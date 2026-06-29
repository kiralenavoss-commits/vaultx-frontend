import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../utils/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('vaultx_user');
    const savedToken = localStorage.getItem('vaultx_token');
    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const response = await authAPI.login({ email, password });
    const { token, user } = response.data;
    localStorage.setItem('vaultx_token', token);
    localStorage.setItem('vaultx_user', JSON.stringify(user));
    setUser(user);
    return response.data;
  };

  const register = async (username, email, password, referralCode) => {
    const response = await authAPI.register({ username, email, password, referralCode });
    const { token, user } = response.data;
    localStorage.setItem('vaultx_token', token);
    localStorage.setItem('vaultx_user', JSON.stringify(user));
    setUser(user);
    return response.data;
  };

  const logout = () => {
    localStorage.removeItem('vaultx_token');
    localStorage.removeItem('vaultx_user');
    setUser(null);
    window.location.href = '/';
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('vaultx_user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};