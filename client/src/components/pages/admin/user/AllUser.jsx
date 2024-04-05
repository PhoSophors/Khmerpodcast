import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { Spin, Alert, Card, Avatar, Menu, Dropdown } from "antd";
import { UserOutlined, MoreOutlined } from "@ant-design/icons";
import "../admin.css";

const AllUser = () => {
  const [allUser, setAllUser] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const authToken = Cookies.get("authToken");

  const fetchAllUser = async () => {
    setLoading(true);
    try {
      if (authToken) {
        const response = await axios.get(`/auths/users/all`, {
          baseURL: process.env.REACT_APP_PROXY,
          headers: {
            "auth-token": authToken,
          },
        });
        if (Array.isArray(response.data.users)) {
          setAllUser(response.data.users);
        } else {
          setError(
            "Expected array but received: " + JSON.stringify(response.data)
          );
        }
      }
    } catch (error) {
      setError("Error fetching users: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllUser();
  }, []);

  return (
    <div className="p-5">
      <Card title="All Users" className="w-full">
        {loading ? (
          <div className="spin-container">
            <Spin size="large" />
          </div>
        ) : error ? (
          <Alert message={error} type="error" />
        ) : (
          <>
            <table id="user-table">
              <tr>
                <th>No *</th>
                <th>Profile *</th>
                <th className="text-start">Name *</th>
                <th className="text-start">Email *</th>
                <th className="text-start">Role *</th>
                <th className="text-start">Status *</th>
                <th>Create Date *</th>
                <th>Action *</th>
              </tr>

              {allUser.map((user, index) => {
                const menu = (
                  <Menu style={{ width: "150px" }}>
                    <Menu.Item key="0">Edit</Menu.Item>
                    <Menu.Item key="1">Delete</Menu.Item>
                  </Menu>
                );

                const roleColor = user.role === "admin" ? "#dcfce7" : "#fef3c7";
                const statusColor = user.emailVerified ? "#dcfce7" : "#64748b";

                // Format the createdAt date
                const date = new Date(user.createdAt);
                const formattedDate = `${
                  date.getMonth() + 1
                }/${date.getDate()}/${date.getFullYear()}`;

                return (
                  <tr key={user._id}>
                    <td className="text-center text-indigo-500 font-semibold">
                      {index + 1}
                    </td>
                    <td className="text-center">
                      <Avatar size="large" icon={<UserOutlined />} />
                    </td>
                    <td className="font-semibold text-indigo-500">
                      {user.username}
                    </td>
                    <td className="font-semibold text-indigo-500">
                      {user.email}
                    </td>
                    <td className="role">
                      <div
                        className="chiil-role text-indigo-500"
                        style={{ backgroundColor: roleColor }}
                      >
                        {user.role}
                      </div>
                    </td>

                    <td className="status text-end">
                      <div
                        className="chil-status text-indigo-500"
                        style={{ backgroundColor: statusColor }}
                      >
                        {user.emailVerified ? "Active" : "Closed"}
                      </div>
                    </td>

                    <td className="text-center text-slate-500">
                      {formattedDate}
                    </td>
                    <td className="text-center">
                      <Dropdown overlay={menu} trigger={["hover"]}>
                        <MoreOutlined />
                      </Dropdown>
                    </td>
                  </tr>
                );
              })}
            </table>
          </>
        )}
      </Card>
    </div>
  );
};

export default AllUser;
