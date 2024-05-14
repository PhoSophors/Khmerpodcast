import React, { useState } from "react";
import { Card, Form, Input, Button, Alert, message } from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../login/Login.css";
import logo from "../../assets/logo.jpg";
import { useTranslation } from "react-i18next";
import { api_url } from "../../../api/config";
import "./forgotpassword.css";
import BackBtn from "../../Btn/BackBtn";

const ForgotPassword = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleForgotPassword = async () => {
    setLoading(true);
    try {
      await axios.post(`${api_url}/auths/forgot-password`, { email });
      setCurrentStep(2);
      message.success("Please check your email for the OTP.");
    } catch (error) {
      setError(error.response.data.error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    setLoading(true);
    try {
      await axios.post(
        `${api_url}/auths/reset-pass-verify-otp`,
        { email, otp },
        { withCredentials: true }
      );
      setCurrentStep(3);
      message.success("OTP verified successfully. Please reset your password.");
    } catch (error) {
      setError(error.response.data.error);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    setLoading(true);
    try {
      await axios.post(
        `${api_url}/auths/reset-password`,
        { email, newPassword },
        { withCredentials: true }
      );
      message.success(
        "Password reset successfully. Please login with your new password."
      );
      navigate("/");
    } catch (error) {
      setError(error.response.data.error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center text-center items-center h-screen bg-indigo-600">
      <Card title={t("forgotPassword.title")} className="forgot-password-card xl:w-1/3 md:w-1/2 w-1/2 p-2">
        <BackBtn />
        <Form layout="vertical">
          {currentStep === 1 && (
            <>
              <div className="flex justify-center items-center text-center mb-4">
                <img src={logo} alt="logo" className="logo" />
              </div>

              <p className="text-center mb-4">
                {t("forgotPassword.description")}
              </p>
              <Form.Item
                label={t("forgotPassword.email")}
                name="email"
                rules={[
                  { required: true, message: t("forgotPassword.emailRequired") },
                ]}
              >
                <Input
                  type="email"
                  className="input-field"
                  placeholder={t("forgotPassword.emailPlaceholder")}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Form.Item>

              <div className="mb-5">
                {error && <Alert message={error} type="error" />}
              </div>

              <Button
                className="mt-5 bg-indigo-600 text-white w-36 h-12 rounded-full hover:none"
                onClick={handleForgotPassword}
                loading={loading}
                style={{ float: "right" }}
              >
                {t("forgotPassword.sendOtp")}
              </Button>
            </>
          )}

          {currentStep === 2 && (
            <>
              <div className="flex justify-center items-center text-center mb-4">
                <img src={logo} alt="logo" className="logo" />
              </div>

              <p className="text-center mb-4">
                Please enter the OTP sent to your email to verify your identity.
              </p>
              <Form.Item
                label="OTP"
                name="otp"
                rules={[
                  {
                    required: true,
                    message: "Please input OTP we sent to your email account!",
                  },
                ]}
              >
                <Input
                  placeholder="Enter OTP sent to your email"
                  className="input-field"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
              </Form.Item>
              {error && <Alert message={error} type="error" />}
              <Button
                className="mt-5 bg-indigo-600 text-white w-36 h-12 rounded-full hover:none"
                onClick={handleVerifyOTP}
                loading={loading}
                style={{ float: "right" }}
              >
                Verify OTP
              </Button>
            </>
          )}

          {currentStep === 3 && (
            <>
              <div className="flex justify-center items-center text-center mb-4">
                <img src={logo} alt="logo" className="logo" />
              </div>
              <p className="text-center mb-4">
                Please enter your new password below. Make sure it's strong and
                secure.
              </p>
              <Form.Item
                label="New Password"
                name="newPassword"
                rules={[
                  {
                    required: true,
                    message: "Please input your new password!",
                  },
                ]}
              >
                <Input.Password
                  className="input-field"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </Form.Item>
              {error && <Alert message={error} type="error" />}
              <Button
                  className="mt-5 bg-indigo-600 text-white w-36 h-12 rounded-full hover:none"
                onClick={handleResetPassword}
                loading={loading}
                style={{ float: "right" }}
              >
                Reset Password
              </Button>
            </>
          )}
        </Form>
      </Card>
    </div>
  );
};

export default ForgotPassword;
