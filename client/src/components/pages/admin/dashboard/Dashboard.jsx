import { useState, useEffect } from "react";
import { Card, DatePicker } from "antd";
import axios from "axios";
import Cookies from "js-cookie";
import { Pie } from "react-chartjs-2";
import { Chart, ArcElement } from "chart.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPodcast,
  faUserPlus,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import { api_url } from "../../../../api/config";
import "../admin.css";
Chart.register(ArcElement);

const Dashboard = () => {
  const [userCount, setUserCount] = useState(0);
  const [fileCount, setFileCount] = useState(0);
  const [selectedDate, setSelectedDate] = useState(null);
  const authToken = Cookies.get("authToken");

  useEffect(() => {
    fetchCounts();
  }, [selectedDate]);

  const fetchCounts = async () => {
    try {
      if (authToken) {
        // Fetch user count
        const userResponse = await axios.get(`${api_url}/auths/users`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
          params: { date: selectedDate },
        });
        setUserCount(userResponse.data.user);

        // Fetch file count
        const fileResponse = await axios.get(`${api_url}/files/count`, {
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
        `${api_url}/api/users/count?start=${selectedDates[0]}&end=${selectedDates[1]}`
      );
      const data = await response.json();
      return data.userCount;
    } catch (error) {
      console.error("Failed to fetch user count:", error);
      return 0;
    }
  };

  const handleDateChange = async (dates) => {
    if (dates && dates.length === 1) {
      const count = await fetchUserCountForDateRange([dates[0], dates[0]]);
      setUserCount(count);
    } else {
      setSelectedDate(null);
      setUserCount(0);
    }
  };

  return (
    <>
      <div className="flex grid xl:grid-cols-4 grid-cols-2 gap-2 sm:flex sm:gap-5 p-2">
        <Card title="Total Users" className="w-full md:w-1/2">
          <div className="flex items-center justify-between">
            <div className="p-3 flex justify-center bg-green-200 h text-gray-500 h-20 w-20 flex justify-center items-center rounded-full">
              <FontAwesomeIcon icon={faUsers} style={{ fontSize: "40px" }} />
            </div>
            <h1 className="text-3xl font-semibold text-gray-600">
              {userCount}
            </h1>
          </div>
          {/* Date Picker */}
          <div className="mt-4">
            <DatePicker
              className="w-full"
              format="YYYY-MM-DD"
              onChange={handleDateChange} // Call handleDateChange on date selection
            />
          </div>
        </Card>

        <Card title="Total Podcasts" className="w-full md:w-1/2">
          <div className="flex items-center justify-between">
            <div className="p-3 flex justify-center text-gray-500 bg-red-200  h-20 w-20 flex justify-center items-center rounded-full">
              <FontAwesomeIcon icon={faPodcast} style={{ fontSize: "40px" }} />
            </div>
            {/* Any additional content you want to put on the right */}
            <h1 className="text-3xl font-semibold text-gray-600">
              {fileCount}
            </h1>
          </div>
        </Card>

        <Card title="News Users" className="w-full md:w-1/2">
          <div className="flex items-center justify-between">
            <div className="p-3 flex justify-center text-white bg-red-400 h-20 w-20 flex justify-center items-center rounded-full">
              <FontAwesomeIcon icon={faUserPlus} style={{ fontSize: "40px" }} />
            </div>
            {/* Any additional content you want to put on the right */}
            <h1 className="text-3xl font-semibold text-red-600">Maintenance</h1>
          </div>
        </Card>

        <Card title="News Podcast" className="w-full md:w-1/2 ">
          <div className="flex items-center justify-between">
            <div className="p-3 flex justify-center text-white bg-red-400 h-20 w-20 flex justify-center items-center rounded-full">
              <FontAwesomeIcon icon={faPodcast} style={{ fontSize: "40px" }} />
            </div>
            {/* Any additional content you want to put on the right */}
            <h1 className="text-3xl font-semibold text-red-600">Maintenance</h1>
          </div>
        </Card>
      </div>

      <div className="flex grid xl:grid-cols-2 grid-cols-1 gap-4 gap-2 sm:flex sm:gap-5 p-2">
        <Card title="Users and Podcasts Counts">
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
