import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer";

const MoodTracker = () => {
  const [moods, setMoods] = useState([]);
  const [filter, setFilter] = useState("week");
  const [selectedMood, setSelectedMood] = useState("");
  const [note, setNote] = useState("");
  const [searchMood, setSearchMood] = useState("");
  const [searchDate, setSearchDate] = useState("");

  // Get user from localStorage
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const userId = storedUser?._id;

  const moodOptions = [
    { label: "Happy", value: 5 },
    { label: "LowSad", value: 3 },
    { label: "Sad", value: 2 },
    { label: "Angry", value: 2 },
    { label: "Sick", value: 1 },
    { label: "Stress", value: 1 },
    { label: "Tension", value: 1 },
  ];

  // Fetch moods
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token || !userId) return;

    axios
      .get(`${import.meta.env.VITE_API_URL}/api/get-mood/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setMoods(res.data))
      .catch((err) => console.error("Error fetching moods:", err));
  }, [userId]);

  // Add new mood
  const handleAddMood = async () => {
    if (!selectedMood) return;
    const moodValue =
      moodOptions.find((m) => m.label === selectedMood)?.value || 3;

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please login again, no token found!");
        return;
      }

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/mood-track`,
        { userId, mood: selectedMood, moodValue, note },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMoods([res.data, ...moods]);
      setSelectedMood("");
      setNote("");
    } catch (err) {
      console.error("Error saving mood:", err.response?.data || err.message);
    }
  };

  // Filtering logic
  const getFilteredMoods = () => {
    let startDate;
    if (filter === "week")
      startDate = new Date(new Date().setDate(new Date().getDate() - 7));
    else if (filter === "month")
      startDate = new Date(new Date().setMonth(new Date().getMonth() - 1));
    else if (filter === "year")
      startDate = new Date(new Date().setFullYear(new Date().getFullYear() - 1));
    else startDate = new Date(0); // all

    return moods.filter((entry) => {
      const entryDate = new Date(entry.date);
      const matchDate = searchDate
        ? entryDate.toLocaleDateString() ===
          new Date(searchDate).toLocaleDateString()
        : true;
      const matchMood = searchMood
        ? entry.mood.toLowerCase().includes(searchMood.toLowerCase())
        : true;
      return entryDate >= startDate && matchDate && matchMood;
    });
  };

  const filteredMoods = getFilteredMoods();

  const moodDataForGraph = filteredMoods.map((entry) => ({
    date: new Date(entry.date).toLocaleDateString(),
    moodValue: entry.moodValue,
    mood: entry.mood,
  }));

  const avgMood =
    filteredMoods.reduce((sum, e) => sum + e.moodValue, 0) /
    (filteredMoods.length || 1);

  return (
    <>
      <Navbar />
      <div className="max-w-6xl mx-auto p-4">
        <h2 className="text-3xl font-extrabold mb-6 text-center text-indigo-700 tracking-wide">
          Mood Tracker
        </h2>

        {/* Mood Input */}
        <div className="flex flex-col md:flex-row gap-4 mb-8 justify-center items-center">
          <select
            value={selectedMood}
            onChange={(e) => setSelectedMood(e.target.value)}
            className="border px-4 py-2 rounded-lg"
          >
            <option value="">Select Mood</option>
            {moodOptions.map((m) => (
              <option key={m.label} value={m.label}>
                {m.label}
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Add a note..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="border px-4 py-2 rounded-lg flex-1"
          />

          <button
            onClick={handleAddMood}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg shadow-lg"
          >
            Save Mood
          </button>
        </div>

        {/* 🔎 Search + Date Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8 justify-center items-center">
          <input
            type="text"
            placeholder="Search Mood (Happy, Sad...)"
            value={searchMood}
            onChange={(e) => setSearchMood(e.target.value)}
            className="border px-4 py-2 rounded-lg"
          />

          <input
            type="date"
            value={searchDate}
            onChange={(e) => setSearchDate(e.target.value)}
            className="border px-4 py-2 rounded-lg"
          />

          <div className="flex gap-2">
            {["week", "month", "year", "all"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg ${
                  filter === f ? "bg-indigo-600 text-white" : "bg-gray-200"
                }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Graph */}
        <div className="bg-gradient-to-r from-indigo-50 to-white p-6 shadow-xl rounded-xl mb-8">
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={moodDataForGraph}>
              <CartesianGrid strokeDasharray="4 4" stroke="#d1d5db" />
              <XAxis dataKey="date" />
              <YAxis domain={[1, 5]} />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="moodValue"
                stroke="#6366f1"
                strokeWidth={3}
                dot={{ r: 6 }}
                activeDot={{ r: 10 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Average */}
        {filteredMoods.length > 0 && (
          <p className="text-center text-lg font-semibold text-gray-700 mb-6">
            <strong>Average Mood ({filter}):</strong> {avgMood.toFixed(2)} / 5
          </p>
        )}

        {/* Entries */}
        <div className="grid md:grid-cols-2 gap-6">
          {filteredMoods.map((entry) => (
            <div
              key={entry._id}
              className="p-4 bg-white shadow-md rounded-xl border"
            >
              <p>
                <strong>Date:</strong>{" "}
                {new Date(entry.date).toLocaleString()}
              </p>
              <p>
                <strong>Mood:</strong>{" "}
                <span className="text-indigo-600">{entry.mood}</span>
              </p>
              <p>
                <strong>Note:</strong> {entry.note}
              </p>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default MoodTracker;
