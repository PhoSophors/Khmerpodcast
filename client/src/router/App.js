import React, { useState, useEffect } from "react";
import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import MainSection from "../container/mainSection/MainSection";
import Favorith from "../components/pages/favorite/Favorith";
import Search from "../components/pages/search/Search";
import Setting from "../components/pages/setting/Setting";
import Profile from "../components/pages/profile/Profile";
import AppLoading from "../components/apploading/AppLoading";
import Login from "../components/auth/login/Login";
import Register from "../components/auth/register/Register";
import Otp from "../components/auth/otp/Otp";
import ForgotPassword from "../components/auth/forgotPassword/ForgotPassword";
import PrivateRoute from "./PrivateRoute";
import GuestRoute from "./GuestRoute";
import Dashboard from "../components/pages/admin/dashboard/Dashboard";
import AllUser from "../components/pages/admin/user/AllUser";
import FileManager from "../components/pages/admin/user/FileManager";
import UserCard from "../components/card/UserCard";
import { AudioProvider } from "../context/AudioContext";
import UpdatePodcast from "../components/pages/create/UpdatePodcast";
import EditProfile from "../components/pages/profile/EditProfile";

const App = () => {
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const authToken = Cookies.get("authToken");
    if (authToken) {
      const decodedToken = jwtDecode(authToken);
      setUserRole(decodedToken.role);
    }

    const timeout = setTimeout(() => {
      setLoading(false);
    }, 200);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <Router>
      {loading ? (
        <AppLoading />
      ) : (
        <>
          <Routes>
            <Route exact path="/" element={<MainSection />} />
            <Route path="/search" element={<Search />} />
            <Route path="/usercard" element={<UserCard />} />
            <Route path="/update-podcast" element={<UpdatePodcast />} />
            <Route path="/edit-profile/:id" element={<EditProfile />} />

            {/* Admin Routes */}
            {userRole === "admin" ? (
              <>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/all-user" element={<AllUser />} />
                <Route path="/all-user-upload" element={<FileManager />} />
              </>
            ) : (
              <Route path="/dashboard" element={<Navigate to="/login" />} />
            )}

            {/* Guest Routes */}
            <Route
              path="/login"
              element={
                <GuestRoute>
                  <Login />
                </GuestRoute>
              }
            />
            <Route
              path="/register"
              element={
                <GuestRoute>
                  <Register />
                </GuestRoute>
              }
            />
            <Route
              path="/otp"
              element={
                <GuestRoute>
                  <Otp />
                </GuestRoute>
              }
            />
            <Route
              path="/forgotPassword"
              element={
                <GuestRoute>
                  <ForgotPassword />
                </GuestRoute>
              }
            />

            {/* Private Routes */}
            <Route
              path="/favorite"
              element={
                <PrivateRoute>
                  <Favorith />
                </PrivateRoute>
              }
            />
            <Route
              path="/setting"
              element={
                <PrivateRoute>
                  <Setting />
                </PrivateRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              }
            />
          </Routes>
        </>
      )}
    </Router>
  );
};

export default App;
