import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { signupUser } from "../redux/usersSlice";
import {
  Form,
  Input,
  Button,
  Typography,
  Checkbox,
  Card,
  Space,
  Alert,
  Divider,
} from "antd";
import {
  UserOutlined,
  MailOutlined,
  LockOutlined,
  EyeTwoTone,
  EyeInvisibleOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

export default function SignupPage() {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.users);

  const handleSubmit = (values) => {
    dispatch(
      signupUser({
        first_name: values.first_name,
        last_name: values.last_name,
        email: values.email,
        password: values.password,
        navigate,
      })
    );
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f5f6fa",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
    >
      <Card
        style={{
          maxWidth: 500,
          width: "100%",
          borderRadius: 12,
          boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <Title level={2} style={{ marginBottom: 0 }}>
            JobConnekt
          </Title>
          <Text type="secondary">
            Join thousands of job seekers and employers
          </Text>
        </div>

        {error && (
          <Alert
            message={error}
            type="error"
            showIcon
            style={{ marginBottom: 16 }}
          />
        )}

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          size="large"
        >
          <Space direction="horizontal" style={{ width: "100%", gap: 16 }}>
            {/* First Name */}
            <Form.Item
              name="first_name"
              label="First Name"
              rules={[
                { required: true, message: "Please enter your first name" },
              ]}
              style={{ flex: 1 }}
            >
              <Input prefix={<UserOutlined />} placeholder="First Name" />
            </Form.Item>

            {/* Last Name */}
            <Form.Item
              name="last_name"
              label="Last Name"
              rules={[
                { required: true, message: "Please enter your last name" },
              ]}
              style={{ flex: 1 }}
            >
              <Input prefix={<UserOutlined />} placeholder="Last Name" />
            </Form.Item>
          </Space>

          {/* Email */}
          <Form.Item
            name="email"
            label="Email Address"
            rules={[
              { required: true, message: "Please enter your email" },
              { type: "email", message: "Please enter a valid email" },
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="Enter your email" />
          </Form.Item>

          {/* Password */}
          <Form.Item
            name="password"
            label="Password"
            rules={[
              { required: true, message: "Please enter your password" },
              { min: 8, message: "Password must be at least 8 characters" },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Enter your password"
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
            />
          </Form.Item>

          {/* Terms Agreement */}
          <Form.Item
            name="agreement"
            valuePropName="checked"
            rules={[
              {
                validator: (_, value) =>
                  value
                    ? Promise.resolve()
                    : Promise.reject(
                        "You must accept the terms and conditions"
                      ),
              },
            ]}
          >
            <Checkbox>
              I agree to the{" "}
              <Link to="/terms" style={{ fontWeight: 500 }}>
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link to="/privacy" style={{ fontWeight: 500 }}>
                Privacy Policy
              </Link>
            </Checkbox>
          </Form.Item>

          {/* Submit Button */}
          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>
              Create Account
            </Button>
          </Form.Item>

          <Divider>
            <Text type="secondary">OR</Text>
          </Divider>

          <div style={{ textAlign: "center" }}>
            <Text>
              Already have an account?{" "}
              <Link to="/login" style={{ fontWeight: 500 }}>
                Login
              </Link>
            </Text>
          </div>
        </Form>
      </Card>
    </div>
  );
}
