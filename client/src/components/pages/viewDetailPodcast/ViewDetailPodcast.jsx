import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useParams } from "react-router-dom";
import { Card } from "antd";

const ViewDetailPodcast = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const authToken = Cookies.get("authToken");
  const { id } = useParams();

  useEffect(() => {
    fetchFile();
  }, []);

  const fetchFile = async () => {
    try {
      const response = await axios.get(`/files/get-file/${id}`, {
        baseURL: process.env.REACT_APP_PROXY,
        headers: {
          "auth-token": authToken,
        },
      });
      setFile(response.data);
      console.log("After setFile:", file);
      console.log("response.data:", response.data);
    } catch (error) {
      console.error("Error fetching file:", error.message);
      setNotification("Error fetching file");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-10">
      <Card title="View Detail Podcast">
        <h1>detail file</h1>
        {file && (
          <>
            <h1>{file.title || ""}</h1>
            {file.image && file.image.url && (
              <img
                style={{ height: "100px" }}
                src={file.image.url}
                alt={file.title || ""}
              />
            )}

            {file.audio && file.audio.url && (
              <audio controls src={file.audio.url} />
            )}
            <p>{file.description || ""}</p>
          </>
        )}
      </Card>
    </div>
  );
};

export default ViewDetailPodcast;
