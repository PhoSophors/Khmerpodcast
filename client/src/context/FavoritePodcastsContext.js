// FavoritePodcastsContext.js
import React, { createContext, useState, useContext, useEffect } from "react";
import Cookies from "js-cookie";

const FavoritePodcastsContext = createContext();

export const FavoritePodcastsProvider = ({ children }) => {
  const [favoritePodcasts, setFavoritePodcasts] = useState(() => {
    const cookie = Cookies.get("favoritePodcasts");
    return cookie ? JSON.parse(cookie) : [];
  });

  useEffect(() => {
    Cookies.set("favoritePodcasts", JSON.stringify(favoritePodcasts));
  }, [favoritePodcasts]);

  const togglePodcastInFavorites = (podcastId) => {
    if (favoritePodcasts.includes(podcastId)) {
      setFavoritePodcasts(favoritePodcasts.filter((id) => id !== podcastId));
    } else {
      setFavoritePodcasts([...favoritePodcasts, podcastId]);
    }
  };

  return (
    <FavoritePodcastsContext.Provider
      value={{ favoritePodcasts, togglePodcastInFavorites }}
    >
      {children}
    </FavoritePodcastsContext.Provider>
  );
};

export const useFavoritePodcasts = () => useContext(FavoritePodcastsContext);
