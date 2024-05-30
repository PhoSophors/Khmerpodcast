import React, { lazy } from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import AppLoading from "../components/apploading/AppLoading";
import PrivateRoute from "./PrivateRoute";
import GuestRoute from "./GuestRoute";
import Login from "../components/auth/login/Login";
import Register from "../components/auth/register/Register";
import Otp from "../components/auth/otp/Otp";
import ForgotPassword from "../components/auth/forgotPassword/ForgotPassword";

// Lazy load components
const PublicProfile = lazy(() => import("../components/pages/profile/PublicProfile"));
const MainSection = lazy(() => import("../container/mainSection/MainSection"));

const App = () => {
  const { isLoading, userRole } = useUser();

  return (
    <Router>
      {isLoading ? (
        <AppLoading />
      ) : (
        <Routes>
          {/* Main layout routes */}
          <Route path="/" element={<MainSection />} />
          <Route path="/search" element={<MainSection />} />
          <Route path="/watch-podcast/:id" element={<MainSection />} />
          <Route path="/public-profile/:id" element={<PublicProfile />} />

          {/* Admin routes */}
          {userRole === "admin" ? (
            <>
              <Route path="/dashboard" element={<MainSection />} />
              <Route path="/all-user" element={<MainSection />} />
              <Route path="/all-user-upload" element={<MainSection />} />
            </>
          ) : (
            <Route path="/dashboard" element={<Navigate to="/login" />} />
          )}

          {/* Auth routes */}
          <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
          <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />
          <Route path="/otp" element={<GuestRoute><Otp /></GuestRoute>} /> 
          <Route path="/forgotPassword" element={<GuestRoute><ForgotPassword /></GuestRoute>} />

          {/* Protected routes */}
          <Route path="/favorite" element={<PrivateRoute><MainSection /></PrivateRoute>} />
          <Route path="/create" element={<PrivateRoute><MainSection /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><MainSection /></PrivateRoute>} />
          <Route path="/setting" element={<PrivateRoute><MainSection /></PrivateRoute>} />
          <Route path="/update-podcast" element={<PrivateRoute><MainSection /></PrivateRoute>} />
          <Route path="/update-profile/:id" element={<PrivateRoute> <MainSection /></PrivateRoute>} />


        </Routes>
      )}
    </Router>
  );
};

export default App;
