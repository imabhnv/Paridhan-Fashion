import React, { createContext, useContext, useState, useEffect } from 'react';
import authService, { resolveRole } from '../services/auth';
import { isFirebaseConfigured, auth as firebaseAuth, onAuthStateChanged } from '../services/firebase';
import { getUserProfile } from '../services/userProfile';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ── Real Firebase auth state listener ──────────────────────
    if (isFirebaseConfigured && firebaseAuth) {
      const unsubscribe = onAuthStateChanged(firebaseAuth, async (firebaseUser) => {
        if (firebaseUser) {
          // Firebase user is logged in — fetch their Firestore profile
          try {
            const profile = await getUserProfile(firebaseUser.uid);
            if (profile) {
              // Always enforce admin whitelist — overrides any role stored in Firestore
              const safeRole = resolveRole(profile.email, profile.role);
              setUser({ ...profile, role: safeRole });
            } else {
              // Profile doesn't exist yet (e.g. during first signup flow)
              setUser({
                uid: firebaseUser.uid,
                email: firebaseUser.email,
                displayName: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
                photoURL: firebaseUser.photoURL || '',
                role: resolveRole(firebaseUser.email),
                provider: firebaseUser.providerData?.[0]?.providerId || 'email',
              });
            }
          } catch (err) {
            console.error('Failed to load user profile:', err);
            setUser(null);
          }
        } else {
          setUser(null);
        }
        setLoading(false);
      });
      return () => unsubscribe();
    }

    // ── Simulated Mode fallback ────────────────────────────────
    // No real Firebase → read from localStorage session
    const session = localStorage.getItem('paridhan_session');
    if (session) {
      try {
        setUser(JSON.parse(session));
      } catch {
        localStorage.removeItem('paridhan_session');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const loggedUser = await authService.login(email, password);
      if (!isFirebaseConfigured) setUser(loggedUser); // Firebase mode sets user via onAuthStateChanged
      return loggedUser;
    } finally {
      if (!isFirebaseConfigured) setLoading(false);
    }
  };

  const signup = async (email, password, displayName, role, extraDetails) => {
    setLoading(true);
    try {
      const newUser = await authService.signup(email, password, displayName, role, extraDetails);
      if (!isFirebaseConfigured) setUser(newUser);
      return newUser;
    } finally {
      if (!isFirebaseConfigured) setLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    setLoading(true);
    try {
      const loggedUser = await authService.loginWithGoogle();
      if (!isFirebaseConfigured) setUser(loggedUser);
      return loggedUser;
    } catch (err) {
      setLoading(false);
      throw err;
    } finally {
      // In Firebase mode, loading is cleared by onAuthStateChanged
      if (!isFirebaseConfigured) setLoading(false);
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
        // Merge the updates into the current user state
        const mergedUser = typeof updated === 'object'
          ? updated
          : { ...user, ...details };
        setUser(mergedUser);
        if (!isFirebaseConfigured) {
          localStorage.setItem('paridhan_session', JSON.stringify(mergedUser));
        }
      }
      return updated;
    } catch (err) {
      console.error('Failed to update profile:', err);
      throw err;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        signup,
        loginWithGoogle,
        logout,
        resetPassword,
        updateProfile,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
