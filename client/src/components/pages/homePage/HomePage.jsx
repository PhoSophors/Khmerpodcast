import React, { useState, useEffect } from "react";
import { Button, Spin, message, Card } from "antd";
import { StepBackwardFilled, StepForwardFilled } from "@ant-design/icons";
import CustomCard from "../../card/CustomCard";
import axios from "axios";
import podcasticon from "../../assets/podcasticon.png";
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
          <div className="xl:p-5 md:p-5 lg:p-5 sm:p-5 p-2 ">
            <Card
              className="box-decoration-slice bg-gradient-to-r from-indigo-600 to-pink-500 text-white px-2"
              style={{ borderRadius: "50px", height: "30vh" }}
              bodyStyle={{ padding: 0 }}
            >
              <div className="flex grid xl:grid-cols-2 gap-4 sm:flex sm:gap-5">
                <div className="sm:w-1/2 self-center p-10 col-span-2 justify-center items-center">
                  <span className="text-4xl text-slate-100 subpixel-antialiased font-semibold tracking-wide">
                    Listion to trending Khmer Podcasts all the time
                  </span>
                  <p class=" text-slate-200 mt-3">
                    Welcome to our Khmer Podcast Hub! Immerse yourself in the
                    world of Khmer language podcasts, where you can discover
                    trending shows anytime, anywhere. Stay connected to
                    Cambodian culture and language through our curated selection
                    of podcasts covering a wide range of topics. Start listening
                    now and explore the richness of Khmer podcasting!
                  </p>
                </div>
                <div className=" sm:w-1/2 text-center flex justify-end">
                  <img
                    src={podcasticon}
                    alt=""
                    style={{ height: "30vh", width: "auto" }}
                  />
                </div>
              </div>
            </Card>
          </div>

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
