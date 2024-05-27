// service/useLogin.js

import { useState } from "react";
import axios from "axios";
import { message } from "antd";
import { api_url } from "../api/config";
import Cookies from "js-cookie";

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(false);

  const login = async (values) => {
    try {
      setIsLoading(true);
      const response = await axios.post(`${api_url}/auths/login`, values, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      setIsLoading(false);

      if (response.status === 200) {
        // Login successful
        const encodedToken = btoa(response.data.authToken);
        const encodedId = btoa(response.data.id);
        Cookies.set("authToken", encodedToken, { expires: 365 * 100 }); // Expires in 100 years
        Cookies.set("id", encodedId, { expires: 365 * 100 }); // Expires in 100 years

        message.success("Login successful ");
        return true;
      }
    } catch (error) {
      setIsLoading(false);
      // Show error message
      message.error("Invalid username or password");
      return false;
    }
  };

  return { login, isLoading };
};
