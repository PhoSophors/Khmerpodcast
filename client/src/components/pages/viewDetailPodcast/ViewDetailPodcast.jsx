import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Card, Spin } from "antd";

const ViewDetailPodcast = ({ podcast }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const [user, setUser] = useState({});
  const { id } = useParams();


  const fetchFile = async () => {
    setLoading(true);
    try {
      console.log("Fetching file with id:", id); // Log the id to check its value
      const response = await axios.get(`/files/get-file/${id}`);
      
      console.log("Response:", response.data); // Log the response data
      setFile(response.data);
      setUser(response.data.user); // Set the user state to the user who uploaded the file
    } catch (error) {
      console.error("Error fetching file:", error.message);
      setNotification("Error fetching file"); // Update the state directly
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
    <div className="p-10 w-full justify-flex-between">
      <Card>
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
          {podcast.user && <p>Posted By : {podcast.user.username}</p>}
        </>
      </Card>
    </div>
  );
};

export default ViewDetailPodcast;
