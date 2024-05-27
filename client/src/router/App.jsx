// App.jsx

import React from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import MainSection from "../container/mainSection/MainSection";
import AppLoading from "../components/apploading/AppLoading";
import Login from "../components/auth/login/Login";
import Register from "../components/auth/register/Register";
import Otp from "../components/auth/otp/Otp";
import ForgotPassword from "../components/auth/forgotPassword/ForgotPassword";
import PrivateRoute from "./PrivateRoute";
import GuestRoute from "./GuestRoute";
import UserCard from "../components/card/UserCard";
import EditProfile from "../components/pages/profile/EditProfile";
import PublicProfile from "../components/pages/profile/PublicProfile";
import { useUser } from "../services/useUser";

const App = () => {
  const { isLoading, userRole } = useUser();

  return (
    <Router>
      {isLoading ? (
        <AppLoading />
      ) : (
        <Routes>
          <Route path="/" element={<MainSection />} />
          <Route path="/search" element={<MainSection />} />
          <Route path="/usercard" element={<UserCard />} />
          <Route path="/public-profile/:id" element={<PublicProfile />} />
          <Route path="/watch-podcast/:id" element={<MainSection />} />
          
          {userRole === "admin" ? (
            <>
              <Route path="/dashboard" element={<MainSection />} />
              <Route path="/all-user" element={<MainSection />} />
              <Route path="/all-user-upload" element={<MainSection />} />
            </>
          ) : (
            <Route path="/dashboard" element={<Navigate to="/login" />} />
          )}

          <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
          <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />
          <Route path="/otp" element={<GuestRoute><Otp /></GuestRoute>} />
          <Route path="/forgotPassword" element={<GuestRoute><ForgotPassword /></GuestRoute>} />

          <Route path="/favorite" element={<PrivateRoute><MainSection /></PrivateRoute>} />
          <Route path="/create" element={<PrivateRoute><MainSection /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><MainSection /></PrivateRoute>} />
          <Route path="/setting" element={<PrivateRoute><MainSection /></PrivateRoute>} />
          <Route path="/update-podcast" element={<PrivateRoute><MainSection /></PrivateRoute>} />
          <Route path="/edit-profile/:id" element={<PrivateRoute><EditProfile /></PrivateRoute>} />
        </Routes>
      )}
    </Router>
  );
};

export default App;
