import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { api_url } from "../../../../api/config";
import DeleteUserBtn from "../../../Btn/DeleteUserBtn";
import {
  Spin,
  Alert,
  Card,
  Avatar,
  Input,
  Space,
  DatePicker,
  Button,
} from "antd";
import {
  UserOutlined,
  SearchOutlined,
  StepBackwardFilled,
  StepForwardFilled,
} from "@ant-design/icons";
import "../admin.css";
import { Link } from "react-router-dom";

const AllUser = () => {
  const [allUser, setAllUser] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [dateRange, setDateRange] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const cardsPerPage = 15;
  const authToken = Cookies.get("authToken")
    ? atob(Cookies.get("authToken"))
    : null;

  useEffect(() => {
    const fetchAllUser = async () => {
      setLoading(true);
      try {
        if (authToken) {
          const response = await axios.get(`${api_url}/admin/all-users`, {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          });
          if (Array.isArray(response.data.users)) {
            setAllUser(response.data.users.reverse());
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

    fetchAllUser();
  }, [authToken]);

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

  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * cardsPerPage,
    currentPage * cardsPerPage
  );

  const handleNext = () => {
    if (currentPage * cardsPerPage < filteredUsers.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="xl:p-5 md:p-5 p-0 ">
      <Card title="All Users" className="w-full all-user-card">
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
            <div className="flex justify-center mt-20 mb-20">
              <Spin />
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
                  {paginatedUsers.map((user, index) => (
                    <tr key={user._id}>
                      <td className="text-center dark:text-gray-300">
                        {(currentPage - 1) * cardsPerPage + index + 1}
                      </td>
                      <Link to={`/public-profile/${user._id}`}>
                        <td className="text-center  dark:text-gray-300">
                          <Avatar
                            className="avatar"
                            src={user && user.profileImage}
                            size="large"
                            icon={<UserOutlined />}
                          />
                        </td>
                      </Link>
                      <td className=" dark:text-gray-300">{user.username}</td>
                      <td className=" dark:text-gray-300">{user.email}</td>
                      <td className="text-center  dark:text-gray-300">
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
                      <td className="text-center dark:text-gray-300">
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
                        {user.role !== "admin" && (
                          <DeleteUserBtn
                            user={user}
                            fetchAllUser={setAllUser}
                          />
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Space>

        {/* Pagination buttons */}
        <div className="w-full flex justify-center mt-4 gap-5">
          <Button
            onClick={handlePrevious}
            disabled={currentPage === 1}
            type="dashed"
            size={5}
            icon={<StepBackwardFilled />}
          >
            <span className="dark:text-gray-300">Previous</span>
          </Button>
          <Button
            onClick={handleNext}
            disabled={currentPage * cardsPerPage >= filteredUsers.length}
            type="dashed"
            size={5}
            icon={<StepForwardFilled />}
          >
            <span className="dark:text-gray-300">Next</span>
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default AllUser;
