"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useSession } from "next-auth/react";
import PlanAccessModal from "@/components/modals/PlanAccessModal";
import { PlanId } from "@/lib/plans";
import LiveSessionChat, { Message } from "@/components/dashboard/live/LiveSessionChat";
import LiveSessionDetails, { LiveSessionInfo } from "@/components/dashboard/live/LiveSessionDetails";

export default function LiveSessionPage() {
  const { data: sessionData } = useSession();
  const [text, setText] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [session, setSession] = useState<LiveSessionInfo | null>(null);
  const [loading, setLoading] = useState(true);

  const { data: dbUser } = useQuery({
    queryKey: ["currentUser", sessionData?.user?.email],
    queryFn: async () => {
      if (!sessionData?.user?.email) return null;
      const res = await axios.get(`/api/user/me?email=${sessionData.user.email}`);
      return res.data;
    },
    enabled: !!sessionData?.user?.email,
  });

  const userPlan = (dbUser?.plan as PlanId) || "free";

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const res = await fetch("/api/live-session");
        const data = await res.json();
        setSession(data.session);
        setMessages(data.messages || []);
      } catch (error) {
        console.error("Failed to load session", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSession();
  }, []);

  const handleSend = async () => {
    if (!text.trim()) return;
    const newMessage: Message = { sender: "user", message: text };
    setMessages((prev) => [...prev, newMessage]);
    setText("");
    await fetch("/api/send-message", { method: "POST", body: JSON.stringify(newMessage) });
  };

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  if (userPlan === "free") {
    return (
      <PlanAccessModal
        currentPlan={userPlan}
        requiredPlan="elite"
        isOpen={true}
        onClose={() => {}}
      />
    );
  }

  if (!session) {
    return <div className="p-6 text-red-400">No session found</div>;
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] p-3 md:p-6">
      <title>Live Sessions | Dashboard - Flexify</title>
      <div className="grid gap-4 mx-auto max-w-7xl lg:grid-cols-2">
        <LiveSessionChat
          coachName={session.coachName}
          coachImage={session.coachImage}
          messages={messages}
          text={text}
          setText={setText}
          onSend={handleSend}
        />
        <LiveSessionDetails session={session} />
      </div>
    </div>
  );
}
