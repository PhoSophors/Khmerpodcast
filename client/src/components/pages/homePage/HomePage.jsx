import React, { useState, useEffect } from "react";
import { Spin, message } from "antd";
import CustomCard from "../../card/CustomCard";
import ViewDetailPodcast from "../viewDetailPodcast/ViewDetailPodcast";
// import Banner from "./Banner";
import axios from "axios";
import "./HomePage.css";
import { api_url } from "../../../api/config";

const HomePage = () => {
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState([]);
  const [error, setError] = useState(false);
  const cardsPerPage = 50;
  const [isViewPodcast, setIsViewPodcast] = useState(false);
  const [selectedPodcast, setSelectedPodcast] = useState(null);

  console.log(api_url);
  
  const fetchRandomFile = async () => {
    try {
      const response = await axios.get(`${api_url}/files/get-random-file`);
      return response.data;
    } catch (error) {
      console.error("Error fetching random file:", error);
      throw error;
    }
  };

  const fetchFiles = async (page) => {
    setLoading(true);

    try {
      const response = await axios.get(
        `${api_url}/files/get-all-file?page=${page}&limit=${cardsPerPage}`

      );
      let files = response.data;

      // Fetch unique random files
      const firstRandomFile = await fetchRandomFile();
      // const lastRandomFile = await fetchRandomFile();

      // Replace first and last files with random ones
      files[0] = firstRandomFile;
      // files[files.length - 1] = lastRandomFile;

      setFiles(files);
      setError(false);
      setLoading(false);
    } catch (error) {
      message.error("Error fetching files");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles(0);
  }, []);

  // // Function to handle next page
  // const handleNext = () => {
  //   const nextPage = startIndex / cardsPerPage + 1;
  //   const nextStartIndex = nextPage * cardsPerPage;
  //   setStartIndex(nextStartIndex);
  //   fetchFiles(nextPage);
  // };

  // // Function to handle previous page
  // const handlePrevious = () => {
  //   if (startIndex - cardsPerPage >= 0) {
  //     setStartIndex(startIndex - cardsPerPage);
  //   }
  // };

  return (
    <>
      <div className="xl:p-1 p-0 ">
        {/* Display loading spinner if loading state is true */}
        {loading || error ? (
          <div className="spin-container">
            <Spin size="large" />
          </div>
        ) : (
          <>
            {/* <Banner/> */}
            <div className="flex sm:p-0 md:p-0 xl:p-1 flex-wrap justify-center items-center">
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

            {/* Pagination buttons */}
            {/* <div className="w-full flex  justify-center mt-5 gap-5">
              <Button
                onClick={handlePrevious}
                disabled={startIndex === 0}
                type="dashed"
                size={5}
                icon={<StepBackwardFilled />}
              >
                Previous
              </Button>
              <Button
                onClick={handleNext}
                disabled={startIndex + cardsPerPage >= files.length}
                type="dashed"
                size={5}
                icon={<StepForwardFilled />}
              >
                Next
              </Button>
            </div> */}

            <div className="mb-50 mt-20">
              .
            </div>

          </>
        )}
      </div>
    </>
  );
};

export default HomePage;
