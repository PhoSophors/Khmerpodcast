import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import "../../auth/login/Login.css";
import { Form, Input, Button, message } from "antd";
import { LeftOutlined } from "@ant-design/icons";

const EditProfile = ({ user }) => {
  const [username, setUsername] = useState(user.username);
  // const [email, setEmail] = useState(user.email);


  useEffect(() => {
    setUsername(user.username);
    // setEmail(user.email);
  }, [user]);

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };
  // const handleEmailChange = (e) => {
  //   setEmail(e.target.value);
  // };

  const handleSubmit = async () => {
    try {
      const authToken = Cookies.get("authToken");

      if (authToken && user._id) {
        const response = await axios.put(
          `http://localhost:8085/auths/user/${user._id}`,
          {
            username,
            // email,
          },
          {
            headers: {
              "auth-token": authToken,
            },
          }
        );

        if (response.status === 200) {
          message.success("Profile updated successfully");
          // Refresh the page
          window.location.reload();
        } else {
          message.error("Failed to update profile. Please try again later.");
        }
      } else {
        message.error("Authentication failed. Please log in again.");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      message.error("Failed to update profile. Please try again later.");
    }
  };

  return (
    <div className="">
      <Button
        className="back-button bg-slate-500 h- text-white mt-5"
        type="text"
        icon={<LeftOutlined />}
      >
        Back
      </Button>

    <div className="flex text-center items-center justify-center ">
      {/* set width form 50% */}

      <Form layout="vertical mt-5 text-center font-semibold w-96">
        <Form.Item label="Username *">
          <Input
            value={username}
            onChange={handleUsernameChange}
            className="input-field "
          />
        </Form.Item>
        {/* <Form.Item label="Email">
          <Input
            value={email}
            onChange={handleEmailChange}
            className="input-field "
          />
        </Form.Item> */}
        <Form.Item>
          <Button
            className="submit-button"
            type="primary"
            onClick={handleSubmit}
            style={{
              backgroundColor: "#3730a3",
              color: "#ffffff",
            }}
          >
            Save Changes
          </Button>
        </Form.Item>
      </Form>
      </div>
    </div>
  );
};

export default EditProfile;
