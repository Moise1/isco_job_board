import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchJobs, createJob, updateJob, deleteJob } from "../redux/jobsSlice";
import {
  Layout,
  Menu,
  Table,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  Typography,
  Select
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  AppstoreOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import * as wcc from "world-countries-capitals";

import { toast } from "react-toastify";

const { Sider, Content } = Layout;
const { Title } = Typography;
const { Option } = Select;

export default function AdminDashboard() {
  const dispatch = useDispatch();

  const { jobs, filteredJobs, loading } = useSelector((state) => state.jobs);

  const [activeTab, setActiveTab] = useState("jobs");
  const [jobModalOpen, setJobModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [currentJob, setCurrentJob] = useState(null);
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [locations, setLocations] = useState([]);
  

  const [form] = Form.useForm();


   useEffect(() => {
     dispatch(fetchJobs());
     prepareLocations()
   }, [dispatch]);

  const prepareLocations = () => {
     try {
       const countriesData = wcc.getAllCountryDetails();
       const formattedLocations = countriesData.map((item) => ({
         label: `${capitalize(item.capital || "")}, ${capitalize(
           item.country || ""
         )}`,
         value: `${capitalize(item.capital || "")}, ${capitalize(
           item.country || ""
         )}`.toLowerCase(),
         //  countryCode: item.countryCode,
       }));
       setLocations(formattedLocations);
     } catch (error) {
       console.error("Failed to load locations:", error);
       // Fallback to some basic locations if the package fails
       setLocations([
         { label: "Kigali, Rwanda", value: "Kigali, Rwanda" },
         { label: "Kampala, Uganda", value: "Kampala, Uganda" },
       ]);
     }
   };

   const capitalize = (str) => {
     if (!str) return "";
     return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
   };
  
 
const handleCreateOrUpdate = (values) => {
  if (currentJob) {
    // Handle UPDATE
    dispatch(
      updateJob({
        jobId: currentJob.id,
        jobData: values,
      })
    )
      .unwrap()
      .then((updatedJob) => {
        console.log("Job updated successfully:", updatedJob);
        toast.success("Job updated successfully");
        // Optionally refresh data from server
        dispatch(fetchJobs());
      })
      .catch((error) => {
        console.error("Failed to update job:", error);
        toast.error("Failed to update job");
      });
  } else {
    // Handle CREATE
    dispatch(createJob(values))
      .unwrap()
      .then((newJob) => {
        console.log("Job created successfully:", newJob);
        toast.success("Job created successfully");
        dispatch(fetchJobs()); // Refresh data
      })
      .catch((error) => {
        console.error("Failed to create job:", error);
        toast.error("Failed to create job");
      });
  }
  setJobModalOpen(false);
  form.resetFields();
  setCurrentJob(null);
};

  const handleEdit = (job) => {
    setCurrentJob(job);
    form.setFieldsValue(job);
    setJobModalOpen(true);
  };

   const handleDeleteConfirm = async () => {
     try {
       await dispatch(deleteJob(selectedJobId)).unwrap();
       toast.success("Job deleted successfully");
       dispatch(fetchJobs()); // Refresh the list after successful deletion
     } catch (error) {
       toast.error("Failed to delete job");
     } finally {
       setDeleteModalOpen(false);
       setSelectedJobId(null);
     }
   };


  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      render: (text, record) => (
        <>
          <strong>{text}</strong>
          <div style={{ fontSize: 12, color: "#888" }}>
            {record.description}
          </div>
        </>
      ),
    },
    {
      title: "Location",
      dataIndex: "location",
      key: "location",
    },
    {
      title: "Salary Range",
      key: "salary",
      render: (_, record) => `$${record.min_salary} - $${record.max_salary}`,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <>
          <Button
            icon={<EditOutlined />}
            type="link"
            onClick={() => handleEdit(record)}
          />
          <Button
            icon={<DeleteOutlined />}
            danger
            type="link"
            onClick={() => {
              setSelectedJobId(record.id);
              setDeleteModalOpen(true);
            }}
          />
        </>
      ),
    },
  ];

  return (
    <Layout style={{ height: "100vh" }}>
      {/* Sidebar */}
      <Sider width={220} style={{ background: "#fff" }}>
        <div style={{ padding: 16, borderBottom: "1px solid #f0f0f0" }}>
          <Title level={4} style={{ margin: 0 }}>
            JobConnekt
          </Title>
        </div>
        <Menu
          mode="inline"
          selectedKeys={[activeTab]}
          onClick={(e) => setActiveTab(e.key)}
          items={[
            {
              key: "jobs",
              icon: <AppstoreOutlined />,
              label: "Jobs",
            },
            {
              key: "applications",
              icon: <FileTextOutlined />,
              label: "Applications",
            },
          ]}
        />
      </Sider>

      {/* Main Content */}
      <Layout>
        <Content style={{ padding: 24 }}>
          {activeTab === "jobs" && (
            <>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 16,
                }}
              >
                <Title level={3}>Job Posts</Title>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => setJobModalOpen(true)}
                >
                  Post New Job
                </Button>
              </div>

              <Table
                columns={columns}
                dataSource={filteredJobs}
                rowKey="id"
                loading={loading}
              />
            </>
          )}

          {activeTab === "applications" && (
            <div>
              <Title level={3}>Applications</Title>
              <p>Application management will appear here.</p>
            </div>
          )}
        </Content>
      </Layout>

      {/* Job Create/Edit Modal */}
      <Modal
        title={currentJob ? "Edit Job" : "Create Job"}
        open={jobModalOpen}
        onCancel={() => {
          setJobModalOpen(false);
          setCurrentJob(null);
          form.resetFields();
        }}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleCreateOrUpdate}>
          <Form.Item
            name="title"
            label="Job Title"
            rules={[{ required: true, message: "Please enter a title" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: "Please enter a description" }]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item
            name="location"
            label="Location"
            rules={[
              {
                required: true,
                message: "Please select a location",
              },
            ]}
          >
            <Select
              showSearch
              allowClear
              style={{ width: "100%" }}
              placeholder="Search or select a location"
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.children.includes(input)
              }
              notFoundContent={<div>No locations found</div>}
            >
              {locations.map((loc) => (
                <Option
                  key={loc.value}
                  value={loc.value}
                  // Optional: you can add additional data as data- attributes
                  data-countrycode={loc.countryCode}
                >
                  {loc.label}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="min_salary"
            label="Min Salary"
            rules={[{ required: true, message: "Please enter min salary" }]}
          >
            <InputNumber style={{ width: "100%" }} min={0} />
          </Form.Item>
          <Form.Item
            name="max_salary"
            label="Max Salary"
            rules={[{ required: true, message: "Please enter max salary" }]}
          >
            <InputNumber style={{ width: "100%" }} min={0} />
          </Form.Item>
          <Form.Item>
            <div
              style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}
            >
              <Button onClick={() => setJobModalOpen(false)}>Cancel</Button>
              <Button type="primary" htmlType="submit">
                {currentJob ? "Update Job" : "Post Job"}
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        title="Confirm Deletion"
        open={deleteModalOpen}
        onOk={handleDeleteConfirm}
        onCancel={() => setDeleteModalOpen(false)}
        okText="Yes, Delete"
        cancelText="Cancel"
        confirmLoading={loading}
      >
        <p>Are you sure you want to delete this job?</p>
      </Modal>
    </Layout>
  );
}
