"use client";

import { useState } from "react";
import CoachContactList, { Contact } from "@/components/dashboard/coach-messages/CoachContactList";
import CoachChatPane, { ChatMessage } from "@/components/dashboard/coach-messages/CoachChatPane";

const contacts: Contact[] = [
  { id: "1", name: "Arif mollah", lastMsg: "Thanks coach! I'll follow the plan.", time: "2m ago", unread: 2, avatar: "A", online: true },
  { id: "2", name: "Nadia Akter", lastMsg: "Can we reschedule tomorrow?", time: "1h ago", unread: 1, avatar: "N", online: false },
  { id: "3", name: "Kamal Uddin", lastMsg: "Hit a new PR today! 💪", time: "3h ago", unread: 0, avatar: "K", online: true },
  { id: "4", name: "Sabrina Islam", lastMsg: "How many sets for squats?", time: "5h ago", unread: 0, avatar: "S", online: false },
];

const initialMessages: ChatMessage[] = [
  { id: "1", sender: "client", text: "Coach, I completed all my sets today!", time: "10:30 AM" },
  { id: "2", sender: "coach", text: "Great work! How did the deadlifts feel?", time: "10:32 AM" },
  { id: "3", sender: "client", text: "Much better than last week. I increased weight by 5kg.", time: "10:35 AM" },
  { id: "4", sender: "coach", text: "Excellent progress! Keep eating enough protein.", time: "10:37 AM" },
];

export default function CoachMessages() {
  const [activeChat, setActiveChat] = useState<string | null>("1");
  const [showMobileChat, setShowMobileChat] = useState(false);
  const [newMsg, setNewMsg] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);

  const activeContact = contacts.find((c) => c.id === activeChat);

  const handleContactClick = (id: string) => {
    setActiveChat(id);
    setShowMobileChat(true);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMsg.trim()) return;
    const msg: ChatMessage = {
      id: String(Date.now()),
      sender: "coach",
      text: newMsg,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setMessages((prev) => [...prev, msg]);
    setNewMsg("");
  };

  return (
    <div
      className="max-w-6xl mx-auto flex flex-col md:flex-row overflow-hidden rounded-2xl border"
      style={{
        background: "var(--bg-secondary)",
        borderColor: "var(--border-color)",
        height: "calc(100vh - 40px)",
      }}
    >
      <title>Messages | Dashboard - Flexify</title>
      <CoachContactList
        contacts={contacts}
        activeChat={activeChat}
        onSelectContact={handleContactClick}
        showMobileChat={showMobileChat}
      />
      <main className={`flex-1 flex flex-col ${!showMobileChat ? "hidden md:flex" : "flex"}`}>
        <CoachChatPane
          activeContact={activeContact}
          messages={messages}
          newMsg={newMsg}
          setNewMsg={setNewMsg}
          onBackMobile={() => setShowMobileChat(false)}
          onSend={handleSendMessage}
        />
      </main>
    </div>
  );
}
