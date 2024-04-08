// search page
import React, { useState, useEffect } from "react";
import { Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import axios from "axios";
import "./SearchForm.css";

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
        const response = await axios.get(`/search/podcasts`, {
          baseURL: process.env.REACT_APP_PROXY,
          params: {
            search: searchQuery,
          },
        });

        handleSearchSubmit(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    const delayTimer = setTimeout(fetchSearchResults, 500); // Add a delay before triggering the search to reduce API calls

    return () => clearTimeout(delayTimer); // Cleanup timer on unmount or when searchQuery changes
  }, [searchQuery, handleSearchSubmit]);

  return (
    <form className="search-form">
      <Input
        className="search-input"
        placeholder="Search..."
        value={searchQuery}
        onChange={handleInputChange}
        prefix={<SearchOutlined />}
        loading={loading}
      />
    </form>
  );
};

export default SearchForm;
