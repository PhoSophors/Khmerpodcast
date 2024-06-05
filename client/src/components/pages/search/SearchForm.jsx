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
    setSearchQuery(event.target.value); // Assuming setSearchQuery is the function to set searchQuery
  };

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (searchQuery.trim() === "") {
        handleSearchSubmit({ podcasts: [], users: [] }); // Clear the search results if the query is empty
        return;
      }

      setLoading(true);

      try {
        const [podcastResponse, userResponse] = await Promise.all([
          axios.get(`${api_url}/search/podcasts`, {
            params: { search: searchQuery },
          }),
          axios.get(`${api_url}/search/users`, {
            params: { search: searchQuery },
          }),
        ]);

        handleSearchSubmit({
          podcasts: podcastResponse.data || [],
          users: userResponse.data || [],
        });
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
    <form className="search-form mt-5" onSubmit={(e) => e.preventDefault()}>
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
