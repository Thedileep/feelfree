import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import DashboardCard from "../components/DashboardCard";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const name = localStorage.getItem("userName");
    if (!name) {
      // If name is not found, redirect to login
      navigate("/login");
    } else {
      setUserName(name);
    }
  }, [navigate]);

  const handleFeatureClick = (feature) => {
    alert(`You clicked: ${feature}`);
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-blue-50 p-6">
        <h2 className="text-3xl font-bold text-center mb-8 text-blue-700">
          Welcome to FeelFree, {userName}! 💙
        </h2>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
          <DashboardCard
            title="Mood Tracker"
            description="Track your daily emotions and understand patterns."
            icon="😊"
            onClick={() => handleFeatureClick("Mood Tracker")}
          />
          <DashboardCard
            title="Journal"
            description="Write and reflect your thoughts safely."
            icon="📖"
            onClick={() => handleFeatureClick("Journal")}
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
            onClick={() => handleFeatureClick("AI Chat")}
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
              localStorage.removeItem("userName");
              navigate("/login");
            }}
          />
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Dashboard;
