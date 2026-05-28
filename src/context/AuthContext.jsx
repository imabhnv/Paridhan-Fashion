import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/auth';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if session exists on boot
  useEffect(() => {
    const checkSession = async () => {
      const session = localStorage.getItem('paridhan_session');
      if (session) {
        try {
          setUser(JSON.parse(session));
        } catch (e) {
          localStorage.removeItem('paridhan_session');
        }
      }
      setLoading(false);
    };
    checkSession();
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const loggedUser = await authService.login(email, password);
      setUser(loggedUser);
      return loggedUser;
    } catch (err) {
      setLoading(false);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (email, password, displayName, role, extraDetails) => {
    setLoading(true);
    try {
      const newUser = await authService.signup(email, password, displayName, role, extraDetails);
      setUser(newUser);
      return newUser;
    } catch (err) {
      setLoading(false);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    setLoading(true);
    try {
      const loggedUser = await authService.loginWithGoogle();
      setUser(loggedUser);
      return loggedUser;
    } catch (err) {
      setLoading(false);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  const resetPassword = async (email) => {
    await authService.resetPassword(email);
  };

  const updateProfile = async (details) => {
    if (!user) return;
    try {
      const updated = await authService.updateProfile(user.uid, details);
      if (updated) {
        setUser(updated);
      }
      return updated;
    } catch (err) {
      console.error("Failed to update profile", err);
      throw err;
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      login, 
      signup, 
      loginWithGoogle, 
      logout, 
      resetPassword,
      updateProfile,
      isAuthenticated: !!user
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
