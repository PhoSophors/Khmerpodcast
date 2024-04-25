import React, { useState } from "react";
import { Card } from "antd";
import SearchForm from "./SearchForm";
import CustomCard from "../../card/CustomCard";

const Search = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [searchPerformed, setSearchPerformed] = useState(false);

  const handleSearchSubmit = async (results) => {
    setSearchResults(results);
    setSearchPerformed(true); // Set searchPerformed to true when search is performed
  };

  return (
    <div className="xl:p-5">
      {/* <Card> */}
        <SearchForm handleSearchSubmit={handleSearchSubmit} />
      {/* </Card> */}

      <div className="search-results mt-5 flex flex-wrap justify-center items-center">
        {searchPerformed && searchResults.length === 0 ? ( 
          <p className="font-semibold text-gray-500 uppercase text-center mt-5">Podcast not found</p>
        ) : (
          searchResults.map((result) => (
            <CustomCard key={result._id} file={result} /> 
          ))
        )}
      </div>
    </div>
  );
};

export default Search;
