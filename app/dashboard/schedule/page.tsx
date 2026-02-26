"use client";

import { CalendarDays, Clock, Dumbbell } from "lucide-react";

const scheduleData = [
  {
    day: "Monday",
    workout: "Chest & Triceps",
    time: "6:00 AM - 7:30 AM",
    status: "Completed",
  },
  {
    day: "Tuesday",
    workout: "Back & Biceps",
    time: "6:00 AM - 7:30 AM",
    status: "Pending",
  },
  {
    day: "Wednesday",
    workout: "Leg Day",
    time: "6:00 AM - 7:30 AM",
    status: "Upcoming",
  },
  {
    day: "Thursday",
    workout: "Shoulders",
    time: "6:00 AM - 7:30 AM",
    status: "Upcoming",
  },
];

export default function SchedulePage() {
  return (
    <div className="mt-10 max-w-7xl mx-auto bg-[var(--bg-primary)] px-4">
      {/* Title */}
      <div className="flex items-center gap-3 mb-6">
        <CalendarDays className="w-7 h-7 text-orange-500" />
        <h1 className="text-2xl font-bold">Workout Weekly Schedule</h1>
      </div>

      {/* Schedule Cards */}
      <div className="grid md:grid-cols-2 gap-6">
        {scheduleData.map((item, index) => (
          <div
            key={index}
            className="group bg-[var(--card-bg)] border border-[var(--primary)] rounded-2xl p-8 text-left relative
                         transition-all duration-300
                         hover:-translate-y-2
                         hover:shadow-[0_20px_40px_rgba(0,0,0,0.25)] text-[var(--text-primary)]"
          >
            {/* Day */}
            <h2 className="text-lg font-semibold mb-3">{item.day}</h2>

            {/* Workout */}
            <div className="flex items-center gap-2 text-[var(--text-primary)] mb-2">
              <Dumbbell className="w-5 h-5 text-orange-500" />
              <span>{item.workout}</span>
            </div>

            {/* Time */}
            <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)] mb-4">
              <Clock className="w-4 h-4" />
              {item.time}
            </div>

            {/* Status */}
            <span
              className={`text-xs px-3 py-1 rounded-full font-medium ${
                item.status === "Completed"
                  ? "bg-green-500/20 text-green-500"
                  : item.status === "Pending"
                  ? "bg-yellow-500/20 text-yellow-500"
                  : "bg-blue-500/20 text-blue-500"
              }`}
            >
              {item.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}