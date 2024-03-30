import React, { useState } from "react";
import { Card, Form, Input, Button, Alert, message } from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const ForgotPassword = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleForgotPassword = async () => {
    setLoading(true);
    try {
      await axios.post("/auths/forgot-password", { email });
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
        "/auths/reset-pass-verify-otp",
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
        "/auths/reset-password",
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
    <div className="flex justify-center items-center h-screen bg-sky-200 dark:bg-neutral-800">
      <Card title="Forgot Password" style={{ width: "40%" }}>
        <Form layout="vertical">
          {currentStep === 1 && (
            <>
              <p className="text-center mb-4">
                Please enter the email associated with your account to receive a
                password reset OTP.
              </p>
              <Form.Item>
                <Input
                  type="email"
                  placeholder="Enter your email to reset your password"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Form.Item>

              <div className="mb-5">
                {error && <Alert message={error} type="error" />}
              </div>

              <Button
                type="primary"
                onClick={handleForgotPassword}
                loading={loading}
              >
                Send OTP
              </Button>
            </>
          )}

          {currentStep === 2 && (
            <>
              <p className="text-center mb-4">
                Please enter the OTP sent to your email to verify your identity.
              </p>
              <Form.Item>
                <Input
                  placeholder="Enter OTP sent to your email"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
              </Form.Item>
              {error && <Alert message={error} type="error" />}
              <Button
                type="primary"
                onClick={handleVerifyOTP}
                loading={loading}
              >
                Verify OTP
              </Button>
            </>
          )}

          {currentStep === 3 && (
            <>
              <p className="text-center mb-4">
                Please enter your new password below. Make sure it's strong and
                secure.
              </p>
              <Form.Item>
                <Input.Password
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </Form.Item>
              {error && <Alert message={error} type="error" />}
              <Button
                type="primary"
                onClick={handleResetPassword}
                loading={loading}
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
