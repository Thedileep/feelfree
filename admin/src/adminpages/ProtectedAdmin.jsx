// components/ProtectedAdmin.js
import React, { useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";

const ProtectedAdmin = ({ children }) => {
  const token = localStorage.getItem("adminToken");
  const loginTime = localStorage.getItem("adminLoginTime");
  const sessionTimeout = 60 * 60 * 1000; 
  const navigate = useNavigate();

  useEffect(() => {
    if (!token || !loginTime) return;

    const timePassed = Date.now() - parseInt(loginTime, 10);
    if (timePassed >= sessionTimeout) {
      localStorage.removeItem("adminToken");
      localStorage.removeItem("adminLoginTime");
      navigate("/admin-login");
    }

    const timer = setTimeout(() => {
      localStorage.removeItem("adminToken");
      localStorage.removeItem("adminLoginTime");
      navigate("/admin-login");
    }, sessionTimeout - timePassed);

    return () => clearTimeout(timer);
  }, [token, loginTime, navigate]);

  if (!token) {
    return <Navigate to="/admin-login" />;
  }

  return children;
};

export default ProtectedAdmin;
