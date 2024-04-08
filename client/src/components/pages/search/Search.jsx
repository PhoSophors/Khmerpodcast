// Search.jsx
import React, { useState } from "react";
import { Card } from "antd";
import SearchForm from "./SearchForm";
import CustomCard from "../../card/CustomCard";
import HomePage from "../../../components/pages/homePage/HomePage";

const Search = () => {
  const [searchResults, setSearchResults] = useState([]);

  const handleSearchSubmit = async (results) => {
    setSearchResults(results);
  };

  return (
    <div className="p-10 ">
      <Card>
        <SearchForm handleSearchSubmit={handleSearchSubmit} />
      </Card>

      <div className="search-results mt-5 flex flex-wrap justify-center items-center">
          {searchResults.map((result) => (
            <CustomCard key={result._id} file={result} /> // Render CustomCard for each search result
          ))}
        </div>
    </div>
  );
};

export default Search;
