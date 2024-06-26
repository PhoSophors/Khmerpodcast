import React from "react";
import { Navigate, useLocation } from 'react-router-dom';
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

const PrivateRoute = ({ children }) => {
  const location = useLocation();
  const authToken = Cookies.get('authToken') ? atob(Cookies.get('authToken')) : null;

  if (!authToken) {
    return <Navigate to="/" state={{ from: location }} />;
  }

  const decodedToken = jwtDecode(authToken);
  const userRole = decodedToken.role;

  // Check if the user role is 'admin' or 'user'
  if (userRole === 'admin' || userRole === 'user') {
    return children;
  } else {
    return <Navigate to="/" state={{ from: location }} />;
  }
};

export default PrivateRoute;
