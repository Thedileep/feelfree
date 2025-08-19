import React from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import Home from "./homePages/Home";
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
import NotFound from "./components/NotFound";
import ProtectedDocRoute from "./components/Protected/protectedDocRoutes";
import TherapistDashboard from "./doctorPages/DashboardDoc";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import BookSchedule from "./Appointments/BookSchedule";
import DoctorList from "./Appointments/DoctorList";
import PaymentPage from "./Appointments/Payments";
import AboutUs from "./homePages/About";
import Pricing from "./homePages/Pricing";
import TermsConditions from "./homePages/TermsCondition";
import PrivacyPolicy from "./homePages/PrivacyPolicy";
import CancellationRefund from "./homePages/Refund";
import ContactUs from "./homePages/Contact";
import ScrollToTop from "./components/ScrollToTop";
import TrackAppointment from "./userPages/TrackAppointment";
import AppointmentsList from "./Appointments/AppointmentList";

function App() {
  return (
    <HashRouter>
    <ScrollToTop/>
     <ToastContainer position="top-center" autoClose={3000} />
      <Routes>
        <Route path="*" element={<NotFound/>}/>
       <Route path="/" element={<Home />} />
        <Route path="/login/user" element={<Login />} />
        <Route path="/register/user" element={<Register />} />
        <Route path="/register/therapist" element={<RegisterDoc />} />
        <Route path="/login/therapist" element={<LoginDoc />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/contact-us" element={<ContactUs />} />
        <Route path="/pricing" element={<Pricing/>} />
        <Route path='/terms-conditions' element={<TermsConditions/>}/>
        <Route path="/privacy-policy" element={<PrivacyPolicy/>}/>
        <Route path="/cancellation-refund" element={<CancellationRefund/>} />

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
          path="/select-doctor"
          element={
            <ProtectedRoute>
              <DoctorList />
            </ProtectedRoute>
          }
        />

        
         <Route
          path="/book-schedule"
          element={
            <ProtectedRoute>
              <BookSchedule />
            </ProtectedRoute>
          }
        />

        <Route
          path="/payment"
          element={
            <ProtectedRoute>
              <PaymentPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/track-appointment/:id"
          element={
            <ProtectedRoute>
              <TrackAppointment />
            </ProtectedRoute>
          }
        />

        <Route
          path="/appointments-list"
          element={
            <ProtectedRoute>
              <AppointmentsList />
            </ProtectedRoute>
          }
        />
          
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
    </HashRouter>
  );
}

export default App;
