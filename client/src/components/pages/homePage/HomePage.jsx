import React, { useState, useEffect } from "react";
import { Spin, notification } from "antd";
import CustomCard from "../../card/CustomCard";
import ViewDetailPodcast from "../viewDetailPodcast/ViewDetailPodcast";
import axios from "axios";
import "./HomePage.css";
import { api_url } from "../../../api/config";
import { useNavigate } from 'react-router-dom'; // Import the useNavigate hook

const HomePage = () => {
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState([]);
  const [error, setError] = useState(false);
  const cardsPerPage = 10;
  const [isViewPodcast, setIsViewPodcast] = useState(false);
  const [selectedPodcast, setSelectedPodcast] = useState(null);
  const navigate = useNavigate(); // Get the navigate function

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
      <div className="xl:p-3 gap-2 p-0 ">
        {/* Display loading spinner if loading state is true */}
        {loading || error ? (
          <div className="spin-loading mt-20">
            <Spin />
          </div>
        ) : (
          <>
            <div className="flex sm:p-0 md:p-0 flex-wrap justify-center items-center home-container">
              {/* Map over the files array starting from startIndex and limit to cardsPerPage */}
              {isViewPodcast ? (
                <ViewDetailPodcast
                  file={selectedPodcast}
                  handleViewPodcast={() => setIsViewPodcast(false)}
                />
              ) : (
                files.map((file, index) => (
                  <CustomCard
                    key={file.id}
                    file={file}
                    handleViewPodcast={() => {
                      setIsViewPodcast(false);
                      setSelectedPodcast(file);
                      navigate(`/watch-podcast/${file._id}`);
                    }}
                  />
                ))
              )}
            </div>
            {error && (
              <div className="mt-10">
                <p className="text-center  text-red-500 font-semebold">
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
