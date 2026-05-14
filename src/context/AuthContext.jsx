import React, { createContext, useState, useContext, useEffect } from 'react';

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

  const fetchUserBooks = async (currentToken) => {
    try {
      const res = await fetch('/api/user/books', {
        headers: { 'Authorization': `Bearer ${currentToken}` }
      });
      if (res.ok) {
        const data = await res.json();
        setUserBooks(data);
      }
    } catch (err) {
      console.error('Failed to fetch user shelf');
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

  const fetchUserProfile = async () => {
    try {
      const res = await fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data);
      } else {
        logout();
      }
    } catch (err) {
      console.error('Failed to fetch user profile');
      logout();
    } finally {
      setLoading(false);
    }
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
