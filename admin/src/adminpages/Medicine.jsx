import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL;

const MedicinePage = () => {
  const [medicines, setMedicines] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        const token = localStorage.getItem("adminToken");
        const res = await axios.get(`${API_BASE}/api/get-medicine`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = res.data.prescriptions || [];
        setMedicines(data);
        setFiltered(data);
      } catch (err) {
        console.error("Error fetching medicines:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMedicines();
  }, []);

  useEffect(() => {
    const lower = search.toLowerCase();
    setFiltered(
      medicines.filter(
        (item) =>
          item.doctorId?.name?.toLowerCase().includes(lower) ||
          item.userId?.name?.toLowerCase().includes(lower) ||
          item.medicines?.some((m) =>
            m.name?.toLowerCase().includes(lower)
          )
      )
    );
  }, [search, medicines]);

  if (loading) return <p className="text-center mt-5">Loading medicines...</p>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center text-indigo-600">
        Medicine Prescriptions
      </h1>

      {/* 🔍 Search Bar */}
      <div className="mb-6 flex justify-center">
        <input
          type="text"
          placeholder="Search by doctor, patient, or medicine..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-lg px-4 py-2 border rounded-xl shadow focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {filtered.length === 0 ? (
        <p className="text-center text-gray-500">No prescriptions found.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2">
          {filtered.map((item, idx) => (
            <div
              key={idx}
              className="bg-white shadow-lg rounded-2xl p-5 border hover:shadow-2xl transition transform hover:-translate-y-1"
            >
              <div className="mb-3">
                <p className="text-sm text-gray-500">Doctor</p>
                <p className="font-semibold">{item.doctorId?.name || "N/A"}</p>
              </div>

              <div className="mb-3">
                <p className="text-sm text-gray-500">Patient</p>
                <p className="font-semibold">{item.userId?.name || "N/A"}</p>
              </div>

              <div className="mb-3">
                <p className="text-sm text-gray-500">Booking</p>
                <p className="font-semibold">
                  {item.bookingId
                    ? `${item.bookingId.date} ${item.bookingId.time}`
                    : "N/A"}
                </p>
              </div>

              <div className="mb-3">
                <p className="text-sm text-gray-500">Created At</p>
                <p className="font-semibold">
                  {new Date(item.createdAt).toLocaleString()}
                </p>
              </div>

              <div className="mb-3">
                <p className="text-sm text-gray-500">Medicines</p>
                <ul className="list-disc ml-5 text-sm">
                  {item.medicines?.map((med, i) => (
                    <li key={i}>
                      <span className="font-semibold">{med.name}</span> -{" "}
                      {med.dosage} ({med.frequency})
                    </li>
                  ))}
                </ul>
              </div>

              {item.notes && (
                <div>
                  <p className="text-sm text-gray-500">Notes</p>
                  <p className="italic text-gray-700">{item.notes}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MedicinePage;
