// PrivateRoute.js

import React from "react";
import { Navigate, useLocation } from 'react-router-dom';
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

const PrivateRoute = ({ children }) => {
  const location = useLocation();
  const authToken = Cookies.get('authToken') ? atob(Cookies.get('authToken')) : null;

  if (!authToken) {
    return <Navigate to="/register" state={{ from: location }} />;
  }

  const decodedToken = jwtDecode(authToken);

  return decodedToken.role === 'admin' ? children : <Navigate to="/register" state={{ from: location }} />;
};

export default PrivateRoute;