import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Card, Spin } from "antd";

const ViewDetailPodcast = () => {
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
      setNotification.message("Error fetching file");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFile();
  }, []);

  if (loading) {
    return (
      <div className="p-10">
        <Spin />
      </div>
    );
  }

  return (
    <div className="p-10 w-full  justify-flex-between">
      <Card>
        {notification && <p>{notification}</p>}
        {file ? (
          <>
            <div className="flex grid xl:grid-cols-2 sm:flex sm:gap-5  mx-auto ">
              <div className="w-full sm:w-1/2 w-fit-content">
                {file.image && file.image.url && (
                  <img
                    style={{
                      height: "200px",
                      borderRadius: "10px",
                      border: "1px solid #f0f0f0",
                    }}
                    src={file.image.url}
                    alt={""}
                  />
                )}
              </div>
              <div className="w-full col-span-8">
                <h1 className="text-2xl font-semibold text-gray-500  tracking-wide">
                  {file.title || ""}
                </h1>
                {file.audio && file.audio.url && (
                  <audio controls src={file.audio.url} />
                )}
              </div>
            </div>

            <h1>{file.description || ""} </h1>
            {user && <p>Posted By : {user.username}</p>}
          </>
        ) : (
          <p>No data available.</p>
        )}
      </Card>
    </div>
  );
};

export default ViewDetailPodcast;
