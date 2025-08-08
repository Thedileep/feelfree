import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer";
import axios from "axios";

const Journal = () => {
  const [entry, setEntry] = useState("");
  const [savedEntries, setSavedEntries] = useState([]);

  const fetchEntries = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/journal-get`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSavedEntries(res.data.entries.reverse());
    } catch (err) {
      console.error("Error fetching journal entries", err);
    }
  };

  const handleSave = async () => {
    if (!entry.trim()) return;
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/journal-post`,
        { text: entry },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEntry("");
      fetchEntries(); 
    } catch (err) {
      console.error("Error saving journal entry", err);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-blue-50 p-6">
        <h2 className="text-3xl font-bold text-center text-blue-700 mb-6">Daily Journal</h2>
        
        <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow">
          <textarea
            rows="6"
            className="w-full p-3 border rounded mb-4"
            placeholder="Write your thoughts here..."
            value={entry}
            onChange={(e) => setEntry(e.target.value)}
          />
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            onClick={handleSave}
          >
            Save Entry
          </button>
        </div>

        <h3 className="text-2xl font-semibold mt-10 mb-4 text-blue-700 text-center">Previous Entries</h3>
        <div className="max-w-3xl mx-auto space-y-4">
          {savedEntries.length === 0 ? (
            <p className="text-center text-gray-600">No entries yet.</p>
          ) : (
            savedEntries.map((e, idx) => (
              <div key={idx} className="bg-white p-4 rounded shadow">
                <div className="text-sm text-gray-500 mb-2">{new Date(e.date).toLocaleString()}</div>
                <p className="text-gray-800 whitespace-pre-line">{e.text}</p>
              </div>
            ))
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Journal;
