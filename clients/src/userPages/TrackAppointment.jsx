// TrackAppointment.jsx
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
  const [prescription, setPrescription] = useState(null);
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

        // fetch prescription
        const presRes = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/get-medicine/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setPrescription(presRes.data);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBooking();
  }, [id]);

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

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

  // 🟢 Remove duplicate medicines (based on name)
  const uniqueMedicines =
    prescription?.medicines?.filter(
      (med, index, self) =>
        index === self.findIndex((m) => m.name.toLowerCase() === med.name.toLowerCase())
    ) || [];

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
          {["chat", "video", "prescription"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                activeTab === tab
                  ? tab === "prescription"
                    ? "bg-green-600 text-white shadow-md"
                    : "bg-blue-600 text-white shadow-md"
                  : "bg-white border text-gray-700"
              }`}
            >
              {tab === "chat"
                ? "Chat"
                : tab === "video"
                ? "Video Call"
                : "Prescription"}
            </button>
          ))}
        </div>

        {/* Content Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 flex-1">
          {activeTab === "chat" ? (
            <ChatBox roomId={id} sender="User" />
          ) : activeTab === "video" ? (
            <VideoCall bookingId={id} role="user" />
          ) : (
            <div>
              <h3 className="text-2xl font-bold text-green-700 mb-4 flex items-center gap-2">
                📝 Doctor Prescription
              </h3>

              {prescription ? (
                <div className="space-y-6">
                  {/* Date */}
                  <p className="text-sm text-gray-500">
                    Issued on:{" "}
                    <span className="font-medium text-gray-700">
                      {formatDate(prescription.createdAt)}
                    </span>
                  </p>

                  {/* Medicines */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800 mb-3">
                      Medicines
                    </h4>
                    <div className="grid gap-3">
                      {uniqueMedicines.map((med, i) => (
                        <div
                          key={i}
                          className="p-4 bg-gradient-to-r from-green-50 to-white border rounded-xl shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between"
                        >
                          <div>
                            <p className="font-semibold text-gray-900">
                              {med.name}
                            </p>
                            <p className="text-sm text-gray-600">
                              Dosage: {med.dosage} | Frequency: {med.frequency}
                            </p>
                          </div>
                          <span className="mt-2 sm:mt-0 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                            {med.frequency}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Notes */}
                  {prescription.notes && (
                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg">
                      <h4 className="font-semibold text-yellow-700">
                        Doctor's Notes
                      </h4>
                      <p className="text-gray-700 mt-1">{prescription.notes}</p>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-gray-500">No prescription available yet.</p>
              )}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
