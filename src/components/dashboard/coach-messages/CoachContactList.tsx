"use client";

import React from "react";
import { Search } from "lucide-react";

export interface Contact {
  id: string;
  name: string;
  lastMsg: string;
  time: string;
  unread: number;
  avatar: string;
  online: boolean;
}

interface CoachContactListProps {
  contacts: Contact[];
  activeChat: string | null;
  onSelectContact: (id: string) => void;
  showMobileChat: boolean;
}

export default function CoachContactList({
  contacts,
  activeChat,
  onSelectContact,
  showMobileChat,
}: CoachContactListProps) {
  return (
    <aside
      className={`w-full md:w-80 border-r flex flex-col ${showMobileChat ? "hidden md:flex" : "flex"}`}
      style={{ borderColor: "var(--border-color)" }}
    >
      <div className="p-4 border-b" style={{ borderColor: "var(--border-color)" }}>
        <h1 className="font-bold text-lg mb-3" style={{ color: "var(--text-primary)" }}>
          Messages
        </h1>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2" size={16} style={{ color: "var(--text-muted)" }} />
          <input
            placeholder="Search clients..."
            className="w-full pl-9 pr-3 py-2 rounded-xl text-sm outline-none"
            style={{
              background: "var(--bg-primary)",
              border: "1px solid var(--border-color)",
              color: "var(--text-primary)",
            }}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {contacts.map((c) => (
          <button
            key={c.id}
            onClick={() => onSelectContact(c.id)}
            className="w-full flex items-center gap-3 p-4 text-left transition"
            style={{
              background: activeChat === c.id ? "var(--primary-light)" : "transparent",
            }}
          >
            <div className="relative">
              <div
                className="w-11 h-11 rounded-full flex items-center justify-center font-bold text-sm"
                style={{ background: "var(--primary-light)", color: "var(--primary)" }}
              >
                {c.avatar}
              </div>
              {c.online && (
                <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full" style={{ background: "var(--success)" }} />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex justify-between text-sm">
                <span className="font-semibold truncate" style={{ color: "var(--text-primary)" }}>
                  {c.name}
                </span>
                <span className="text-xs" style={{ color: "var(--text-muted)" }}>{c.time}</span>
              </div>
              <p className="text-xs truncate" style={{ color: "var(--text-muted)" }}>{c.lastMsg}</p>
            </div>

            {c.unread > 0 && (
              <span className="text-[10px] px-2 py-1 rounded-full font-bold" style={{ background: "var(--primary)", color: "white" }}>
                {c.unread}
              </span>
            )}
          </button>
        ))}
      </div>
    </aside>
  );
}
