import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { loginUser, signupUser, getCurrentUser } from '../api/auth';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('agroscan_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('agroscan_token'));
  const [loading, setLoading] = useState(true);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('agroscan_token');
    localStorage.removeItem('agroscan_user');
  }, []);

  useEffect(() => {
    const handleUnauthorized = () => {
      logout();
    };
    window.addEventListener('agroscan:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('agroscan:unauthorized', handleUnauthorized);
  }, [logout]);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('agroscan_token');
      if (storedToken) {
        try {
          const userData = await getCurrentUser();
          setUser(userData);
          localStorage.setItem('agroscan_user', JSON.stringify(userData));
        } catch (err) {
          if (err.response?.status === 401) {
            console.warn('Saved session expired; signing out.');
            logout();
          } else {
            console.error('Could not verify the saved session with the API:', err);
          }
        }
      }
      setLoading(false);
    };
    initAuth();
  }, [logout]);

  const login = async (email, password) => {
    const data = await loginUser(email, password);
    setToken(data.access_token);
    setUser(data.user);
    localStorage.setItem('agroscan_token', data.access_token);
    localStorage.setItem('agroscan_user', JSON.stringify(data.user));
    return data;
  };

  const signup = async (userData) => {
    const data = await signupUser(userData);
    setToken(data.access_token);
    setUser(data.user);
    localStorage.setItem('agroscan_token', data.access_token);
    localStorage.setItem('agroscan_user', JSON.stringify(data.user));
    return data;
  };

  const demoLogin = async () => {
    return await login('farmer@agroscan.com', 'AgroScan2025!');
  };

  const updateUser = (updatedUserData) => {
    setUser(updatedUserData);
    localStorage.setItem('agroscan_user', JSON.stringify(updatedUserData));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        loading,
        login,
        signup,
        demoLogin,
        updateUser,
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
