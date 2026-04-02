"use client";

import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import { useSession } from "next-auth/react";
import { Video, MessageSquare, User, Bell, ChevronLeft } from "lucide-react";
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
      const res = await api.get<ITrainee[]>(`/api/coach-users?coachId=${session.user.id}`);
      return res.data;
    },
    enabled: !!session?.user?.id,
  });

  useEffect(() => {
    const currentRef = stickyRef.current;
    const observer = new IntersectionObserver(
      ([entry]) => setIsSticky(entry.intersectionRatio < 1),
      { threshold: [1], rootMargin: "-1px 0px 0px 0px" }
    );

    if (currentRef) observer.observe(currentRef);
    return () => {
      if (currentRef) observer.disconnect();
    };
  }, [activeTrainee]);

  if (isLoading) return <div className="p-10 text-center font-bold text-[var(--primary)] animate-pulse">Loading...</div>;

  return (
    <div className="flex h-[calc(100vh-64px)] md:h-[calc(100vh-80px)] overflow-hidden text-[var(--text-primary)] relative">
      
      {/* Sidebar: Trainee List */}
      <div className={`w-full lg:w-80 border-r border-[var(--border-color)] flex flex-col bg-[var(--bg-primary)] transition-all duration-300 ${
        activeTrainee ? "hidden lg:flex" : "flex"
      }`}>
        <div className="p-6 border-b border-[var(--border-color)]">
          <h2 className="text-xl font-bold flex items-center gap-2 text-[var(--primary)]">
            <User size={22} /> Trainees
            <span className="ml-auto text-xs bg-[var(--bg-tertiary)] text-[var(--text-secondary)] px-3 py-1 rounded-full font-mono">
              {trainees?.length || 0}
            </span>
          </h2>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
          {trainees?.map((t) => (
            <div 
              key={t._id} 
              onClick={() => setActiveTrainee(t)} 
              className={`p-4 rounded-2xl cursor-pointer border transition-all duration-300 active:scale-[0.98] ${
                activeTrainee?._id === t._id 
                  ? "bg-[var(--primary)] border-transparent text-white shadow-lg" 
                  : "card-glass border-[var(--border-color)] hover:border-[var(--primary)]/50"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black uppercase text-lg shrink-0 ${
                  activeTrainee?._id === t._id ? "bg-white/20 text-white" : "bg-[var(--bg-tertiary)] text-[var(--primary)]"
                }`}>
                  {t.userName.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm truncate">{t.userName}</p>
                  <p className={`text-[10px] truncate ${activeTrainee?._id === t._id ? "text-white/70" : "text-[var(--text-muted)]"}`}>
                    {t.userEmail}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content: Chat & Details */}
      <div className={`flex-1 flex flex-col bg-[var(--bg-nav-footer)]/20 transition-all duration-300 ${
        activeTrainee ? "flex" : "hidden lg:flex"
      }`}>
        {activeTrainee && session?.user?.id ? (
          <div className="flex-1 flex flex-col h-full">
            {/* Dynamic Sticky Header */}
            <div 
              ref={stickyRef}
              className={`flex justify-between items-center px-4 md:px-8 py-4 border-b border-[var(--border-color)] sticky top-0 z-20 transition-all duration-300 ${
                isSticky ? "bg-[var(--card-bg)] shadow-xl" : "bg-transparent"
              }`}
            >
              <div className="flex items-center gap-3">
                {/* Back Button for Mobile */}
                <button 
                  onClick={() => setActiveTrainee(null)}
                  className="lg:hidden p-2 hover:bg-[var(--bg-tertiary)] rounded-xl transition text-[var(--text-secondary)]"
                >
                  <ChevronLeft size={24} />
                </button>

                <div className="hidden sm:flex p-2 bg-[var(--primary)]/10 rounded-xl text-[var(--primary)]">
                  <MessageSquare size={20} />
                </div>
                <div>
                  <h3 className="font-black text-sm md:text-base leading-tight">{activeTrainee.userName}</h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-2 h-2 bg-[var(--success)] rounded-full animate-pulse"></span>
                    <span className="text-[10px] text-[var(--success)] font-bold uppercase tracking-wider">Online Session</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <button className="hidden sm:flex p-2.5 text-[var(--text-muted)] hover:text-[var(--primary)] hover:bg-[var(--primary)]/10 rounded-xl transition">
                  <Bell size={20} />
                </button>
                <a 
                  href="https://meet.google.com/new" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2.5 bg-[var(--success)] text-white rounded-xl hover:opacity-90 transition shadow-lg text-[10px] md:text-xs font-black uppercase tracking-tighter"
                >
                  <Video size={16}/> <span className="hidden xs:inline">Live Meet</span>
                </a>
              </div>
            </div>

            {/* Chat Box Area */}
            <div className="flex-1 overflow-hidden">
              <ChatBox 
                coachUserId={activeTrainee._id} 
                currentUserId={session.user.id} 
                initialMessages={activeTrainee.messages || []} 
              />
            </div>
          </div>
        ) : (
          /* Empty State */
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <div className="w-24 h-24 bg-[var(--bg-tertiary)] rounded-3xl flex items-center justify-center mb-6 border border-[var(--border-color)]">
              <User size={48} className="text-[var(--primary)] opacity-40" />
            </div>
            <h3 className="text-xl font-black text-[var(--text-primary)]">Trainee Conversations</h3>
            <p className="text-[var(--text-muted)] mt-2 max-w-xs">
              Select a trainee from the list to start messaging or schedule a live meeting.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}