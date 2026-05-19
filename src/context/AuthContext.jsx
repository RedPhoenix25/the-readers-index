import React, { createContext, useState, useContext, useEffect } from 'react';
import { API_BASE } from '../services/api';

const AuthContext = createContext(null);

const getInitialToken = () => {
  try {
    return localStorage.getItem('token');
  } catch (e) {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userBooks, setUserBooks] = useState([]);
  const [token, setToken] = useState(getInitialToken());
  const [loading, setLoading] = useState(true);

  const fetchUserBooks = async (currentToken, retries = 3) => {
    const delays = [2000, 5000, 10000];
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const res = await fetch(`${API_BASE}/user/books`, {
          headers: { 'Authorization': `Bearer ${currentToken}` }
        });
        if (res.ok) {
          const data = await res.json();
          setUserBooks(data);
          return;
        }
        if (res.status === 401 || res.status === 403) return; // auth error, don't retry
        // Server error (5xx) — retry
        if (attempt < retries) {
          await new Promise(r => setTimeout(r, delays[attempt]));
        }
      } catch (err) {
        if (attempt >= retries) {
          console.error('Failed to fetch user shelf after retries');
          return;
        }
        await new Promise(r => setTimeout(r, delays[attempt]));
      }
    }
  };

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
      fetchUserProfile();
      fetchUserBooks(token);
    } else {
      localStorage.removeItem('token');
      setUser(null);
      setUserBooks([]);
      setLoading(false);
    }
  }, [token]);

  const fetchUserProfile = async (retries = 3) => {
    const delays = [2000, 5000, 10000];
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const res = await fetch(`${API_BASE}/auth/me`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data);
          setLoading(false);
          return;
        }
        if (res.status === 401 || res.status === 403) {
          // Token is genuinely invalid — log out
          logout();
          setLoading(false);
          return;
        }
        // Server error (5xx) — retry if server is waking
        if (attempt < retries) {
          await new Promise(r => setTimeout(r, delays[attempt]));
        }
      } catch (err) {
        // Network error (server still waking) — retry
        if (attempt >= retries) {
          console.error('Failed to reach server after retries');
          // Don't logout — keep token in case user refreshes once server is up
          setLoading(false);
          return;
        }
        await new Promise(r => setTimeout(r, delays[attempt]));
      }
    }
    setLoading(false);
  };

  const login = (userData, userToken) => {
    setToken(userToken);
    setUser(userData);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setUserBooks([]);
    localStorage.removeItem('token');
  };

  const refreshUserBooks = () => {
    if (token) fetchUserBooks(token);
  };

  const updateUser = (data) => {
    setUser(prev => ({ ...prev, ...data }));
  };

  return (
    <AuthContext.Provider value={{ user, userBooks, token, loading, login, logout, refreshUserBooks, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
