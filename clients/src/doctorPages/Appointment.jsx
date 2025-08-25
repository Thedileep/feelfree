import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const token = localStorage.getItem("doctoken");
        const storedDoctor = JSON.parse(localStorage.getItem("doctor"));
        const doctorId = storedDoctor?._id;

        if (!doctorId) return;

        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/doctor/${doctorId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const sortedAppointments = (res.data || []).sort((a, b) => {
          const dateA = new Date(`${a.date}T${a.time}`);
          const dateB = new Date(`${b.date}T${b.time}`);
          return dateA - dateB;
        });

        setAppointments(sortedAppointments);
      } catch (err) {
        console.error("Error fetching appointments:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  // 🔹 Navigate to VideoCall page
  const joinMeeting = (appt) => {
    navigate(`/doctor/call/${appt._id}`);
  };

  if (loading) {
    return <p className="text-center text-gray-500">Loading appointments...</p>;
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-2xl font-semibold text-indigo-600 mb-4">
        Appointments
      </h2>

      {appointments.length === 0 ? (
        <p className="text-gray-600">No appointments found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="hidden md:table w-full border-collapse border rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-indigo-100 text-indigo-800">
                <th className="p-3 border">User</th>
                <th className="p-3 border">Date</th>
                <th className="p-3 border">Time</th>
                <th className="p-3 border">Status</th>
                <th className="p-3 border">Action</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appt) => (
                <tr key={appt._id} className="hover:bg-gray-100">
                  <td className="p-3 border">{appt.userId?.name || "Unknown"}</td>
                  <td className="p-3 border">{appt.date}</td>
                  <td className="p-3 border">{appt.time}</td>
                  <td className="p-3 border">
                    <span className="px-3 py-1 rounded-full text-white bg-green-500">
                      {appt.status || "confirmed"}
                    </span>
                  </td>
                  <td className="p-3 border">
                    <button
                      onClick={() => joinMeeting(appt)}
                      className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 transition"
                    >
                      Start / Join
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Mobile UI */}
          <div className="md:hidden space-y-4">
            {appointments.map((appt) => (
              <div key={appt._id} className="border rounded-lg p-4 shadow-sm bg-gray-50">
                <p>User: {appt.userId?.name}</p>
                <p>Date: {appt.date}</p>
                <p>Time: {appt.time}</p>
                <p>Status: {appt.status || "confirmed"}</p>
                <button
                  onClick={() => joinMeeting(appt)}
                  className="mt-3 bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition text-sm w-full"
                >
                  Start / Join
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Appointments;
