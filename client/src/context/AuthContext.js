import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState(() => {
    const token = Cookies.get('authToken');
    return token ? { isAuthenticated: true, authToken: token } : { isAuthenticated: false, authToken: null };
  });

  useEffect(() => {
    const token = Cookies.get('authToken');
    if (token) {
      axios.get('/auths/verify-token', {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(response => {
          if (response.status === 200) {
            setAuthState({ isAuthenticated: true, authToken: token });
          }
        })
        .catch(error => {
          console.error('Token verification failed:', error);
          // Clear token and log user out
          Cookies.remove('authToken');
          setAuthState({ isAuthenticated: false, authToken: null });
        });
    }
  }, []);

  return (
    <AuthContext.Provider value={{ authState, setAuthState }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };