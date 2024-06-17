// Import necessary dependencies
import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import "../admin.css";
import MoreBtn from "../../../Btn/MoreBtn";
import { api_url } from "../../../../api/config";
import DeletePodcastBtn from "../../../Btn/DeletePodcastBtn";
import {
  SearchOutlined,
} from "@ant-design/icons";
import {
  Spin,
  Alert,
  Card,
  Avatar,
  Space,
  Input,
  Pagination,
  Select,
  // DatePicker,
} from "antd";
import { Link } from "react-router-dom";

// Define FileManager component
const FileManager = () => {
  // State variables
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  // const [dateRange, setDateRange] = useState([]);
  const [verifyPodcastLoading, setVerifyPodcastLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const cardsPerPage = 15;

  // const authToken = Cookies.get("authToken");
  const authToken = Cookies.get("authToken")
    ? atob(Cookies.get("authToken"))
    : null;

  useEffect(() => {
    // Fetch files function
    const fetchFiles = async () => {
      setLoading(true);
      try {
        if (authToken) {
          const response = await axios.get(`${api_url}/files/get-all-file`, {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          });
          if (Array.isArray(response.data)) {
            setFiles(response.data.reverse());
          } else {
            setError(
              "Expected array but received: " + JSON.stringify(response.data)
            );
          }
        }
      } catch (error) {
        setError("Error fetching files: " + error.message);
      } finally {
        setLoading(false);
      }
    };

    // Fetch files on component mount

    fetchFiles();
  }, [authToken]);

  const verifyPodcast = async (id, isVerified) => {
    try {
      setVerifyPodcastLoading(true);
      const response = await axios.patch(
        `${api_url}/files/verify-podcast-by-admin/${id}`,
        { verifyPodcast: isVerified },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      if (response.data) {
        setFiles((prevFiles) =>
          prevFiles.map((file) =>
            file._id === id ? { ...file, verifyPodcast: isVerified } : file
          )
        );
      }
    } catch (error) {
      console.error("Error verifying podcast:", error);
    } finally {
      setVerifyPodcastLoading(false);
    }
  };

  // Function to handle search
  const handleSearch = (value) => {
    setSearchQuery(value);
  };

  const filteredFiles = files.filter((file) => {
    return (
      (file.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        file.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  });

  const paginatedFiles = filteredFiles.slice(
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
      {/* File Manager Card */}
      <Card title="File Manager" className="w-full file-manager-container">
        {/* Search Input */}
        <Space direction="vertical" style={{ width: "100%" }}>
          <div className="flex grid xl:grid-cols-2 sm:flex sm:gap-5 gap-3">
            <div className="w-full sm:w-1/2">
              <Input
                className="search-input  xl:w-96 w-full"
                placeholder="Search files"
                prefix={<SearchOutlined />}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>

            <div className="w-full sm:w-1/2 text-end flex justify-end">
              <Pagination
                className="text-white w-aut0 bg-gray-200/30 backdrop-blur-sm p-2 rounded-lg"
                current={currentPage}
                pageSize={cardsPerPage} // number of items per page
                total={filteredFiles.length} // total number of items
                onChange={handlePageChange} // function to handle page change
                showSizeChanger={false}
              />
            </div>
          </div>

          {/* Loading/Error/No files message */}
          {loading ? (
            <div className="flex justify-center mt-20 mb-20">
              <Spin />
            </div>
          ) : error ? (
            <Alert message={error} type="error" />
          ) : filteredFiles.length === 0 ? (
            <div className="font-semibold text-gray-500 uppercase text-center mt-5">
              No files found
            </div>
          ) : (
            // Table displaying files
            <div className="overflow-auto">
              <table id="user-podcast-table" className="mt-10">
                <thead>
                  <tr>
                    <th className="text-center">No *</th>
                    <th className="text-center">Thumbnail *</th>
                    <th className="text-start">Title *</th>
                    <th className="text-start">Description *</th>
                    <th className="text-start">Verify</th>
                    <th className="text-center">Audio Size *</th>
                    <th className="text-center">Thumbnail Size *</th>
                    <th className="text-center">Audio Types *</th>
                    <th className="text-center">Thumbnail Types *</th>
                    <th className="text-center">Upload Date *</th>
                    <th className="text-center">Delete *</th>
                    <th className="text-center">Action *</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Map through paginatedFiles and display in table */}
                  {paginatedFiles.map((file, index) => (
                    <tr key={file._id}>
                      <td className="text-center dark:text-gray-300">
                        {(currentPage - 1) * cardsPerPage + index + 1}
                      </td>
                      <td className="text-center">
                        <Link to={`/watch-podcast/${file._id}`}>
                          <Avatar size="large" src={file.image.url} />
                        </Link>
                      </td>
                      <td className="dark:text-gray-300">
                        {file.title.substring(0, 10)}
                      </td>
                      <td className="dark:text-gray-300">
                        {file.description.substring(0, 10)}
                      </td>
                      <td>
                        <Select
                          className={
                            file.verifyPodcast ? "verified" : "not-verified"
                          }
                          defaultValue={
                            file.verifyPodcast ? "Verified" : "Not Verified"
                          }
                          style={{ width: 120 }}
                          onChange={(value) =>
                            verifyPodcast(file._id, value === "Verified")
                          }
                          notFoundContent={
                            verifyPodcastLoading ? <Spin size="small" /> : null
                          }
                        >
                          <Select.Option value="Verified">
                            Verified
                          </Select.Option>
                          <Select.Option value="Not Verified">
                            Not Verified
                          </Select.Option>
                        </Select>
                      </td>

                      <td className="text-center  text-gray-700 dark:text-gray-300">
                        <div
                          className="bg-slate-100 dark:bg-black p-2 rounded-xl"
                          style={{ backgroundColor: `var(--content-bg)` }}
                        >
                          {(file.audio.size / 1024 / 1024).toFixed(2)} MB
                        </div>
                      </td>
                      <td className="text-center  text-gray-700 dark:text-gray-300">
                        <div
                          className="bg-slate-100 dark:bg-black p-2 rounded-xl"
                          style={{ backgroundColor: `var(--content-bg)` }}
                        >
                          {(file.image.size / 1024 / 1024).toFixed(2)} MB
                        </div>
                      </td>
                      <td className="text-center  text-gray-700 dark:text-gray-300">
                        <div
                          className="bg-slate-100 dark:bg-black p-2 rounded-xl"
                          style={{ backgroundColor: `var(--content-bg)` }}
                        >
                          {file.audio.mimetype}
                        </div>
                      </td>
                      <td className="text-center  text-gray-700 dark:text-gray-300">
                        <div
                          className="bg-slate-100 dark:bg-black p-2 rounded-xl"
                          style={{ backgroundColor: `var(--content-bg)` }}
                        >
                          {file.image.mimetype}
                        </div>
                      </td>
                      <td className="text-center dark:text-gray-300">
                        {new Date(file.uploadDate).toLocaleDateString(
                          undefined,
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )}
                      </td>
                      <td className="text-center">
                        {/* Delete Button */}
                        <DeletePodcastBtn file={file} fetchFiles={setFiles} />
                      </td>
                      {/* More button */}
                      <td className="text-center place-items-center">
                        <MoreBtn file={file} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Space>
      </Card>
      {/* Delete Modal */}
    </div>
  );
};

export default FileManager;
