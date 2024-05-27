import { useState, useEffect } from "react";
import axios from "axios";
import { api_url } from "../api/config";
import Cookies from "js-cookie";

export const useUser = (fileId) => {
  const [user, setUser] = useState(null);
  const [fileData, setFileData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userFiles, setUserFiles] = useState([]);
  const [userRole, setUserRole] = useState(null);
  const authToken = Cookies.get("authToken") ? atob(Cookies.get("authToken")) : null;
  const id = Cookies.get("id") ? atob(Cookies.get("id")) : null;

  const handleConfirmLogout = () => {
    Cookies.remove("authToken");
    Cookies.remove("id");
    window.location.reload();
  };

  useEffect(() => {
    if (authToken) {
      try {
        const decodedToken = JSON.parse(atob(authToken.split(".")[1]));
        setUserRole(decodedToken.role);
      } catch (error) {
        console.error("Error decoding authToken:", error);
      }
    }

    const fetchData = async () => {
      setIsLoading(true);

      if (authToken) {
        try {
          const response = await axios.get(`${api_url}/auths/user-data/${id}`, {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          });
          const userData = response.data.user;

          if (userData) {
            setUser(userData);
            setIsLoggedIn(true);
          } else {
            setUser(null);
            setIsLoggedIn(false);
          }

          const filesResponse = await axios.get(
            `${api_url}/files/get-file-by-user/${id}`,
            {
              headers: {
                Authorization: `Bearer ${authToken}`,
              },
            }
          );

          if (filesResponse.data && filesResponse.data.length > 0) {
            setUserFiles(filesResponse.data);
          } else {
            setUserFiles([]);
          }

          if (fileId) {
            const fileResponse = await axios.get(`${api_url}/files/get-file/${fileId}`);
            setFileData(fileResponse.data);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          setFileData(null); // Set fileData to null if there's an error
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id, authToken, fileId]);

  return { user, isLoading, isLoggedIn, userFiles, fileData, userRole, handleConfirmLogout };
};
