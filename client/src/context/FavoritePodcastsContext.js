import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";
const { api_url } = require("../api/config");

const FavoritePodcastsContext = createContext();

export const FavoritePodcastsProvider = ({ children }) => {
  const [favoritePodcasts, setFavoritePodcasts] = useState([]);

  useEffect(() => {
    // Fetch the user's favorite podcasts when the component mounts
    axios.get(`${api_url}/files/get-all-favorite`)
      .then(response => {
        setFavoritePodcasts(response.data.map(podcast => podcast.id)); // Adjust the response if needed
      })
      .catch(error => {
        console.error('Error fetching favorite podcasts:', error);
      });
  }, []);

  const addPodcastToFavorites = async (podcastId) => {
    try {
      await axios.post(`${api_url}/files/favorite/${podcastId}`);
      setFavoritePodcasts((prevFavorites) => [...prevFavorites, podcastId]);
    } catch (error) {
      console.error('Error adding podcast to favorites:', error);
    }
  };

  const removePodcastFromFavorites = async (podcastId) => {
    try {
      await axios.post(`${api_url}/files/remove-favorite/${podcastId}`);
      setFavoritePodcasts((prevFavorites) =>
        prevFavorites.filter((id) => id !== podcastId)
      );
    } catch (error) {
      console.error('Error removing podcast from favorites:', error);
    }
  };

  return (
    <FavoritePodcastsContext.Provider
      value={{ favoritePodcasts, addPodcastToFavorites, removePodcastFromFavorites }}
    >
      {children}
    </FavoritePodcastsContext.Provider>
  );
};

export const useFavoritePodcasts = () => useContext(FavoritePodcastsContext);
