import React, { useEffect, useState } from "react";
import axios from "axios";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

const MoodTracker = () => {
  const [moods, setMoods] = useState([]);

  useEffect(() => {
    const fetchMoods = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:4000/api/mood-tracker", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setMoods(res.data.moods);
      } catch (err) {
        console.error("Error fetching moods", err);
      }
    };

    fetchMoods();
  }, []);

  const moodDataForGraph = moods.map((entry) => ({
    date: new Date(entry.date).toLocaleDateString(),
    moodValue: entry.moodValue, // assume 1 to 5 scale
  }));

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4 text-center">Mood Tracker</h2>

      <div className="mb-8">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={moodDataForGraph}>
            <XAxis dataKey="date" />
            <YAxis domain={[1, 5]} />
            <Tooltip />
            <CartesianGrid stroke="#ccc" />
            <Line type="monotone" dataKey="moodValue" stroke="#4f46e5" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid gap-4">
        {moods.map((entry) => (
          <div key={entry._id} className="p-4 bg-white shadow-md rounded-xl">
            <p><strong>Date:</strong> {new Date(entry.date).toLocaleString()}</p>
            <p><strong>Mood:</strong> {entry.mood}</p>
            <p><strong>Note:</strong> {entry.note}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MoodTracker;
