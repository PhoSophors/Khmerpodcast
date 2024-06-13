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
    onClick={goBack}
      className="p-3 cursor-pointer text-white bg-indigo-600 h-8 w-auto flex justify-center items-center rounded-full"
      style={{ position: "absolute", top: "20px", left: "20px" }}
    >
      <ArrowLeftOutlined />
    </div>
  );
};

export default BackBtn;
