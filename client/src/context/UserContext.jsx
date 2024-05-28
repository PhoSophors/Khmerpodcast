import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { api_url } from '../api/config';
import Cookies from 'js-cookie';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [currentUser, setCurrentUser] = useState(null); // Add currentUser state
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userFiles, setUserFiles] = useState([]);
  const [userRole, setUserRole] = useState(null);
  const authToken = Cookies.get('authToken') ? atob(Cookies.get('authToken')) : null;
  const id = Cookies.get('id') ? atob(Cookies.get('id')) : null;

  const handleConfirmLogout = () => {
    Cookies.remove('authToken');
    Cookies.remove('id');
    window.location.reload();
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      try {
        if (authToken) {
          const decodedToken = JSON.parse(atob(authToken.split('.')[1]));
          setUserRole(decodedToken.role);

          const response = await axios.get(`${api_url}/auths/user-data/${id}`, {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          });
          const userData = response.data.user;

          if (userData) {
            setUser(userData);
            setCurrentUser(userData); // Set currentUser when user data is fetched
            setIsLoggedIn(true);
          } else {
            setUser(null);
            setCurrentUser(null); // Set currentUser to null if user data is not available
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
        console.error('Error fetching user data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id, authToken]);

  return (
    <UserContext.Provider
      value={{ user, isLoading, isLoggedIn, userFiles, userRole, currentUser, handleConfirmLogout }} // Include currentUser in the context value
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
