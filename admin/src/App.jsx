import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminLogin from "./adminpages/AdminLogin";
import ProtectedAdmin from "./adminpages/ProtectedAdmin";
import AdminDashboard from "./adminpages/AdminDashboard";

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import UserAuditLogs from "./adminpages/UserAuditLog";
import DocAuditLog from "./adminpages/DocAuditLog"

function App() {
  return (
    <BrowserRouter>
     <ToastContainer position="top-center" autoClose={3000} />
      <Routes>
        <Route path="/" element={<AdminLogin/>} />

        <Route
          path="/admin-dashboard"
          element={
            <ProtectedAdmin>
              <AdminDashboard/>
            </ProtectedAdmin>
          }
        />

        <Route
          path="/admin/audit-logs"
          element={
            <ProtectedAdmin>
              <UserAuditLogs/>
            </ProtectedAdmin>
          }
        />

        <Route
          path="/admin/doc-audit-logs"
          element={
            <ProtectedAdmin>
              <DocAuditLog/>
            </ProtectedAdmin>
          }
        />

       </Routes>
    </BrowserRouter>
  );
}

export default App;
