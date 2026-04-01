"use client";

import { useEffect, useState } from "react";
import socket from "@/lib/socket";

interface ChatBoxProps {
  userId: string;
  coachId: string;
}

interface Message {
  userId: string;
  coachId: string;
  message: string;
  createdAt?: string;
}

export default function ChatBox({ userId, coachId }: ChatBoxProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");

  const roomId = `${coachId}_${userId}`;

  useEffect(() => {
    socket.emit("join_room", roomId);

    socket.on("receive_message", (msg: Message) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off("receive_message");
    };
  }, [roomId]);

  const sendMessage = () => {
    if (!input.trim()) return;
    const msg: Message = { userId, coachId, message: input };
    socket.emit("send_message", msg);
    setMessages((prev) => [
      ...prev,
      { ...msg, createdAt: new Date().toISOString() },
    ]);
    setInput("");
  };

  return (
    <div className="card-glass p-4 space-y-3">
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {messages.map((m, i) => (
          <div key={i} className="flex flex-col">
            <span className="text-sm font-semibold">
              {m.userId === userId ? "You" : "Coach"}
            </span>
            <span>{m.message}</span>
            <span className="text-xs text-muted">{m.createdAt}</span>
          </div>
        ))}
      </div>

      <div className="flex gap-2 mt-2">
        <input
          type="text"
          className="input-style flex-1"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button className="btn-primary" onClick={sendMessage}>
          Send
        </button>
      </div>
    </div>
  );
}
