import React, { useEffect, useState } from "react";
import { Card } from "antd";
import axios from "axios";
import Cookies from "js-cookie";

const Dashboard = () => {
  const [userCount, setUserCount] = useState(0); // Initialize userCount with 0
  const authToken = Cookies.get("authToken");

  useEffect(() => {
    fetchUserCount();
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

  return (
    <div className="flex grid xl:grid-cols-4 sm:flex gap-5 sm:gap-5 p-5">
      <Card title="Total Users" className="w-full md:w-1/4">
        <h1>{userCount}</h1>
      </Card>
      <Card title="Total Podcasts" className="w-full md:w-1/4">
        <h1>100</h1>
      </Card>
      <Card title="Total Products" className="w-full md:w-1/4">
        <h1>100</h1>
      </Card>
      <Card title="Total Categories" className="w-full md:w-1/4">
        <h1>100</h1>
      </Card>
    </div>
  );
};

export default Dashboard;
