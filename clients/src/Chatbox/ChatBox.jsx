import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";

const API = import.meta.env.VITE_API_URL;

export default function ChatBox({ bookingId }) {
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);
  const messagesEndRef = useRef(null);

  const storedUser = JSON.parse(localStorage.getItem("user"));
  const userId = storedUser?._id; 

  const scrollToBottom = () =>
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchMessages = async () => {
  try {
    const res = await fetch(`${API}/api/messages/${bookingId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setMessages((prev) => {
      const existingMessages = prev.map((msg) => msg._id);
      const newMessages = data.filter((msg) => !existingMessages.includes(msg._id));
      return [...prev, ...newMessages];
    });
    scrollToBottom();
  } catch (err) {
    console.error("Error fetching messages:", err);
  }
};

    fetchMessages();

    const newSocket = io(API, {
      query: { bookingId },
      auth: { token },
      transports: ["websocket"],
    });

    newSocket.on("connect_error", (err) => console.error("Socket error:", err));

    // Listen for incoming messages
    newSocket.on("message", (msg) => {
    setMessages((prev) => {
      const ids = prev.map(m => m._id.toString());
      if (ids.includes(msg._id.toString())) return prev;
      return [...prev, msg];
    });
    scrollToBottom();
  });


    // Delete message for everyone
    newSocket.on("deleteMessage", (messageId) => {
      setMessages((prev) => prev.filter((m) => m._id !== messageId));
    });

    // Delete message for a single user
    newSocket.on("deleteMessageForUser", ({ messageId, userId: uid }) => {
      if (uid === userId) {
        setMessages((prev) =>
          prev.map((m) =>
            m._id === messageId
              ? { ...m, deletedFor: [...(m.deletedFor || []), uid] }
              : m
          )
        );
      }
    });

    setSocket(newSocket);
    return () => newSocket.disconnect();
  }, [bookingId, userId]);

  return (
    <div className="flex flex-col h-[450px] w-full max-w-xl border rounded-xl shadow-lg bg-white relative">
      <h2 className="text-center text-xl font-bold text-blue-700 py-2 border-b">
        Live Chat
      </h2>

      <MessageList messages={messages} messagesEndRef={messagesEndRef} userId={userId} />
      <MessageInput
        bookingId={bookingId}
        socket={socket}
        setMessages={setMessages}
        scrollToBottom={scrollToBottom}
        userId={userId}
      />
    </div>
  );
}
