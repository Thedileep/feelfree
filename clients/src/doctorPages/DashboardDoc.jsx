import React, { useEffect, useState } from "react";
import Footer from "../components/Footer";
import SidebarDoc from "../components/Navbar/SidebarDoc";
import ProfilePage from "./Profile";        
import PasswordChange from "./PasswordChange"; 
import Appointments from "./Appointment";   
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const DashboardDoc = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [selected, setSelected] = useState("appointments");
  const [loading, setLoading] = useState(true);

  // Check authentication
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setAuthenticated(false);
    } else {
      setAuthenticated(true);
    }
    setLoading(false); 
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.success('Successfully Logout',{autoclose:2000})
    setAuthenticated(false);
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  // Show login/register options if not authenticated
  if (!authenticated) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
        <h2 className="text-3xl font-bold text-gray-700 mb-6">
          Please login or register to continue
        </h2>
        <div className="flex gap-4">
          <a
            href="/login/therapist"
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            Login
          </a>
          <a
            href="/register/therapist"
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
          >
            Register
          </a>
        </div>
      </div>
    );
  }

  // Dashboard view when authenticated
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <div className="flex flex-1">
        <SidebarDoc selected={selected} setSelected={setSelected} handleLogout={handleLogout} />
        <div className="flex-1 p-6">
          <h1 className="text-4xl font-bold mb-8 text-center text-indigo-700">Therapist Dashboard</h1>

          {selected === "appointments" && <Appointments />}
          {selected === "profile" && <ProfilePage />}
          {selected === "password" && <PasswordChange />}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default DashboardDoc;
