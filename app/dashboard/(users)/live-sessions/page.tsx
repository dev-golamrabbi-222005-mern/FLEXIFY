// "use client";

// import { Video, Clock, User, Send, Phone } from "lucide-react";
// import { useState } from "react";

// export default function LiveSessionPage() {
//   const meetLink = "https://meet.google.com/pwh-fetr-kfx";

//   const [text, setText] = useState("");

//   const dummyMessages = [
//     { sender: "coach", message: "Hey! Ready for today’s workout? 💪" },
//     { sender: "user", message: "Yes coach! Let’s go 🔥" },
//     { sender: "coach", message: "Start with warm-up first." },
//   ];

//   return (
//     <div className="min-h-screen bg-[var(--bg-primary)] p-3 md:p-6">

//       <div className="grid gap-4 mx-auto max-w-7xl lg:grid-cols-2">

//         {/* LEFT: SESSION CARD */}
//         <div className="bg-[var(--bg-secondary)] border border-white/10 rounded-3xl shadow-xl flex flex-col h-[75vh]">

//           {/* Chat Header */}
//           <div className="flex items-center gap-3 p-4 border-b border-white/10">
//             <img
//               src="https://i.ibb.co.com/Pv0wP422/user.png"
//               className="w-10 h-10 rounded-full"
//             />

//             <div>
//               <p className="font-semibold">Coach John</p>
//               <p className="text-xs text-green-400">Online</p>
//             </div>
//           </div>

//           {/* Messages */}
//           <div className="flex-1 p-4 space-y-3 overflow-y-auto">
//             {dummyMessages.map((msg, i) => (
//               <div
//                 key={i}
//                 className={`flex ${
//                   msg.sender === "user"
//                     ? "justify-end"
//                     : "justify-start"
//                 }`}
//               >
//                 <div
//                   className={`px-4 py-2 rounded-2xl text-sm max-w-xs ${
//                     msg.sender === "user"
//                       ? "bg-blue-400 text-[var(--text-primary)]"
//                       : "bg-[var(--bg-tertiary)] border border-white/20"
//                   }`}
//                 >
//                   {msg.message}
//                 </div>
//               </div>
//             ))}
//           </div>

//           {/* Input */}
//           <div className="flex gap-2 p-3 border-t border-white/10">
//             <input
//               value={text}
//               onChange={(e) => setText(e.target.value)}
//               placeholder="Type a message..."
//               className="flex-1 bg-[var(--bg-tertiary)] border border-white/20 rounded-xl px-3 py-2 text-sm focus:outline-none"
//             />

//             <button className="flex items-center px-4 bg-blue-400 hover:bg-blue-500 rounded-xl">
//               <Send size={16} />
//             </button>
//           </div>
//         </div>
        

//         {/* RIGHT: CHAT UI */}
//         <div className="bg-[var(--bg-secondary)] backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-xl">

//           {/* Header */}
//           <div className="flex items-center justify-between mb-6">
//             <h2 className="text-lg font-semibold md:text-xl">
//               Live Session
//             </h2>

//             <span className="px-3 py-1 text-xs font-semibold text-red-400 rounded-full bg-red-500/20 animate-pulse">
//               LIVE
//             </span>
//           </div>

//           {/* Coach */}
//           <div className="flex items-center gap-4 mb-6">
//             <img
//               src="https://i.ibb.co.com/Pv0wP422/user.png"
//               className="border rounded-full w-14 h-14 border-white/10"
//             />

//             <div>
//               <p className="text-lg font-semibold">Coach John</p>
//               <p className="text-sm text-[var(--text-secondary)] flex items-center gap-1">
//                 <User size={14} /> Personal Trainer
//               </p>
//             </div>
//           </div>

//           {/* Info */}
//           <div className="bg-[var(--bg-tertiary)] rounded-2xl p-4 mb-6 border border-white/10">
//             <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
//               <Clock size={16} />
//               Today • 10:00 AM - 11:00 AM
//             </div>

//             <p className="mt-2 text-sm text-[var(--text-secondary)]">
//               Join your live coaching session and train together.
//             </p>
//           </div>

