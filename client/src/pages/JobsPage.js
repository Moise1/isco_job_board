import React, { useState, useEffect } from "react";
import {
  Table,
  Input,
  Select,
  InputNumber,
  Button,
  Card,
  Row,
  Col,
  Space,
  List,
  Form,
  Typography,
  Tag,
} from "antd";
import {
  SearchOutlined,
  EnvironmentOutlined,
  DollarOutlined,
  PaperClipOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchJobs,
  setTitleFilter,
  setLocationFilter,
  setSalaryRange,
  clearFilters,
} from "../redux/jobsSlice";
import * as wcc from "world-countries-capitals";
import JobModal from "../components/JobModal";
import {submitJobApplication, reset} from "../redux/applicationsSlice";
import { toast } from "react-toastify";

const { Option } = Select;
const { Title, Paragraph, Text } = Typography;

function JobsPage() {
  const [selectedJob, setSelectedJob] = useState(null);
  const dispatch = useDispatch();
  const { filteredJobs, loading, error, filters } = useSelector(
    (state) => state.jobs
  );

 
  const [form] = Form.useForm();
  
  const {
    loading: loadingApplication,
    error: errorApplication,
    success,
    message: apiMessage,
  } = useSelector((state) => state.applications);

  const [locations, setLocations] = useState([]);
  const [salaryRange, setLocalSalaryRange] = useState({
    min_salary: null,
    max_salary: null,
  });


  useEffect(() => {
    dispatch(fetchJobs());
    const countriesData = wcc.getAllCountryDetails();
    const formattedLocations = countriesData.map((item) => ({
      label: `${capitalize(item.capital || "")}, ${capitalize(
        item.country || ""
      )}`,
      value: `${capitalize(item.capital || "")}, ${capitalize(
        item.country || ""
      )}`.toLowerCase(),
    }));
    setLocations(formattedLocations);
  }, [dispatch]);

  const capitalize = (str) => {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  const applySalaryFilter = () => {
    dispatch(setSalaryRange(salaryRange));
  };

  const resetFilters = () => {
    dispatch(clearFilters());
    setLocalSalaryRange({ min_salary: null, max_salary: null });
  };

  const handleSubmit = (values) => {

    const applicationData = {
      job_id: selectedJob.id,
      cover_letter: values.cover_letter,
      cv_link: values.cv_link,
    };
    dispatch(submitJobApplication(applicationData));
  };
  
  const onCancel = () => setSelectedJob(null);
  
   useEffect(() => {
     if (success) {
       toast.success(apiMessage);
       form.resetFields();
       onCancel();
       dispatch(reset());
     }
     if (error) {
       toast.error(error || "Failed to submit application");
       dispatch(reset());
     }
   }, [success, error, apiMessage, form, dispatch]);


  return (
    <div style={{ maxWidth: 1200, margin: "auto", padding: "24px" }}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <Title level={2}>Available Jobs</Title>
        <Paragraph type="secondary">
          Find your next career opportunity
        </Paragraph>
      </div>

      {/* Filters */}
      <Card style={{ marginBottom: 24 }}>
        <Space wrap>
          <Input
            placeholder="Search by job title"
            prefix={<SearchOutlined />}
            value={filters.title}
            onChange={(e) => dispatch(setTitleFilter(e.target.value))}
            style={{ width: 200 }}
          />
          <Select
            placeholder="Select location"
            value={filters.location || undefined}
            onChange={(value) => dispatch(setLocationFilter(value))}
            style={{ width: 220 }}
            allowClear
            showSearch
          >
            {locations.map((loc, idx) => (
              <Option key={idx} value={loc.value}>
                {loc.label}
              </Option>
            ))}
          </Select>
          <InputNumber
            placeholder="Min salary"
            value={salaryRange.min_salary}
            onChange={(value) =>
              setLocalSalaryRange((prev) => ({ ...prev, min_salary: value }))
            }
            style={{ width: 120 }}
            prefix="$"
          />
          <InputNumber
            placeholder="Max salary"
            value={salaryRange.max_salary}
            onChange={(value) =>
              setLocalSalaryRange((prev) => ({ ...prev, max_salary: value }))
            }
            style={{ width: 120 }}
            prefix="$"
          />
          <Button type="primary" onClick={applySalaryFilter}>
            Filter
          </Button>
          <Button onClick={resetFilters}>Reset</Button>
        </Space>
      </Card>

      {/* Job Cards */}
      <Row gutter={[16, 16]}>
        {filteredJobs.length > 0 ? (
          filteredJobs.map((job) => (
            <Col xs={24} sm={12} lg={8} key={job.id}>
              <Card
                title={job.title}
                extra={<Tag color="purple">{job.type || "Full-time"}</Tag>}
                bordered
                hoverable
              >
                <Space direction="vertical" size="small">
                  <Space>
                    <EnvironmentOutlined /> {job.location}
                  </Space>
                  <Space>
                    <DollarOutlined /> ${job.min_salary} - ${job.max_salary}
                  </Space>
                  <Paragraph ellipsis={{ rows: 3 }}>
                    {job.description}
                  </Paragraph>
                </Space>
                <Button
                  type="primary"
                  block
                  style={{ marginTop: 12 }}
                  onClick={() => setSelectedJob(job)}
                >
                  Apply Now
                </Button>
              </Card>
            </Col>
          ))
        ) : (
          <Col span={24} style={{ textAlign: "center", padding: 24 }}>
            <Title level={4}>No jobs found matching your criteria</Title>
            <Button onClick={resetFilters}>Clear all filters</Button>
          </Col>
        )}
      </Row>

      {/* Modal */}
      <JobModal
        title={selectedJob?.title}
        open={!!selectedJob}
        onSubmit={handleSubmit}
        footer={null}
        onCancel={onCancel}
        destroyOnHidden
      >
        <List
          size="small"
          dataSource={[
            { label: "Location", value: selectedJob?.location },
            {
              label: "Salary",
              value: `$${selectedJob?.min_salary} - $${selectedJob?.max_salary}`,
            },
          ]}
          renderItem={(item) => (
            <List.Item>
              <Text strong>{item.label}:</Text> {item.value}
            </List.Item>
          )}
          className="mb-6"
        />

        {/* Cover Letter */}
        <Form.Item
          name="cover_letter"
          label="Cover Letter"
          rules={[
            { required: true, message: "Please enter your cover letter" },
          ]}
        >
          <Input.TextArea
            rows={8}
            placeholder="Explain why you're the best fit for this position..."
            className="w-full"
          />
        </Form.Item>

        {/* CV/Resume Link */}
        <Form.Item
          name="cv_link"
          label="CV/Resume Link"
          rules={[
            { required: true, message: "Please provide your resume link" },
            { type: "url", message: "Please enter a valid URL" },
          ]}
        >
          <Input
            prefix={<PaperClipOutlined className="text-gray-400" />}
            placeholder="Paste a link to your CV/Resume"
          />
        </Form.Item>

        {/* Submit Button */}
        <Form.Item className="mb-0">
          <Button
            type="primary"
            htmlType="submit"
            loading={loadingApplication}
            block
            size="large"
          >
            Submit Application
          </Button>
        </Form.Item>
      </JobModal>
    </div>
  );
}

export default JobsPage;
