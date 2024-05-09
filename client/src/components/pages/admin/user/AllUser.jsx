import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { Spin, Alert, Card, Avatar, Menu, Dropdown, Input, Space } from "antd";
import { UserOutlined, MoreOutlined, SearchOutlined } from "@ant-design/icons";
import "../admin.css";

const AllUser = () => {
  const [allUser, setAllUser] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const authToken = Cookies.get("authToken");

  useEffect(() => {
    fetchAllUser();
  }, []);

  const fetchAllUser = async () => {
    setLoading(true);
    try {
      if (authToken) {
        const response = await axios.get(`/auths/users/all`, {
          baseURL: process.env.REACT_APP_PROXY,
          headers: {
            Authorization: `Bearer ${authToken}`,
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

  const handleSearch = (value) => {
    setSearchQuery(value);
  };

  const filteredUsers = allUser.filter(
    (user) =>
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-5">
      <Card title="All Users" className="w-full">
        <Space direction="vertical" style={{ width: "100%" }}>
          <Input
            className="xl:w-96 w-full"
            placeholder="Search users"
            prefix={<SearchOutlined />}
            onChange={(e) => handleSearch(e.target.value)}
          />
          {loading ? (
            <div className="spin-container">
              <Spin size="large" />
            </div>
          ) : error ? (
            <Alert message={error} type="error" />
          ) : filteredUsers.length === 0 ? (
            <div className="font-semibold text-gray-500 uppercase text-center mt-5">
              No users found
            </div>
          ) : (
            <div className="overflow-auto">
              <table id="user-podcast-table" className="mt-10">
                <thead>
                  <tr>
                    <th className="text-center">No *</th>
                    <th className="text-center">Profile *</th>
                    <th className="text-start">Name *</th>
                    <th className="text-start">Email *</th>
                    <th className="text-center">Role</th>
                    <th className="text-center">Status</th>
                    <th className="text-center">Create Date</th>
                    <th className="text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user, index) => (
                    <tr key={user._id}>
                      <td className="text-center">{index + 1}</td>
                      <td className="text-center">
                        <Avatar
                          src={user && user.profileImage}
                          size="large"
                          icon={<UserOutlined />}
                        />
                      </td>
                      <td>{user.username}</td>
                      <td>{user.email}</td>
                      <td className="text-center">{user.role}</td>
                      <td className="text-center">
                        {user.emailVerified ? "Active" : "Closed"}
                      </td>
                      <td className="text-center">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="text-center">
                        <Dropdown
                          overlay={
                            <Menu>
                              <Menu.Item key="0">Edit</Menu.Item>
                              <Menu.Item key="1">Delete</Menu.Item>
                            </Menu>
                          }
                          trigger={["hover"]}
                        >
                          <MoreOutlined />
                        </Dropdown>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Space>
      </Card>
    </div>
  );
};

export default AllUser;
