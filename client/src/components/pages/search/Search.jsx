import React, { useState } from "react";
import SearchForm from "./SearchForm";
import CustomCard from "../../card/CustomCard";
import ViewDetailPodcast from "../viewDetailPodcast/ViewDetailPodcast";

const Search = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [isViewPodcast, setIsViewPodcast] = useState(false);
  const [selectedPodcast, setSelectedPodcast] = useState(null);

  const handleSearchSubmit = async (results) => {
    setSearchResults(results);
    setSearchPerformed(true);
  };

  return (
    <>
      {isViewPodcast ? (
        <ViewDetailPodcast
          file={selectedPodcast}
          handleViewPodcast={() => setIsViewPodcast(false)}
        />
      ) : (
        <div className="xl:p-5">
          <SearchForm handleSearchSubmit={handleSearchSubmit} />

          <div className="search-results mt-5 flex flex-wrap justify-center items-center">
            {searchPerformed && searchResults.length === 0 ? (
              <p className="font-semibold text-gray-500 uppercase text-center mt-5">
                Podcast not found
              </p>
            ) : (
              searchResults.map((result, index) => (
                <CustomCard
                  key={result.id}
                  file={result}
                  handleViewPodcast={() => {
                    setIsViewPodcast(true);
                    setSelectedPodcast(result);
                  }}
                />
              ))
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Search;
