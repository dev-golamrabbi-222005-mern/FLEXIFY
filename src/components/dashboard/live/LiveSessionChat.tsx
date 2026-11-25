"use client";

import React from "react";
import { Send } from "lucide-react";

export interface Message {
  sender: "coach" | "user";
  message: string;
}

interface LiveSessionChatProps {
  coachName: string;
  coachImage: string;
  messages: Message[];
  text: string;
  setText: (v: string) => void;
  onSend: () => void;
}

export default function LiveSessionChat({
  coachName,
  coachImage,
  messages,
  text,
  setText,
  onSend,
}: LiveSessionChatProps) {
  return (
    <div className="bg-[var(--bg-secondary)] border border-white/10 rounded-3xl shadow-xl flex flex-col h-[75vh]">
      <div className="flex items-center gap-3 p-4 border-b border-white/10">
        <img src={coachImage} alt={coachName} className="w-10 h-10 rounded-full" />
        <div>
          <p className="font-semibold">{coachName}</p>
          <p className="text-xs text-green-400">Online</p>
        </div>
      </div>

      <div className="flex-1 p-4 space-y-3 overflow-y-auto">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`px-4 py-2 rounded-2xl text-sm max-w-xs ${
                msg.sender === "user"
                  ? "bg-blue-400 text-[var(--text-primary)]"
                  : "bg-[var(--bg-tertiary)] border border-white/20"
              }`}
            >
              {msg.message}
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-2 p-3 border-t border-white/10">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onSend()}
          placeholder="Type a message..."
          className="flex-1 bg-[var(--bg-tertiary)] border border-white/20 rounded-xl px-3 py-2 text-sm focus:outline-none"
        />
        <button onClick={onSend} className="flex items-center px-4 bg-blue-400 hover:bg-blue-500 rounded-xl">
          <Send size={16} />
        </button>
      </div>
    </div>
  );
}
