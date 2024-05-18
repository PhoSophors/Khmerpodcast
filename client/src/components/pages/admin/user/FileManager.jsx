// Import necessary dependencies
import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import "../admin.css";
import MoreBtn from "../../../Btn/MoreBtn";
import { api_url } from "../../../../api/config";
import DeletePodcastBtn from "../../../Btn/DeletePodcastBtn";
import {
  StepBackwardFilled,
  StepForwardFilled,
  SearchOutlined,
} from "@ant-design/icons";
import {
  Spin,
  Alert,
  Card,
  Avatar,
  Space,
  Input,
  Button,
  DatePicker,
} from "antd";

// Define FileManager component
const FileManager = () => {
  // State variables
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [dateRange, setDateRange] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const cardsPerPage = 15;

  const authToken = Cookies.get("authToken");
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
            setFiles(response.data);
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

  // Function to handle search
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

  const filteredFiles = files.filter((file) => {
    const userCreatedDate = new Date(file.createdAt);
    const startDate = dateRange[0] ? new Date(dateRange[0]) : null;
    const endDate = dateRange[1] ? new Date(dateRange[1]) : null;

    return (
      (!startDate || userCreatedDate >= startDate) &&
      (!endDate || userCreatedDate <= endDate) &&
      (file.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        file.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  });

  const paginatedFiles = filteredFiles.slice(
    (currentPage - 1) * cardsPerPage,
    currentPage * cardsPerPage
  );

  // Function to handle next page
  const handleNext = () => {
    if (currentPage * cardsPerPage < filteredFiles.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Function to handle previous page
  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="xl:p-5 md:p-5 p-0 ">
      {/* File Manager Card */}
      <Card title="File Manager" className="w-full file-manager-container">
        {/* Search Input */}
        <Space direction="vertical" style={{ width: "100%" }}>
          <div className="flex grid xl:grid-cols-2 sm:flex sm:gap-5 gap-3">
            <div className="w-full sm:w-1/2">
              <Input
                className="xl:w-96 w-full"
                placeholder="Search files"
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

          {/* Loading/Error/No files message */}
          {loading ? (
            <div className="spin-container">
              <Spin size="large" />
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
                      <td className="text-center dark:text-slate-100">
                        {(currentPage - 1) * cardsPerPage + index + 1}
                      </td>
                      <td className="text-center">
                        <Avatar size="large" src={file.image.url} />
                      </td>
                      <td className="dark:text-slate-100">
                        {file.title.substring(0, 30)}
                      </td>
                      <td className="dark:text-slate-100">
                        {file.description.substring(0, 30)}
                      </td>
                      <td className="text-center dark:text-slate-100">
                        {file.audio.mimetype}
                      </td>
                      <td className="text-center dark:text-slate-100">
                        {file.image.mimetype}
                      </td>
                      <td className="text-center dark:text-slate-100">
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

        {/* Pagination buttons */}
        <div className="w-full flex justify-center mt-4 gap-5">
          <Button
            onClick={handlePrevious}
            disabled={currentPage === 1}
            type="dashed"
            size={5}
            icon={<StepBackwardFilled />}
          >
            <span className="dark:text-slate-100">Previous</span>
          </Button>
          <Button
            onClick={handleNext}
            disabled={currentPage * cardsPerPage >= filteredFiles.length}
            type="dashed"
            size={5}
            icon={<StepForwardFilled />}
          >
            <span className="dark:text-slate-100">Next</span>
          </Button>
        </div>
      </Card>
      <div className="mt-20 xl:mt-0 md:mt-0 text-white">.</div>
      {/* Delete Modal */}
    </div>
  );
};

export default FileManager;
