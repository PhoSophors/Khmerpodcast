import { useState, useEffect } from "react";
import axios from "axios";
import { api_url } from "../api/config";

export const useFileData = (fileId) => {
  const [fileData, setFileData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFileData = async () => {
      setIsLoading(true);

      if (fileId) {
        try {
          const fileResponse = await axios.get(
            `${api_url}/files/get-file/${fileId}`
          );
          setFileData(fileResponse.data);
        } catch (error) {
          console.error("Error fetching file data:", error);
          // Check if the error is a 404 and handle it accordingly
          if (error.response && error.response.status === 404) {
            console.error(
              "File not found. Please check the fileId or contact an admin."
            );
          }
        }
      }

      setIsLoading(false);
    };

    fetchFileData();
  }, [fileId]);

  return { fileData, isLoading };
};
