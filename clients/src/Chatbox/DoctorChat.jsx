import React from "react";
import { useParams } from "react-router-dom";
import ChatBox from "./ChatBox";

const DoctorChat = () => {
  const { roomId } = useParams(); 

  return (
    <div className="flex flex-col md:flex-row h-screen">
      {/* Left side - Video Call Placeholder */}
      <div className="flex-1 bg-black flex items-center justify-center text-white">
        <p>🎥 Video Call Screen (under development)</p>
      </div>

      {/* Right side - Chat */}
      <div className="w-full md:w-96 border-l bg-white">
        <ChatBox roomId={roomId} sender="Doctor" />
      </div>
    </div>
  );
};

export default DoctorChat;
