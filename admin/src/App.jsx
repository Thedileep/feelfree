import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminLogin from "./adminpages/AdminLogin";
import ProtectedAdmin from "./adminpages/ProtectedAdmin";
import AdminDashboard from "./adminpages/AdminDashboard";

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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

       </Routes>
    </BrowserRouter>
  );
}

export default App;
