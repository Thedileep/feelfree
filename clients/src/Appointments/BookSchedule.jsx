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
  const [successMsg, setSuccessMsg] = useState("");
  const [bookedTimes, setBookedTimes] = useState([]);
  const navigate = useNavigate();

  // Generate all 30-min slots in a day (00:00 to 23:30)
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

  // Load selected doctor from localStorage
  useEffect(() => {
    const selectedDoc = localStorage.getItem("selectedDoctor");
    if (!selectedDoc) {
      navigate("/doctors");
    } else {
      setDoctor(JSON.parse(selectedDoc));
    }
  }, [navigate]);

  // Fetch booked times for doctor on selected date
  useEffect(() => {
    if (!date || !doctor) {
      setBookedTimes([]);
      return;
    }
    const fetchBookedTimes = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/bookings/times`,
          {
            params: {
              doctorId: doctor._id,
              date,
            },
          }
        );
        setBookedTimes(res.data.bookedTimes || []);
      } catch (error) {
        console.error("Failed to fetch booked times", error);
        setBookedTimes([]);
      }
    };
    fetchBookedTimes();
  }, [date, doctor]);

  // Validate selected date & time
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

  // Check availability from backend
  const checkAvailability = async () => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/check-availability`, {
        doctorId: doctor._id,
        date,
        time,
      });
  
      return res.data.available;
    } catch (err) {

      setErrorMsg("Error checking availability. Please try again.");
      return false;
    }
  };

  // Handle booking
 const handleBooking = async () => {
  setErrorMsg("");
  setSuccessMsg("");

  if (!validateDateTime()) return;

  setLoading(true);
  const available = await checkAvailability();

  if (!available) {
    setErrorMsg("Selected slot is not available. Please choose another time.");
    setLoading(false);
    return;
  }

  try {
    // Get userId from localStorage or context (adjust accordingly)
    const user = JSON.parse(localStorage.getItem("user")); 

    if (!user || !user._id) {
      setErrorMsg("User not logged in");
      setLoading(false);
      return;
    }

    const booking = await axios.post(`${import.meta.env.VITE_API_URL}/api/bookings`, {
      doctorId: doctor._id,
      date,
      time,
      userId: user._id,
      
    });
  
    setSuccessMsg("Booking successful! Redirecting to payment...");
    setTimeout(() => {
      navigate(`/payment/${booking.data._id}`,{
         state: {
          bookingId: booking.data._id,
          doctorId: doctor._id,
          date,
          time
        }
      });
    }, 1500);
  } catch (err) {
    console.error(err);
    setErrorMsg(err.response?.data?.message || "Booking failed. Please try again.");
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
          <label className="block mb-2 font-semibold text-gray-700" htmlFor="date">
            Select Date
          </label>
          <input
            type="date"
            id="date"
            className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            min={new Date().toISOString().split("T")[0]} 
          />
        </div>

        {/* Time Picker Dropdown */}
        <div className="mb-6">
          <label className="block mb-2 font-semibold text-gray-700" htmlFor="time">
            Select Time (30-minute slots)
          </label>
          <select
            id="time"
            className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          >
            <option value="">Select a time</option>
            {timeSlots.map((slot) => {
              // Disable booked times and past times if date is today
              const slotDateTime = new Date(`${date}T${slot}`);
              const now = new Date();

              const isBooked = bookedTimes.includes(slot);
              const isPastTime = date === new Date().toISOString().split("T")[0] && slotDateTime < now;

              return (
                <option
                  key={slot}
                  value={slot}
                  disabled={isBooked || isPastTime}
                  title={isBooked ? "Already booked" : isPastTime ? "Past time" : ""}
                >
                  {slot}
                </option>
              );
            })}
          </select>
        </div>

        {/* Error Message */}
        {errorMsg && (
          <p className="mb-4 text-red-600 font-semibold text-center">{errorMsg}</p>
        )}

        {/* Success Message */}
        {successMsg && (
          <p className="mb-4 text-green-600 font-semibold text-center">{successMsg}</p>
        )}

        <button
          onClick={handleBooking}
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
