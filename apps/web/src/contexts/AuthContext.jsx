import React, { createContext, useContext, useState, useEffect } from 'react';
import pb from '@/lib/pocketbaseClient';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    if (pb.authStore.isValid) {
      setCurrentUser(pb.authStore.model);
    }
    setInitialLoading(false);

    const unsubscribe = pb.authStore.onChange((token, model) => {
      setCurrentUser(model);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    try {
      const authData = await pb.collection('users').authWithPassword(email, password, { $autoCancel: false });
      setCurrentUser(authData.record);
      return { success: true, user: authData.record };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const signup = async (email, password, name, institution, country) => {
    try {
      const data = {
        email,
        password,
        passwordConfirm: password,
        name,
        institution: institution || '',
        country: country || '',
        role: 'researcher'
      };
      
      const record = await pb.collection('users').create(data, { $autoCancel: false });
      
      await pb.collection('users').requestVerification(email, { $autoCancel: false });
      
      const authData = await pb.collection('users').authWithPassword(email, password, { $autoCancel: false });
      setCurrentUser(authData.record);
      
      return { success: true, user: authData.record };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    pb.authStore.clear();
    setCurrentUser(null);
  };

  const requestPasswordReset = async (email) => {
    try {
      await pb.collection('users').requestPasswordReset(email, { $autoCancel: false });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const updateProfile = async (userId, data) => {
    try {
      const updated = await pb.collection('users').update(userId, data, { $autoCancel: false });
      setCurrentUser(updated);
      return { success: true, user: updated };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const isAdmin = currentUser?.role === 'admin';
  const isAuthenticated = !!currentUser;

  const value = {
    currentUser,
    login,
    signup,
    logout,
    requestPasswordReset,
    updateProfile,
    isAdmin,
    isAuthenticated,
    initialLoading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};