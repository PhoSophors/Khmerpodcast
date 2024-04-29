import React, { useState } from "react";
import { Snackbar } from "@mui/material";
import "./SignInWithGoogle.css";
import { GoogleOutlined } from "@ant-design/icons";
import { Button } from "antd";
import axios from "axios";

const SigninWithGoogles = () => {
  const [errorMessage, setErrorMessage] = useState("");
  
  const handleSignInWithGoogle = () => {
    window.location.href = "http://localhost:4000/auth/google";
  };

  const handleCloseError = () => {
    // Clear error message when Snackbar is closed
    setErrorMessage("");
  };

  return (
    <>
      <Button
        type="default"
        onClick={handleSignInWithGoogle}
        icon={<GoogleOutlined />}
        block
        className="google-button"
      >
        Login with Google
      </Button>

      <Snackbar
        open={!!errorMessage} // Show Snackbar only when errorMessage is not empty
        autoHideDuration={6000}
        onClose={handleCloseError}
        message={errorMessage}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      />
    </>
  );
};

export default SigninWithGoogles;
