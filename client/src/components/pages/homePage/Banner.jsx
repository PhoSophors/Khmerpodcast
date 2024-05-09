import React from "react";
import { Card } from "antd";
import { useTranslation } from "react-i18next";

const Banner = () => {
  const { t } = useTranslation();

  return (
    <div>
      <Card
        className="mt-5 xl:mx-5 mx-2 px-2 bg-indigo-600 content-center xl:text-start md:text-start text-center 
        xl:box-decoration-slice xl:bg-gradient-to-r xl:from-indigo-600 xl:to-pink-500 
        md:box-decoration-slice md:bg-gradient-to-r md:from-indigo-600 md:to-pink-500 
       "
        style={{ borderRadius: "50px", height: "auto" }}
      >
        <div className="flex grid xl:grid-cols-2 content-center gap-4 sm:flex sm:gap-5">
          <div className="sm:w-1/1 justify-center items-center">
            <span className="text-4xl text-center text-slate-100 font-semibold overflow-hidden">
              {t("banner.title")}
            </span>
            <p class=" text-lg text-slate-300 mt-3 overflow-hidden">
              {t("banner.description")}
            </p>
          </div>
          <div className="sm:w-1/2 w-full text-center rounded-3xl  justify-self-center backdrop-filter backdrop-blur-md bg-opacity-50 bg-white">
            <Card
              style={{
                // height: "15vw",
                // borderRadius: "25px",
                backgroundColor: "transparent",
                border: "none",
                height: "100%",
              }}
            >
              {/* Audio Controller */}
            </Card>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Banner;
