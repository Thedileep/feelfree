import React from "react";
import { FaTrashAlt } from "react-icons/fa";
import axios from "axios";

const API = import.meta.env.VITE_API_URL;
const storedUser = JSON.parse(localStorage.getItem("user"));
  const userId = storedUser?._id; 

export default function MessageItem({ message, userId }) {
  const token = localStorage.getItem("token");

  if (message.deletedFor?.includes(userId)) return null;

  const isSender = message.sender?.toString() === userId;

  const deleteForMe = async () => {
    try {
      await axios.delete(`${API}/api/messages/${message._id}`, {
        headers: { Authorization: `Bearer ${token}` },
        data: { forEveryone: false },
      });
    } catch (err) {
      console.error(err);
    }
  };

  const deleteForEveryone = async () => {
    try {
      await axios.delete(`${API}/api/messages/${message._id}/clear`, {
        headers: { Authorization: `Bearer ${token}` },
        data: { forEveryone: true },
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div
      className={`flex ${isSender ? "justify-end" : "justify-start"} relative group`}
    >
      <div
        className={`max-w-[70%] p-3 rounded-lg break-words ${
          isSender ? "bg-green-200 rounded-br-none" : "bg-gray-200 rounded-bl-none"
        }`}
      >
        {message.text && <p>{message.text}</p>}
        {message.image && <img src={message.image} alt="sent" className="mt-1 rounded max-h-48" />}
        {message.audio && <audio controls src={message.audio} className="mt-1 w-full" />}
        {message.video && <video controls src={message.video} className="mt-1 w-full max-h-48" />}
      </div>

      {isSender && (
        <div className="absolute top-0 right-0 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={deleteForMe} className="p-1 text-gray-600 hover:text-red-600" title="Delete for me">
            <FaTrashAlt size={14} />
          </button>
          <button onClick={deleteForEveryone} className="p-1 text-gray-600 hover:text-red-600" title="Delete for everyone">
            <FaTrashAlt size={14} />
          </button>
        </div>
      )}
    </div>
  );
}
