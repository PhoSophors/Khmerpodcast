import React, { useState, useEffect } from "react";
import { Input, message } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import axios from "axios";
import "./search.css";

const AdminSearchUser = ({ handleSearchSubmit }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const handleInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (searchQuery.trim() === "") {
        handleSearchSubmit([]); // Clear the search results if the query is empty
        return;
      }

      setLoading(true);

      try {
        let response;
        // Only search for podcasts
        response = await axios.get(`/search/users`, {
          baseURL: process.env.REACT_APP_PROXY,
          params: {
            search: searchQuery,
          },
        });

        handleSearchSubmit(response.data); // Pass the results
      } catch (error) {
        message.error("Error fetching search results");
      } finally {
        setLoading(false);
      }
    };

    const delayTimer = setTimeout(fetchSearchResults, 500); // Add a delay before triggering the search to reduce API calls

    return () => clearTimeout(delayTimer); // Clear the timer when the component is unmounted or when the searchQuery changes
  }, [searchQuery, handleSearchSubmit]);

  return (
    <form className="search-form">
      <span>&nbsp;&nbsp;</span>
      <Input
        className="search-input"
        placeholder="Search..."
        value={searchQuery}
        onChange={handleInputChange}
        suffix={
          <SearchOutlined style={{ color: "rgba(0,0,0,.45)" }} spin={loading} />
        }
      />
    </form>
  );
};

export default AdminSearchUser;
