import React, { useState, useEffect } from "react";
import axios from "axios";
import { Spin, Alert, Card, Avatar, Menu, Dropdown } from "antd";
import Cookies from "js-cookie";
import { MoreOutlined } from "@ant-design/icons";
import "../admin.css";

const FileManager = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [audioUrls, setAudioUrls] = useState([]);
  const [notification, setNotification] = useState(null);
  const [error, setError] = useState(null);
  const authToken = Cookies.get("authToken");

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/files/get-all-file", {
        headers: {
          "auth-token": authToken,
        },
      });
      setFiles(response.data);
      const urls = response.data.map((file) => file.audio.url);
      setAudioUrls(urls);
    } catch (error) {
      console.error("Error fetching files:", error.message);
      setNotification("Error fetching files");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-5 ">
      <Card title="File Manager" className="w-full">
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
                <th>Thumnaill *</th>
                <th className="text-start">Audio *</th>
                <th className="text-start">Title *</th>
                <th className="text-start">File Types *</th>
                {/* <th className="text-start">Status *</th> */}
                <th>Upload Date *</th>
                <th>Action *</th>
              </tr>

              {files.map((file, index) => {
                const menu = (
                  <Menu style={{ width: "150px" }}>
                    <Menu.Item key="0">Edit</Menu.Item>
                    <Menu.Item key="1">Delete</Menu.Item>
                  </Menu>
                );

                const date = new Date(file.uploadDate);
                const formattedDate = `${
                  date.getMonth() + 1
                }/${date.getDate()}/${date.getFullYear()}`;

                return (
                  // <div key={index}>
                  <tr key={file._id}>
                    <td className="text-center text-indigo-500 font-semibold">
                      {index + 1}
                    </td>

                    <td className="text-center">
                      <Avatar size="large">
                        <img
                          src={file.image.url}
                          alt={file.title}
                          style={{ height: "50px" }}
                        />
                      </Avatar>
                    </td>

                    <td className="text-center">
                      <audio controls src={file.audio.url}>
                        Your browser does not support the audio element.
                      </audio>
                    </td>

                    <td>{file.title.substring(0, 30)}</td>

                    <td>{file.audio.mimetype}</td>

                    <td className="text-center text-slate-500">
                      {formattedDate}
                    </td>

                    <td className="text-center">
                      <Dropdown overlay={menu} trigger={["hover"]}>
                        <MoreOutlined />
                      </Dropdown>
                    </td>
                  </tr>
                  // </div>
                );
              })}
            </table>
          </>
        )}
      </Card>
    </div>
  );
};

export default FileManager;
