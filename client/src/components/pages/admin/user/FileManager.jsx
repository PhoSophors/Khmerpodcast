// Import necessary dependencies
import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import "../admin.css";
import MoreBtn from "../../../Btn/MoreBtn";
import DeletePodcastBtn from "../../../Btn/DeletePodcastBtn";
import {
  StepBackwardFilled,
  StepForwardFilled,
  SearchOutlined,
} from "@ant-design/icons";
import { Spin, Alert, Card, Avatar, Space, Input, Button } from "antd";

// Define FileManager component
const FileManager = () => {
  // State variables
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const authToken = Cookies.get("authToken");
  const [startIndex, setStartIndex] = useState(0);
  const cardsPerPage = 10;

  // Fetch files function
  const fetchFiles = async (page) => {
    setLoading(true);
    try {
      if (authToken) {
        const response = await axios.get(
          `/files/get-all-file?page=${page}&limit=${cardsPerPage}`,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
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
  useEffect(() => {
    fetchFiles();
  }, []);

  // Function to handle search
  const handleSearch = (value) => {
    setSearchQuery(value);
  };

  const filteredFiles = files.filter(
    (file) =>
      file.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      file.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Function to handle next page
  const handleNext = () => {
    const nextPage = startIndex / cardsPerPage + 1;
    const nextStartIndex = (nextPage - 1) * cardsPerPage;
    setStartIndex(nextStartIndex);
    fetchFiles(nextPage);
  };

  // Function to handle previous page
  const handlePrevious = () => {
    if (startIndex - cardsPerPage >= 0) {
      const prevPage = startIndex / cardsPerPage - 1;
      const prevStartIndex = prevPage * cardsPerPage;
      setStartIndex(prevStartIndex);
      fetchFiles(prevPage);
    }
  };

  return (
    <div className="p-5">
      {/* File Manager Card */}
      <Card title="File Manager" className="w-full">
        {/* Search Input */}
        <Space direction="vertical" style={{ width: "100%" }}>
          <Input
            className="xl:w-96 w-full"
            placeholder="Search files"
            prefix={<SearchOutlined />}
            onChange={(e) => handleSearch(e.target.value)}
          />

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
                  {/* Map through files and display in table */}
                  {filteredFiles.map((file, index) => (
                    <tr key={file._id}>
                      <td className="text-center">{index + 1}</td>
                      <td className="text-center">
                        <Avatar size="large" src={file.image.url} />
                      </td>
                      <td>{file.title.substring(0, 30)}</td>
                      <td>{file.description.substring(0, 30)}</td>
                      <td className="text-center">{file.audio.mimetype}</td>
                      <td className="text-center">{file.image.mimetype}</td>
                      <td className="text-center">
                        {new Date(file.uploadDate).toLocaleDateString()}
                      </td>
                      <td className="text-center">
                        {/* Delete Button */}
                        <DeletePodcastBtn file={file} fetchFiles={fetchFiles} />
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
        <div className="w-full flex  justify-center mt-4 gap-5">
          <Button
            onClick={handlePrevious}
            disabled={startIndex === 0}
            type="dashed"
            size={5}
            icon={<StepBackwardFilled />}
          >
            Previous
          </Button>
          <Button
            onClick={handleNext}
            disabled={startIndex + cardsPerPage >= files.length}
            type="dashed"
            size={5}
            icon={<StepForwardFilled />}
          >
            Next
          </Button>
        </div>
      </Card>

      {/* Delete Modal */}
    </div>
  );
};

export default FileManager;
