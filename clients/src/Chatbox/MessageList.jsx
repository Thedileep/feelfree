import React from "react";
import MessageItem from "./MessageItem";

export default function MessageList({ messages, messagesEndRef, userId }) {
  
  return (
    <div className="flex-1 overflow-y-auto p-2 space-y-2">
      {messages.map((msg) => (
        <MessageItem key={msg._id} message={msg} userId={userId} />
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
}
