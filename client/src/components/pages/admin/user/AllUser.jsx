import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import {
  Spin,
  Alert,
  Card,
  Avatar,
  Input,
  Space,
  message,
  DatePicker,
} from "antd";
import { UserOutlined, SearchOutlined, DeleteFilled } from "@ant-design/icons";
import "../admin.css";

const AllUser = () => {
  const [allUser, setAllUser] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [dateRange, setDateRange] = useState([]);
  const authToken = Cookies.get("authToken");

  useEffect(() => {
    fetchAllUser();
  }, []);

  const fetchAllUser = async () => {
    setLoading(true);
    try {
      if (authToken) {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_API}/auths/users/all`, {
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

  const handleDeleteUser = async (_id) => {
    try {
      const response = await axios.delete(`${process.env.REACT_APP_BACKEND_API}/auths/delete/user/${_id}`, {
        method: "DELETE",
        baseURL: process.env.REACT_APP_PROXY,
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      if (response.status === 200) {
        message.success("User deleted successfully");
        fetchAllUser();
      } else {
        message.error("Unexpected response status: " + response.status);
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        message.error("Error deleting user: " + error.response.data.error);
      } else {
        message.error("Error deleting user: " + error.message);
      }
    }
  };

  const handleSearch = (value) => {
    setSearchQuery(value);
  };

  const handleDateRangeChange = (dates) => {
    if (dates && dates.length === 2) {
      setDateRange(dates.map((date) => date.format("YYYY-MM-DD")));
    } else {
      setDateRange([]);
    }
  };

  const filteredUsers = allUser.filter((user) => {
    const userCreatedDate = new Date(user.createdAt);
    const startDate = dateRange[0] ? new Date(dateRange[0]) : null;
    const endDate = dateRange[1] ? new Date(dateRange[1]) : null;

    return (
      (!startDate || userCreatedDate >= startDate) &&
      (!endDate || userCreatedDate <= endDate) &&
      (user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  });

  return (
    <div className="p-5">
      <Card title="All Users" className="w-full">
        <Space direction="vertical" style={{ width: "100%" }}>
          <div className="flex grid xl:grid-cols-2 sm:flex sm:gap-5 gap-3">
            <div className="w-full sm:w-1/2">
              <Input
                className="xl:w-96 w-full"
                placeholder="Search users"
                prefix={<SearchOutlined />}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
            <div className="w-full sm:w-1/2 text-end">
              <DatePicker.RangePicker
                className="xl:w-96 w-full mb-3"
                format="YYYY-MM-DD"
                onChange={handleDateRangeChange}
              />
            </div>
          </div>
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
                    <th className="text-start">Role</th>
                    <th className="text-start">Email Verify</th>
                    <th className="text-center">Create Date</th>
                    <th className="text-start">Delete User</th>
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
                      <td className="text-center">
                        <div
                          className={`text-white h-8 w-14 flex justify-center items-center rounded-xl ${
                            user.role === "admin"
                              ? "bg-green-500"
                              : "bg-orange-500"
                          }`}
                        >
                          {user.role}
                        </div>
                      </td>
                      <td className="text-center">
                        <div
                          className={`text-white h-8 w-14 flex justify-center items-center rounded-xl ${
                            user.emailVerified ? "bg-green-500" : "bg-red-500"
                          }`}
                        >
                          {user.emailVerified ? "True" : "False"}
                        </div>
                      </td>
                      <td className="text-center">
                        {new Date(user.createdAt).toLocaleDateString(
                          undefined,
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )}
                      </td>
                      <td className="text-center">
                        <div
                          onClick={() => handleDeleteUser(user._id)}
                          className="p-3 cursor-pointer text-white bg-red-600 h-8 w-8 flex justify-center items-center rounded-full"
                        >
                          <DeleteFilled />
                        </div>
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
