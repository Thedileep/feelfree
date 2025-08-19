import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import AppointmentInfo from "../Appointments/Appointmentinfo";
import ChatBox from "../Chatbox/ChatBox";
import VideoCall from "../Appointments/VideoCall";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer";

export default function TrackAppointment() {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

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
        <p className="text-gray-500 text-lg animate-pulse">Loading appointment...</p>
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
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <AppointmentInfo booking={booking} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-4 rounded-xl shadow-md">
            <ChatBox bookingId={id} />
          </div>
          <div className="bg-white p-4 rounded-xl shadow-md">
            <VideoCall booking={booking} />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
