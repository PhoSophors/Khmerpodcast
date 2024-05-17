// import React, { createContext, useState, useEffect } from "react";
// import axios from "axios";
// import Cookies from "js-cookie";
// import { jwtDecode } from "jwt-decode";
// import { api_url } from "../api/config";
// import { message } from "antd";

// export const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [authState, setAuthState] = useState({
//     isAuthenticated: false,
//     user: null,
//     authToken: null,
//   });

//   useEffect(() => {
//     const authToken = Cookies.get("authToken");

//     if (authToken) {
//       let decodedToken;
//       try {
//         decodedToken = jwtDecode(authToken);
//       } catch (e) {
//         message.error("Invalid token:", e);
//         return;
//       }

//       setAuthState({
//         isAuthenticated: true,
//         user: decodedToken,
//         authToken: authToken,
//       });
//     }
//   }, []);

//   const login = async (email, password) => {
//     try {
//       const response = await axios.post(`${api_url}/auths/login`, {
//         email,
//         password,
//       });
//       const { data } = response;

//       if (data) {
//         // Encode the authToken using btoa and then set it to cookies
//         const encodedToken = btoa(data.authToken);
//         Cookies.set("authToken", encodedToken);

//         // Decode the authToken using jwt-decode
//         let decodedToken;
//         try {
//           decodedToken = jwtDecode(encodedToken);
//         } catch (e) {
//           message.error("Invalid token:", e);
//           return;
//         }

//         setAuthState({
//           isAuthenticated: true,
//           user: {
//             id: data.id,
//             email: data.email,
//             username: data.username,
//             role: data.role,
//           },
//           authToken: decodedToken,
//         });
//       }
//     } catch (error) {
//       message.error(
//         "Error logging in:",
//         error.response?.data?.message || error.message
//       );
//       setAuthState({
//         isAuthenticated: false,
//         user: null,
//         authToken: null,
//       });
//     }
//   };

//   const logout = () => {
//     // Clear the authToken from cookies
//     Cookies.remove("authToken");

//     setAuthState({
//       isAuthenticated: false,
//       user: null,
//       authToken: null,
//     });
//   };

//   return (
//     <AuthContext.Provider value={{ authState, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };
