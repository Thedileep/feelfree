import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer";

export default function BookSchedule() {
  const [doctor, setDoctor] = useState(null);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [bookedTimes, setBookedTimes] = useState([]);
  const navigate = useNavigate();

  const token = localStorage.getItem("token"); 

  // Generate all 30-min slots in a day
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let min = 0; min < 60; min += 30) {
        const hh = hour.toString().padStart(2, "0");
        const mm = min.toString().padStart(2, "0");
        slots.push(`${hh}:${mm}`);
      }
    }
    return slots;
  };
  const timeSlots = generateTimeSlots();

  useEffect(() => {
    const selectedDoc = localStorage.getItem("selectedDoctor");
    if (!selectedDoc) {
      navigate("/doctors");
    } else {
      setDoctor(JSON.parse(selectedDoc));
    }
  }, [navigate]);

  // Fetch booked times
  useEffect(() => {
    if (!date || !doctor) {
      setBookedTimes([]);
      return;
    }
    const fetchBookedTimes = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/bookings/times`,
          { params: { doctorId: doctor._id, date } },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setBookedTimes(res.data.bookedTimes || []);
      } catch (error) {
        console.error("Failed to fetch booked times", error);
        setBookedTimes([]);
      }
    };
    fetchBookedTimes();
  }, [date, doctor]);

  // Validate slot
  const validateDateTime = () => {
    setErrorMsg("");
    if (!date) {
      setErrorMsg("Please select a date.");
      return false;
    }
    if (!time) {
      setErrorMsg("Please select a time.");
      return false;
    }
    const selectedDateTime = new Date(`${date}T${time}`);
    const now = new Date();
    if (selectedDateTime < now) {
      setErrorMsg("You cannot book for past date/time.");
      return false;
    }
    return true;
  };

  // Handle Next → Payment
  const proceedToPayment = async () => {
    if (!validateDateTime()) return;

    setLoading(true);
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/check-availability`, {
        doctorId: doctor._id,
        date,
        time
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );
      if (!res.data.available) {
        setErrorMsg("Selected slot is not available. Please choose another time.");
        setLoading(false);
        return;
      }

      // Save payment details for PaymentPage
      const bookingData = { doctorId: doctor._id, doctorName: doctor.name, date, time };
      localStorage.setItem("pendingBooking", JSON.stringify(bookingData));

     navigate("/payment", {
    state: {
    doctorId: doctor._id,
    name: doctor.name,
    date,
    time
  }
});

    } catch (err) {
      setErrorMsg("Error checking availability. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!doctor) return null;

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 py-10 px-6 max-w-xl mx-auto rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold mb-8 text-center text-blue-700">
          Book Appointment with {doctor.name}
        </h2>

        {/* Date Picker */}
        <div className="mb-6">
          <label className="block mb-2 font-semibold text-gray-700">Select Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            min={new Date().toISOString().split("T")[0]}
            className="w-full border border-gray-300 rounded px-4 py-2"
          />
        </div>

        {/* Time Picker */}
        <div className="mb-6">
          <label className="block mb-2 font-semibold text-gray-700">Select Time</label>
          <select
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-full border border-gray-300 rounded px-4 py-2"
          >
            <option value="">Select a time</option>
            {timeSlots.map((slot) => {
              const slotDateTime = new Date(`${date}T${slot}`);
              const now = new Date();
              const isBooked = bookedTimes.includes(slot);
              const isPastTime = date === new Date().toISOString().split("T")[0] && slotDateTime < now;
              return (
                <option key={slot} value={slot} disabled={isBooked || isPastTime}>
                  {slot}
                </option>
              );
            })}
          </select>
        </div>

        {errorMsg && <p className="mb-4 text-red-600 font-semibold text-center">{errorMsg}</p>}

        <button
          onClick={proceedToPayment}
          disabled={loading}
          className={`w-full py-3 font-semibold text-white rounded-lg transition ${
            loading ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {loading ? "Checking..." : "Proceed to Payment"}
        </button>
      </div>
      <Footer />
    </>
  );
}
