import React, { useState } from "react";
import { Avatar, Card } from "antd";
import { Link } from "react-router-dom";
import "./card.css";
import { UserOutlined } from "@ant-design/icons";

const SearchUserCard = ({ user }) => {
  const [isLoading, setIsLoading] = useState(true);

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  return (
    <div className="p-1">
      <Link to={`/public-profile/${user._id}`}>
        <Card
          className="card-hover card-bg"
          style={{
            borderRadius: "20px",
            minWidth: "100%",
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
                {isLoading && <div className=" animate-pulse"></div>}
                <div>
                  <Avatar
                    className="avatar   object-cover"
                    size={90}
                    icon={<UserOutlined />}
                    src={user.profileImage}
                    alt={user.username}
                    onLoad={handleImageLoad}
                  />
                </div>

                <div
                  style={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    width: "100%",
                    maxHeight: "80px",
                  }}
                >
                  <h1 className="hover:underline line-clamp-1 cursor-pointer text-base tracking-wide text-indigo-500 font-semibold">
                    {user.username}
                  </h1>

                  <h3 className="mt-2 line-clamp-2 text-slate-500 dark:text-gray-300">
                    {user.bio}
                  </h3>
                </div>
              </div>
            </div>
          }
        />
      </Link>
    </div>
  );
};

export default SearchUserCard;
