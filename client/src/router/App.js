// App.js
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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
        <Routes>
          <Route path="/" element={<MainSection />} />
          <Route path="/search" element={<Search />} />
          <Route path="/dashboard" element={userRole === 'admin' ? <Dashboard /> : <Login />} />

          {/* GuestRoute */}
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

          {/* PrivateRoute */}
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

          {/* <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          /> */}
        
        </Routes>
      )}
    </Router>
  );
};

export default App;
