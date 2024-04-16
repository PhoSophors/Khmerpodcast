import React, { useState, useEffect } from "react";
import axios from "axios";
import { Spin, Alert, Card, Avatar, Menu, Dropdown, message, Modal } from "antd";
import Cookies from "js-cookie";
import { MoreOutlined, DeleteOutlined } from "@ant-design/icons";
import SearchForm from "../../search/SearchForm";
import "../admin.css";

const FileManager = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [audioUrls, setAudioUrls] = useState([]);
  const [notification, setNotification] = useState(null);
  const [error, setError] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
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

  
  const deletePodcast = (id) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this podcast?',
      icon: <DeleteOutlined />,
      content: 'This action cannot be undone.',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        deletePodcastConfirmed(id);
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };
  
  const deletePodcastConfirmed = async (id) => {
    try {
      setLoading(true);
      const response = await axios.delete(`/files/${id}`, {
        method: "DELETE",
        baseURL: process.env.REACT_APP_SERVER_URL,
        headers: {
          "auth-token": authToken,
        },
      });
      setNotification(response.data.message);
      message.success('Podcast deleted successfully');
      fetchFiles();
    } catch (error) {
      message.error('Error deleting file');
    } finally {
      setLoading(false);
    }
  };



  const handleSearchSubmit = async (results, query) => {
    setSearchResults(results);
    setSearchQuery(query);
  };

  const date = new Date(); // replace this with your date
  const formattedDate = date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="p-5 ">
      <Card title="File Manager" className="w-full">
        <SearchForm handleSearchSubmit={handleSearchSubmit} />

        {loading ? (
          <div className="spin-container">
            <Spin size="large" />
          </div>
        ) : error ? (
          <Alert message={error} type="error" />
        ) : (
          <>
            <table id="user-table" className="mt-10">
              <thead>
                <tr>
                  <th>No *</th>
                  <th>Thumbnail *</th>
                  <th className="text-start">Audio *</th>
                  <th className="text-start">Title *</th>
                  <th className="text-start">Description *</th>
                  <th className="text-start">File Types *</th>
                  {/* <th className="text-start">Status *</th> */}
                  <th>Upload Date *</th>
                  <th>Action *</th>
                </tr>
              </thead>
              <tbody>
                {searchResults.length > 0 ? (
                  searchResults.map((result, index) => (
                    <tr key={result._id} className="search-result">
                      <td className="text-center text-indigo-500 font-semibold">
                        {index + 1}
                      </td>
                      <td className="text-center">
                        <Avatar size="large">
                          <img
                            src={result.image.url}
                            alt={result.title}
                            style={{ height: "50px" }}
                          />
                        </Avatar>
                      </td>
                      <td className="text-center">
                        {/* <audio controls src={result.audio.url}>
                          Your browser does not support the audio element.
                        </audio> */}
                      </td>
                      <td>{result.title.substring(0, 30)}</td>
                      <td>{result.description.substring(0, 30)}</td>
                      <td>{result.audio.mimetype}</td>
                      <td className="text-center text-slate-500">
                        {formattedDate}
                      </td>
                      <td className="text-center">
                        <Dropdown
                          overlay={
                            <Menu style={{ width: "200px" }}>
                              <Menu.Item key="0">Edit</Menu.Item>
                              <Menu.Item key="1" onClick={() => deletePodcast(result._id)}>Delete</Menu.Item>
                            </Menu>
                          }
                          trigger={["hover"]}
                        >
                          <MoreOutlined />
                        </Dropdown>
                      </td>
                    </tr>
                  ))
                ) : files.length > 0 ? (
                  files.map((file, index) => (
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
                        {/* <audio controls src={file.audio.url}>
                          Your browser does not support the audio element.
                        </audio> */}
                        {/* {file.user} */}
                      </td>
                      <td>{file.title.substring(0, 30)}</td>
                      <td>{file.description.substring(0, 30)}</td>
                      <td>{file.audio.mimetype}</td>
                      <td className="text-center text-slate-500">
                        {formattedDate}
                      </td>
                      <td className="text-center">
                        <Dropdown
                          overlay={
                            <Menu style={{ width: "200px" }}>
                              <Menu.Item key="0">Edit</Menu.Item>
                              <Menu.Item key="1" onClick={() => deletePodcast(file._id)}>Delete</Menu.Item>
                            </Menu>
                          }
                          trigger={["hover"]}
                        >
                          <MoreOutlined />
                        </Dropdown>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td  className="text-center">
                      No Podcast found..!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </>
        )}
      </Card>
    </div>
  );
};

export default FileManager;
