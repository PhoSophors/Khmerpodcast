import React from "react";
import { Card, Spin, message, Breadcrumb, Avatar } from "antd";
import PlayBtn from "../../Btn/PlayBtn";
import MoreBtn from "../../Btn/MoreBtn";
import "./viewpodcast.css";
import { LeftOutlined, UserOutlined } from "@ant-design/icons";
import Linkify from "react-linkify";
import { useParams } from "react-router-dom";
import { useUser } from "../../../services/useUser";
import { useNavigate } from 'react-router-dom';

const ViewDetailPodcast = () => {
  const { id } = useParams();
  const { isLoading, fileData } = useUser(id);
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="p-10 text-center spin-loading">
        <Spin />
      </div>
    );
  }

  if (!fileData) {
    message.error("File data not found");
    return null;
  }

  const handleCloseDetailPodcast = () => {
    navigate(-1);
  };

  const linkDecorator = (href, text, key) => (
    <a
      href={href}
      key={key}
      style={{ color: "red" }}
      target="_blank"
      rel="noopener noreferrer"
    >
      {text}
    </a>
  );

  return (
    <div className="min-w-full">
      <Card className="view-podcast-card">
        <Breadcrumb className="w-full back-btn-view-podcast p-3 rounded-xl">
          <Breadcrumb.Item
            onClick={handleCloseDetailPodcast}
            className="cursor-pointer"
          >
            <LeftOutlined
              style={{ fontWeight: "bold", color: `var(--gray-300)` }}
            />
            <span className="dark:text-gray-300">Back</span>
          </Breadcrumb.Item>
          <Breadcrumb.Item className="dark:text-gray-300">
            View Podcast
          </Breadcrumb.Item>
        </Breadcrumb>

        <div className="w-full container-view-podcast mt-5">
          <Card
            style={{
              border: "none",
              backgroundColor: "transparent",
            }}
            bodyStyle={{ padding: 0 }}
            cover={
              <div
                style={{
                  padding: "10px",
                  position: "relative",
                  overflow: "hidden",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div style={{ display: "flex", gap: "10px" }}>
                  <div className="thumnaill">
                    <img
                      className="object-cover image-view-podcast"
                      src={fileData.image.url}
                      alt={`.${fileData._id} hidden`}
                      style={{
                        borderRadius: "10px",
                        marginRight: "-10px",
                        minWidth: "15vw",
                        maxHeight: "15vw",
                        justifyContent: "center",
                      }}
                    />
                  </div>

                  <div
                    style={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      width: "100%",
                      maxHeight: "95px",
                    }}
                  >
                    <div className=" mx-3 tracking-wide mt-5 play-and-more-btn-laptop text-xl text-indigo-500 font-semibold">
                      {fileData.title}
                    </div>
                  </div>
                </div>

                <div className=" flex justify-end mt-2 items-center gap-3">
                  <div className="play-and-more-btn-laptop">
                    <PlayBtn file={fileData} />
                  </div>
                  <div className="play-and-more-btn-laptop">
                    <MoreBtn file={fileData} />
                  </div>
                </div>
              </div>
            }
          />
        </div>

        <div className="justify-flex-between play-and-more-btn-mobile gap-3 mt-5 items-center">
          <div className="tracking-wide text-md text-start w-4/5 text-indigo-500 font-semibold">
            {fileData.title}
          </div>

          <div className="flex  justify-end mt-2 items-center gap-3">
            <div>
              <PlayBtn file={fileData} />
            </div>
            <div>
              <MoreBtn file={fileData} />
            </div>
          </div>
        </div>

        <hr className="mt-5 mb-5 dark:bg-gray-600" />
        <p className="mt-2 tracking-wide text-slate-500 dark:text-gray-300 xl:w-6/12 md:w-6/12 w-full">
          <Linkify componentDecorator={linkDecorator}>
            {fileData.description}
          </Linkify>
        </p>

        {/* Information about Podcast Upload */}
        <div className="mt-20 mb-20">
          <span className="text-indigo-500 font-semibold">Information</span>

          <div className="flex justify-between mt-5">
            <div className="items-center flex gap-2">
              <Avatar
                src={fileData.user.profileImage}
                style={{ border: "1px solid #6366f1" }}
                size="large"
                icon={<UserOutlined />}
              />
              <span className="uppercase capitalize tracking-wide text-sm text-indigo-500 font-semibold">
                {fileData.user.username}
              </span>
            </div>

            <div className="text-center">
              <span className="font-semibold text-indigo-500">Upload Date</span>
              <div className="dark:text-gray-300">
                {new Date(fileData.uploadDate).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ViewDetailPodcast;
