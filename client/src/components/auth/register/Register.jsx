import React, { useState } from "react";
import { Form, Input, Button, Card, message, Spin, notification } from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Register.css";
import "../login/Login.css";
import Cookies from "js-cookie";
import { Link } from "react-router-dom";
import SigninWithGoogles from "../signinWithGoogle/SignInWithGoogle";
import { useTranslation } from "react-i18next";
import { api_url } from "../../../api/config";
import BackBtn from "../../Btn/BackBtn";

const Register = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation();

  const onFinish = async (values) => {
    try {
      setIsLoading(true);

      // Validate password
      const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,20}$/;
      if (!passwordRegex.test(values.password)) {
        notification.error({
          message: "Validation Error",
          description: "Password must contain at least one letter, one number.",
        });
        setIsLoading(false); // Stop loading spinner
        return; // Exit the function
      }

      const response = await axios.post(
        `${api_url}/auths/register`,
        values,
        {}
      );
      setIsLoading(false); // Stop loading spinner

      if (response.status === 200) {
        // Save the id to cookies
        Cookies.set("id", response.data.id);

        // Registration successful, navigate to /otp
        notification.success({
          message: "Registration successful.",
          description: "Please check your email for the OTP to activate your account.",
        });

        // After successful registration, navigate to OTP verification page
        navigate("/otp", { state: { email: values.email } });
      } else {
        message.error("Registration failed. Please try again later.");
      }
    } catch (error) {
      setIsLoading(false); // Stop loading spinner
      message.error("Registration failed. Please try again later.");
    }
  };

  const handlePasswordBlur = (event) => {
    const value = event.target.value;
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,20}$/;
    if (!passwordRegex.test(value)) {
      notification.error({
        message: "Validation Error",
        description: "Password must contain at least one letter, one number.",
      });
    }
  };

  return (
    <div className="main-register">
      <div className="register-backBtn">
        <BackBtn />
      </div>

      <div className="register-form mx-auto flex p-0 overflow-auto">
        <Card className="register-card ">
          <div className="items-center p-4">
            <h1 className="text-center mb-4 ">
              <span className="title md:mt-10 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-pink-500">
                {t("register.title")}
              </span>
            </h1>

            <Form
              className=""
              name="register"
              onFinish={onFinish}
              layout="vertical"
            >
              <Form.Item
                label={t("register.username")}
                name="username"
                rules={[
                  { required: true, message: t("register.usernameRequired") },
                ]}
              >
                <Input
                  className="input-field"
                  placeholder={t("register.usernamePlaceholder")}
                />
              </Form.Item>

              <Form.Item
                label={t("register.email")}
                name="email"
                rules={[
                  { required: true, message: t("register.emailRequired") },
                ]}
              >
                <Input
                  className="input-field"
                  placeholder={t("register.emailPlaceholder")}
                />
              </Form.Item>

              <Form.Item
                label={t("register.password")}
                name="password"
                rules={[
                  {
                    required: true,
                    message: t("register.passwordRequired"),
                  },
                ]}
              >
                <Input.Password
                  className="input-field"
                  placeholder={t("register.passwordPlaceholder")}
                  onBlur={handlePasswordBlur} // Trigger validation on blur
                />
              </Form.Item>

              <Form.Item
                label={t("register.confirmPassword")}
                name="confirmPassword"
                rules={[
                  {
                    required: true,
                    message: t("register.confirmPasswordRequired"),
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("password") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error("Password not match!"));
                    },
                  }),
                ]}
              >
                <Input.Password
                  className="input-field"
                  placeholder={t("register.confirmPasswordPlaceholder")}
                />
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
                  {isLoading ? <Spin /> : t("register.register")}
                </Button>
              </Form.Item>

              <h1 className="text-center mb-4">{t("register.or")}</h1>

              <SigninWithGoogles />

              <h1 className="text-center mb-4 mt-5">
                <span className="text-black ">
                  {t("register.haveAccount")}{" "}
                </span>
                <Link to="/">
                  <span className="text-indigo-600  hover:underline  font-bold">
                    {t("register.login")}{" "}
                  </span>
                </Link>
              </h1>

              <hr className="mt-5" />
              <p className="text-gray-600 mt-5 text-center">
                {t("register.termsAndConditions")}
              </p>
            </Form>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Register;
