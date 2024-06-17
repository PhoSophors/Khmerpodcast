import React, { useState, useEffect } from "react";
import { Spin, notification } from "antd";
import CustomCard from "../../card/CustomCard";
import axios from "axios";
import "./HomePage.css";
import { api_url } from "../../../api/config";
import { useNavigate } from "react-router-dom";
import useView from "../../../services/useView";

const HomePage = () => {
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState([]);
  const [error, setError] = useState(null); 
  const navigate = useNavigate();
  const { incrementViewCount } = useView();

  const fetchFiles = async () => {
    setLoading(true);

    try {
      const response = await axios.get(`${api_url}/files/get-random-file`);
      let files = response.data.reverse();

      for (let i = files.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [files[i], files[j]] = [files[j], files[i]];
      }

      setFiles(files);
      setError(null);
    } catch (err) {
      notification.error({
        message: "Error fetching Podcasts.",
        description: "Please wait a minute and try again.",
      });
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles(0);
  }, []);

  return (
    <div className="xl:p-3 gap-2 p-0 homepage">
      {loading ? (
        <div className="spin-loading mt-20">
          <Spin />
        </div>
      ) : (
        <>
          <div className="flex sm:p-0 md:p-0 flex-wrap justify-center items-center home-container">
            {files.map((file, index) => (
              <CustomCard
                key={file.id || index}
                file={file}
                handleViewPodcast={async () => {
                  navigate(`/watch-podcast/${file._id}`);
                  await incrementViewCount(file._id);
                }}
              />
            ))}
          </div>
          {error && (
            <div className="mt-10">
              <p className="text-center text-base text-red-500 font-semibold flex flex-col">
                <div className="mt-10">
                  {error.message || "Server Error..!"}
                </div>
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default HomePage;
