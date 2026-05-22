import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();
const API_URL = 'http://localhost:5000/api';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('authUser');
    const token = localStorage.getItem('authToken');
    if (savedUser && token) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password, role = 'user') => {
    try {
      setError(null);
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Login failed with status ${response.status}`);
      }

      const data = await response.json();
      setUser(data.user);
      localStorage.setItem('authUser', JSON.stringify(data.user));
      localStorage.setItem('authToken', data.token);
      return data.user;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const register = async (name, email, password, role = 'user', phone = '', dateOfBirth = '', city = '') => {
    try {
      setError(null);
      const payload = { name, email, password, role, phone, dateOfBirth, city };
      console.log('📤 AuthContext sending register payload:', payload);
      console.log('📤 JSON.stringify result:', JSON.stringify(payload));
      
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Registration failed with status ${response.status}`);
      }

      const data = await response.json();
      setUser(data.user);
      localStorage.setItem('authUser', JSON.stringify(data.user));
      localStorage.setItem('authToken', data.token);
      return data.user;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('authUser');
    localStorage.removeItem('authToken');
  };

  const isAdmin = () => {
    return user?.role === 'admin';
  };

  const isLoggedIn = () => {
    return user !== null;
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isAdmin, isLoggedIn, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
