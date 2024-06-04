import React from "react";
import useDashbaord from "../../../../../services/useDashboard";
import { Link } from "react-router-dom";
import { Line } from "react-chartjs-2";
import { Card } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { Chart as ChartJS } from "chart.js/auto";

const TotalUser = () => {
  const { userCount } = useDashbaord(null);

  const totaluserChart = {
    labels: ["Total Users"],
    datasets: [
      {
        label: "Total Users",
        data: [userCount],
        backgroundColor: ["#bae6ff"],
        borderColor: ["#4285f4"],
        pointRadius: 5,
        pointHoverRadius: 7,
        pointHitRadius: 10,
      },
    ],

    options: {
      title: {
        display: true,
        text: "Total Users",
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
    },
  };

  return (
    <>
      <Card title="Total Users" className="dashboard-card w-full">
        <div className="flex items-center justify-between">
          <Link to="/all-user">
            <div className="p-4  h-18 w-18  flex justify-center bg-green-200 h text-gray-500 flex justify-center items-center rounded-full">
              <FontAwesomeIcon icon={faUser} style={{ fontSize: "2rem" }} />
            </div>
          </Link>
          <h1 className="text-3xl font-semibold text-gray-600 dark:text-slate-100 ">
            {userCount}
          </h1>
        </div>
        <Line
          height={80}
          data={totaluserChart}
          options={totaluserChart.options}
        />
      </Card>
    </>
  );
};

export default TotalUser;
