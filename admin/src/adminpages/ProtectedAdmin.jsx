// components/ProtectedRoute.js
import { Navigate } from 'react-router-dom';
import React from "react";

const ProtectedAdmin = ({ children }) => {
  const token = localStorage.getItem('adminToken');
  return token ? children : <Navigate to="/admin-login" />;
};

export default ProtectedAdmin;
