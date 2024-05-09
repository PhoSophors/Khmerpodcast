import React, { useState, useEffect } from "react";
import { Button, Spin, message } from "antd";
import { StepBackwardFilled, StepForwardFilled } from "@ant-design/icons";
import CustomCard from "../../card/CustomCard";
// import Banner from "./Banner";
import axios from "axios";
import "./HomePage.css";

const HomePage = ({ onPodcastSelected }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [startIndex, setStartIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState([]);
  const [error, setError] = useState(false);
  const cardsPerPage = 50;

  const fetchRandomFile = async () => {
    try {
      const response = await axios.get("/files/get-random-file");
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
        `/files/get-all-file?page=${page}&limit=${cardsPerPage}`
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

  // Function to handle next page
  const handleNext = () => {
    const nextPage = startIndex / cardsPerPage + 1;
    const nextStartIndex = nextPage * cardsPerPage;
    setStartIndex(nextStartIndex);
    fetchFiles(nextPage);
  };

  // Function to handle previous page
  const handlePrevious = () => {
    if (startIndex - cardsPerPage >= 0) {
      setStartIndex(startIndex - cardsPerPage);
    }
  };

  return (
    <div className="xl:p-1 p-0 ">
      {/* Display loading spinner if loading state is true */}
      {loading || error ? (
        <div className="spin-container">
          <Spin size="large" />
        </div>
      ) : (
        <>
        {/* <Banner/> */}
          <div className="flex sm:p-0 md:p-0 xl:p-0 xl:p-5 flex-wrap justify-center items-center translate-y-6">
            {/* Map over the files array starting from startIndex and limit to cardsPerPage */}
            {files
              .slice(startIndex, startIndex + cardsPerPage)
              .map((file, index) => (
                <CustomCard
                  key={file._id}
                  index={index}
                  hoveredIndex={hoveredIndex}
                  setHoveredIndex={setHoveredIndex} // Pass setHoveredIndex function to CustomCard
                  file={file} // Pass file data to CustomCard
                  setSelectedPodcast={onPodcastSelected} // Pass setSelectedPodcast function to CustomCard
                />
              ))}
          </div>

          {/* Pagination buttons */}
          <div className="w-full flex  justify-center mt-5 gap-5">
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
          </div>

          <div className="p-5"></div>
        </>
      )}
    </div>
  );
};

export default HomePage;
