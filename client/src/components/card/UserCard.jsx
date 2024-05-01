import React, { useState, useEffect } from "react";
import { Avatar, Alert, Spin } from "antd";
import Cookies from "js-cookie";
import axios from "axios";
import { UserOutlined } from "@ant-design/icons";
import "./card.css";

const UserCard = ({ user }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
 

  return (
    <div>
      {loading ? (
        <div className="spin-container">
          <Spin size="large" />
        </div>
      ) : error ? (
        <Alert message={error} type="error" />
      ) : (
        <div className="usercard max-w-sm mx-auto rounded-xl shadow-md overflow-hidden md:max-w-sm">
          <div className="md:flex">
            <div className="md:shrink-0 p-5">
              <Avatar
                className="object-cover"
                size={64}
                alt={`.${user._id}`}
                src={user.profilePicture}
                icon={!user.profilePicture && <UserOutlined />}
              />
            </div>
            <div className="p-8">
              <div className="tracking-wide text-sm text-indigo-500 font-semibold">
                {user.username}
              </div>
              <p className="mt-2 text-slate-500">Status</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserCard;
