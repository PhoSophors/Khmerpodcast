// GuestRoute.js

import React from "react";
import { Navigate, useLocation } from 'react-router-dom';
import Cookies from "js-cookie";

const GuestRoute = ({ children }) => {
  const location = useLocation();
  const authToken = Cookies.get("authToken")? atob(Cookies.get("authToken")): null;

  return authToken ? <Navigate to="/" state={{ from: location }} /> : children;
};

export default GuestRoute;