import React from "react";

export default function MessageItem({ message }) {
  return (
    <div className={`flex ${message.sender === "patient" ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[70%] p-3 rounded-lg break-words ${
          message.sender === "patient"
            ? "bg-green-200 rounded-br-none"
            : "bg-gray-200 rounded-bl-none"
        }`}
      >
        {message.text && <p>{message.text}</p>}
        {message.image && <img src={message.image} alt="sent" className="mt-1 rounded max-h-48" />}
        {message.audio && <audio controls src={message.audio} className="mt-1 w-full" />}
        {message.video && <video controls src={message.video} className="mt-1 w-full max-h-48" />}
      </div>
    </div>
  );
}
