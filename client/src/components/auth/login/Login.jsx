import { Form, Input, Button, Modal, message, Spin } from "antd";
import React, { useState } from "react";
import "./Login.css"; // Import your CSS file
import { Link } from "react-router-dom";
import SigninWithGoogle from "../signinWithGoogle/SignInWithGoogle";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { useTranslation } from "react-i18next";
import { api_url } from "../../../api/config";

const Login = ({ visible, onCancel }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation();

  const handleCancel = () => {
    onCancel();
    document.body.classList.remove("modal-open");
  };

  const onFinish = async (values) => {
    try {
      setIsLoading(true);
      const response = await axios.post(`${api_url}/auths/login`, values, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
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
      <div className="flex flex-col items-center p-4">
        <h1 className="text-center mb-4 mt-5">
          <span className="title mb-3 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-pink-500">
            {t("login.title")}
          </span>
        </h1>

        <Form
          name="login-form"
          onFinish={onFinish}
          layout="vertical"
          className="w-80"
        >
          <Form.Item
            label={t("login.email")}
            name="email"
            rules={[{ required: true, message: t("login.emailRequired") }]}
          >
            <Input
              className="input-field"
              placeholder={t("login.emailPlaceholder")}
            />
          </Form.Item>

          <Form.Item
            label={t("login.password")}
            name="password"
            rules={[{ required: true, message: t("login.passwordRequired") }]}
          >
            <Input.Password
              className="input-field"
              placeholder={t("login.passwordPlaceholder")}
            />
          </Form.Item>

          <Form.Item style={{ marginTop: "-20px" }}>
            <Link to="/forgotPassword">
              <h1 className="text-end hover:underline hover:italic font-bold text-indigo-600 ">
                {t("login.forgotPassword")}
              </h1>
            </Link>
          </Form.Item>

          <Form.Item>
            <Button
              style={{
                backgroundColor: "#4f46e5",
                color: "#ffffff",
              }}
              type="default"
              className="submit-button"
              htmlType="submit"
              disabled={isLoading}
            >
              {isLoading ? <Spin /> : t("login.login")}
            </Button>
          </Form.Item>

          <h1 className="text-center mb-4">{t("login.or")}</h1>

          <SigninWithGoogle />

          <h1 className="text-center mb-4 mt-5">
            <span className="text-black ">{t("login.notHaveAccount")}</span>
            <Link to="/register">
              <span className="text-indigo-600 hover:underline hover:italic  font-bold">
                {t("login.signUp")}
              </span>
            </Link>
          </h1>
          <hr className="mt-5" />
          <p className="text-gray-600 mt-5 text-center">
            {t("login.discription")}
          </p>
        </Form>
      </div>
    </Modal>
  );
};

export default Login;
