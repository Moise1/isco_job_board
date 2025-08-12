import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Dropdown, Menu, Avatar, Typography, Space } from "antd";
import {
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
} from "@ant-design/icons";

export default function TopBar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.users);

  const handleLogout = () => {
    dispatch({ type: "auth/logout" });
    navigate("/login");
  };

  const menu = (
    <Menu
      items={[
        {
          key: "account",
          label: "Account",
          icon: <UserOutlined />,
          onClick: () => navigate("/account"),
        },
        {
          key: "settings",
          label: "Settings",
          icon: <SettingOutlined />,
          onClick: () => navigate("/settings"),
        },
        {
          type: "divider",
        },
        {
          key: "logout",
          label: "Logout",
          icon: <LogoutOutlined />,
          danger: true,
          onClick: handleLogout,
        },
      ]}
    />
  );

  return (
    <div
      style={{
        background: "#fff",
        padding: "8px 24px",
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "center",
        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
      }}
    >
      <Dropdown overlay={menu} placement="bottomRight" trigger={["click"]}>
        <Space style={{ cursor: "pointer" }}>
          <Avatar
            style={{ backgroundColor: "#1890ff" }}
            icon={<UserOutlined />}
          />
          <Typography.Text strong>
            Hey, {user?.first_name || "User"}
          </Typography.Text>
        </Space>
      </Dropdown>
    </div>
  );
}
