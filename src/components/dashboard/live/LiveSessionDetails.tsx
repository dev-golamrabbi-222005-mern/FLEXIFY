"use client";

import React from "react";
import { Video, Clock, User, Phone } from "lucide-react";

export interface LiveSessionInfo {
  coachName: string;
  coachImage: string;
  meetLink: string;
  time: string;
}

interface LiveSessionDetailsProps {
  session: LiveSessionInfo;
}

export default function LiveSessionDetails({ session }: LiveSessionDetailsProps) {
  return (
    <div className="bg-[var(--bg-secondary)] backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold md:text-xl">Live Session</h2>
        <span className="px-3 py-1 text-xs font-semibold text-red-400 rounded-full bg-red-500/20 animate-pulse">
          LIVE
        </span>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <img src={session.coachImage} alt={session.coachName} className="border rounded-full w-14 h-14 border-white/10" />
        <div>
          <p className="text-lg font-semibold">{session.coachName}</p>
          <p className="text-sm text-[var(--text-secondary)] flex items-center gap-1">
            <User size={14} /> Personal Trainer
          </p>
        </div>
      </div>

      <div className="bg-[var(--bg-tertiary)] rounded-2xl p-4 mb-6 border border-white/10">
        <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
          <Clock size={16} />
          {session.time}
        </div>
        <p className="mt-2 text-sm text-[var(--text-secondary)]">
          Join your live coaching session and train together.
        </p>
      </div>

      <div className="flex gap-3">
        <a
          href={session.meetLink}
          target="_blank"
          rel="noopener noreferrer"
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
  );
}
