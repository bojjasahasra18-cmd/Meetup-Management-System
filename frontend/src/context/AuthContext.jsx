import React, { createContext, useState, useEffect, useContext } from 'react';
import { getMe, loginUser, registerUser } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const data = await getMe();
          if (data.success && data.user) {
            setUser(data.user);
            setIsAuthenticated(true);
          } else {
            localStorage.removeItem('token');
          }
        } catch (error) {
          console.error('Failed to load user info:', error);
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };

    fetchCurrentUser();
  }, []);

  const login = async (email, password) => {
    try {
      const data = await loginUser({ email, password });
      if (data.success && data.token) {
        localStorage.setItem('token', data.token);
        setIsAuthenticated(true);
        const profileData = await getMe();
        if (profileData.success && profileData.user) {
          setUser(profileData.user);
        }
        return { success: true };
      }
      return { success: false, message: 'Invalid credentials' };
    } catch (error) {
      const msg = error.response?.data?.message || 'Login failed';
      return { success: false, message: msg };
    }
  };

  const register = async (formData) => {
    try {
      const data = await registerUser(formData);
      if (data.success && data.token) {
        localStorage.setItem('token', data.token);
        setIsAuthenticated(true);
        const profileData = await getMe();
        if (profileData.success && profileData.user) {
          setUser(profileData.user);
        }
        return { success: true };
      }
      return { success: false, message: 'Registration failed' };
    } catch (error) {
      const msg = error.response?.data?.message || 'Registration failed';
      return { success: false, message: msg };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
