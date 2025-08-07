import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./userPages/Home";
import Login from "./userPages/Login";
import Register from "./userPages/Register";
import Dashboard from "./userPages/Dashboard";
import Features from "./userPages/Features";
import ProtectedRoute from "./components/Protected/protectedRoute"; 
import ChatAI from "./userPages/chatAI";
import Journal from "./userPages/Journal";
import MoodTracker from "./userPages/MoodTracker";
import RegisterDoc from "./doctorPages/RegisterDoc";
import LoginDoc from "./doctorPages/LoginDoc";
import AdminLogin from "./adminpages/AdminLogin";
import ProtectedAdmin from "./components/Protected/ProtectedAdmin";
import AdminDashboard from "./adminpages/AdminDashboard";
import NotFound from "./components/NotFound";
import ProtectedDocRoute from "./components/Protected/protectedDocRoutes";
import TherapistDashboard from "./doctorPages/DashboardDoc";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <BrowserRouter>
     <ToastContainer position="top-center" autoClose={3000} />
      <Routes>
        <Route path="*" element={<NotFound/>}/>
       <Route path="/" element={<Home />} />
        <Route path="/admin-login" element={<AdminLogin/>} />
        <Route path="/login/user" element={<Login />} />
        <Route path="/register/user" element={<Register />} />
        <Route path="/register/therapist" element={<RegisterDoc />} />
        <Route path="/login/therapist" element={<LoginDoc />} />
        
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedAdmin>
              <AdminDashboard/>
            </ProtectedAdmin>
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route path="/features"
         element={
          <ProtectedRoute>
         <Features />
         </ProtectedRoute>
         } />
       
        <Route
          path="/chat"
          element={
            <ProtectedRoute>
              <ChatAI />
            </ProtectedRoute>
          }
        />

          <Route
          path="/journal"
          element={
            <ProtectedRoute>
              <Journal />
            </ProtectedRoute>
          }
        />

        <Route
          path="/mood-tracker"
          element={
            <ProtectedRoute>
              <MoodTracker />
            </ProtectedRoute>
          }
        />

           <Route
          path="/therapist-dashboard"
          element={
            <ProtectedDocRoute>
              <TherapistDashboard />
            </ProtectedDocRoute>
          }
        />

       </Routes>
    </BrowserRouter>
  );
}

export default App;
