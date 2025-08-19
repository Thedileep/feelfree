import React, { useState } from "react";
import { FaPaperPlane, FaSmile, FaPaperclip, FaCamera, FaMicrophone } from "react-icons/fa";
import EmojiPicker from "emoji-picker-react";
import { sendMediaHelper, startRecording, capturePhoto } from "./mediaUtils";
import axios from "axios";

const API = import.meta.env.VITE_API_URL;
const userId = localStorage.getItem("userId");

export default function MessageInput({ bookingId, socket, setMessages, scrollToBottom }) {
  const [newMessage, setNewMessage] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const [uploading, setUploading] = useState(false);

  const sendMessage = async () => {
    if (!newMessage.trim()) return;
    const msg = { text: newMessage, sender: userId };
    socket.emit("message", msg);
    setMessages((prev) => [...prev, msg]);
    setNewMessage("");
    scrollToBottom();

    try {
      const token = localStorage.getItem("token");
      await axios.post(`${API}/api/messages/${bookingId}`, msg, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  const sendMedia = async (file, filename) => {
    await sendMediaHelper(file, filename, bookingId, setMessages, scrollToBottom, setUploading);
  };

  return (
    <>
      {/* Emoji Picker */}
      {showEmoji && (
        <div className="absolute bottom-20 left-4 z-50">
          <EmojiPicker onEmojiClick={(emoji) => setNewMessage((prev) => prev + emoji.emoji)} />
          <button onClick={() => setShowEmoji(false)} className="mt-2 px-2 py-1 bg-gray-200 rounded hover:bg-gray-300">
            Close
          </button>
        </div>
      )}

      {/* Input & Buttons */}
      <div className="flex items-center p-2 border-t space-x-2 bg-white">
        {/* Emoji */}
        <button onClick={() => setShowEmoji(!showEmoji)} className="p-2 rounded-full hover:bg-gray-200 transition">
          <FaSmile size={20} />
        </button>

        {/* Text Input */}
        <input
          type="text"
          placeholder="Type a message..."
          className="flex-1 border rounded-full px-4 py-2 focus:outline-none"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />

        {/* File Upload */}
        <label className="p-2 rounded-full hover:bg-gray-200 transition cursor-pointer">
          <FaPaperclip size={20} />
          <input
            type="file"
            className="hidden"
            accept="image/*,audio/*,video/*"
            onChange={(e) => sendMedia(e.target.files[0])}
          />
        </label>

        {/* Camera Photo */}
        <button onClick={() => capturePhoto(sendMedia)} className="p-2 rounded-full hover:bg-gray-200 transition">
          <FaCamera size={20} />
        </button>

        {/* Voice Record */}
        <button onClick={() => startRecording(sendMedia)} className="p-2 rounded-full hover:bg-gray-200 transition">
          <FaMicrophone size={20} />
        </button>

        {/* Send Message */}
        <button
          onClick={sendMessage}
          disabled={uploading}
          className={`p-2 rounded-full transition ${uploading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"} text-white`}
        >
          <FaPaperPlane size={20} />
        </button>
      </div>
    </>
  );
}
