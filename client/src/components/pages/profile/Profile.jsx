import React, { useState } from "react";
import { Card, Button, Spin } from "antd";
import { Link } from "react-router-dom";
import { UserOutlined } from "@ant-design/icons";
import { Avatar } from "antd";
import "./Profile.css";
import ViewDetailPodcast from "../viewDetailPodcast/ViewDetailPodcast";
import UserUploadCard from "../../card/UserUploadCard";
import { useUser } from "../../../context/UserContext";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [isViewPodcast, setIsViewPodcast] = useState(false);
  const [selectedPodcast, setSelectedPodcast] = useState(null);
  const { user, userFiles, isLoading } = useUser();
  const id = user ? user._id : null;
  const navigate = useNavigate();

  return (
    <div className="profile-container h-screen">
      {isViewPodcast && selectedPodcast ? (
        <ViewDetailPodcast
          file={selectedPodcast}
          handleViewPodcast={() => setIsViewPodcast(false)}
        />
      ) : (
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

                <h1 className="text-2xl text-center text-gray-600 dark:text-gray-300  font-bold">
                  {user && user.username}
                </h1>

                <div className="mt-5 rounded-xl p-3 relative border w-full">
                  <h1 className="text-gray-500  dark:text-gray-300 mt- mx-7 text-center text-lg">
                    {user && user.email}
                  </h1>
                  <span
                    className="text-gray-500 dark:text-gray-300  bg-profile-text-field absolute"
                    style={{
                      top: "-10px",
                      padding: "0 5px",
                    }}
                  >
                    Email *
                  </span>
                </div>

                <div className="mt-5 rounded-xl p-3 relative border w-full">
                  <h1 className="text-gray-500  dark:text-gray-300 mt- mx-7 text-center text-lg">
                    {user && user.role}
                  </h1>
                  <span
                    className="text-gray-500  dark:text-gray-300  bg-profile-text-field absolute"
                    style={{
                      top: "-10px",
                      padding: "0 5px",
                    }}
                  >
                    Role *
                  </span>
                </div>

                <Link to={`/edit-profile/${id}`}>
                  <Button
                    className="mt-10 w-full bg-indigo-600 hover:bg-indigo-700 text-gray-300 font-bold py-2 px-4 rounded-xl"
                    size="large"
                  >
                    Edit profile
                  </Button>
                </Link>
              </div>
            </div>
          </Card>

          <div className="col-span-2 w-full">
            <Card className="profile-card" bodyStyle={{ padding: 0 }}>
              {isLoading ? (
                <div className="spin-container">
                  <Spin />
                </div>
              ) : userFiles.length === 0 ? (
                <div className="spin-container">
                  <p className="font-semibold text-gray-500 dark:text-slate-100 uppercase top-0">
                    No Podcasts!
                  </p>
                </div>
              ) : (
                <div className="flex sm:p-0 md:p-0 xl:p-0 xl:p-5 flex-wrap justify-center items-center">
                  {userFiles.map((file) => (
                    <UserUploadCard
                      key={file.id}
                      file={file}
                      handleViewPodcast={() => {
                        setIsViewPodcast(true);
                        setSelectedPodcast(file);
                        navigate(`/watch-podcast/${file._id}`);
                      }}
                    />
                  ))}
                </div>
              )}
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
