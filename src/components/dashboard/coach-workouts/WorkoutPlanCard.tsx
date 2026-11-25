"use client";

import { motion } from "framer-motion";
import { Edit, Trash2, Copy, Users, Calendar, MoreVertical, Clock, UserPen } from "lucide-react";
import React from "react";

export interface WorkoutPlan {
  _id: string;
  exerciseName: string;
  clientEmail: string;
  clientName: string;
  date: string;
  time: string;
  assignedBy: string;
}

interface WorkoutPlanCardProps {
  plan: WorkoutPlan;
  index: number;
  formatTime12h: (time: string) => string;
  onDelete: (id: string) => void;
}

export default function WorkoutPlanCard({
  plan,
  index,
  formatTime12h,
  onDelete,
}: WorkoutPlanCardProps) {
  return (
    <motion.div
      key={plan._id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      className="card-glass group flex flex-col justify-between hover:scale-[1.02] transition"
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>
            {plan.exerciseName}
          </h3>
        </div>
        <button className="p-2 transition rounded-lg hover:bg-gray-200/20" style={{ color: "var(--text-muted)" }}>
          <MoreVertical size={18} />
        </button>
      </div>

      <div className="mb-5">
        <div className="p-3 border rounded-xl" style={{ borderColor: "var(--border-color)", background: "var(--bg-secondary)" }}>
          <div className="flex items-center gap-2 text-xs font-semibold" style={{ color: "var(--text-muted)" }}>
            <Users size={14} /> Client
          </div>
          <p className="mt-1 text-lg font-bold" style={{ color: "var(--text-primary)" }}>{plan.clientName}</p>
          <p className="text-sm text-[var(--text-muted)]">{plan.clientEmail}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-5 text-sm" style={{ color: "var(--text-secondary)" }}>
        <Calendar size={16} style={{ color: "var(--primary)" }} />
        Date: <span className="font-semibold" style={{ color: "var(--text-primary)" }}>{plan.date}</span>
      </div>

      <div className="flex items-center gap-2 mb-5 text-sm" style={{ color: "var(--text-secondary)" }}>
        <Clock size={16} style={{ color: "var(--primary)" }} />
        Time: <span className="font-semibold" style={{ color: "var(--text-primary)" }}>{formatTime12h(plan.time)}</span>
      </div>

      <div className="flex items-center gap-2 mb-5 text-sm" style={{ color: "var(--text-secondary)" }}>
        <UserPen size={16} style={{ color: "var(--primary)" }} />
        Assigned By: <span className="font-semibold" style={{ color: "var(--text-primary)" }}>{plan.assignedBy}</span>
      </div>

      <div className="flex gap-2 pt-4 border-t" style={{ borderColor: "var(--border-color)" }}>
        <button className="flex items-center justify-center flex-1 gap-1 text-xs btn-secondary">
          <Edit size={14} /> Edit
        </button>
        <button className="flex items-center justify-center flex-1 gap-1 text-xs btn-secondary">
          <Copy size={14} /> Copy
        </button>
        <button onClick={() => onDelete(plan._id)} className="p-2 transition rounded-xl hover:bg-red-500/10" style={{ color: "var(--danger)" }}>
          <Trash2 size={16} />
        </button>
      </div>
    </motion.div>
  );
}
