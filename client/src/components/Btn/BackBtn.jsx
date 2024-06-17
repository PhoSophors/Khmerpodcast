import React from "react";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const BackBtn = () => {
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1);
  };

  return (
    <div
      className="p-2 back-btn-view-podcast w-12 rounded-xl  cursor-pointer"
      onClick={goBack}
      style={{ position: "absolute", top: "20px", left: "20px" }}
    >
      <div className="p-3 cursor-pointer text-white bg-indigo-600 h-8 w-8 flex justify-center items-center rounded-xl">
        <ArrowLeftOutlined />
      </div>
    </div>
  );
};

export default BackBtn;
