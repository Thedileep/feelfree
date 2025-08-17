import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { CalendarDays, Clock, User } from "lucide-react"; 
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer";

export default function AppointmentsList() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/bookings/user`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setAppointments(res.data || []);
      } catch (err) {
        console.error("Error fetching appointments:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <p className="text-gray-500 text-lg animate-pulse">
          Loading your appointments...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-1 max-w-6xl mx-auto w-full p-6 space-y-6">
        <h3 className="text-2xl sm:text-3xl font-bold text-blue-700 mb-6 text-center sm:text-left">
          Your Appointments
        </h3>

        {appointments.length === 0 ? (
          <p className="text-center text-gray-500 mt-6">
            No appointments booked yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {appointments.map((apt) => (
              <div
                key={apt._id}
                className="p-5 border rounded-xl shadow-md hover:shadow-xl bg-white transition cursor-pointer flex flex-col justify-between"
                onClick={() => {
                  if (apt.status === "confirmed") {
                    navigate(`/track-appointment/${apt._id}`);
                  } else if (apt.status === "pending") {
                    navigate(`/payment/${apt._id}`);
                  }
                }}
              >
                <div>
                  <h4 className="font-semibold text-lg flex items-center gap-2 text-gray-800">
                    <User className="w-5 h-5 text-blue-600" />
                    {apt.doctorId?.name || "Unknown Doctor"}
                  </h4>

                  <p className="text-gray-600 flex items-center gap-2 mt-2">
                    <CalendarDays className="w-4 h-4 text-gray-500" />
                    {apt.date}
                  </p>

                  <p className="text-gray-600 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    {apt.time}
                  </p>
                </div>

                <span
                  className={`inline-block mt-4 px-3 py-1 text-xs font-medium rounded-full self-start ${
                    apt.status === "confirmed"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {apt.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
