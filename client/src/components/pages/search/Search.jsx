import React, { useState } from "react";
import { Card } from "antd";
import SearchForm from "./SearchForm";
import CustomCard from "../../card/CustomCard";
import UserCard from "../../card/UserCard";

const Search = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [selectedOption, setSelectedOption] = useState('');

  const handleSearchSubmit = async (results, option) => {
    // console.log('Selected option:', option); // Log the selected option
    setSearchResults(results);
    setSelectedOption(option);
  };

  return (
    <div className="p-10 ">
      <Card>
        <SearchForm handleSearchSubmit={handleSearchSubmit} />
      </Card>

      {selectedOption === "podcasts" && (
        <div className="search-results mt-5 flex flex-wrap justify-center items-center">
          {searchResults.map((result) => (
            <CustomCard key={result._id} file={result} /> // Render CustomCard for each search result
          ))}
        </div>
      )}

      {selectedOption === "users" && (
        <div className="search-results mt-5 flex flex-wrap justify-center items-center">
          {searchResults.map((result) => (
            <UserCard key={result._id} user={result} /> // Render UserCard for each search result
          ))}
        </div>
      )}
    </div>
  );
};

export default Search;
