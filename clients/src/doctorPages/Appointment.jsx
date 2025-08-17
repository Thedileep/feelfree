import React, { useEffect, useState } from "react";

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
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
        <div className="overflow-x-auto">
          {/* Table for medium & large screens */}
          <table className="hidden md:table w-full border-collapse border rounded-lg overflow-hidden">
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

          {/* Cards for mobile screens */}
          <div className="md:hidden space-y-4">
            {appointments.map((appt) => (
              <div
                key={appt._id}
                className="border rounded-lg p-4 shadow-sm bg-gray-50"
              >
                <p className="text-sm font-semibold text-gray-700">
                  User: <span className="font-normal">{appt.userName}</span>
                </p>
                <p className="text-sm font-semibold text-gray-700">
                  Date: <span className="font-normal">{appt.date}</span>
                </p>
                <p className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  Status:
                  <span
                    className={`px-3 py-1 rounded-full text-white text-xs ${
                      appt.status === "approved"
                        ? "bg-green-500"
                        : "bg-yellow-500"
                    }`}
                  >
                    {appt.status}
                  </span>
                </p>
                {appt.status === "pending" && (
                  <button
                    onClick={() => approveAppointment(appt._id)}
                    className="mt-3 bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition text-sm"
                  >
                    Approve
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Appointments;
