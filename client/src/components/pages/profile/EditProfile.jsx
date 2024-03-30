import React, { useState, useEffect } from "react";
import { Form, Input, Button, message } from "antd";
import axios from "axios";
import Cookies from "js-cookie";
import "../../auth/login/Login.css";

const EditProfile = ({ user }) => {
  const [username, setUsername] = useState(user.username);
  const [email, setEmail] = useState(user.email);

  const id = Cookies.get("id");

  useEffect(() => {
    setUsername(user.username);
    // setEmail(user.email);
  }, [user]);

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

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
    <div className="" style={{ width: "40%" }}>
      <Form layout="vertical">
        <Form.Item label="Username">
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
            type="dashed"
            onClick={handleSubmit}
            style={{
              backgroundColor: "#0e7490",
              color: "#ffffff",
            }}
          >
            Save Changes
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default EditProfile;
