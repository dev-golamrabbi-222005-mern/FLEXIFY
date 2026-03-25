
"use client";

import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

const sessions = [
  { day: 1, time: "10:00 AM", client: "Arif Hossain", type: "Upper Body" },
  { day: 1, time: "2:00 PM", client: "Kamal Uddin", type: "Leg Day" },
  { day: 3, time: "9:00 AM", client: "Nadia Akter", type: "Cardio HIIT" },
  { day: 3, time: "11:00 AM", client: "Rashed Khan", type: "Full Body" },
  { day: 5, time: "10:00 AM", client: "Sabrina Islam", type: "Yoga" },
  { day: 8, time: "9:00 AM", client: "Fatima Begum", type: "Post-natal" },
  { day: 10, time: "10:00 AM", client: "Arif Hossain", type: "Push Day" },
  { day: 12, time: "2:00 PM", client: "Kamal Uddin", type: "Pull Day" },
  { day: 15, time: "9:00 AM", client: "Nadia Akter", type: "Cardio" },
];

const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function CoachSchedule() {

  const [currentMonth] = useState(new Date(2025, 2));

  const daysInMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0
  ).getDate();

  const firstDay = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    1
  ).getDay();

  const monthName = currentMonth.toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  const calendarDays: (number | null)[] = [];

  for (let i = 0; i < firstDay; i++) calendarDays.push(null);
  for (let i = 1; i <= daysInMonth; i++) calendarDays.push(i);

  return (
    <>

      <div className="max-w-7xl mx-auto space-y-8">
         <title>Coach-Schedule | Dashboard - Flexify</title>

        {/* Header */}
        <div>
          <h1
            className="text-2xl font-bold"
            style={{ color: "var(--text-primary)" }}
          >
            Schedule
          </h1>

          <p
            className="text-sm mt-1"
            style={{ color: "var(--text-muted)" }}
          >
            Manage your availability and training sessions
          </p>
        </div>

        {/* Calendar */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-glass"
        >

          {/* Month header */}
          <div className="flex items-center justify-between mb-6">

            <button
              className="p-2 rounded-lg hover:bg-gray-500/10"
            >
              <ChevronLeft size={20} />
            </button>

            <h2
              className="text-lg font-semibold"
              style={{ color: "var(--text-primary)" }}
            >
              {monthName}
            </h2>

            <button
              className="p-2 rounded-lg hover:bg-gray-500/10"
            >
              <ChevronRight size={20} />
            </button>

          </div>

          {/* Week Days */}
          <div className="grid grid-cols-7 gap-1 mb-2">

            {daysOfWeek.map((d) => (
              <div
                key={d}
                className="text-center text-xs font-medium py-2"
                style={{ color: "var(--text-muted)" }}
              >
                {d}
              </div>
            ))}

          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-2">

            {calendarDays.map((day, i) => {

              const daySessions = day
                ? sessions.filter((s) => s.day === day)
                : [];

              return (
                <div
                  key={i}
                  className="min-h-[85px] p-2 rounded-xl"
                  style={{
                    border: "1px solid var(--border-color)",
                    background: "var(--bg-secondary)",
                  }}
                >

                  {day && (
                    <>
                      {/* Day Number */}
                      <span
                        className="text-xs font-semibold"
                        style={{
                          color:
                            day === new Date().getDate()
                              ? "white"
                              : "var(--text-primary)",
                          background:
                            day === new Date().getDate()
                              ? "var(--primary)"
                              : "transparent",
                          padding:
                            day === new Date().getDate()
                              ? "2px 6px"
                              : "0",
                          borderRadius:
                            day === new Date().getDate()
                              ? "999px"
                              : "0",
                        }}
                      >
                        {day}
                      </span>

                      {/* Sessions */}
                      {daySessions.map((s, j) => (
                        <div
                          key={j}
                          className="mt-1 px-2 py-1 rounded text-[10px] truncate"
                          style={{
                            background: "var(--primary-light)",
                            color: "var(--primary)",
                          }}
                        >
                          {s.time} – {s.client.split(" ")[0]}
                        </div>
                      ))}

                    </>
                  )}

                </div>
              );
            })}

          </div>
        </motion.div>

        {/* Upcoming Sessions */}
        <motion.div
          className="card-glass"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >

          <h3
            className="font-semibold mb-4"
            style={{ color: "var(--text-primary)" }}
          >
            Upcoming Sessions
          </h3>

          <div className="space-y-3">

            {sessions.slice(0, 5).map((s, i) => (

              <div
                key={i}
                className="flex items-center justify-between p-3 rounded-xl"
                style={{
                  background: "var(--bg-secondary)",
                  border: "1px solid var(--border-color)",
                }}
              >

                <div>
                  <span
                    className="text-sm font-medium"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {s.client}
                  </span>

                  <p
                    className="text-xs"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {s.type}
                  </p>
                </div>

                <div className="text-right">

                  <span
                    className="text-xs font-mono"
                    style={{ color: "var(--primary)" }}
                  >
                    {s.time}
                  </span>

                  <p
                    className="text-xs"
                    style={{ color: "var(--text-muted)" }}
                  >
                    March {s.day}
                  </p>

                </div>

              </div>

            ))}

          </div>
        </motion.div>

      </div>

    </>
  );
}