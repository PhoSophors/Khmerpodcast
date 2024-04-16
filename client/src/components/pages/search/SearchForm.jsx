import React, { useState, useEffect } from "react";
import { Input, Select } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import axios from "axios";
import "./SearchForm.css";

const { Option } = Select;

const SearchForm = ({ handleSearchSubmit }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState("podcasts");
  const [loading, setLoading] = useState(false);

  const handleInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSelectChange = (value) => {
    setSearchType(value);
  };

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (searchQuery.trim() === "") {
        handleSearchSubmit([], searchType); // Clear the search results if the query is empty
        return;
      }

      setLoading(true);

      try {
        let response;
        if (searchType === "podcasts") {
          response = await axios.get(`/search/podcasts`, {
            baseURL: process.env.REACT_APP_PROXY,
            params: {
              search: searchQuery,
            },
          });
        } else if (searchType === "users") {
          response = await axios.get(`/search/users`, {
            baseURL: process.env.REACT_APP_PROXY,
            params: {
              search: searchQuery,
            },
          });
        }

        handleSearchSubmit(response.data, searchType); // Pass both results and selected option
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    const delayTimer = setTimeout(fetchSearchResults, 500); // Add a delay before triggering the search to reduce API calls

    return () => clearTimeout(delayTimer); // Cleanup timer on unmount or when searchQuery changes
  }, [searchQuery, searchType, handleSearchSubmit]); // Add searchType to the dependency array

  return (
    <form className="search-form">
      <Select
        className="search-input"
        defaultValue="podcasts"
        style={{ width: 120 }}
        onChange={handleSelectChange}
      >
        <Option value="podcasts">Podcasts</Option>
        <Option value="users">Users</Option>
      </Select>
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

export default SearchForm;
