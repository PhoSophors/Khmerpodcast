import React, { useState } from "react";
import { Form, Input, Button, Card, message, Spin } from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Register.css";
import "../login/Login.css";
import Cookies from "js-cookie";
import { Link } from "react-router-dom";
import SigninWithGoogles from "../signinWithGoogle/SignInWithGoogle";


const Register = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const onFinish = async (values) => {
    try {
      setIsLoading(true);

      const response = await axios.post(
        "http://localhost:3001/auths/register",
        values
      );
      setIsLoading(true);

      if (response.status === 200) {
        // Save the id to cookies
        
        Cookies.set("id", response.data.id);

        // Registration successful, navigate to /otp
        message.success(
          "Registration successful. Please check your email for the OTP to activate your account."
        );

        // After successful registration, navigate to OTP verification page
        navigate("/otp", { state: { email: values.email } });
      } else {
        // Unexpected response status
        console.error("Unexpected response status:", response.status);
        message.error("Registration failed. Please try again later.");
      }
    } catch (error) {
      setIsLoading(true);
      // Handle request error
      console.error("Error:", error.message);
      message.error("Registration failed. Please try again later.");
    }
  };

  return (
    <div className="register-form bg-slate-100 mx-auto flex p-0 overflow-auto">
      <Card className="card overflow-auto">
        <div className="items-center p-4">
          <h1 className="text-center mb-4 ">
            <span className="text-black title md:mt-10">Welcome to </span>
            <span className="text-indigo-600 title">KhmerPodcast</span>
          </h1>

          <Form
            className=""
            name="register"
            onFinish={onFinish}
            layout="vertical"
          >
            <Form.Item
              label="Username *"
              name="username"
              rules={[
                { required: true, message: "Please input your username!" },
              ]}
            >
              <Input
                className="input-field"
                placeholder="Enter your username"
              />
            </Form.Item>

            <Form.Item
              label="Email *"
              name="email"
              rules={[{ required: true, message: "Please input your email!" }]}
            >
              <Input className="input-field" placeholder="Enter your email" />
            </Form.Item>

            <Form.Item
              label="Password *"
              name="password"
              rules={[
                { required: true, message: "Please input your password!" },
              ]}
            >
              <Input.Password
                className="input-field"
                placeholder="Create password"
              />
            </Form.Item>

            <Form.Item
              label="Confirm Password *"
              name="confirmPassword"
              rules={[
                { required: true, message: "Please confirm your password!" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error(
                        "Password not match!"
                      )
                    );
                  },
                }),
              ]}
            >
              <Input.Password
                className="input-field"
                placeholder="Confirm password"
              />
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
                {isLoading ? <Spin /> : "Register"}
              </Button>
            </Form.Item>

            <h1 className="text-center mb-4">OR</h1>

            <SigninWithGoogles />

            <h1 className="text-center mb-4 mt-5">
              <span className="text-black ">Do you have an account? </span>
              <Link to="/">
                <span className="text-indigo-600 font-bold">Login</span>
              </Link>
            </h1>

            <hr className="mt-5" />
            <p className="text-gray-600 mt-5 text-center">
              By signing up, you agree to our Terms, Data Policy and Cookies
              Policy.
            </p>
          </Form>
        </div>
      </Card>
    </div>
  );
};

export default Register;
