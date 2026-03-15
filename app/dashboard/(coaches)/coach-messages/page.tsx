

"use client";
import { Send, ChevronLeft, MoreVertical, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const contacts = [
  { id: "1", name: "Arif Hossain", lastMsg: "Thanks coach! I'll follow the plan.", time: "2m ago", unread: 2, avatar: "A", online: true },
  { id: "2", name: "Nadia Akter", lastMsg: "Can we reschedule tomorrow?", time: "1h ago", unread: 1, avatar: "N", online: false },
  { id: "3", name: "Kamal Uddin", lastMsg: "Hit a new PR today! 💪", time: "3h ago", unread: 0, avatar: "K", online: true },
  { id: "4", name: "Sabrina Islam", lastMsg: "How many sets for squats?", time: "5h ago", unread: 0, avatar: "S", online: false },
  { id: "5", name: "Rashed Khan", lastMsg: "I'm feeling sore after yesterday", time: "1d ago", unread: 0, avatar: "R", online: false },
];

const initialMessages = [
  { id: "1", sender: "client", text: "Coach, I completed all my sets today!", time: "10:30 AM" },
  { id: "2", sender: "coach", text: "Great work Arif! How did the deadlifts feel?", time: "10:32 AM" },
  { id: "3", sender: "client", text: "Much better than last week. I increased weight by 5kg.", time: "10:35 AM" },
  { id: "4", sender: "coach", text: "Excellent progress! Let's keep that momentum. Make sure to eat enough protein today.", time: "10:37 AM" },
  { id: "5", sender: "client", text: "Thanks coach! I'll follow the plan.", time: "10:38 AM" },
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
    <div className="max-w-6xl mx-auto h-[calc(100vh-40px)] md:h-[600px] bg-background border rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row m-2 md:m-10">
      
      {/* --- Sidebar (Contact List) --- */}
      <aside className={`w-full md:w-80 border-r flex flex-col bg-card ${showMobileChat ? "hidden md:flex" : "flex"}`}>
        <div className="p-4 border-b space-y-4">
          <h1 className="text-xl font-bold tracking-tight">Messages</h1>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input 
              placeholder="Search clients..." 
              className="w-full bg-muted/50 border-none rounded-xl py-2 pl-10 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {contacts.map((c) => (
            <button
              key={c.id}
              onClick={() => handleContactClick(c.id)}
              className={`w-full flex items-center gap-3 p-4 transition-all hover:bg-muted/50 group ${activeChat === c.id ? "bg-muted border-r-4 border-primary" : ""}`}
            >
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center text-sm font-bold border border-primary/10">
                  {c.avatar}
                </div>
                {c.online && <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-background rounded-full" />}
              </div>
              
              <div className="flex-1 min-w-0 text-left">
                <div className="flex justify-between items-baseline">
                  <span className="font-semibold text-sm truncate">{c.name}</span>
                  <span className="text-[10px] text-muted-foreground uppercase">{c.time}</span>
                </div>
                <p className="text-xs text-muted-foreground truncate leading-relaxed">{c.lastMsg}</p>
              </div>

              {c.unread > 0 && (
                <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center text-[10px] font-bold text-primary-foreground shadow-lg shadow-primary/20">
                  {c.unread}
                </div>
              )}
            </button>
          ))}
        </div>
      </aside>

      {/* --- Chat Main Area --- */}
      <main className={`flex-1 flex flex-col bg-muted/5 ${!showMobileChat ? "hidden md:flex" : "flex"}`}>
        {activeContact ? (
          <>
            {/* Header */}
            <header className="p-4 border-b bg-background/80 backdrop-blur-md flex items-center justify-between sticky top-0 z-10">
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setShowMobileChat(false)}
                  className="md:hidden p-2 -ml-2 hover:bg-muted rounded-full"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                  {activeContact.avatar}
                </div>
                <div>
                  <h2 className="text-sm font-bold leading-none">{activeContact.name}</h2>
                  <span className="text-[11px] text-green-500 font-medium">Online</span>
                </div>
              </div>
              <button className="p-2 hover:bg-muted rounded-full transition-colors text-muted-foreground">
                <MoreVertical className="w-5 h-5" />
              </button>
            </header>

            {/* Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
              {initialMessages.map((m) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={m.id} 
                  className={`flex ${m.sender === "coach" ? "justify-end" : "justify-start"}`}
                >
                  <div className={`max-w-[85%] md:max-w-[70%] group`}>
                    <div className={`px-4 py-3 rounded-2xl shadow-sm text-sm ${
                      m.sender === "coach" 
                      ? "bg-primary text-primary-foreground rounded-tr-none" 
                      : "bg-background border rounded-tl-none"
                    }`}>
                      {m.text}
                    </div>
                    <span className={`text-[10px] mt-1.5 block px-1 text-muted-foreground ${m.sender === "coach" ? "text-right" : "text-left"}`}>
                      {m.time}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Input Area */}
            <footer className="p-4 bg-background border-t">
              <form 
                onSubmit={(e) => e.preventDefault()}
                className="flex items-center gap-2 max-w-4xl mx-auto w-full"
              >
                <input
                  className="flex-1 px-4 py-3 rounded-xl border bg-muted/30 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-background transition-all"
                  placeholder="Write a message..."
                  value={newMsg}
                  onChange={(e) => setNewMsg(e.target.value)}
                />
                <button className="p-3 rounded-xl bg-primary text-primary-foreground hover:shadow-lg hover:shadow-primary/30 active:scale-95 transition-all">
                  <Send className="w-5 h-5" />
                </button>
              </form>
            </footer>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground p-8 text-center">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
               <Send className="w-8 h-8 opacity-20" />
            </div>
            <h3 className="text-lg font-medium">Your Messages</h3>
            <p className="text-sm max-w-[200px]">Select a client from the left to start a conversation.</p>
          </div>
        )}
      </main>
    </div>
  );
}