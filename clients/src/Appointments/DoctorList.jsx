import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer";

export default function DoctorList() {
  const [doctors, setDoctors] = useState([]);
  const [search, setSearch] = useState("");
  const [sortOption, setSortOption] = useState("default");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/doctors`
        );

        const doctorData = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data.data)
          ? res.data.data
          : [];

        setDoctors(doctorData);
      } catch (err) {
        console.error("Error fetching doctors:", err);
        setDoctors([]);
      }
    };

    fetchDoctors();
  }, []);

  const selectDoctor = (doctor) => {
    localStorage.setItem("selectedDoctor", JSON.stringify(doctor));
    navigate("/book-schedule");
  };

  // Search + Sort doctors
  const filteredDoctors = doctors
    .filter((doc) =>
      [doc.name, doc.specialization]
        .join(" ")
        .toLowerCase()
        .includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sortOption === "rating") return (b.rating || 0) - (a.rating || 0);
      if (sortOption === "experience")
        return (b.experience || 0) - (a.experience || 0);
      return 0;
    });

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 py-10 px-6">
        <h2 className="text-3xl font-extrabold text-center mb-10 text-blue-700">
          Choose Your Doctor
        </h2>

        {/* Search & Sort Controls */}
        <div className="flex flex-col md:flex-row justify-center gap-4 mb-8">
          <input
            type="text"
            placeholder="Search doctor by name or specialization..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-1/2 border rounded-lg px-4 py-2 shadow-sm focus:ring focus:ring-blue-300"
          />
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="border rounded-lg px-4 py-2 shadow-sm focus:ring focus:ring-blue-300"
          >
            <option value="default">Sort By</option>
            <option value="rating">Highest Rating</option>
            <option value="experience">Highest Experience</option>
          </select>
        </div>

        {filteredDoctors.length === 0 ? (
          <p className="text-center text-gray-500 text-lg">
            No doctors match your search.
          </p>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
            {filteredDoctors.map((doc) => (
              <div
                key={doc._id}
                className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100"
              >
                {/* Doctor Photo */}
                <div className="w-48 h-48 mx-auto mt-4 overflow-hidden rounded-full border-4 border-blue-500">
                  <img
                    src={
                      doc.photoPath ||
                      "https://via.placeholder.com/150?text=No+Image"
                    }
                    alt={doc.name || "doctor photo"}
                    className="w-full h-full object-cover object-top"
                    loading="lazy"
                  />
                </div>

                {/* Doctor Info */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800">
                    {doc.name}
                  </h3>
                  <p className="text-sm text-gray-500 mb-2">
                    {doc.specialization || "Specialist"}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-semibold">Experience:</span>{" "}
                    {doc.experience || 0} years
                  </p>
                  <p className="text-gray-700 mb-3">
                    <span className="font-semibold">Rating:</span> ⭐{" "}
                    {doc.rating || 0} / 5
                  </p>

                  <button
                    onClick={() => selectDoctor(doc)}
                    className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-200"
                  >
                    Select Doctor
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}
