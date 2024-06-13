import { ArrowLeftOutlined } from "@ant-design/icons";
import React from "react";
import { useNavigate } from "react-router-dom";

const BreadcrumbBtn = () => {
  const navigate = useNavigate();

  const handleCloseDetailPodcast = () => {
    navigate(-1);
  };

  return (
    <div className="p-2 back-btn-view-podcast w-full rounded-xl ">
      <div
        onClick={handleCloseDetailPodcast}
        className="p-3 cursor-pointer text-white bg-indigo-600 h-8 w-9 flex justify-center items-center rounded-full"
      >
        <ArrowLeftOutlined />
      </div>
    </div>
  );
};

export default BreadcrumbBtn;
