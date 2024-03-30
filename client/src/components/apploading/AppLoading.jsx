import React from "react";
import { Spin } from "antd";
import "./AppLoading.css";

const AppLoading = () => {
  return (
    <div className="loading-spinner-container">
      <Spin size="large" className="spinner" />
    </div>
  );
};

export default AppLoading;
