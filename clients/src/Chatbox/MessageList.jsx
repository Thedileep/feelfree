import React from "react";
import MessageItem from "./MessageItem";

export default function MessageList({ messages, messagesEndRef }) {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-gray-50">
      {messages.map((m, i) => (
        <MessageItem key={i} message={m} />
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
}
