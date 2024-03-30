// PrivateRoute.js
import React from "react";
import { Navigate, useLocation } from 'react-router-dom';
import Cookies from "js-cookie";

const PrivateRoute = ({ children }) => {
  const location = useLocation();
  const authToken = Cookies.get("authToken");

  return authToken ? children : <Navigate to="/register" state={{ from: location }} />;
};

export default PrivateRoute;