import React from "react";
import useDashbaord from "../../../../../services/useDashboard";
import { Bar } from "react-chartjs-2";
import { Card } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDatabase, faFile } from "@fortawesome/free-solid-svg-icons";
import { Chart as ChartJS } from "chart.js/auto";

const TotalProfileStorage = () => {
  const { profileStorageInfo } = useDashbaord(null);

  const profileStorageDataAndObject = {
    labels: ["Profile Data", "Profile Object"],

    datasets: [
      {
        label: "Storage Usage (MB)",
        data: [
          profileStorageInfo.totalSize / (1024 * 1024),
          profileStorageInfo.totalObjects,
        ],
        backgroundColor: ["#bae6ff", "#a9e4a0"], // Light blue and light green
        borderColor: ["#4285f4", "#43a047"], // Darker blue and green
        pointRadius: 5,
        pointHoverRadius: 7,
        pointHitRadius: 10,
      },
    ],
  };

  // profile storage options
  const profileStorageOptions = {
    title: {
      display: true,
      text: "Profile Storage Breakdown",
    },
    scales: {
      x: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Content Category",
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Storage Usage (MB)",
        },
      },
    },
  };

  return (
    <>
      <Card
        title="Total Profile Storage Used"
        className="dashboard-card w-full"
      >
        <div className="flex items-center justify-between">
          <div>
            <div className="p-4  h-18 w-18  flex justify-center text-gray-500 bg-blue-200 flex justify-center items-center rounded-full">
              <FontAwesomeIcon icon={faDatabase} style={{ fontSize: "2rem" }} />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="p-4  h-18 w-18  flex justify-center text-gray-500 bg-amber-200 flex justify-center items-center rounded-full">
              <FontAwesomeIcon icon={faFile} style={{ fontSize: "2rem" }} />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mt-3">
          <h1 className="text-xl font-semibold text-gray-600 dark:text-slate-100 ">
            {profileStorageInfo && (
              <>{(profileStorageInfo.totalSize / 1048576).toFixed(2)} MB</>
            )}
          </h1>
          <h1 className="text-xl font-semibold text-gray-600 dark:text-slate-100 ">
            {profileStorageInfo && <>{profileStorageInfo.totalObjects}</>}
          </h1>
        </div>

        <Bar
          height={80}
          data={profileStorageDataAndObject}
          options={profileStorageOptions}
        />
      </Card>
    </>
  );
};

export default TotalProfileStorage;
