"use client";
import { useEffect, useState, useRef } from "react";
import socket from "@/lib/socket";
import api from "@/lib/axios";
import { Send, Edit2, Trash2, X, Check, ArrowUpCircle } from "lucide-react";

interface IMessage {
  id: string;
  senderId: string;
  text: string;
  createdAt: string;
  isEdited: boolean;
  isDeleted: boolean;
}

interface ChatBoxProps {
  coachUserId: string;
  currentUserId: string;
  initialMessages: IMessage[]; 
}

interface SocketUpdatePayload {
  messageId: string;
  text?: string;
  action: "edit" | "deleteEveryone";
}

export default function ChatBox({ coachUserId, currentUserId, initialMessages }: ChatBoxProps) {
  const [messages, setMessages] = useState<IMessage[]>(initialMessages);
  const [input, setInput] = useState<string>("");
  const [editMode, setEditMode] = useState<IMessage | null>(null);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const limit = 20;

  const fetchMessages = async (skipCount: number) => {
    if (loadingMore || !hasMore) return;
    try {
      setLoadingMore(true);
      const res = await api.get(`/api/coach-users/messages?coachUserId=${coachUserId}&limit=${limit}&skip=${skipCount}`);
      const newMsgs: IMessage[] = res.data;
      if (newMsgs.length < limit) setHasMore(false);
      setMessages((prev) => [...newMsgs, ...prev]);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    setMessages(initialMessages);
    setHasMore(true);
    socket.emit("join_room", coachUserId);

    socket.on("receive_message", (msg: IMessage) => setMessages((prev) => [...prev, msg]));
    
    socket.on("message_updated", ({ messageId, text, action }: SocketUpdatePayload) => {
      setMessages((prev) => prev.map((m) => {
        if (m.id === messageId) {
          if (action === "edit" && text) return { ...m, text, isEdited: true };
          if (action === "deleteEveryone") return { ...m, text: "This message was deleted", isDeleted: true };
        }
        return m;
      }));
    });

    return () => {
      socket.off("receive_message");
      socket.off("message_updated");
    };
  }, [coachUserId, initialMessages]);

  useEffect(() => {
    if (messages.length <= (initialMessages.length + 1)) {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, initialMessages.length]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    try {
      const res = await api.post("/api/coach-users/messages", { coachUserId, senderId: currentUserId, text: input });
      const newMessage: IMessage = res.data;
      socket.emit("send_message", { roomId: coachUserId, ...newMessage });
      setMessages((prev) => [...prev, newMessage]);
      setInput("");
      setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAction = async (messageId: string, action: "edit" | "deleteEveryone", newText?: string) => {
    try {
      await api.patch("/api/coach-users/messages", { coachUserId, messageId, action, text: newText });
      socket.emit("update_message", { roomId: coachUserId, messageId, text: newText, action });
      setMessages((prev) => prev.map((m) => {
        if (m.id === messageId) {
          if (action === "edit" && newText) return { ...m, text: newText, isEdited: true };
          if (action === "deleteEveryone") return { ...m, text: "This message was deleted", isDeleted: true };
        }
        return m;
      }));
      setEditMode(null);
      setInput("");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="card-glass rounded-2xl flex flex-col h-[550px] border border-[var(--border-color)] overflow-hidden shadow-xl bg-[var(--card-bg)]">
      <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
        {hasMore && (
          <button 
            onClick={() => fetchMessages(messages.length)}
            disabled={loadingMore}
            className="w-full py-2 text-[10px] font-bold uppercase tracking-widest text-[var(--primary)] flex items-center justify-center gap-2 hover:opacity-70 disabled:opacity-30 transition-all"
          >
            {loadingMore ? "Loading..." : <><ArrowUpCircle size={14}/> Previous Messages</>}
          </button>
        )}

        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.senderId === currentUserId ? "justify-end" : "justify-start"}`}>
            <div className={`relative group max-w-[75%] p-4 rounded-xl shadow-sm ${
              m.senderId === currentUserId ? "bg-[var(--primary)] text-white" : "bg-[var(--bg-tertiary)] text-[var(--text-primary)]"
            }`}>
              {m.isDeleted ? (
                <span className="italic text-xs opacity-50 flex items-center gap-1"><X size={12}/> Deleted</span>
              ) : (
                <>
                  <p className="text-sm leading-relaxed">{m.text}</p>
                  {m.isEdited && <span className="text-[10px] opacity-40 block mt-1">(edited)</span>}
                </>
              )}
              
              {!m.isDeleted && m.senderId === currentUserId && (
                <div className="absolute -left-10 top-2 opacity-0 group-hover:opacity-100 transition-all duration-200">
                  <div className="flex flex-col bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-color)] p-1.5 shadow-xl gap-1">
                    <button onClick={() => { setEditMode(m); setInput(m.text); }} className="p-1.5 text-[var(--info)] hover:bg-[var(--bg-tertiary)] rounded-md transition-colors"><Edit2 size={14}/></button>
                    <button onClick={() => handleAction(m.id, "deleteEveryone")} className="p-1.5 text-[var(--danger)] hover:bg-[var(--bg-tertiary)] rounded-md transition-colors"><Trash2 size={14}/></button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      <div className="p-4 bg-[var(--bg-nav-footer)] border-t border-[var(--border-color)]">
        {editMode && (
          <div className="flex justify-between items-center mb-2 px-3 py-1 bg-[var(--bg-tertiary)] border border-[var(--primary)] rounded-xl">
            <span className="text-xs text-[var(--primary)] flex items-center gap-1 italic"><Edit2 size={10}/> Editing...</span>
            <button onClick={() => { setEditMode(null); setInput(""); }} className="text-[var(--text-muted)] hover:text-[var(--text-primary)]"><X size={14}/></button>
          </div>
        )}
        <div className="flex gap-2">
          <input 
            value={input} 
            onChange={(e) => setInput(e.target.value)} 
            className="flex-1 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl px-5 py-3 outline-none focus:border-[var(--primary)] transition-all text-[var(--text-primary)] text-sm" 
            placeholder={editMode ? "Edit..." : "Type message..."} 
            onKeyDown={(e) => e.key === "Enter" && (editMode ? handleAction(editMode.id, "edit", input) : sendMessage())}
          />
          <button 
            onClick={editMode ? () => handleAction(editMode.id, "edit", input) : sendMessage} 
            className="bg-[var(--primary)] p-3 px-5 rounded-xl hover:bg-[var(--primary-dark)] active:scale-95 transition-all text-white shadow-lg"
          >
            {editMode ? <Check size={20}/> : <Send size={20}/>}
          </button>
        </div>
      </div>
    </div>
  );
}