import { Form, Input, Button, Modal, message, Spin } from "antd";
import React, { useState } from "react";
import "./Login.css"; // Import your CSS file
import { Link } from "react-router-dom";
import SigninWithGoogle from "../signinWithGoogle/SignInWithGoogle";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const Login = ({ visible, onCancel }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleCancel = () => {
    onCancel();
    document.body.classList.remove("modal-open");
  };

  const onFinish = async (values) => {
    try {
      setIsLoading(true);
      const response = await axios.post("/auths/login", values, {
        baseURL: process.env.REACT_APP_PROXY,
        headers: {
          "Content-Type": "application/json",
        },
      });

      setIsLoading(false);

      if (response.status === 200) {
        // Login successful

        Cookies.set("authToken", response.data.authToken);
        Cookies.set("id", response.data.id);

        // console.log("Login successful");
        message.success("Login successful ");

        // Close the modal

        handleCancel();

        // refresh the page
        window.location.reload();

        // Navigate to the home page after successful login
        navigate("/");
      }
    } catch (error) {
      setIsLoading(false);
      // Show error message
      message.error("Invalid username or password");
    }
  };

  return (
    <Modal
      visible={visible}
      maskClosable={true}
      footer={null}
      keyboard={true}
      onCancel={handleCancel}
    >
      <div className="flex flex-col items-center bg-white p-4">
        <h1 className="text-center mb-4 mt-5">
          <span className="text-black title">Welcome to </span>
          <span className="text-indigo-600 title">KhmerPodcast</span>
        </h1>

        <Form
          name="login-form"
          onFinish={onFinish}
          layout="vertical"
          className="w-80"
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: "Please input your email!" }]}
          >
            <Input className="input-field" placeholder="Enter your email" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password
              className="input-field"
              placeholder="Enter your password"
            />
          </Form.Item>

          <Form.Item style={{ marginTop: "-20px" }}>
            <Link to="/forgotPassword">
              <h1 className="text-start font-bold text-black hover:text-indigo-600 ">
                Forgot your password?
              </h1>
            </Link>
          </Form.Item>

          <Form.Item>
            <Button
              style={{
                backgroundColor: "#3730a3",
                color: "#ffffff",
              }}
              type="default"
              className="submit-button"
              htmlType="submit"
              disabled={isLoading}
            >
              {isLoading ? <Spin /> : "Login"}
            </Button>
          </Form.Item>

          <h1 className="text-center mb-4">OR</h1>

          <SigninWithGoogle />

          <h1 className="text-center mb-4 mt-5">
            <span className="text-black ">Not on KhmerPodcast yet? </span>
            <Link to="/register">
              <span className="text-indigo-600 font-bold">Sign up</span>
            </Link>
          </h1>
          <hr className="mt-5" />
          <p className="text-gray-600 mt-5 text-center">
            Your go-to platform for discovering and listening to podcasts in
            Khmer language.
          </p>
        </Form>
      </div>
    </Modal>
  );
};

export default Login;
