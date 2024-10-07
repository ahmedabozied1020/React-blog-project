import React, { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userName = localStorage.getItem("userName");
    const userAvatar = localStorage.getItem("userAvatar");
    if (token && userName) {
      setUser({ name: userName, avatar: userAvatar });
    }
  }, []);

  const login = (userData) => {
    setUser({ name: userData.name, avatar: userData.avatar });
    localStorage.setItem("token", userData.token);
    localStorage.setItem("userName", userData.name);
    localStorage.setItem("userAvatar", userData.avatar);
  };

  const signup = (token, name, avatar) => {
    setUser({ name, avatar });
    localStorage.setItem("token", token);
    localStorage.setItem("userName", name);
    localStorage.setItem("userAvatar", avatar);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    localStorage.removeItem("userAvatar");
  };

  return <AuthContext.Provider value={{ user, login, signup, logout }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
