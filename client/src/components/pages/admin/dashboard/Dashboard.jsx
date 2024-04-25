import { useState, useEffect } from 'react';
import { Card } from 'antd';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Pie } from 'react-chartjs-2';
import { Chart } from 'chart.js/auto';
import '../admin.css';

const Dashboard = () => {
  const [userCount, setUserCount] = useState(0);
  const [fileCount, setFileCount] = useState(0);
  const authToken = Cookies.get('authToken');

  useEffect(() => {
    fetchUserCount();
    fetchFileCount();
  }, []);

  const fetchUserCount = async () => {
    try {
      if (authToken) {
        const response = await axios.get('/auths/users', {
          baseURL: process.env.REACT_APP_PROXY,
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        setUserCount(response.data.user);
      }
    } catch (error) {
      console.error('Error:', error.message);
    }
  };

  const fetchFileCount = async () => {
    try {
      if (authToken) {
        const response = await axios.get('/files/count', {
          baseURL: process.env.REACT_APP_PROXY,
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        setFileCount(response.data.count);
      }
    } catch (error) {
      console.error('Error:', error.message);
    }
  };

  const total = userCount + fileCount;
  const userPercentage = (userCount / total) * 100;
  const filePercentage = (fileCount / total) * 100;

  const data = {
    labels: ['Users', 'Files'],
    datasets: [
      {
        label: '% of Total',
        data: [userPercentage, filePercentage],
        backgroundColor: ['rgba(75, 192, 192, 0.2)', 'rgba(255, 99, 132, 0.2)'],
        borderColor: ['rgba(75, 192, 192, 1)', 'rgba(255, 99, 132, 1)'],
        borderWidth: 1,
      },
    ],
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
      <div className='flex grid xl:grid-cols-3 sm:flex gap-5 sm:gap-5 p-5'>
        <Card title="User and File Counts"  className="card w-full md:w-1/3">
          <Pie style={{ height: "200px" }} data={data} />
        </Card>
        <Card title="Total Categories" className="card w-full md:w-1/3">
          <h1>100</h1>
        </Card>
      </div>
    </>
  );
};

export default Dashboard;
