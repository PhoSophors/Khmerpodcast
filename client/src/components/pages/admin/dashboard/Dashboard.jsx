import React, { useEffect, useState } from "react";
import { Card } from "antd";
import axios from "axios";
import Cookies from "js-cookie";
import "../admin.css";
// import AllUser from "../user/AllUser";
// import FileManager from "../user/FileManager";

const Dashboard = () => {
  const [userCount, setUserCount] = useState(0);
  const [fileCount, setFileCount] = useState(0);
  const authToken = Cookies.get("authToken");

  useEffect(() => {
    fetchUserCount();
    fetchFileCount();
  }, []);

  const fetchUserCount = async () => {
    try {
      if (authToken) {
        const response = await axios.get(`/auths/users`, {
          baseURL: process.env.REACT_APP_PROXY,
          headers: {
            "auth-token": authToken,
          },
        });
        setUserCount(response.data.user);
      }
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  const fetchFileCount = async () => {
    try {
      if (authToken) {
        const response = await axios.get(`/files/count`, {
          baseURL: process.env.REACT_APP_PROXY,
          headers: {
            "auth-token": authToken,
          },
        });
        setFileCount(response.data.count);
      }
    } catch (error) {
      console.error("Error fetching file count:", error.message);
      if (error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
        console.error("Response headers:", error.response.headers);
      }
    }
  };

  return (
    <>
      <div className="flex grid xl:grid-cols-4 sm:flex gap-5 sm:gap-5 p-5">
        <Card title="Total Users" className="card w-full md:w-1/4 ">
          <h1>{userCount}</h1>
        </Card>

        <Card title="Total Podcasts" className="card w-full md:w-1/4">
          <h1>{fileCount}</h1>
        </Card>
        <Card title="Total Products" className="card w-full md:w-1/4">
          <h1>100</h1>
        </Card>
        <Card title="Total Categories" className="card w-full md:w-1/4">
          <h1>100</h1>
        </Card>
      </div>

      {/*
       <AllUser />
      <FileManager />
       */}
    </>
  );
};

export default Dashboard;