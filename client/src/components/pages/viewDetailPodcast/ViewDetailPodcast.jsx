import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Card, Spin } from "antd";
import Cookies from "js-cookie";

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
      setNotification("Error fetching file");
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
    <div className="p-10">
      {file ? (
        <>
          <h1>{file.title || ""}</h1>
          <h1>{file.description || ""} </h1>
          {file.image && file.image.url && (
            <img
              style={{ height: "100px" }}
              src={file.image.url}
              alt={""}
            />
          )}
          {file.audio && file.audio.url && (
            <audio controls src={file.audio.url} />
          )}
          {/* {user && <p>{user._id}</p>} */}
          {user && <p>Posted By : {user.username}</p>}
        </>
      ) : (
        <p>No data available.</p>
      )}
    </div>
  );
};

export default ViewDetailPodcast;
