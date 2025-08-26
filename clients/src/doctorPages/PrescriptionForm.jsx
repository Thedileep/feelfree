import React, { useState } from "react";
import axios from "axios";

export default function PrescriptionForm({ booking }) {
  const [medicines, setMedicines] = useState([
    { name: "", dosage: "", frequency: "" },
  ]);
  const [notes, setNotes] = useState("");

  const handleChange = (index, field, value) => {
    const updated = [...medicines];
    updated[index][field] = value;
    setMedicines(updated);
  };

  const addMedicine = () => {
    setMedicines([...medicines, { name: "", dosage: "", frequency: "" }]);
  };

  const savePrescription = async () => {
    try {
      const token = localStorage.getItem("doctoken");
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/medicine/${booking._id}`,
        { medicines, notes, userId: booking.userId._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("✅ Prescription saved successfully!");
    } catch (err) {
      console.error(err);
      alert("❌ Failed to save prescription");
    }
  };

  return (
    <div className="bg-white shadow-xl rounded-2xl p-6 w-full max-w-3xl mx-auto">
      <h3 className="text-2xl font-bold text-green-700 mb-4 flex items-center justify-between">
        📝 Write Prescription
        <span className="text-sm text-gray-500 font-medium">
          Patient: {booking?.userId?.name}
        </span>
      </h3>

      <div className="space-y-4">
        {medicines.map((med, i) => (
          <div
            key={i}
            className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-gray-50 p-4 rounded-lg shadow-sm"
          >
            <input
              type="text"
              placeholder="Medicine Name"
              value={med.name}
              onChange={(e) => handleChange(i, "name", e.target.value)}
              className="border px-3 py-2 rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none"
            />
            <input
              type="text"
              placeholder="Dosage (e.g. 500mg)"
              value={med.dosage}
              onChange={(e) => handleChange(i, "dosage", e.target.value)}
              className="border px-3 py-2 rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none"
            />
            <input
              type="text"
              placeholder="Frequency (e.g. 2x/day)"
              value={med.frequency}
              onChange={(e) => handleChange(i, "frequency", e.target.value)}
              className="border px-3 py-2 rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none"
            />
          </div>
        ))}

        <button
          onClick={addMedicine}
          className="w-full sm:w-auto bg-gradient-to-r from-green-400 to-green-600 text-white px-4 py-2 rounded-xl shadow hover:opacity-90 transition"
        >
          ➕ Add Another Medicine
        </button>
      </div>

      <div className="mt-6">
        <label className="block text-gray-700 font-semibold mb-2">
          Additional Notes
        </label>
        <textarea
          placeholder="Write any special instructions..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={4}
          className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none"
        />
      </div>

      <button
        onClick={savePrescription}
        className="mt-6 w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl shadow-lg transition font-semibold"
      >
        💾 Save Prescription
      </button>
    </div>
  );
}
