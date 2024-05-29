import React from "react";
import { Form, Input, Button, Modal, Spin } from "antd";
import "./Login.css"; // Import your CSS file
import { Link } from "react-router-dom";
// import SigninWithGoogle from "../signinWithGoogle/SignInWithGoogle";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../../services/useAuth";
import { CloseOutlined } from "@ant-design/icons";

const Login = ({ visible, onCancel }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { login, isLoading } = useAuth();

  const handleCancel = () => {
    onCancel();
    document.body.classList.remove("modal-open");
  };

  const onFinish = async (values) => {
    const success = await login(values);
    if (success) {
      // Close the modal
      handleCancel();
      window.location.reload();
      navigate("/");
    }
  };

  return (
    <Modal
      visible={visible}
      centered 
      maskClosable={true}
      footer={null}
      keyboard={true}
      onCancel={handleCancel}
      closeIcon={
        <CloseOutlined className="text-white bg-indigo-600 hover:bg-red-500 rounded-full p-3" />
      }
    >
      <div className="flex flex-col items-center p-4">
        <h1 className="text-center mb-4 mt-5">
          <h1 className="title mb-3 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-pink-500">
            {t("login.title")}
          </h1>
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
              <h1 className="text-end hover:underline font-bold text-indigo-600  dark:text-gray-300">
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

          <h1 className="text-center  dark:text-gray-300 mb-4">{t("login.or")}</h1>

          {/* <SigninWithGoogle /> */}

          <h1 className="text-center justify-center mb-4 mt-5 gap-2 flex">
            <span className="text-gray-600 dark:text-gray-300">{t("login.notHaveAccount")}</span>
            <Link to="/register">
              <span className="text-indigo-600  dark:text-gray-300 hover:underline  font-bold">
                {t("login.signUp")}
              </span>
            </Link>
          </h1>
          <hr className="mt-5" />
          <h1 className="text-gray-600 dark:text-gray-300 mt-5 text-center">
            {t("login.discription")}
          </h1>
        </Form>
      </div>
    </Modal>
  );
};

export default Login;
