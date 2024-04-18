import React, { useState, useEffect } from "react";
import axios from "axios";
import FavoritesCard from "../../card/FavoritesCard";
import Cookies from "js-cookie";
import { PlusCircleOutlined } from "@ant-design/icons";
import "./Favorith.css";

const Favorith = () => {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const authToken = Cookies.get("authToken");

    axios
      .get(`/files/get-all-favorite`, {
        baseURL: process.env.REACT_APP_PROXY,
        headers: {
          "auth-token": authToken,
        },
      })
      .then((response) => {
        setFavorites(response.data);
      })
      .catch((error) => {
        console.error(
          "Error fetching user favorites:",
          error.response?.data?.message || error.message
        );
      });

  }, []);

  return (
    <div className="xl:p-5">
      {favorites.length === 0 ? (
        <div className="favorites">
          <PlusCircleOutlined style={{ fontSize: "40px", color: "gray" }} />{" "}
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
        favorites.map((file, index) => (
          <FavoritesCard key={index} file={file} />
        ))
      )}
    </div>
  );
};

export default Favorith;
