import React from "react";
import useDashbaord from "../../../../../services/useDashboard";
import { Bar } from "react-chartjs-2";
import { Card } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDatabase, faFile } from "@fortawesome/free-solid-svg-icons";
import { Chart as ChartJS } from "chart.js/auto";

const TotalPodcastStorage = () => {
  const { podcastStorageInfo } = useDashbaord(null);

  const podcastStorageDataAndObject = {
    labels: ["Podcast Data", "Podcast Object"],
    datasets: [
      {
        label: "Storage Usage (MB)",
        data: [
          podcastStorageInfo.totalSize / (1024 * 1024),
          podcastStorageInfo.totalObjects,
        ],
        backgroundColor: ["#bae6ff", "#a9e4a0"], // Light blue and light green
        borderColor: ["#4285f4", "#43a047"], // Darker blue and green
        pointRadius: 5,
        pointHoverRadius: 7,
        pointHitRadius: 10,
      },
    ],
  };

  const podcastStorageOptions = {
    title: {
      display: true,
      text: "Podcast Storage Breakdown",
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
      <Card
        title="Total Podcast Storage Used"
        className="dashboard-card w-full"
      >
        <div className="flex items-center justify-between ">
          <div>
            <div className="p-4  h-18 w-18  flex justify-center text-gray-500 bg-blue-200 flex justify-center items-center rounded-full">
              <FontAwesomeIcon icon={faDatabase} style={{ fontSize: "2rem" }} />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="p-4  h-18 w-18 flex justify-center text-gray-500 bg-amber-200 flex justify-center items-center rounded-full">
              <FontAwesomeIcon icon={faFile} style={{ fontSize: "2rem" }} />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mt-3">
          <h1 className="text-xl  font-semibold text-gray-600 dark:text-slate-100 ">
            {podcastStorageInfo && (
              <>{(podcastStorageInfo.totalSize / 1048576).toFixed(2)} MB</>
            )}
          </h1>
          <h1 className="text-xl font-semibold text-gray-600 dark:text-slate-100 ">
            {podcastStorageInfo && <>{podcastStorageInfo.totalObjects}</>}
          </h1>
        </div>

        <Bar
          height={80}
          data={podcastStorageDataAndObject}
          options={podcastStorageOptions}
        />
      </Card>
    </>
  );
};

export default TotalPodcastStorage;
