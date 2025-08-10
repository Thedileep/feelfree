// ProtectedUserRoute.js
import React from "react";

import { Navigate, useNavigate } from "react-router-dom";
import { useEffect } from "react";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const loginTime = localStorage.getItem("logintime");
  const sessionTimeout = 60 * 60 * 1000; 
  const navigate = useNavigate();

  useEffect(() => {
    if (!token || !loginTime) return;

    const timePassed = Date.now() - parseInt(loginTime, 10);
    if (timePassed >= sessionTimeout) {
      localStorage.removeItem("token");
      localStorage.removeItem("logintime");
      navigate("/login/user");
    }

    const timer = setTimeout(() => {
      localStorage.removeItem("token");
      localStorage.removeItem("logintime");
      navigate("/login/user");
    }, sessionTimeout - timePassed);

    return () => clearTimeout(timer);
  }, [token, loginTime, navigate]);

  if (!token) {
    return <Navigate to="/login/user" />;
  }

  return children;
};

export default ProtectedRoute;
