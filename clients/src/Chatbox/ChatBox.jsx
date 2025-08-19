import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";

const API = import.meta.env.VITE_API_URL;
const userId = localStorage.getItem("userId");

export default function ChatBox({ bookingId }) {
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () =>
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

  useEffect(() => {
    const token = localStorage.getItem("token");

    // Fetch messages
    const fetchMessages = async () => {
      try {
        const res = await fetch(`${API}/api/messages/${bookingId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setMessages(data || []);
        scrollToBottom();
      } catch (err) {
        console.error("Error fetching messages:", err);
      }
    };
    fetchMessages();

    // Socket connection
    const newSocket = io(API, {
      query: { bookingId },
      auth: { token },
      transports: ["websocket"],
    });

    newSocket.on("connect_error", (err) => console.error("Socket error:", err));
    newSocket.on("message", (msg) => {
      setMessages((prev) => [...prev, msg]);
      scrollToBottom();
    });

    setSocket(newSocket);
    return () => newSocket.disconnect();
  }, [bookingId]);

  return (
    <div className="flex flex-col h-[500px] w-full max-w-xl border rounded-xl shadow-lg bg-white relative">
      <h2 className="text-center text-xl font-bold text-blue-700 py-2 border-b">
        Live Chat
      </h2>

      <MessageList messages={messages} messagesEndRef={messagesEndRef} />
      <MessageInput
        bookingId={bookingId}
        socket={socket}
        setMessages={setMessages}
        scrollToBottom={scrollToBottom}
      />
    </div>
  );
}
