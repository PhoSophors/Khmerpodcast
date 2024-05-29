import React, { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import { api_url } from "../../../api/config";
import { Input, Row, Col, Card, Button, message, Spin } from "antd";
import { SafetyOutlined } from "@ant-design/icons";
import BackBtn from "../../Btn/BackBtn";

const Otp = () => {
  const [otpValues, setOtpValues] = useState(Array(6).fill(""));
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const inputRefs = useRef([]);
  const location = useLocation();
  const email = location.state ? location.state.email : ""; // Get email from location state

  const handleVerifyOTP = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await axios.post(`${api_url}/auths/user/verify-otp`, {
        email,
        otp: otpValues.join(""),
      });

      if (response.status === 200) {
        // OTP verified successfully, set the authToken cookie
        const encodedToken = btoa(response.data.authToken);
        const encodedId = btoa(response.data.id);
        Cookies.set("authToken", encodedToken, { expires: 365 * 100 });
        Cookies.set("id", encodedId, { expires: 365 * 100 });


        // Navigate to home page
        message.success("OTP verified successfully");
        navigate("/");
      } else {
        message.error("OTP verification failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  }, [email, otpValues, navigate]);

  useEffect(() => {
    if (otpValues.join("").length === 6) {
      handleVerifyOTP();
    }
  }, [otpValues, handleVerifyOTP]);

  const handleInputChange = (e, index) => {
    const { value } = e.target;
    if (value.match(/^\d*$/)) {
      const updatedOtpValues = [...otpValues];
      updatedOtpValues[index] = value;
      setOtpValues(updatedOtpValues);

      if (value !== "") {
        // Automatically focus on the next input field if a number is entered
        if (index < 5) {
          inputRefs.current[index + 1].focus();
        }
      } else {
        // Automatically focus on the previous input field if a number is deleted
        if (index > 0) {
          inputRefs.current[index - 1].focus();
        }
      }
    }
  };

  return (
    <div style={{ backgroundColor: `var(--content-bg)` }}>
      <BackBtn />

      <div className="flex flex-col w-full xl-min-w-96 items-center justify-center h-screen text-center p-5">
        <Card title="Please verify OTP!" style={{ width: 350, float: "left" }}>
          <div className="mt-10">
            <SafetyOutlined style={{ fontSize: "100px", color: "#4f46e5" }} />
          </div>
          <h1 className="mt-10  dark:text-gray-300">
            We have sent you an access code via email verification:
          </h1>
          <h1 className="mb-10 font-bold  dark:text-gray-100">{email}</h1>
          <Row gutter={16}>
            {otpValues.map((value, index) => (
              <Col key={index} span={4}>
                <Input
                  ref={(input) => (inputRefs.current[index] = input)}
                  style={{
                    textAlign: "center",
                    width: "3rem",
                    height: "3rem",
                    borderRadius: "15px",
                    backgroundColor: "#f0f0f0",
                  }}
                  value={value}
                  maxLength={1}
                  onChange={(e) => handleInputChange(e, index)}
                />
              </Col>
            ))}
          </Row>
          <hr className="mt-10" />
          <div className="mt-10 mb-10 text-center">
            <Spin spinning={isLoading}>
              <Button
                style={{
                  width: "100%",
                  height: "50px",
                  borderRadius: "18px",
                  backgroundColor: "#4f46e5",
                  color: "#ffffff",
                }}
                onClick={handleVerifyOTP}
                disabled={otpValues.join("").length !== 6}
              >
                Verify OTP
              </Button>
            </Spin>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Otp;
