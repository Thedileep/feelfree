import React, { useState, useRef, useEffect } from "react";

export default function VideoCall({ booking }) {
  const [localStream, setLocalStream] = useState(null);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const [doctorStopped, setDoctorStopped] = useState(false);
  const [canStart, setCanStart] = useState(false);

  useEffect(() => {
    // 5 min before appointment start
    const checkStart = () => {
      const now = new Date();
      const appointmentTime = new Date(`${booking.date} ${booking.time}`);
      const diffMinutes = (appointmentTime - now) / 60000;
      setCanStart(diffMinutes <= 5 && diffMinutes > -60); // allow up to 1 hr after start
    };
    checkStart();
    const timer = setInterval(checkStart, 30000);
    return () => clearInterval(timer);
  }, [booking]);

  const startVideoChat = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setLocalStream(stream);
      if (localVideoRef.current) localVideoRef.current.srcObject = stream;
    } catch (err) {
      console.error("Error accessing camera/mic:", err);
    }
  };

  return (
    <div className="border rounded-lg p-4">
      <h2 className="font-semibold mb-2">Video Chat</h2>
      {doctorStopped ? (
        <p className="text-red-500">Doctor has ended the video call. You can still chat.</p>
      ) : (
        <>
          <video ref={localVideoRef} autoPlay muted className="border rounded-lg w-full h-40 bg-black" />
          <video ref={remoteVideoRef} autoPlay className="border rounded-lg w-full h-40 bg-black" />
          {canStart ? (
            <button
              onClick={startVideoChat}
              className="bg-green-600 text-white px-4 py-2 rounded mt-2"
            >
              Start Video
            </button>
          ) : (
            <p className="text-gray-500 mt-2">Video will be available 5 minutes before the appointment.</p>
          )}
        </>
      )}
    </div>
  );
}
