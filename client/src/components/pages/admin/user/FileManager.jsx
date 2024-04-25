import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import "../admin.css";
import { MoreOutlined, SearchOutlined } from "@ant-design/icons";
import {
  Spin,
  Alert,
  Card,
  Avatar,
  Menu,
  Dropdown,
  Space,
  Input,
} from "antd";
const FileManager = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const authToken = Cookies.get("authToken");

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    setLoading(true);
    try {
      if (authToken) {
        const response = await axios.get("/files/get-all-file", {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        if (Array.isArray(response.data)) { // Check if response.data is an array
          setFiles(response.data); // Set the files state to the array of files
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

  const handleSearch = (value) => {
    setSearchQuery(value);
  };

  const filteredFiles = files.filter(
    (file) =>
      file.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      file.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-5">
      <Card title="File Manager" className="w-full">
        <Space direction="vertical" style={{ width: "100%" }}>
          <Input
          style={{ width: "20%" }}
            placeholder="Search files"
            prefix={<SearchOutlined />}
            onChange={(e) => handleSearch(e.target.value)}
          />
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
                  <th className="text-center">Action *</th>
                </tr>
              </thead>
              <tbody>
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
          )}
        </Space>
      </Card>
    </div>
  );
};

export default FileManager;
