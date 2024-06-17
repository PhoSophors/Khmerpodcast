import { ArrowLeftOutlined } from "@ant-design/icons";
import React from "react";
import { useNavigate } from "react-router-dom";

const BreadcrumbBtn = () => {
  const navigate = useNavigate();

  const handleCloseDetailPodcast = () => {
    navigate(-1);
  };

  return (
    <div
      className="p-2 back-btn-view-podcast w-12 rounded-xl  cursor-pointer"
      onClick={handleCloseDetailPodcast}
    >
      <div className="p-3 cursor-pointer text-white bg-indigo-600 h-8 w-8 flex justify-center items-center rounded-xl">
        <ArrowLeftOutlined />
      </div>
    </div>
  );
};

export default BreadcrumbBtn;
