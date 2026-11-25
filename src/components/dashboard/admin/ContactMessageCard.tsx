"use client";

import React from "react";
import { Clock, User, Mail, MessageSquare, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";

export interface ContactMessageItem {
  _id: string;
  name: string;
  email: string;
  message: string;
  status: "pending" | "replied";
  createdAt: string;
  repliedAt?: string;
}

interface ContactMessageCardProps {
  item: ContactMessageItem;
  isUpdating: boolean;
  onMarkAsReplied: (id: string) => void;
}

export default function ContactMessageCard({
  item,
  isUpdating,
  onMarkAsReplied,
}: ContactMessageCardProps) {
  const isReplied = item.status === "replied";
  const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${item.email}&su=${encodeURIComponent(
    "Regarding your message"
  )}&body=${encodeURIComponent(
    `Hi ${item.name},\n\n\n\n\nThank you for reaching out.\n\nBest regards,\nAdmin`
  )}`;

  return (
    <div className="card-glass group hover:border-[var(--primary)] transition-all duration-300 flex flex-col h-full">
      <div className="flex-grow">
        <div className="flex items-center gap-2 text-[var(--text-muted)] text-xs font-bold uppercase tracking-widest">
          <Clock size={14} />
          {item.createdAt ? new Date(item.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric" }) : "N/A"}
        </div>
        <div className="mt-3 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[var(--primary-light)] text-[var(--primary)] flex items-center justify-center font-bold">
            <User size={18} />
          </div>
          <div>
            <h3 className="font-bold text-base text-[var(--text-primary)]">{item.name}</h3>
            <p className="text-xs text-[var(--text-secondary)]">{item.email}</p>
          </div>
        </div>
        <div className="mt-4 p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)]">
          <p className="text-sm text-[var(--text-secondary)] whitespace-pre-wrap">{item.message}</p>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-[var(--border-color)] flex items-center justify-between">
        <span
          className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5 ${
            isReplied ? "bg-emerald-500/10 text-emerald-500" : "bg-amber-500/10 text-amber-500"
          }`}
        >
          {isReplied ? <CheckCircle2 size={12} /> : <AlertCircle size={12} />}
          {isReplied ? "Replied" : "Pending"}
        </span>

        <div className="flex items-center gap-2">
          {!isReplied && (
            <button
              onClick={() => onMarkAsReplied(item._id)}
              disabled={isUpdating}
              className="text-xs font-bold px-3 py-1.5 rounded-lg border border-[var(--border-color)] hover:border-[var(--primary)] transition"
            >
              {isUpdating ? <Loader2 size={12} className="animate-spin" /> : "Mark Replied"}
            </button>
          )}
          <a
            href={gmailUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5"
          >
            <Mail size={12} /> Reply
          </a>
        </div>
      </div>
    </div>
  );
}
