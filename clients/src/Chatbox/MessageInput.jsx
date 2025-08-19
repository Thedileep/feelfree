import React, { useState, useRef } from "react";
import { FaPaperPlane, FaSmile, FaPaperclip, FaCamera, FaMicrophone } from "react-icons/fa";
import EmojiPicker from "emoji-picker-react";
import { sendMediaHelper } from "./Mediautils";
import axios from "axios";

const API = import.meta.env.VITE_API_URL;
const storedUser = JSON.parse(localStorage.getItem("user"));
const userId = storedUser?._id; 

export default function MessageInput({ bookingId, socket, setMessages, scrollToBottom }) {
  const [newMessage, setNewMessage] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Camera
  const [showCamera, setShowCamera] = useState(false);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  // Audio
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  // Send text message
  const sendMessage = async () => {
  if (!newMessage.trim()) return;

  // Temporary ID for optimistic rendering
  const tempId = Date.now().toString();
  const msg = { _id: tempId, text: newMessage, sender: userId, createdAt: new Date().toISOString() };

  // Optimistically update UI
  setMessages((prev) => [...prev, msg]);
  setNewMessage("");
  scrollToBottom();

  try {
    const token = localStorage.getItem("token");
    const res = await axios.post(`${API}/api/messages/${bookingId}`, msg, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const savedMsg = res.data; 

    // Replace temporary message with server message
    setMessages((prev) =>
      prev.map((m) => (m._id === tempId ? savedMsg : m))
    );
  } catch (err) {
    console.error("Error sending message:", err);
    // Optional: remove temp message on error
    setMessages((prev) => prev.filter((m) => m._id !== tempId));
  }
};


  // Send media (photo/audio/file)
  const sendMedia = async (file, filename) => {
    await sendMediaHelper(file, filename, bookingId, setMessages, scrollToBottom, setUploading);
  };

  // Camera functions
  const openCamera = async () => {
    setShowCamera(true); // show video element
    await new Promise((resolve) => setTimeout(resolve, 100)); // wait for render

    if (!videoRef.current) {
      console.error("Video element not ready");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
      await videoRef.current.play();
      streamRef.current = stream;
    } catch (err) {
      console.error("Camera error:", err);
    }
  };

  const closeCamera = () => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    setShowCamera(false);
  };

  // Audio functions
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (e) => audioChunksRef.current.push(e.data);
      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: "audio/mp3" });
        sendMedia(blob, "audio.mp3");
        stream.getTracks().forEach((track) => track.stop());
        setIsRecording(false);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Audio recording error:", err);
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
  };

  return (
    <>
      {/* Emoji Picker */}
      {showEmoji && (
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-50">
          <EmojiPicker onEmojiClick={(emoji) => setNewMessage((prev) => prev + emoji.emoji)} />
          <button
            onClick={() => setShowEmoji(false)}
            className="mt-2 px-3 py-1 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
          >
            Close
          </button>
        </div>
      )}

      {/* Camera Preview Modal */}
      {showCamera && (
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center z-50 p-4">
          <video
            ref={videoRef}
            autoPlay
            className="w-full max-w-sm h-64 sm:w-80 sm:h-96 rounded-lg object-cover shadow-lg"
          />
          <div className="flex space-x-3 mt-4">
            <button
              onClick={() => {
                const canvas = document.createElement("canvas");
                canvas.width = videoRef.current.videoWidth;
                canvas.height = videoRef.current.videoHeight;
                canvas.getContext("2d").drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
                canvas.toBlob((blob) => sendMedia(blob, "photo.jpg"), "image/jpeg");
                closeCamera();
              }}
              className="px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition"
            >
              Send
            </button>
            <button
              onClick={closeCamera}
              className="px-4 py-2 bg-red-600 text-white rounded-lg shadow hover:bg-red-700 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Input & Buttons */}
      <div className="flex flex-wrap items-center p-2 border-t space-x-2 bg-white relative">
        {/* Emoji */}
        <button
          onClick={() => setShowEmoji(!showEmoji)}
          className="p-2 rounded-full hover:bg-gray-200 transition"
        >
          <FaSmile size={20} />
        </button>

        {/* Text Input */}
        <input
          type="text"
          placeholder="Type a message..."
          className="flex-1 min-w-[120px] border rounded-full px-4 py-2 focus:outline-none"
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

        {/* Camera */}
        <button
          onClick={openCamera}
          className="p-2 rounded-full hover:bg-gray-200 transition"
        >
          <FaCamera size={20} />
        </button>

        {/* Audio */}
        <div className="flex items-center">
          {!isRecording ? (
            <button
              onClick={startRecording}
              className="p-2 rounded-full hover:bg-gray-200 transition"
            >
              <FaMicrophone size={20} />
            </button>
          ) : (
            <button
              onClick={stopRecording}
              className="p-2 rounded-full bg-red-600 text-white transition"
            >
              Stop
            </button>
          )}
          {isRecording && <span className="ml-2 text-red-600 font-bold animate-pulse">Recording...</span>}
        </div>

        {/* Send Text */}
        <button
          onClick={sendMessage}
          disabled={uploading}
          className={`p-2 rounded-full transition ${
            uploading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
          } text-white`}
        >
          <FaPaperPlane size={20} />
        </button>
      </div>
    </>
  );
}
