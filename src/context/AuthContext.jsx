import { createContext, useState, useContext, useEffect } from "react";

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
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (response.ok && result.status === "success") {
        setUser(result.data.user);
        setToken(result.data.token);
        localStorage.setItem("user", JSON.stringify(result.data.user));
        localStorage.setItem("token", result.data.token);
        return { success: true };
      } else {
        return { success: false, error: result.message || "Login failed" };
      }
    } catch (err) {
      console.error("Login API Error:", err);
      return { success: false, error: "Network error, please try again" };
    }
  };

  const signup = async (fullname, email, password) => {
    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullname, email, password }),
      });

      const result = await response.json();

      if (response.ok && result.status === "success") {
        setUser(result.data.user);
        setToken(result.data.token);
        localStorage.setItem("user", JSON.stringify(result.data.user));
        localStorage.setItem("token", result.data.token);
        return { success: true };
      } else {
        return { success: false, error: result.message || "Registration failed" };
      }
    } catch (err) {
      console.error("Signup API Error:", err);
      return { success: false, error: "Network error, please try again" };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, signup, logout, isInitializing }}>
      {!isInitializing && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
