import { useState, useEffect } from "react";
import axios from "axios";
import { message, notification } from "antd";
import { api_url } from "../api/config";
import Cookies from "js-cookie";

export const useFavorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const authToken = Cookies.get("authToken")
    ? atob(Cookies.get("authToken"))
    : null;

  useEffect(() => {
    const fetchFavorites = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${api_url}/favorites/get-all-favorite`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        if (response.status === 200) {
          setFavorites(response.data.reverse());
        } else {
          console.error("Unexpected response status:", response.status);
        }
      } catch (error) {
        // notification.error({
        //   message: "Error fetching user favorites:",
        //   description: error.message
        //   // error.response?.data?.message || error.message
        // });
      } finally {
        setIsLoading(false);
      }
    };

    if (authToken) {
      fetchFavorites();
    }
  }, [authToken]);

  const toggleFavorite = async (fileId, isFavorite) => {
    setIsLoading(true);
    try {
      if (!authToken) {
        message.error("Please login to add to favorites");
        return;
      }
      const url = isFavorite
        ? `${api_url}/favorites/remove-favorite/${fileId}`
        : `${api_url}/favorites/add-favorite/${fileId}`;
      const response = await axios.post(
        url,
        {},
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      if (response.status === 200) {
        setFavorites((prev) =>
          isFavorite
            ? prev.filter((fav) => fav._id !== fileId)
            : [...prev, response.data]
        );
        message.success(
          isFavorite
            ? "Removed from favorites successfully."
            : "Added to favorites successfully."
        );
      } else {
        console.error("Unexpected response status:", response.status);
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const removePodcastFromFavorites = async (fileId) => {
    setIsLoading(true);
    try {
      let response;
      response = await fetch(`${api_url}/favorites/remove-favorite/${fileId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (response.status === 200) {
        message.success("Podcast removed from favorites");
      } else {
        throw new Error("Failed to remove podcast from favorites");
      }
    } catch (error) {
      console.error("Error removing podcast from favorites:", error);
      message.error("Error remove podcast in favorites");
    } finally {
      setIsLoading(false);
    }
  };
  return { favorites, isLoading, toggleFavorite, removePodcastFromFavorites};
};
