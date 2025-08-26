import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import ChatBox from "../Chatbox/ChatBox"
import VideoCall from "../VideoCall/VideoCall";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer";
import PrescriptionForm from "./PrescriptionForm";

export default function DoctorUserInteraction() {
  const { id } = useParams(); 
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("chat"); 

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const token = localStorage.getItem("doctoken");
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

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <p className="text-gray-500 text-lg animate-pulse">
          Loading appointment...
        </p>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <p className="text-red-500 text-lg">Appointment not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-6xl mx-auto w-full p-6 space-y-6">
        {/* Booking Details */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold text-indigo-700">Appointment Details</h2>
          <p><strong>Patient:</strong> {booking.userId?.name}</p>
          <p><strong>Date:</strong> {booking.date}</p>
          <p><strong>Time:</strong> {booking.time}</p>
          <p><strong>Status:</strong> {booking.status || "confirmed"}</p>
        </div>

        {/* Tabs */}
       {/* Tabs */}
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
  <button
    onClick={() => setActiveTab("prescription")}
    className={`px-4 py-2 rounded-lg font-medium ${
      activeTab === "prescription"
        ? "bg-green-600 text-white shadow-md"
        : "bg-white border text-gray-700"
    }`}
  >
    Prescription
  </button>
</div>


        {/* Content */}
        <div className="bg-white rounded-xl shadow-lg p-4 flex-1">
          {activeTab === "chat" ? (
            <ChatBox roomId={id} sender="Doctor" />
            ) : activeTab === "video" ? (
            <VideoCall bookingId={id} role="doctor" />
            ) : (
            <PrescriptionForm booking={booking} />
            )}

        </div>
      </main>

      <Footer />
    </div>
  );
}
