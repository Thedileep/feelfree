import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import axios from "axios";

export default function ChatBox({ bookingId }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/messages/${bookingId}`);
        setMessages(res.data || []);
      } catch (err) {
        console.error("Error fetching messages:", err);
      }
    };
    fetchMessages();

    const newSocket = io(import.meta.env.VITE_API_URL, { query: { bookingId } });
    setSocket(newSocket);

    newSocket.on("message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => newSocket.close();
  }, [bookingId]);

  const sendMessage = async () => {
    if (!newMessage.trim()) return;
    const msg = { text: newMessage, sender: "patient" };
    socket.emit("message", msg);
    setMessages((prev) => [...prev, msg]);
    setNewMessage("");
    await axios.post(`${import.meta.env.VITE_API_URL}/api/messages/${bookingId}`, msg);
  };

  return (
    <div className="border rounded-lg p-4 flex flex-col h-96">
      <h2 className="font-semibold mb-2">Live Chat</h2>
      <div className="flex-1 overflow-y-auto mb-3 border p-2 rounded">
        {messages.map((m, i) => (
          <div key={i} className={m.sender === "patient" ? "text-right" : "text-left"}>
            <p className={`inline-block px-3 py-1 rounded-lg ${m.sender === "patient" ? "bg-green-200" : "bg-gray-200"}`}>
              {m.text}
            </p>
          </div>
        ))}
      </div>
      <div className="flex">
        <input
          type="text"
          className="flex-1 border rounded-l px-3"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
        />
        <button onClick={sendMessage} className="bg-blue-600 text-white px-4 rounded-r">
          Send
        </button>
      </div>
    </div>
  );
}
