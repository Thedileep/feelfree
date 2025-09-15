import React from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import AdminLogin from "./adminpages/AdminLogin";
import ProtectedAdmin from "./adminpages/ProtectedAdmin";
import AdminDashboard from "./adminpages/AdminDashboard";

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import UserAuditLogs from "./adminpages/UserAuditLog";
import DocAuditLog from "./adminpages/DocAuditLog"
import MedicinePage from "./adminpages/Medicine";
import PaymentsList from "./adminpages/PaymentList";

function App() {
  return (
    <HashRouter>
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

        <Route
          path="/admin/get-medicine"
          element={
            <ProtectedAdmin>
              <MedicinePage/>
            </ProtectedAdmin>
          }
        />

         <Route
          path="/admin/get-payments"
          element={
            <ProtectedAdmin>
              <PaymentsList/>
            </ProtectedAdmin>
          }
        />

       </Routes>
    </HashRouter>
  );
}

export default App;
