import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { api_url } from "../api/config";
import Cookies from "js-cookie";
import { message } from "antd";

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

  const fetchUserData = useCallback(async () => {
    if (!authToken) {
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);

    try {
      const decodedToken = JSON.parse(atob(authToken.split(".")[1]));
      setUserRole(decodedToken.role);

      const userResponse = await axios.get(`${api_url}/auths/user-data/${id}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      const userData = userResponse.data.user;

      if (userData) {
        setUser(userData);
        setIsLoggedIn(true);
      } else {
        setUser(null);
        setIsLoggedIn(false);
      }

      const filesResponse = await axios.get(`${api_url}/files/get-file-by-user/${id}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      
      setUserFiles(filesResponse.data || []);
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setIsLoading(false);
    }
  }, [authToken, id]);

  const fetchPodcast = useCallback(async (fileId) => {
    try {
      const response = await axios.get(`${api_url}/files/get-file/${fileId}`);
      if (response.data) {
        setFileData(response.data);
      } else {
        message.error("Podcast not found");
      }
    } catch (error) {
      message.error("Error fetching podcast");
    }
  }, []);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  useEffect(() => {
    if (fileId) {
      fetchPodcast(fileId);
    }
  }, [fileId, fetchPodcast]);

  return { user, isLoading, isLoggedIn, userFiles, fileData, userRole, handleConfirmLogout, fetchPodcast };
};
