import React, { useEffect, useState } from "react";
import Footer from "../components/Footer";
import SidebarDoc from "../components/Navbar/SidebarDoc";
import ProfilePage from "./Profile";
import PasswordChange from "./PasswordChange";
import Appointments from "./Appointment";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const DashboardDoc = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [selected, setSelected] = useState("appointments");
  const [loading, setLoading] = useState(true);
  const [therapist, setTherapist] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false); 

  useEffect(() => {
    const token = localStorage.getItem("doctoken");
    if (!token) {
      setAuthenticated(false);
      setLoading(false);
      return;
    }

    setAuthenticated(true);

    const fetchTherapist = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/therapist/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch therapist details");

        const data = await res.json();
        setTherapist(data);
      } catch (error) {
        console.error("Error fetching therapist:", error);
        toast.error("Failed to load profile data");
      } finally {
        setLoading(false);
      }
    };

    fetchTherapist();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("doctoken");
    toast.success("Successfully Logout", { autoClose: 2000 });
    setAuthenticated(false);
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  if (!authenticated) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
        <h2 className="text-3xl font-bold text-gray-700 mb-6">
          Please login or register to continue
        </h2>
        <div className="flex gap-4">
          <a href="/login/therapist" className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition">
            Login
          </a>
          <a href="/register/therapist" className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition">
            Register
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* ✅ Top User Info Bar */}
      {therapist && (
        <div className="bg-white shadow-md p-4 flex items-center justify-between">
          <div className="flex items-center">
            <img
              src={therapist.photoPath}
              alt="Therapist"
              className="w-12 h-12 rounded-full border-2 border-green-500 object-cover"
            />
            <div className="ml-3">
              <p className="text-lg font-semibold text-gray-800">{therapist.name}</p>
              <p className="text-sm text-gray-500">Therapist</p>
            </div>
          </div>

          {/* ✅ Mobile Menu Button */}
          <button
            className="sm:hidden bg-indigo-600 text-white px-3 py-2 rounded-lg hover:bg-indigo-700 transition"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            ☰
          </button>

          {/* ✅ Desktop Logout */}
          <button
            onClick={handleLogout}
            className="hidden sm:block bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
      )}

      <div className="flex flex-1">
        {/* ✅ Sidebar for Desktop */}
        <div className="hidden sm:block w-64 bg-white shadow-lg">
          <SidebarDoc selected={selected} setSelected={setSelected} handleLogout={handleLogout} />
        </div>

        {/* ✅ Sidebar Drawer for Mobile */}
       {sidebarOpen && (
  <div
    className="sm:hidden fixed inset-0 bg-white bg-opacity-40 z-50"
    onClick={() => setSidebarOpen(false)}  
  >
    <div
      className="bg-white w-120 max-w-full h-full shadow-lg p-4"
      onClick={(e) => e.stopPropagation()}  
    >
      <SidebarDoc selected={selected} setSelected={setSelected} handleLogout={handleLogout} />
    </div>
  </div>
)}


        {/* ✅ Main Content */}
        <div className="flex-1 p-4 sm:p-6 min-w-0 overflow-auto">
          <h1 className="text-3xl font-bold mb-6 text-center text-indigo-700">
            Therapist Dashboard
          </h1>

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
