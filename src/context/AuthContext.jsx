import { createContext, useState, useContext, useEffect } from "react";
import * as userService from "../services/userService";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser && token) {
      setUser(JSON.parse(savedUser));
    } else {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      setToken(null);
      setUser(null);
    }
    setIsInitializing(false);
  }, [token]);

  const login = async (email, password) => {
    const result = await userService.login(email, password);
    if (result.success) {
      setUser(result.data.user);
      setToken(result.data.token);
      localStorage.setItem("user", JSON.stringify(result.data.user));
      localStorage.setItem("token", result.data.token);
      return { success: true };
    } else {
      return { success: false, error: result.error || "Login failed" };
    }
  };

  const signup = async (fullname, email, password) => {
    const result = await userService.signup(fullname, email, password);
    if (result.success) {
      setUser(result.data.user);
      setToken(result.data.token);
      localStorage.setItem("user", JSON.stringify(result.data.user));
      localStorage.setItem("token", result.data.token);
      return { success: true };
    } else {
      return { success: false, error: result.error || "Registration failed" };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  const updateUser = (updatedFields) => {
    setUser((prev) => {
      if (!prev) return null;
      const updated = { ...prev, ...updatedFields };
      localStorage.setItem("user", JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <AuthContext.Provider value={{ user, token, login, signup, logout, updateUser, isInitializing }}>
      {!isInitializing && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
