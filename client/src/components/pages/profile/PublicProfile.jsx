import React from "react";
import { Spin, Card } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { UserOutlined } from "@ant-design/icons";
import { Avatar } from "antd";
import UserUploadCard from "../../card/UserUploadCard";
import ShareProfileBtn from "../../Btn/ShareProfileBtn";
import { useUser } from "../../../context/UserContext";
import "./Profile.css";

const PublicProfile = () => {
  const { id: publicUserId } = useParams();
  const { usePublicProfile } = useUser();
  const { publicUserData, isPublicDataLoading } = usePublicProfile(publicUserId);
  const navigate = useNavigate();

  if (isPublicDataLoading) {
    return (
      <div className="spin-loading">
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
                <ShareProfileBtn userId={publicUserId}/>
              </>
            </div>
          </div>
        </Card>

        <div className="col-span-2 w-full">
          <Card className="profile-card" bodyStyle={{ padding: 0 }}>
            <div className="flex sm:p-0 md:p-0 xl:p-0 xl:p-5 flex-wrap justify-center items-center">
              {publicUserData.files.map((file, index) => (
                <UserUploadCard
                  key={file._id || index}
                  file={file}
                  handleViewPodcast={() => {
                    navigate(`/watch-podcast/${file._id}`);
                  }}
                />
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PublicProfile;
