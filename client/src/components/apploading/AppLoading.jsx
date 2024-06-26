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
        <div className="loading-text xl:text-xl md:text-xl text-base text-state-800 dark:text-slate-100">
          Loading...
        </div>
      </div>
    </div>
  );
};

export default AppLoading;
