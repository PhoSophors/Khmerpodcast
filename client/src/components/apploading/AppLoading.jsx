import React from "react";
import Lottie from "react-lottie";
import animationData from "./app_loading.json";
import "./AppLoading.css";

const AppLoading = () => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <div className="loading-spinner">
      <div className="animation-container">
        <Lottie options={defaultOptions} height={400} width={400} />
        {/* <span className="loading-text font-sans xl:text-6xl md:text-6xl text-5xl">
          Khmer Podcast
        </span> */}
      </div>
    </div>
  );
};

export default AppLoading;
