"use client";

import { Video, Clock, User, Send, Phone } from "lucide-react";
import { useState } from "react";

export default function LiveSessionPage() {
  const meetLink = "https://meet.google.com/pwh-fetr-kfx";

  const [text, setText] = useState("");

  const dummyMessages = [
    { sender: "coach", message: "Hey! Ready for today’s workout? 💪" },
    { sender: "user", message: "Yes coach! Let’s go 🔥" },
    { sender: "coach", message: "Start with warm-up first." },
  ];

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] p-3 md:p-6">

      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-4">

        {/* LEFT: SESSION CARD */}
        <div className="bg-[var(--bg-secondary)] border border-white/10 rounded-3xl shadow-xl flex flex-col h-[75vh]">

          {/* Chat Header */}
          <div className="flex items-center gap-3 p-4 border-b border-white/10">
            <img
              src="https://i.ibb.co.com/Pv0wP422/user.png"
              className="w-10 h-10 rounded-full"
            />

            <div>
              <p className="font-semibold">Coach John</p>
              <p className="text-xs text-green-400">Online</p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {dummyMessages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${
                  msg.sender === "user"
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
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

          {/* Input */}
          <div className="p-3 border-t border-white/10 flex gap-2">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 bg-[var(--bg-tertiary)] border border-white/20 rounded-xl px-3 py-2 text-sm focus:outline-none"
            />

            <button className="bg-blue-400 hover:bg-blue-500 px-4 rounded-xl flex items-center">
              <Send size={16} />
            </button>
          </div>
        </div>
        

        {/* RIGHT: CHAT UI */}
        <div className="bg-[var(--bg-secondary)] backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-xl">

          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg md:text-xl font-semibold">
              Live Session
            </h2>

            <span className="bg-red-500/20 text-red-400 px-3 py-1 rounded-full text-xs font-semibold animate-pulse">
              LIVE
            </span>
          </div>

          {/* Coach */}
          <div className="flex items-center gap-4 mb-6">
            <img
              src="https://i.ibb.co.com/Pv0wP422/user.png"
              className="w-14 h-14 rounded-full border border-white/10"
            />

            <div>
              <p className="font-semibold text-lg">Coach John</p>
              <p className="text-sm text-[var(--text-secondary)] flex items-center gap-1">
                <User size={14} /> Personal Trainer
              </p>
            </div>
          </div>

          {/* Info */}
          <div className="bg-[var(--bg-tertiary)] rounded-2xl p-4 mb-6 border border-white/10">
            <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
              <Clock size={16} />
              Today • 10:00 AM - 11:00 AM
            </div>

            <p className="mt-2 text-sm text-[var(--text-secondary)]">
              Join your live coaching session and train together.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <a
              href={meetLink}
              target="_blank"
              className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 transition py-3 rounded-xl font-semibold"
            >
              <Video size={18} />
              Join
            </a>

            <button className="flex items-center justify-center bg-white/10 hover:bg-white/20 p-3 rounded-xl">
              <Phone size={18} />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}