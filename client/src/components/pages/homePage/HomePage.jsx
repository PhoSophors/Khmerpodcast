import React, { useState, useEffect } from "react";
import { Spin, notification } from "antd";
import CustomCard from "../../card/CustomCard";
import axios from "axios";
import "./HomePage.css";
import { api_url } from "../../../api/config";
import { useNavigate } from 'react-router-dom'; 

const HomePage = () => {
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState([]);
  const [error, setError] = useState(false);
  const cardsPerPage = 10;
  const navigate = useNavigate(); 

  const fetchFiles = async (page) => {
    setLoading(true);

    try {
      const response = await axios.get(
        `${api_url}/files/get-all-file?page=${page}&limit=${cardsPerPage}`
      );
      let files = response.data.reverse();

      setFiles(files);
      setError(false);
      setLoading(false);
    } catch (error) {
      notification.error({
        message: "Error fetching Podcasts.",
        description: "Please wait a minute and try again.",
      });
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles(0);
  }, []);



  return (
    <>
      <div className="xl:p-3 gap-2 p-0 homepage">
        {/* Display loading spinner if loading state is true */}
        {loading || error ? (
          <div className="spin-loading mt-20">
            <Spin />
          </div>
        ) : (
          <>
            <div className="flex sm:p-0 md:p-0 flex-wrap justify-center items-center home-container">
              {/* Map over the files array */}
              {files.map((file, index) => (
                <CustomCard
                  key={file.id || index}
                  file={file}
                  handleViewPodcast={() => {
                    navigate(`/watch-podcast/${file._id}`);
                  }}
                />
              ))}
            </div>
            {error && (
              <div className="mt-10">
                <p className="text-center text-base text-red-500 font-semebold">
                  Server Error..!
                </p>
              </div>
            )}
          </>
        )}
  
        <div className="dot">.</div>
      </div>
    </>
  );
};

export default HomePage;
