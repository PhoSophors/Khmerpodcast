import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { api_url } from "../../../../api/config";
import DeleteUserBtn from "../../../Btn/DeleteUserBtn";
import { Spin, Alert, Card, Avatar, Input, Space, Pagination } from "antd";
import { UserOutlined, SearchOutlined } from "@ant-design/icons";
import "../admin.css";
import { Link } from "react-router-dom";

const AllUser = () => {
  const [allUser, setAllUser] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
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

  const filteredUsers = allUser.filter((user) => {
    return (
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * cardsPerPage,
    currentPage * cardsPerPage
  );

  // Function to handle page change
  const handlePageChange = (page, pageSize) => {
    // Update the current page
    setCurrentPage(page);
    // Update the number of items per page (if necessary)
    cardsPerPage(pageSize);
  };

  return (
    <div className="xl:p-2 md:p-2 p-0 ">
      <Card title="All Users" className="w-full all-user-card">
        <Space direction="vertical" style={{ width: "100%" }}>
          <div className="flex grid xl:grid-cols-2 sm:flex sm:gap-5 gap-3">
            <div className="w-full sm:w-1/2">
              <Input
                className="search-input xl:w-96 w-full"
                placeholder="Search users"
                prefix={<SearchOutlined />}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
            <div className="w-full sm:w-1/2 text-end flex justify-end">
              <Pagination
                className="text-white w-aut0 bg-gray-200/30 backdrop-blur-sm p-2 rounded-lg"
                current={currentPage}
                pageSize={cardsPerPage} // number of items per page
                total={filteredUsers.length} // total number of items
                onChange={handlePageChange} // function to handle page change
                showSizeChanger={false}
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
      </Card>
    </div>
  );
};

export default AllUser;
