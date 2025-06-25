import React, { createContext, useContext, useState, useEffect } from 'react';
import { tokenUtils } from '../utils/token';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is authenticated on app load
  useEffect(() => {
    const token = tokenUtils.getToken();
    if (token) {
      // You can decode the JWT token here to get user info
      // For now, we'll just set a basic user object
      setUser({ isAuthenticated: true });
    }
    setLoading(false);
  }, []);

  const login = (token) => {
    tokenUtils.setToken(token);
    setUser({ isAuthenticated: true });
  };

  const logout = () => {
    tokenUtils.removeToken();
    setUser(null);
  };

  const value = {
    user,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};