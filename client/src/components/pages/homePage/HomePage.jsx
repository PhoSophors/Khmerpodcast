import React, { useState, useEffect } from "react";
import { Spin, notification } from "antd";
import CustomCard from "../../card/CustomCard";
import ViewDetailPodcast from "../viewDetailPodcast/ViewDetailPodcast";
// import { StepBackwardFilled, StepForwardFilled } from "@ant-design/icons";
import axios from "axios";
import "./HomePage.css";
import { api_url } from "../../../api/config";

const HomePage = () => {
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState([]);
  const [error, setError] = useState(false);
  const cardsPerPage = 10;
  const [isViewPodcast, setIsViewPodcast] = useState(false);
  const [selectedPodcast, setSelectedPodcast] = useState(null);

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
          <div className="spin-container">
            <Spin size="large" />
          </div>
        ) : (
          <>
            {/* <Banner/> */}
            <div className="flex sm:p-0 md:p-0 flex-wrap justify-center items-center">
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
                      setIsViewPodcast(true);
                      setSelectedPodcast(file);
                    }}
                  />
                ))
              )}
            </div>
            {error && (
              <div className="mt-10 text-red-500">
                <p className="text-center font-semebold ">Srver Error..!</p>
              </div>
            )}
          </>
        )}
      </div>
      <div className="mt-20 text-white">.</div>
    </>
  );
};

export default HomePage;
