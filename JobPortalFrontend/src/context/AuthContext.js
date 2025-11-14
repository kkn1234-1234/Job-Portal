import React, { createContext, useContext, useEffect, useState } from "react";
import authService from "../api/authService";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      const savedUser = localStorage.getItem("user");

      if (token && savedUser) {
        try {
          const response = await authService.validateToken();
          if (response.valid && response.user) {
            setUser(response.user);
            localStorage.setItem("user", JSON.stringify(response.user));
            setIsAuthenticated(true);
          } else {
            authService.logout();
          }
        } catch (error) {
          console.error("Auth validation error:", error);
          authService.logout();
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email, password, role) => {
    try {
      const response = await authService.login(email, password, role);
      setUser(response.user);
      setIsAuthenticated(true);
      return { success: true, user: response.user };
    } catch (error) {
      console.error("Login error:", error);
      return {
        success: false,
        error: error.response?.data?.error || "Login failed"
      };
    }
  };

  const register = async (userData) => {
    try {
      const response = await authService.register(userData);
      setUser(response.user);
      setIsAuthenticated(true);
      return { success: true, user: response.user };
    } catch (error) {
      console.error("Registration error:", error);
      return {
        success: false,
        error: error.response?.data?.error || "Registration failed"
      };
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  const refreshProfile = async () => {
    try {
      const account = await authService.getProfile();
      setUser(account);
      return account;
    } catch (error) {
      console.error("Profile refresh error:", error);
      throw error;
    }
  };

  const updateApplicantProfile = async (profile) => {
    const account = await authService.updateApplicantProfile(profile);
    setUser(account);
    return account;
  };

  const updateEmployerProfile = async (profile) => {
    const account = await authService.updateEmployerProfile(profile);
    setUser(account);
    return account;
  };

  const changePassword = async (oldPassword, newPassword) => {
    try {
      return await authService.changePassword(oldPassword, newPassword);
    } catch (error) {
      console.error("Password change error:", error);
      throw error;
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    refreshProfile,
    updateApplicantProfile,
    updateEmployerProfile,
    changePassword
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
