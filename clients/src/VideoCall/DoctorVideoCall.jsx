import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import VideoCall from "./VideoCall";

export default function DoctorVideoCall() {
  const { id } = useParams(); 
  const navigate = useNavigate();

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-indigo-600">
          Doctor Video Consultation
        </h2>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-1 bg-gray-200 rounded hover:bg-gray-300"
        >
          Back
        </button>
      </div>

      {/* Video Call */}
      <div className="border rounded-lg shadow p-2">
        {/* ✅ FIX: pass bookingId not channelName */}
        <VideoCall bookingId={id} role="doctor" />
      </div>
    </div>
  );
}
