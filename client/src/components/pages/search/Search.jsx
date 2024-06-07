import React, { useEffect, useState } from "react";
import SearchForm from "./SearchForm";
import SearchPodcastCard from "../../card/SearchPodcastCard";
import SearchUserCard from "../../card/SearchUserCard";
import ViewDetailPodcast from "../viewDetailPodcast/ViewDetailPodcast";
import { useNavigate } from "react-router-dom";
import useView from "../../../services/useView";

const Search = () => {
  const [searchResults, setSearchResults] = useState({
    podcasts: [],
    users: [],
  });
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [isViewPodcast, setIsViewPodcast] = useState(false);
  const [selectedPodcast, setSelectedPodcast] = useState(null);
  const navigate = useNavigate();
  const { incrementViewCount } = useView();

  // Load search results from local storage when component mounts
  useEffect(() => {
    const storedResults = localStorage.getItem("searchResults");
    if (storedResults) {
      setSearchResults(JSON.parse(storedResults));
    }
    const storedSearchPerformed = localStorage.getItem("searchPerformed");
    if (storedSearchPerformed) {
      setSearchPerformed(JSON.parse(storedSearchPerformed));
    }
  }, []);

  const handleSearchSubmit = async (results) => {
    setSearchResults(results);
    setSearchPerformed(true);

    // Store search results and searchPerformed in local storage
    localStorage.setItem("searchResults", JSON.stringify(results));
    localStorage.setItem("searchPerformed", "true");
  };

  return (
    <>
      {isViewPodcast ? (
        <ViewDetailPodcast
          file={selectedPodcast}
          handleViewPodcast={() => setIsViewPodcast(false)}
        />
      ) : (
        <div className=" p-0">
          <SearchForm handleSearchSubmit={handleSearchSubmit} />

          <div className="search-results mt-5 flex flex-wrap justify-center items-center">
            {searchPerformed &&
            searchResults.podcasts.length === 0 &&
            searchResults.users.length === 0 ? (
              <p className="font-semibold text-gray-500 dark:text-gray-300 uppercase text-center mt-5">
                No results found
              </p>
            ) : (
              <>
                {searchResults.podcasts.map((result) => (
                  <div key={result.id} className="md:w-1/2 xl:w-1/3 w-full p-1">
                    <SearchPodcastCard
                      file={result}
                      handleViewPodcast={async () => {
                        setIsViewPodcast(true);
                        setSelectedPodcast(result);
                        navigate(`/watch-podcast/${result._id}`);
                        await incrementViewCount(result._id);
                      }}
                    />
                  </div>
                ))}
                {searchResults.users.map((user) => (
                  <div key={user._id} className="md:w-1/2 xl:w-1/3 w-full p-1">
                    <SearchUserCard user={user} />
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Search;
