import React, { useState } from "react";
import UserUploadCard from "../../../components/card/UserUploadCard";
import ViewDetailPodcast from "../viewDetailPodcast/ViewDetailPodcast";
import "./Favorith.css";
import { useFavorites } from "../../../services/useFavorites";
import { useNavigate } from "react-router-dom";
import { Spin } from "antd";
import useView from "../../../services/useView";

const Favorith = () => {
  const [isViewPodcast, setIsViewPodcast] = useState(false);
  const [selectedPodcast, setSelectedPodcast] = useState(null);
  const { favorites, isLoading } = useFavorites();
  const navigate = useNavigate();
  const { incrementViewCount } = useView();

  if (isLoading) {
    return (
      <di className="spin-loading text-center mt-20">
        <Spin />
      </di>
    );
  }

  return (
    <div className="xl:p-2 sm:p-0 h-screen">
      {favorites.length === 0 ? (
        <div className="favorites">
          <svg
            className="w-10 h-10 text-gray-500 mx-auto"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 14 20"
          >
            <path d="M13 20a1 1 0 0 1-.64-.231L7 15.3l-5.36 4.469A1 1 0 0 1 0 19V2a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v17a1 1 0 0 1-1 1Z" />
          </svg>
          <br />
          <span className="font-semibold text-xl text-gray-500 tracking-wide">
            No Saved Episodes
          </span>{" "}
          <br />
          <span className="text-gray-500 tracking-wide">
            Save episodes you want to listen to later, and they'll show up here.
          </span>
        </div>
      ) : (
        <>
          {isViewPodcast ? (
            <ViewDetailPodcast
              file={selectedPodcast}
              handleViewPodcast={() => setIsViewPodcast(false)}
            />
          ) : (
            favorites.map((file, index) => (
              <UserUploadCard
                key={file.id}
                file={file}
                handleViewPodcast={async () => {
                  setIsViewPodcast(true);
                  setSelectedPodcast(file);
                  navigate(`/watch-podcast/${file._id}`);

                  // Increment the view count
                  await incrementViewCount(file._id);
                }}
              />
            ))
          )}
        </>
      )}
    </div>
  );
};

export default Favorith;
