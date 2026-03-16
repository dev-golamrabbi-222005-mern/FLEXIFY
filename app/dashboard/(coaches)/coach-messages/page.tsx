

"use client";

import { Send, ChevronLeft, MoreVertical, Search } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

const contacts = [
  { id: "1", name: "Arif Hossain", lastMsg: "Thanks coach! I'll follow the plan.", time: "2m ago", unread: 2, avatar: "A", online: true },
  { id: "2", name: "Nadia Akter", lastMsg: "Can we reschedule tomorrow?", time: "1h ago", unread: 1, avatar: "N", online: false },
  { id: "3", name: "Kamal Uddin", lastMsg: "Hit a new PR today! 💪", time: "3h ago", unread: 0, avatar: "K", online: true },
  { id: "4", name: "Sabrina Islam", lastMsg: "How many sets for squats?", time: "5h ago", unread: 0, avatar: "S", online: false },
];

const initialMessages = [
  { id: "1", sender: "client", text: "Coach, I completed all my sets today!", time: "10:30 AM" },
  { id: "2", sender: "coach", text: "Great work! How did the deadlifts feel?", time: "10:32 AM" },
  { id: "3", sender: "client", text: "Much better than last week. I increased weight by 5kg.", time: "10:35 AM" },
  { id: "4", sender: "coach", text: "Excellent progress! Keep eating enough protein.", time: "10:37 AM" },
];

export default function CoachMessages() {

  const [activeChat, setActiveChat] = useState<string | null>("1");
  const [showMobileChat, setShowMobileChat] = useState(false);
  const [newMsg, setNewMsg] = useState("");

  const activeContact = contacts.find((c) => c.id === activeChat);

  const handleContactClick = (id: string) => {
    setActiveChat(id);
    setShowMobileChat(true);
  };

  return (
    <div
      className="max-w-6xl mx-auto flex flex-col md:flex-row overflow-hidden rounded-2xl border"
      style={{
        background: "var(--bg-secondary)",
        borderColor: "var(--border-color)",
        height: "calc(100vh - 40px)"
      }}
    >

      {/* SIDEBAR */}
      <aside
        className={`w-full md:w-80 border-r flex flex-col ${
          showMobileChat ? "hidden md:flex" : "flex"
        }`}
        style={{ borderColor: "var(--border-color)" }}
      >

        {/* Header */}
        <div className="p-4 border-b" style={{ borderColor: "var(--border-color)" }}>
          <h1
            className="font-bold text-lg mb-3"
            style={{ color: "var(--text-primary)" }}
          >
            Messages
          </h1>

          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2"
              size={16}
              style={{ color: "var(--text-muted)" }}
            />

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

        {/* CONTACT LIST */}
        <div className="flex-1 overflow-y-auto">

          {contacts.map((c) => (
            <button
              key={c.id}
              onClick={() => handleContactClick(c.id)}
              className="w-full flex items-center gap-3 p-4 text-left transition"
              style={{
                background:
                  activeChat === c.id
                    ? "var(--primary-light)"
                    : "transparent",
              }}
            >

              {/* Avatar */}
              <div className="relative">

                <div
                  className="w-11 h-11 rounded-full flex items-center justify-center font-bold text-sm"
                  style={{
                    background: "var(--primary-light)",
                    color: "var(--primary)",
                  }}
                >
                  {c.avatar}
                </div>

                {c.online && (
                  <span
                    className="absolute bottom-0 right-0 w-3 h-3 rounded-full"
                    style={{ background: "var(--success)" }}
                  />
                )}
              </div>

              {/* Text */}
              <div className="flex-1 min-w-0">

                <div className="flex justify-between text-sm">

                  <span
                    className="font-semibold truncate"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {c.name}
                  </span>

                  <span
                    className="text-xs"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {c.time}
                  </span>
                </div>

                <p
                  className="text-xs truncate"
                  style={{ color: "var(--text-muted)" }}
                >
                  {c.lastMsg}
                </p>
              </div>

              {c.unread > 0 && (
                <span
                  className="text-[10px] px-2 py-1 rounded-full font-bold"
                  style={{
                    background: "var(--primary)",
                    color: "white",
                  }}
                >
                  {c.unread}
                </span>
              )}
            </button>
          ))}

        </div>
      </aside>

      {/* CHAT AREA */}
      <main
        className={`flex-1 flex flex-col ${
          !showMobileChat ? "hidden md:flex" : "flex"
        }`}
      >

        {activeContact && (
          <>

            {/* CHAT HEADER */}
            <header
              className="p-4 border-b flex justify-between items-center"
              style={{ borderColor: "var(--border-color)" }}
            >

              <div className="flex items-center gap-3">

                <button
                  className="md:hidden"
                  onClick={() => setShowMobileChat(false)}
                >
                  <ChevronLeft size={20} />
                </button>

                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center font-bold"
                  style={{
                    background: "var(--primary-light)",
                    color: "var(--primary)",
                  }}
                >
                  {activeContact.avatar}
                </div>

                <div>
                  <h2
                    className="font-semibold text-sm"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {activeContact.name}
                  </h2>

                  <span
                    className="text-xs"
                    style={{ color: "var(--success)" }}
                  >
                    Online
                  </span>
                </div>
              </div>

              <MoreVertical size={20} />
            </header>

            {/* MESSAGES */}
            <div className="flex-1 overflow-y-auto p-4 space-y-5">

              {initialMessages.map((m) => (

                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${
                    m.sender === "coach"
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >

                  <div
                    className="max-w-[70%] px-4 py-3 rounded-2xl text-sm"
                    style={{
                      background:
                        m.sender === "coach"
                          ? "var(--primary)"
                          : "var(--bg-primary)",
                      color:
                        m.sender === "coach"
                          ? "#fff"
                          : "var(--text-primary)",
                    }}
                  >
                    {m.text}
                  </div>

                </motion.div>
              ))}

            </div>

            {/* INPUT */}
            <footer
              className="p-4 border-t"
              style={{ borderColor: "var(--border-color)" }}
            >

              <form className="flex gap-2">

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

                <button className="btn-primary p-3">
                  <Send size={18} />
                </button>

              </form>
            </footer>

          </>
        )}

      </main>
    </div>
  );
}