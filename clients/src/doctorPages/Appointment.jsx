import React, { useEffect, useState } from "react";

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    // Simulate fetching from API
    setTimeout(() => {
      setAppointments([
        { _id: "1", userName: "John Doe", date: "2025-08-06", status: "pending" },
        { _id: "2", userName: "Jane Smith", date: "2025-08-07", status: "approved" },
      ]);
    }, 500);
  }, []);

  const approveAppointment = (id) => {
    setAppointments((prev) =>
      prev.map((appt) =>
        appt._id === id ? { ...appt, status: "approved" } : appt
      )
    );
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-2xl font-semibold text-indigo-600 mb-4">Appointments</h2>
      {appointments.length === 0 ? (
        <p className="text-gray-600">No appointments found.</p>
      ) : (
        <table className="w-full border-collapse border rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-indigo-100 text-indigo-800">
              <th className="p-3 border">User</th>
              <th className="p-3 border">Date</th>
              <th className="p-3 border">Status</th>
              <th className="p-3 border">Action</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appt) => (
              <tr key={appt._id} className="hover:bg-gray-100">
                <td className="p-3 border">{appt.userName}</td>
                <td className="p-3 border">{appt.date}</td>
                <td className="p-3 border">
                  <span
                    className={`px-3 py-1 rounded-full text-white ${
                      appt.status === "approved" ? "bg-green-500" : "bg-yellow-500"
                    }`}
                  >
                    {appt.status}
                  </span>
                </td>
                <td className="p-3 border">
                  {appt.status === "pending" && (
                    <button
                      onClick={() => approveAppointment(appt._id)}
                      className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700 transition"
                    >
                      Approve
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Appointments;
