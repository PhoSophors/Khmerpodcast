import React, { useState, useEffect } from "react";
import axios from "axios";
import FavoritesCard from "../../card/FavoritesCard";
import Cookies from "js-cookie";
import ViewDetailPodcast from "../viewDetailPodcast/ViewDetailPodcast";
import "./Favorith.css";
import { api_url } from "../../../api/config";

const Favorith = () => {
  const [favorites, setFavorites] = useState([]);
  const [isViewPodcast, setIsViewPodcast] = useState(false);
  const [selectedPodcast, setSelectedPodcast] = useState(null);

  useEffect(() => {
    const authToken = Cookies.get("authToken");
    axios
      .get(`${api_url}/files/get-all-favorite`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      })
      .then((response) => {
        const favorites = response.data.reverse();
        setFavorites(favorites);
      })
      .catch((error) => {
        console.error(
          "Error fetching user favorites:",
          error.response?.data?.message || error.message
        );
      });
  }, []);

  return (
    <div className="xl:p-5 sm:p-0">
      {favorites.length === 0 ? (
        <div className="favorites">
          <svg
            className="w-10 h-10 text-gray-500 mx-auto"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 14 20"
          >
            <path d="M13 20a1 1 0 0 1-.64-.231L7 15.3l-5.36 4.469A1 1 0 0 1 0 19V2a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v17a1 1 0 0 1-1 1Z" />
          </svg>
          <br />
          <span className="font-semibold text-xl text-gray-500 tracking-wide">
            No Saved Episodes
          </span>{" "}
          <br />
          <span className="text-gray-500 tracking-wide">
            Save episodes you want to listen to later, and they'll show up here.
          </span>
        </div>
      ) : (
        <>
          {isViewPodcast ? (
            <ViewDetailPodcast
              file={selectedPodcast}
              handleViewPodcast={() => setIsViewPodcast(false)}
            />
          ) : (
            favorites.map((file, index) => (
              <FavoritesCard
                key={file.id}
                file={file}
                handleViewPodcast={() => {
                  setIsViewPodcast(true);
                  setSelectedPodcast(file);
                }}
              />
            ))
          )}
        </>
      )}
    </div>
  );
};

export default Favorith;
