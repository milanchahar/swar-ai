import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import axios from 'axios';
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';


const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('swarai_token'));
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('swarai_user');
    try {
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });
  
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');

  // Persistence effects
  useEffect(() => {
    if (token) {
      localStorage.setItem('swarai_token', token);
    } else {
      localStorage.removeItem('swarai_token');
    }
  }, [token]);

  // Persistence and Sync effects
  useEffect(() => {
    if (user) {
      localStorage.setItem('swarai_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('swarai_user');
    }
  }, [user]);

  // Handle cross-tab synchronization
  useEffect(() => {
    const channel = new BroadcastChannel('swarai_auth_sync');
    
    channel.onmessage = (event) => {
      if (event.data.type === 'UPDATE_USER') {
        setUser(event.data.user);
      }
    };

    return () => channel.close();
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('swarai_token');
    localStorage.removeItem('swarai_user');
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, { email, password });
      const userData = response.data.user;
      setToken(response.data.token);
      setUser(userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const signup = async (email, password, name) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/signup`, { email, password, name });
      const userData = response.data.user;
      setToken(response.data.token);
      setUser(userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  // Fetch latest user data from server (Real-time sync)
  const fetchLatestProfile = useCallback(async () => {
    if (!token) return;
    try {
      const response = await axios.get(`${API_BASE_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.user) {
        setUser(response.data.user);
      }
    } catch (error) {
      console.error('Failed to sync profile:', error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        logout();
      }
    }
  }, [token, logout]);

  // Real-time polling and focus refetch
  useEffect(() => {
    if (!token) return;

    // Sync when user comes back to tab
    const handleFocus = () => fetchLatestProfile();
    window.addEventListener('focus', handleFocus);

    // Periodic sync (every 5 seconds)
    const interval = setInterval(fetchLatestProfile, 5000);

    return () => {
      window.removeEventListener('focus', handleFocus);
      clearInterval(interval);
    };
  }, [token, fetchLatestProfile]);

  const openLogin = () => { setAuthMode('login'); setIsAuthModalOpen(true); };
  const openSignup = () => { setAuthMode('signup'); setIsAuthModalOpen(true); };
  const closeAuthModal = () => setIsAuthModalOpen(false);

  const updateUser = (userData) => {
    setUser(userData);
    // Broadcast to other tabs
    const channel = new BroadcastChannel('swarai_auth_sync');
    channel.postMessage({ type: 'UPDATE_USER', user: userData });
    channel.close();
  };

  const value = {
    setToken,
    user, 
    token, 
    login, 
    signup, 
    logout, 
    updateUser,
    isAuthModalOpen, 
    authMode, 
    openLogin, 
    openSignup, 
    closeAuthModal
  };

  return (
    <AuthContext.Provider value={value}>
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
