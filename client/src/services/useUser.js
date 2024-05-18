import { useState, useEffect } from 'react';
import axios from 'axios';
import { message } from 'antd';
import { api_url } from '../api/config';
import Cookies from 'js-cookie';

export const useUser = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userFiles, setUserFiles] = useState([]);
  const authToken = Cookies.get('authToken') ? atob(Cookies.get('authToken')) : null;
  const id = Cookies.get('id') ? atob(Cookies.get('id')) : null;

  const handleConfirmLogout = () => {
    Cookies.remove('authToken');
    Cookies.remove('id');
    window.location.reload();
  }


  useEffect(() => {
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
          }

          const filesResponse = await axios.get(`${api_url}/files/get-file-by-user/${id}`, {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          });
          setUserFiles(filesResponse.data);
        } catch (error) {
          message.error("Error fetching user data");
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id, authToken]);

  return { user, isLoading, isLoggedIn, userFiles, handleConfirmLogout };
};