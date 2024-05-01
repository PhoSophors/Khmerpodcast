import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Card, Spin, message } from "antd";

const ViewDetailPodcast = ({ podcast }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState({});
  const { id } = useParams();

  const fetchFile = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/files/get-file/${id}`);

      console.log("Response:", response.data); // Log the entire response

      setFile(response.data);
      if (response.data.user) {
        setUser(response.data.user);
        console.log("User data found in response:", response.data.user);
      } else {
        // Handle missing user data
        console.log("User data not found in response");
      }
    } catch (error) {
      if (error.response && error.response.status === 500) {
        console.error("Server error:", error.message);
      } else {
        message.error("Error fetching file");
        console.error("Error fetching file:", error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFile();
  }, [id]);

  if (loading) {
    return (
      <div className="p-10">
        <Spin />
      </div>
    );
  }

  return (
    <div className="p-2 w-full justify-flex-between">
      <Card
        style={{
          height: `calc(100vh - 110px)`,
          backgroundColor: "transparent",
        }}
      >
        <>
          <div className="flex grid xl:grid-cols-2 sm:flex sm:gap-5  mx-auto ">
            <div className="w-full sm:w-1/2 w-fit-content">
              {podcast.image && podcast.image.url && (
                <img
                  style={{
                    height: "200px",
                    borderRadius: "10px",
                    border: "1px solid #f0f0f0",
                  }}
                  src={podcast.image.url}
                  alt=""
                />
              )}
            </div>
            <div className="w-full col-span-8">
              <h1 className="text-2xl font-semibold text-gray-500  tracking-wide">
                {podcast.title || ""}
              </h1>
              {podcast.audio && podcast.audio.url && (
                <audio controls src={podcast.audio.url} />
              )}
            </div>
          </div>
          <h1>{podcast.description || ""} </h1>
          {podcast.user && <p>Posted By: {podcast.user.id}</p>}
        </>
      </Card>
    </div>
  );
};

export default ViewDetailPodcast;
