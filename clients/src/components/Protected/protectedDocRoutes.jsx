import React from "react";

import { Navigate, useNavigate } from "react-router-dom";
import { useEffect } from "react";

const ProtectedDocRoute = ({ children }) => {
  const token = localStorage.getItem("doctoken");
  const loginTime = localStorage.getItem("doclogintime");
  const sessionTimeout = 60 * 60 * 1000; 
  const navigate = useNavigate();

  useEffect(() => {
    if (!token || !loginTime) return;

    const timePassed = Date.now() - parseInt(loginTime, 10);
    if (timePassed >= sessionTimeout) {
      localStorage.clear();
      navigate("/login/therapist");
    }

    const timer = setTimeout(() => {
      localStorage.clear();
      navigate("/login/therapist");
    }, sessionTimeout - timePassed);

    return () => clearTimeout(timer);
  }, [token, loginTime, navigate]);

  if (!token) {
    return <Navigate to="/login/therapist" />;
  }

  return children;
};

export default ProtectedDocRoute;