//           {/* Buttons */}
//           <div className="flex gap-3">
//             <a
//               href={meetLink}
//               target="_blank"
//               className="flex items-center justify-center flex-1 gap-2 py-3 font-semibold transition bg-green-600 hover:bg-green-700 rounded-xl"
//             >
//               <Video size={18} />
//               Join
//             </a>

//             <button className="flex items-center justify-center p-3 bg-white/10 hover:bg-white/20 rounded-xl">
//               <Phone size={18} />
//             </button>
//           </div>
//         </div>

//       </div>
//     </div>
//   );
// }



"use client";

import { Video, Clock, User, Send, Phone } from "lucide-react";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useSession } from "next-auth/react";
import PlanAccessModal from "@/components/modals/PlanAccessModal";
import { PlanId } from "@/lib/plans";

// Types
interface Message {
  sender: "coach" | "user";
  message: string;
}

interface Session {
  coachName: string;
  coachImage: string;
  meetLink: string;
  time: string;
}

export default function LiveSessionPage() {
  const { data: sessionData } = useSession();
  const [text, setText] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Fetch user data to check plan
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

  // 🔥 Fetch dynamic session data
  useEffect(() => {
    const fetchSession = async () => {
      try {
        // Replace with your API
        const res = await fetch("/api/live-session");
        const data = await res.json();

        setSession(data.session);
        setMessages(data.messages);
      } catch (error) {
        console.error("Failed to load session", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSession();
  }, []);

  // 🔥 Send message
  const handleSend =async () => {
    if (!text.trim()) return;

    const newMessage: Message = {
      sender: "user",
      message: text,
    };

    setMessages((prev) => [...prev, newMessage]);
    setText("");

    // Optional: send to backend
    // await fetch("/api/send-message", { method: "POST", body: JSON.stringify(newMessage) })
    await fetch("/api/send-message", { method: "POST", body: JSON.stringify(newMessage)})
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

        {/* LEFT: CHAT */}
        <div className="bg-[var(--bg-secondary)] border border-white/10 rounded-3xl shadow-xl flex flex-col h-[75vh]">

          {/* Header */}
          <div className="flex items-center gap-3 p-4 border-b border-white/10">
            <img
              src={session.coachImage}
              className="w-10 h-10 rounded-full"
            />

            <div>
              <p className="font-semibold">{session.coachName}</p>
              <p className="text-xs text-green-400">Online</p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 space-y-3 overflow-y-auto">
            {messages.map((msg, i) => (
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
          <div className="flex gap-2 p-3 border-t border-white/10">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 bg-[var(--bg-tertiary)] border border-white/20 rounded-xl px-3 py-2 text-sm focus:outline-none"
            />

            <button
              onClick={handleSend}
              className="flex items-center px-4 bg-blue-400 hover:bg-blue-500 rounded-xl"
            >
              <Send size={16} />
            </button>
          </div>
        </div>

        {/* RIGHT: SESSION INFO */}
        <div className="bg-[var(--bg-secondary)] backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-xl">

          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold md:text-xl">
              Live Session
            </h2>

            <span className="px-3 py-1 text-xs font-semibold text-red-400 rounded-full bg-red-500/20 animate-pulse">
              LIVE
            </span>
          </div>

          {/* Coach */}
          <div className="flex items-center gap-4 mb-6">
            <img
              src={session.coachImage}
              className="border rounded-full w-14 h-14 border-white/10"
            />

            <div>
              <p className="text-lg font-semibold">{session.coachName}</p>
              <p className="text-sm text-[var(--text-secondary)] flex items-center gap-1">
                <User size={14} /> Personal Trainer
              </p>
            </div>
          </div>

          {/* Info */}
          <div className="bg-[var(--bg-tertiary)] rounded-2xl p-4 mb-6 border border-white/10">
            <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
              <Clock size={16} />
              {session.time}
            </div>

            <p className="mt-2 text-sm text-[var(--text-secondary)]">
              Join your live coaching session and train together.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <a
              href={session.meetLink}
              target="_blank"
              className="flex items-center justify-center flex-1 gap-2 py-3 font-semibold transition bg-green-600 hover:bg-green-700 rounded-xl"
            >
              <Video size={18} />
              Join
            </a>

            <button className="flex items-center justify-center p-3 bg-white/10 hover:bg-white/20 rounded-xl">
              <Phone size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
