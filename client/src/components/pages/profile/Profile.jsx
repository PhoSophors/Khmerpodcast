import React from "react";
import { Card, Button, Spin } from "antd";
import { Link } from "react-router-dom";
import {
  EditOutlined,
  FacebookFilled,
  GlobalOutlined,
  InstagramFilled,
  TikTokOutlined,
  TwitterOutlined,
  UserOutlined,
  YoutubeFilled,
} from "@ant-design/icons";
import { Avatar } from "antd";
import "./Profile.css";
import UserUploadCard from "../../card/UserUploadCard";
import { useUser } from "../../../context/UserContext";
import { useNavigate } from "react-router-dom";
import ShareProfileBtn from "../../Btn/ShareProfileBtn";
import useView from "../../../services/useView";

const Profile = () => {
  const { user, userFiles, isLoading } = useUser();
  const id = user ? user._id : null;
  const navigate = useNavigate();
  const { incrementViewCount } = useView();

  if (isLoading) {
    return (
      <div className="spin-loading mt-20">
        <Spin />
      </div>
    );
  }

  return (
    <div className="profile-container h-screen">
      <div className="flex grid xl:grid-cols-2 grid-cols-1 md:grid-cols-1 md:flex xl:p-2 md:p-2 p-0 xl:gap-2 md:gap-2 gap-2">
        <Card className="recent-upload-card">
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
                <Spin spinning={isLoading || !user}>
                  <Avatar
                    className="avatar"
                    size={140}
                    icon={<UserOutlined />}
                    src={user && user.profileImage}
                  />
                </Spin>
              </div>

              <h1 className="text-2xl capitalize text-center text-gray-600 dark:text-gray-300  font-bold">
                {user && user.username}
              </h1>

              <h1 className="text-sm mt-3 max-w-60 text-center text-gray-600 dark:text-gray-300">
                {user && user.bio}
              </h1>

              {/* {user socail media} */}
              <div className="flex flex-row gap-3 mt-5">
                {user &&
                  user.facebook &&
                  user.facebook !== "https://facebook.com/" && (
                    <a
                      href={user.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <h1 className="p-3 cursor-pointer text-white bg-blue-600 h-8 w-8 flex justify-center items-center rounded-full">
                        <FacebookFilled />
                      </h1>
                    </a>
                  )}
                {user && user.website && user.website !== "https://" && (
                  <a
                    href={user.website}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <h1 className="p-3 cursor-pointer text-white bg-slate-600 h-8 w-8 flex justify-center items-center rounded-full">
                      <GlobalOutlined />
                    </h1>
                  </a>
                )}

                {user &&
                  user.twitter &&
                  user.twitter !== "https://twitter.com/" && (
                    <a
                      href={user.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <h1 className="p-3 cursor-pointer text-white bg-cyan-600 h-8 w-8 flex justify-center items-center rounded-full">
                        <TwitterOutlined />
                      </h1>
                    </a>
                  )}
                {user &&
                  user.instagram &&
                  user.instagram !== "https://instagram.com/" && (
                    <a
                      href={user.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <h1 className="p-3 cursor-pointer text-white bg-pink-600 h-8 w-8 flex justify-center items-center rounded-full">
                        <InstagramFilled />
                      </h1>
                    </a>
                  )}

                {user &&
                  user.youtube &&
                  user.youtube !== "https://youtube.com/user/" && (
                    <a
                      href={user.youtube}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <h1 className="p-3 cursor-pointer text-white bg-red-600 h-8 w-8 flex justify-center items-center rounded-full">
                        <YoutubeFilled />
                      </h1>
                    </a>
                  )}
                {user &&
                  user.tiktok &&
                  user.tiktok !== "https://tiktok.com/@" && (
                    <a
                      href={user.tiktok}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <h1 className="p-3 cursor-pointer text-white bg-black h-8 w-8 flex justify-center items-center rounded-full">
                        <TikTokOutlined />
                      </h1>
                    </a>
                  )}
              </div>

              <div className="mt-5 rounded-xl p-3 relative border ">
                <h2 className="text-gray-500 text-base  dark:text-gray-300 mt- mx-7 text-center text-lg">
                  {user && user.email}
                </h2>
                <h2
                  className="text-gray-500 text-sm  dark:text-gray-300  bg-profile-text-field absolute"
                  style={{
                    top: "-10px",
                    padding: "0 5px",
                  }}
                >
                  Email *
                </h2>
              </div>

              <div className="mt-5 rounded-xl p-3 relative border w-full">
                <h2 className="text-gray-500 text-base  dark:text-gray-300 mt- mx-7 text-center text-lg">
                  {user && user.role}
                </h2>
                <h2
                  className="text-gray-500 text-sm  dark:text-gray-300  bg-profile-text-field absolute"
                  style={{
                    top: "-10px",
                    padding: "0 5px",
                  }}
                >
                  Role *
                </h2>
              </div>

              <>
                <ShareProfileBtn userId={id} />
              </>

              <div className="mt-5 gap-5 mb-20 w-full">
                <Link to={`/update-profile/${id}`}>
                  <Button className="button-style ">
                    <EditOutlined />
                    Update Profile
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </Card>

        <div className="col-span-2 w-full">
          <Card className="profile-card" bodyStyle={{ padding: 0 }}>
            {isLoading ? (
              <div className="spin-loading mt-20">
                <Spin />
              </div>
            ) : userFiles.length === 0 ? (
              <div className="spin-loading">
                <p className="font-semibold mt-10 text-gray-500 dark:text-slate-100 uppercase top-0">
                  No Podcasts!
                </p>
              </div>
            ) : (
              <div className="flex sm:p-0 md:p-0 xl:p-0 xl:p-5 flex-wrap justify-center items-center">
                {userFiles.map((file) => (
                  <UserUploadCard
                    key={file.id}
                    file={file}
                    handleViewPodcast={async () => {
                      navigate(`/watch-podcast/${file._id}`);
                      await incrementViewCount(file._id);
                    }}
                  />
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
