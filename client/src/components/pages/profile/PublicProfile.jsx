import React from "react";
import { Spin, Card } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import {
  FacebookFilled,
  GlobalOutlined,
  InstagramFilled,
  TikTokFilled,
  TwitterOutlined,
  UserOutlined,
  YoutubeFilled,
} from "@ant-design/icons";
import { Avatar } from "antd";
import UserUploadCard from "../../card/UserUploadCard";
import ShareProfileBtn from "../../Btn/ShareProfileBtn";
import { useUser } from "../../../context/UserContext";
import "./Profile.css";
import useView from "../../../services/useView";

const PublicProfile = () => {
  const { id: publicUserId } = useParams();
  const { usePublicProfile } = useUser();
  const { publicUserData } = usePublicProfile(publicUserId);
  const navigate = useNavigate();
  const { incrementViewCount } = useView();

  if (!publicUserData) {
    return (
      <div className="spin-loading mt-20">
        <Spin />
      </div>
    );
  }

  if (!publicUserData) {
    return (
      <div className="text-center dark:text-gray-300 mt-20 text-base">
        User not found
      </div>
    );
  }

  return (
    <div className="profile-container h-screen">
      <div className="flex grid xl:grid-cols-2 grid-cols-1 md:grid-cols-1 md:flex xl:p-2 md:p-2 p-0 xl:gap-2 md:gap-2 gap-2">
        <Card className="recent-upload-card min-w-80">
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
            }}
          >
            <div className="profile-content mt-5">
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "140px",
                  height: "140px",
                  marginBottom: "16px",
                  border: "1px solid #6366f1",
                  borderRadius: "50%",
                  overflow: "hidden",
                }}
              >
                <Avatar
                  className="avatar"
                  size={140}
                  icon={<UserOutlined />}
                  src={publicUserData.profileImage}
                />
              </div>

              <h1 className="text-2xl capitalize text-center text-gray-600 dark:text-gray-300 font-bold">
                {publicUserData.username}
              </h1>

              <h1 className="text-sm mt-3 max-w-60 text-center text-gray-600 dark:text-gray-300">
                {publicUserData && publicUserData.bio}
              </h1>

              {/* {user && user.twitter} */}
              <div className="flex flex-row gap-3 mt-5">
                {publicUserData &&
                  publicUserData.facebook &&
                  publicUserData.facebook !== "https://facebook.com/" && (
                    <a
                      href={publicUserData.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <h1 className="p-3 cursor-pointer text-white bg-blue-600 h-8 w-8 flex justify-center items-center rounded-full">
                        <FacebookFilled />
                      </h1>
                    </a>
                  )}
                {publicUserData &&
                  publicUserData.website &&
                  publicUserData.website !== "https://" && (
                    <a
                      href={publicUserData.website}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <h1 className="p-3 cursor-pointer text-white bg-slate-600 h-8 w-8 flex justify-center items-center rounded-full">
                        <GlobalOutlined />
                      </h1>
                    </a>
                  )}

                {publicUserData &&
                  publicUserData.twitter &&
                  publicUserData.twitter !== "https://twitter.com/" && (
                    <a
                      href={publicUserData.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <h1 className="p-3 cursor-pointer text-white bg-cyan-600 h-8 w-8 flex justify-center items-center rounded-full">
                        <TwitterOutlined />
                      </h1>
                    </a>
                  )}
                {publicUserData &&
                  publicUserData.instagram &&
                  publicUserData.instagram !== "https://instagram.com/" && (
                    <a
                      href={publicUserData.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <h1 className="p-3 cursor-pointer text-white bg-pink-600 h-8 w-8 flex justify-center items-center rounded-full">
                        <InstagramFilled />
                      </h1>
                    </a>
                  )}

                {publicUserData &&
                  publicUserData.youtube &&
                  publicUserData.youtube !== "https://youtube.com/user/" && (
                    <a
                      href={publicUserData.youtube}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <h1 className="p-3 cursor-pointer text-white bg-red-600 h-8 w-8 flex justify-center items-center rounded-full">
                        <YoutubeFilled />
                      </h1>
                    </a>
                  )}
                {publicUserData &&
                  publicUserData.tiktok &&
                  publicUserData.tiktok !== "https://tiktok.com/@" && (
                    <a
                      href={publicUserData.tiktok}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <h1 className="p-3 cursor-pointer text-white bg-black h-8 w-8 flex justify-center items-center rounded-full">
                        <TikTokFilled />
                      </h1>
                    </a>
                  )}
              </div>

              <div className="mt-5 rounded-xl p-3 relative border min-w-72">
                <h2 className="text-gray-500 text-base dark:text-gray-300 mx-7 text-center text-lg">
                  {publicUserData.role}
                </h2>
                <h2
                  className="text-gray-500 text-sm dark:text-gray-300 bg-profile-text-field absolute"
                  style={{
                    top: "-10px",
                    padding: "0 5px",
                  }}
                >
                  Role *
                </h2>
              </div>
              <>
                <ShareProfileBtn userId={publicUserId} />
              </>
            </div>
          </div>
        </Card>

        <div className="col-span-2 w-full">
          <Card className="profile-card" bodyStyle={{ padding: 0 }}>
            {publicUserData.files.length === 0 ? (
              <div className="spin-loading">
                <p className="font-semibold mt-10 text-gray-500 dark:text-slate-100 uppercase top-0">
                  No Podcasts!
                </p>
              </div>
            ) : (
              <div className="flex sm:p-0 md:p-0 xl:p-0 xl:p-5 flex-wrap justify-center items-center">
                {publicUserData.files.map((file, index) =>
                  file.verifyPodcast ? (
                    <UserUploadCard
                      key={file._id || index}
                      file={file}
                      handleViewPodcast={async () => {
                        navigate(`/watch-podcast/${file._id}`);
                        await incrementViewCount(file._id);
                      }}
                    />
                  ) : null
                )}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PublicProfile;
