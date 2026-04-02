"use client";
import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import { useSession } from "next-auth/react";
import { Video, MessageSquare, User, Bell } from "lucide-react";
import ChatBox from "../../components/live-chat/ChatBox";

interface IMessage {
  id: string;
  senderId: string;
  text: string;
  createdAt: string;
  isEdited: boolean;
  isDeleted: boolean;
}

interface ITrainee {
  _id: string;
  coachId: string;
  userId: string;
  userName: string;
  userEmail: string;
  messages?: IMessage[];
  unreadCount?: number; 
  status: string;
}

export default function MyTraineesPage() {
  const { data: session } = useSession();
  const [activeTrainee, setActiveTrainee] = useState<ITrainee | null>(null);
  const [isSticky, setIsSticky] = useState(false);
  const stickyRef = useRef<HTMLDivElement>(null);

  const { data: trainees, isLoading } = useQuery<ITrainee[]>({
    queryKey: ["my-trainees", session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return [];
      const res = await api.get(`/api/coach-users?coachId=${session.user.id}`);
      return res.data;
    },
    enabled: !!session?.user?.id,
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsSticky(entry.intersectionRatio < 1),
      { threshold: [1], rootMargin: "-1px 0px 0px 0px" }
    );

    if (stickyRef.current) observer.observe(stickyRef.current);
    return () => observer.disconnect();
  }, [activeTrainee]);

  if (isLoading) return <div className="p-10 text-center font-bold text-[var(--primary)] animate-pulse">Loading...</div>;

  return (
    <div className="flex h-[calc(100vh-80px)] overflow-hidden text-[var(--text-primary)]">
      <div className="w-full lg:w-80 border-r border-[var(--border-color)] flex flex-col bg-[var(--bg-primary)]">
        <div className="p-6 border-b border-[var(--border-color)]">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <User className="text-[var(--primary)]" size={20} /> Trainees
            <span className="ml-auto text-xs bg-[var(--bg-tertiary)] px-2 py-1 rounded-lg">
              {trainees?.length || 0}
            </span>
          </h2>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
          {trainees?.map((t) => (
            <div 
              key={t._id} 
              onClick={() => setActiveTrainee(t)} 
              className={`p-4 rounded-xl cursor-pointer border transition-all duration-300 ${
                activeTrainee?._id === t._id 
                  ? "bg-[var(--primary)] border-transparent text-white shadow-lg" 
                  : "card-glass border-[var(--border-color)] hover:border-[var(--primary)]"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-11 h-11 rounded-full flex items-center justify-center font-bold uppercase ${
                  activeTrainee?._id === t._id ? "bg-white/20" : "bg-[var(--bg-tertiary)] text-[var(--primary)]"
                }`}>
                  {t.userName.charAt(0)}
                </div>
                <div className="flex-1 overflow-hidden">
                  <p className="font-bold text-sm truncate">{t.userName}</p>
                  <p className="text-[10px] truncate opacity-70">{t.userEmail}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col bg-[var(--bg-nav-footer)]/30 overflow-y-auto custom-scrollbar">
        {activeTrainee && session?.user?.id ? (
          <div className="p-6 space-y-4 max-w-5xl mx-auto w-full">
            <div 
              ref={stickyRef}
              className={`flex justify-between items-center card-glass p-4 border border-[var(--border-color)] sticky top-0 z-20 transition-all duration-300 ${
                isSticky ? "rounded-b-none border-b-transparent shadow-lg bg-[var(--card-bg)]" : "rounded-xl"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[var(--primary)]/10 rounded-lg text-[var(--primary)]">
                  <MessageSquare size={20} />
                </div>
                <div>
                  <span className="font-bold block text-sm">{activeTrainee.userName}</span>
                  <span className="text-[10px] text-[var(--success)] flex items-center gap-1 italic">
                    <span className="w-1.5 h-1.5 bg-[var(--success)] rounded-full animate-pulse"></span> Active Session
                  </span>
                </div>
              </div>
              
              <div className="flex gap-2">
                <button className="p-2 text-[var(--text-muted)] hover:text-[var(--primary)]"><Bell size={18} /></button>
                <a 
                  href="https://meet.google.com/new" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-[var(--success)] text-white rounded-xl hover:opacity-90 transition shadow-lg text-[10px] font-black uppercase tracking-wider"
                >
                  <Video size={14}/> Live Meet
                </a>
              </div>
            </div>

            <div className="pb-6">
              <ChatBox 
                coachUserId={activeTrainee._id} 
                currentUserId={session.user.id} 
                initialMessages={activeTrainee.messages || []} 
              />
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-[var(--text-muted)] space-y-4">
            <div className="p-6 bg-[var(--bg-tertiary)] rounded-full border border-[var(--border-color)]">
              <User size={48} className="opacity-20 text-[var(--primary)]" />
            </div>
            <p className="font-bold">Select a trainee to start</p>
          </div>
        )}
      </div>
    </div>
  );
}