import React, { useState, useRef, useEffect } from "react";
import { Input, Row, Col, Card, Button, message, Spin } from "antd";
import axios from "axios";
import { SafetyOutlined } from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import Cookies from "js-cookie";

const Otp = () => {
  const [otpValues, setOtpValues] = useState(Array(6).fill(""));
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const inputRefs = useRef([]);
  const location = useLocation();
  const email = location.state ? location.state.email : ""; // Get email from location state

  useEffect(() => {
    // Check if all OTP digits have been entered
    if (otpValues.join("").length === 6) {
      handleVerifyOTP();
    }
  }, [otpValues]);

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

  const handleVerifyOTP = async () => {
    try {
      setIsLoading(true);
      const response = await axios.post(
        "http://localhost:8085/auths/user/verify-otp",
        {
          email,
          otp: otpValues.join(""),
        }
      );

      if (response.status === 200) {
        // OTP verified successfully, set the authToken cookie
        Cookies.set("authToken", response.data.authToken);

        // Navigate to home page
        message.success("OTP verified successfully");
        navigate("/");
      } else {
        // Unexpected response status
        console.error("Unexpected response status:", response.status);
        message.error("OTP verification failed. Please try again.");
      }
    } catch (error) {
      // Handle request error
      console.error("Error:", error.message);
      message.error("OTP verification failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col w-full bg-slate-700  items-center justify-center h-screen text-center bg-white p-5">
      <Card
        title="Please verified OTP to complete register!"
        style={{ width: 350, float: "left" }}
      >
      <div className="mt-10 ">
          <SafetyOutlined
            style={{ fontSize: "100px", color: "#06b6d4" }}
          />
        </div>
        <h1 className="mt-10">
          We have sent you access code vai Email verification:{" "}
        </h1>
        <h1 className="mb-10 text-bold" style={{ fontWeight: "bold" }}>
          {email}
        </h1>
        <Row gutter={16} className="">
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
        <hr className="mt-10 " />
        <div className="mt-10 mb-10 text-center">
          <Spin spinning={isLoading}>
            <Button
              style={{
                width: "100%",
                height: "50px",
                borderRadius: "18px",
                backgroundColor: "#0e7490",
                color: "#ffffff",
              }}
              type="dashed"
              onClick={handleVerifyOTP}
            >
              Verify OTP
            </Button>
          </Spin>
        </div>
      </Card>
    </div>
  );
};

export default Otp;
