import { useState, useEffect } from "react";
import { Card, DatePicker } from "antd";
import axios from "axios";
import Cookies from "js-cookie";
import { Pie } from "react-chartjs-2";
import Chart from "chart.js/auto";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPodcast,
  faUserPlus,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import "../admin.css";

const Dashboard = () => {
  const [userCount, setUserCount] = useState(0);
  const [fileCount, setFileCount] = useState(0);
  const [selectedDate, setSelectedDate] = useState(null);
  const authToken = Cookies.get("authToken");

  useEffect(() => {
    fetchCounts();
  }, [selectedDate]); // Call API whenever selectedDate changes

  const fetchCounts = async () => {
    try {
      if (authToken) {
        // Fetch user count
        const userResponse = await axios.get("/auths/users", {
          baseURL: process.env.REACT_APP_PROXY,
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
          params: { date: selectedDate }, // Pass selectedDate as query parameter
        });
        setUserCount(userResponse.data.user);

        // Fetch file count
        const fileResponse = await axios.get("/files/count", {
          baseURL: process.env.REACT_APP_PROXY,
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        setFileCount(fileResponse.data.count);
      }
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  const total = userCount + fileCount;
  const userPercentage = (userCount / total) * 100;
  const filePercentage = (fileCount / total) * 100;

  const data = {
    labels: ["Users", "Files"],
    datasets: [
      {
        label: "% of Total",
        data: [userPercentage, filePercentage],
        backgroundColor: ["rgba(75, 192, 192, 0.2)", "rgba(255, 99, 132, 0.2)"],
        borderColor: ["rgba(75, 192, 192, 1)", "rgba(255, 99, 132, 1)"],
        borderWidth: 1,
      },
    ],
  };

  const fetchUserCountForDateRange = async (selectedDates) => {
    try {
      const response = await fetch(
        `/api/users/count?start=${selectedDates[0]}&end=${selectedDates[1]}`
      );
      const data = await response.json();
      return data.userCount;
    } catch (error) {
      console.error("Failed to fetch user count:", error);
      return 0;
    }
  };

  const handleDateChange = async (dates) => {
    if (dates && dates.length === 2) {
      // If both start and end dates are selected
      const selectedDates = dates.map((date) => date.format("YYYY-MM-DD"));
      setSelectedDate(selectedDates);

      // Fetch the user count for the selected date range
      // Replace this with your actual function to fetch the user count
      const count = await fetchUserCountForDateRange(selectedDates);
      setUserCount(count);
    } else {
      setSelectedDate(null); // Reset selectedDate if dates are not selected properly
      setUserCount(0); // Reset userCount if dates are not selected properly
    }
  };

  return (
    <>
      <div className="flex grid xl:grid-cols-4 grid-cols-2 gap-2 sm:flex sm:gap-5 p-2">
        <Card title="Total Users" className="w-full md:w-1/2 bg-red-400">
          <div className="flex items-center justify-between">
            <div className="flex items-center text-gray-100">
              <FontAwesomeIcon
                icon={faUsers}
                style={{ fontSize: "40px", marginRight: "10px" }}
              />
            </div>
            <h1 className="text-3xl font-semibold text-gray-100">
              {userCount}
            </h1>
          </div>
          {/* Date Picker */}
          <div className="mt-4">
            <DatePicker.RangePicker
              className="w-full"
              format="YYYY-MM-DD"
              onChange={handleDateChange} // Call handleDateChange on date selection
            />
          </div>
        </Card>

        <Card title="Total Podcasts" className="w-full md:w-1/2 bg-red-400">
          <div className="flex items-center justify-between">
            <div className="flex items-center text-gray-100">
              <FontAwesomeIcon
                icon={faPodcast}
                style={{ fontSize: "40px", marginRight: "10px" }}
              />
            </div>
            {/* Any additional content you want to put on the right */}
            <h1 className="text-3xl font-semibold text-gray-100">
              {fileCount}
            </h1>
          </div>
        </Card>

        <Card title="News Users" className="w-full md:w-1/2 bg-emerald-400">
          <div className="flex items-center justify-between">
            <div className="flex items-center text-gray-100">
              <FontAwesomeIcon
                icon={faUserPlus}
                style={{ fontSize: "40px", marginRight: "10px" }}
              />
            </div>
            {/* Any additional content you want to put on the right */}
            <h1 className="text-3xl font-semibold text-red-600">
              App Maintenance
            </h1>
          </div>
        </Card>

        <Card title="News Podcast" className="w-full md:w-1/2 bg-emerald-400">
          <div className="flex items-center justify-between">
            <div className="flex items-center text-gray-100">
              <FontAwesomeIcon
                icon={faPodcast}
                style={{ fontSize: "40px", marginRight: "10px" }}
              />
            </div>
            {/* Any additional content you want to put on the right */}
            <h1 className="text-3xl font-semibold text-red-600">
              App Maintenance
            </h1>
          </div>
        </Card>
      </div>
      <div className="flex grid xl:grid-cols-2 grid-cols-1 gap-4 gap-2 sm:flex sm:gap-5 p-2">
        <Card title="User and File Counts">
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
            }}
          >
            <Pie style={{ width: "auto" }} data={data} />
          </div>
        </Card>
        <Card title="Cloud Storage" className="col-span-2 w-full">
          <h1 className="text-3xl font-semibold text-red-600">
            App Maintenance
          </h1>
        </Card>
        <div className="mb-20"></div>
      </div>
    </>
  );
};

export default Dashboard;
