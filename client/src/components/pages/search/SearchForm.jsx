import React, { useState, useEffect } from "react";
import { Input, message } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import axios from "axios";
import "./search.css";
import { api_url } from "../../../api/config";

const SearchForm = ({ handleSearchSubmit }) => {
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
        response = await axios.get(`${api_url}/search/podcasts`, {
          params: {
            search: searchQuery,
          },
        });

        if (response.data) {
          handleSearchSubmit(response.data); // Pass the results
        } else {
          message.error("Error fetching search results");
        }
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
          <SearchOutlined
            style={{ color: `var(--text-color)` }}
            spin={loading}
          />
        }
      />
    </form>
  );
};

export default SearchForm;
