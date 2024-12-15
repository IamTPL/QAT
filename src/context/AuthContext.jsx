import React, { createContext, useContext, useEffect, useState } from "react";
import LoginService from "../services/api.login.service";
import AuthenticationService from "../services/api.authentication.service";
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({
    isAuthenticated: false,
    role: "",
    token: "",
    userInfo: null,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      let authToken = localStorage.getItem("authToken");
      if (authToken) {
        authToken = JSON.parse(authToken);
        try {
          setUser({
            isAuthenticated: true,
            role: authToken.role,
            token: authToken.token,
            userInfo: authToken.userInfo,
          });
          setLoading(false);
        } catch (error) {
          console.error("Error during initialization:", error);
        }
      } else {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email, password) => {
    try {
      let resData = {
        isAuthenticated: false,
        role: "",
        token: "",
        userInfo: null,
      };
      const response = await LoginService.login(email, password);

      if (response.data) {
        resData.isAuthenticated = true;
        resData.token = response.data.token;
        resData.userInfo = {
          fullName: response.data.username,
        };
        if (response.data.is_admin) {
          resData.role = "admin";
        } else {
          resData.role = "user";
        }
        setUser(resData);
      }

      localStorage.setItem("authToken", JSON.stringify(resData));
      return { success: true, role: resData.role };
    } catch (error) {
      console.error("Login failed:", error);
      return {
        success: false,
        message:
          error.response?.data?.message == "Account is not active"
            ? "Your account is currently locked! Please contact administrators for assistance"
            : "Incorrect email or password",
      };
    }
  };

  const logout = async () => {
    setUser({
      isAuthenticated: false,
      role: "",
      token: "",
      userInfo: null,
    });
    try {
      await AuthenticationService.logout();
      localStorage.removeItem("authToken");
    } catch (error) {
      console.error("Error during logout:", error);
      localStorage.removeItem("authToken");
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
