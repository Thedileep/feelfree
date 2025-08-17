// 📁 client/src/pages/Dashboard.js
import React from "react";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer";
import DashboardCard from "../components/DashboardCard";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AppointmentsList from "../Appointments/AppointmentList";

const Dashboard = () => {
  const navigate = useNavigate();

  const handleFeatureClick = (feature) => {
    // You can route to other pages or modal logic
    alert(`You clicked: ${feature}`);
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-blue-50 p-6">
        <h2 className="text-3xl font-bold text-center mb-8 text-blue-700">
          Welcome to Your Dashboard
        </h2>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">

          <DashboardCard
            title="Mood Tracker"
            description="Track your daily emotions and understand patterns."
            icon="😊"
            onClick={() => navigate("/mood-tracker")}
          />

          <DashboardCard
            title="Book Scheduling"
            description="Book an appointment with a therapist."
            icon="📅"
            onClick={() => navigate("/select-doctor")}
          />

            <DashboardCard
            title="Appointments"
            description="View and track all your booked appointments."
            icon="🩺"
            onClick={() => navigate("/appointments-list")}
          />


          <DashboardCard
            title="Journal"
            description="Write and reflect your thoughts safely."
            icon="📖"
            onClick={() => navigate("/journal")}
          />

          

          <DashboardCard
            title="Community"
            description="Connect with others in a safe space."
            icon="👥"
            onClick={() => handleFeatureClick("Community")}
          />

         <DashboardCard
          title="AI Chat Support"
          description="Talk to our supportive AI companion."
          icon="🤖"
          onClick={() => navigate("/chat")}
        />

          <DashboardCard
            title="Music Zone"
            description="Relax with handpicked calming music."
            icon="🎵"
            onClick={() => handleFeatureClick("Music Zone")}
          />

          <DashboardCard
            title="Logout"
            description="Logout from your FeelFree account."
            icon="🚪"
            onClick={() => {
              localStorage.removeItem("token");
              toast.success('Successfully Logout',{autoclose:2000})
              navigate("/login/user");
            }}
          />
          
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Dashboard;
