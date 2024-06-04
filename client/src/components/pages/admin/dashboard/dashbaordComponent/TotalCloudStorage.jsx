import React from "react";
import useDashbaord from "../../../../../services/useDashboard";
import { Card } from "antd";
import { Chart as ChartJS } from "chart.js/auto";
import { CloudFilled } from "@ant-design/icons";
import { Bar } from "react-chartjs-2";

const TotalCloudStorage = () => {
  const { userCount, fileCount, podcastStorageInfo, profileStorageInfo } =
    useDashbaord(null);

  // const totalPodcastChart
  const CloudStorageData = {
    labels: ["Podcast Data", "Profile Data", "Total Users", "Total Files"],
    datasets: [
      {
        label: "Storage Usage (MB)",
        data: [
          podcastStorageInfo.totalSize / (1024 * 1024),
          profileStorageInfo.totalSize / (1024 * 1024),
          userCount,
          fileCount,
        ],
        backgroundColor: ["#bae6ff", "#a9e4a0"], // Light blue and light green
        borderColor: ["#4285f4", "#43a047"], // Darker blue and green
        pointRadius: 5,
        pointHoverRadius: 7,
        pointHitRadius: 10,
      },
    ],
  };

  const CloudStorageOptions = {
    title: {
      display: true,
      text: "Cloud Storage Breakdown",
    },
    scales: {
      xAxes: [
        {
          stacked: true,
          ticks: {
            beginAtZero: true,
          },
          scaleLabel: {
            display: true,
            labelString: "Content Category",
          },
        },
      ],
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
          },
          scaleLabel: {
            display: true,
            labelString: "Usage (GB)",
          },
        },
      ],
    },
    legend: {
      display: true, // Show legend
    },
  };

  return (
    <>
      <Card title="Cloud Storage" className="dashboard-card col-span-2 w-full">
        <div className="p-4  h-18 w-18  flex justify-center text-gray-500 bg-red-200 flex justify-center items-center rounded-xl">
          <CloudFilled style={{ fontSize: "3rem" }} />
        </div>

        <Bar
          className="mt-5"
          height={80}
          data={CloudStorageData}
          options={CloudStorageOptions}
        />
      </Card>
    </>
  );
};

export default TotalCloudStorage;
