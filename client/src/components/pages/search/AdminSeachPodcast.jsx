import React, { useState, useEffect } from "react";
import { Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import axios from "axios";
import "./search.css";

const AdminSeachPodcast = ({ handleSearchSubmit }) => {
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
        const response = await axios.get(`/search/users`, {
          baseURL: process.env.REACT_APP_PROXY,
          params: {
            search: searchQuery,
          },
        });
  
        handleSearchSubmit(response.data); // Pass the results
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    const delayTimer = setTimeout(fetchSearchResults, 500); // Add a delay before triggering the search to reduce API calls

    return () => clearTimeout(delayTimer); // Clear the timer when the component is unmounted or when the searchQuery changes
  }, [searchQuery, handleSearchSubmit]);

  return (
    <Input
      placeholder="Search users"
      onChange={handleInputChange}
      suffix={<SearchOutlined />}
      loading={loading}
    />
  );
};

export default AdminSeachPodcast;