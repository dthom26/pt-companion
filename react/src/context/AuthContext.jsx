import { createContext, useContext, useState, useEffect } from "react";
import { authAPI } from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on mount
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const response = await authAPI.getMe();
          setUser(response.data);
        } catch (error) {
          localStorage.removeItem("token");
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (credentials, role) => {
    try {
      const response =
        role === "trainer"
          ? await authAPI.loginTrainer(credentials)
          : await authAPI.loginClient(credentials);

      const { token, ...userData } = response.data;
      localStorage.setItem("token", token);
      setUser(userData);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Login failed",
      };
    }
  };

  const registerTrainer = async (data) => {
    try {
      const response = await authAPI.registerTrainer(data);
      const { token, ...userData } = response.data;
      localStorage.setItem("token", token);
      setUser(userData);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Registration failed",
      };
    }
  };

  const registerClient = async (data) => {
    try {
      const response = await authAPI.registerClient(data);
      const { token, ...userData } = response.data;
      localStorage.setItem("token", token);
      setUser(userData);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Registration failed",
      };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    registerTrainer,
    registerClient,
    logout,
    isTrainer: user?.role === "trainer",
    isClient: user?.role === "client",
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
