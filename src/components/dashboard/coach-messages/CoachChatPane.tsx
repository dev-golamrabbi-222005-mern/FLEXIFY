"use client";

import { motion } from "framer-motion";
import { Send, ChevronLeft, MoreVertical } from "lucide-react";
import React from "react";
import { Contact } from "./CoachContactList";

export interface ChatMessage {
  id: string;
  sender: "coach" | "client";
  text: string;
  time: string;
}

interface CoachChatPaneProps {
  activeContact?: Contact;
  messages: ChatMessage[];
  newMsg: string;
  setNewMsg: (msg: string) => void;
  onBackMobile: () => void;
  onSend: (e: React.FormEvent) => void;
}

export default function CoachChatPane({
  activeContact,
  messages,
  newMsg,
  setNewMsg,
  onBackMobile,
  onSend,
}: CoachChatPaneProps) {
  if (!activeContact) return null;

  return (
    <>
      <header className="p-4 border-b flex justify-between items-center" style={{ borderColor: "var(--border-color)" }}>
        <div className="flex items-center gap-3">
          <button className="md:hidden" onClick={onBackMobile}>
            <ChevronLeft size={20} />
          </button>
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center font-bold"
            style={{ background: "var(--primary-light)", color: "var(--primary)" }}
          >
            {activeContact.avatar}
          </div>
          <div>
            <h2 className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>{activeContact.name}</h2>
            <span className="text-xs" style={{ color: "var(--success)" }}>Online</span>
          </div>
        </div>
        <MoreVertical size={20} />
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        {messages.map((m) => (
          <motion.div
            key={m.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${m.sender === "coach" ? "justify-end" : "justify-start"}`}
          >
            <div
              className="max-w-[70%] px-4 py-3 rounded-2xl text-sm"
              style={{
                background: m.sender === "coach" ? "var(--primary)" : "var(--bg-primary)",
                color: m.sender === "coach" ? "#fff" : "var(--text-primary)",
              }}
            >
              {m.text}
            </div>
          </motion.div>
        ))}
      </div>

      <footer className="p-4 border-t" style={{ borderColor: "var(--border-color)" }}>
        <form onSubmit={onSend} className="flex gap-2">
          <input
            className="flex-1 rounded-xl px-4 py-3 text-sm outline-none"
            style={{
              background: "var(--bg-primary)",
              border: "1px solid var(--border-color)",
              color: "var(--text-primary)",
            }}
            placeholder="Write a message..."
            value={newMsg}
            onChange={(e) => setNewMsg(e.target.value)}
          />
          <button type="submit" className="btn-primary p-3">
            <Send size={18} />
          </button>
        </form>
      </footer>
    </>
  );
}
