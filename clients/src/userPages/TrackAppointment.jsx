import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import AppointmentInfo from "../Appointments/Appointmentinfo";
import ChatBox from "../Chatbox/ChatBox";
import VideoCall from "../VideoCall/VideoCall";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer";

export default function TrackAppointment() {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("chat"); 

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/bookings/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setBooking(res.data);
      } catch (err) {
        console.error("Error fetching booking:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBooking();
  }, [id]);

  if (loading)
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <p className="text-gray-500 text-lg animate-pulse">
          Loading appointment...
        </p>
      </div>
    );

  if (!booking)
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <p className="text-red-500 text-lg">Appointment not found</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-6xl mx-auto w-full p-6 space-y-6">
        {/* Appointment Info */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <AppointmentInfo booking={booking} />
        </div>

        {/* Tab Switcher */}
        <div className="flex justify-center gap-4">
          <button
            onClick={() => setActiveTab("chat")}
            className={`px-4 py-2 rounded-lg font-medium ${
              activeTab === "chat"
                ? "bg-blue-600 text-white shadow-md"
                : "bg-white border text-gray-700"
            }`}
          >
            Chat
          </button>
          <button
            onClick={() => setActiveTab("video")}
            className={`px-4 py-2 rounded-lg font-medium ${
              activeTab === "video"
                ? "bg-blue-600 text-white shadow-md"
                : "bg-white border text-gray-700"
            }`}
          >
            Video Call
          </button>
        </div>

        {/* Content Section */}
       <div className="bg-white rounded-xl shadow-lg p-4 flex-1">
        {activeTab === "chat" ? (
          <ChatBox bookingId={id} />
        ) : (
          <VideoCall bookingId={id} role="user" />
        )}
      </div>

      </main>

      <Footer />
    </div>
  );
}
