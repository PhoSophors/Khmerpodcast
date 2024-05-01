import React, { useState, useEffect } from "react";
import { Button, Spin, message } from "antd";
import { StepBackwardFilled, StepForwardFilled } from "@ant-design/icons";
import CustomCard from "../../card/CustomCard";
import axios from "axios";
import "./HomePage.css";

const HomePage = ({ onPodcastSelected }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [startIndex, setStartIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState([]);
  const [error, setError] = useState(false);
  const cardsPerPage = 24;

  // Function to fetch files
  const fetchFiles = async (page) => {
    setLoading(true);

    try {
      const response = await axios.get(
        `/files/get-all-file?page=${page}&limit=${cardsPerPage}`
      );
      setFiles(response.data);
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
          <div className="flex sm:p-0 md:p-0 xl:p-0 xl:p-5 flex-wrap justify-center items-center">
            {/* Map over the files array starting from startIndex and limit to cardsPerPage */}
            {files
              .slice(startIndex, startIndex + cardsPerPage)
              .map((file, index) => (
                <CustomCard
                  key={index}
                  index={index}
                  hoveredIndex={hoveredIndex}
                  setHoveredIndex={setHoveredIndex} // Pass setHoveredIndex function to CustomCard
                  file={file} // Pass file data to CustomCard
                  setSelectedPodcast={onPodcastSelected} // Pass setSelectedPodcast function to CustomCard
                />
              ))}
          </div>

          {/* Pagination buttons */}
          <div className="w-full flex  justify-center mt-4 gap-5">
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
