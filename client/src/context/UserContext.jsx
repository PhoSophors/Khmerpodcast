import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { api_url } from "../api/config";
import Cookies from "js-cookie";
import { message } from "antd";
import {jwtDecode} from "jwt-decode";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [userFiles, setUserFiles] = useState([]);
  const [userRole, setUserRole] = useState(null);
  
  const authToken = Cookies.get("authToken")
    ? atob(Cookies.get("authToken"))
    : null;
  const id = Cookies.get("id") ? atob(Cookies.get("id")) : null;

  const handleConfirmLogout = () => {
    Cookies.remove("authToken");
    Cookies.remove("id");
    window.location.reload();
  };

  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);

      try {
        if (authToken) {
          const decodedToken = jwtDecode(authToken);
          setUserRole(decodedToken.role);


          const response = await axios.get(`${api_url}/users/user-data/${id}`, {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          });
          const userData = response.data.user;

          if (userData) {
            setUser(userData);
            setCurrentUser(userData);
            setIsLoggedIn(true);
          } else {
            setUser(null);
            setCurrentUser(null);
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
        }
      } catch (error) {
        // console.error("Failed to fetch user data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [id, authToken]);

  const usePublicProfile = (publicUserId) => {
    const [publicUserData, setPublicUserData] = useState(null);
    const [isPublicDataLoading, setIsPublicDataLoading] = useState(true);

    useEffect(() => {
      const fetchPublicProfileUserData = async () => {
        setIsPublicDataLoading(true);

        try {
          const response = await axios.get(
            `${api_url}/users/public-profile/${publicUserId}`
          );
          const userData = response.data.user;

          if (userData) {
            setPublicUserData(userData);
          } else {
            setPublicUserData(null);
            message.error("User not found");
          }
        } catch (error) {
          console.error("Failed to fetch public user data:", error);
        } finally {
          setIsPublicDataLoading(false);
        }
      };

      if (publicUserId) {
        fetchPublicProfileUserData();
      }
    }, [publicUserId]);

    return { publicUserData, isPublicDataLoading };
  };

  return (
    <UserContext.Provider
      value={{
        user,
        isLoading,
        isLoggedIn,
        userFiles,
        userRole,
        currentUser,
        handleConfirmLogout,
        usePublicProfile, // Public Profile
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
