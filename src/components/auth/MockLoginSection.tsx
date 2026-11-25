"use client";

import React from "react";

export function MockLoginSection({
  isMockLoading,
  onMockLogin,
}: {
  isMockLoading: boolean;
  onMockLogin: (email: string, pass: string) => void;
}) {
  return (
    <div className="mt-6 mb-4">
      <div className="flex items-center justify-between mb-2.5">
        <span className="text-[11px] font-semibold tracking-wider text-emerald-400 uppercase">
          Want a Quick Look of Flexify?
        </span>
        <span className="text-[11px] text-gray-400">Here's Demo Login</span>
      </div>
      <div className="grid grid-cols-3 gap-2.5">
        {/* User Mock */}
        <button
          disabled={isMockLoading}
          type="button"
          onClick={() => onMockLogin("user@flexify.com", "User@Flexify")}
          className={`px-2 py-2 text-[11px] font-bold uppercase tracking-wider rounded-xl transition-all duration-300 ${isMockLoading ? "opacity-70 cursor-wait" : ""}`}
          style={{
            backgroundColor: "rgba(16, 185, 129, 0.1)",
            color: "var(--primary)",
            border: "1px solid var(--primary)",
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = "var(--primary)";
            e.currentTarget.style.color = "white";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = "rgba(16, 185, 129, 0.1)";
            e.currentTarget.style.color = "var(--primary)";
          }}
        >
          {isMockLoading ? "Processing..." : "User Login"}
        </button>

        {/* Coach Mock */}
        <button
          type="button"
          disabled={isMockLoading}
          onClick={() => onMockLogin("coach@flexify.com", "Coach@Flexify1")}
          className={`px-2 py-2 text-[11px] font-bold uppercase tracking-wider rounded-xl transition-all duration-300 ${isMockLoading ? "opacity-70 cursor-wait" : ""}`}
          style={{
            backgroundColor: "rgba(139, 92, 246, 0.1)",
            color: "var(--secondary)",
            border: "1px solid var(--secondary)",
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = "var(--secondary)";
            e.currentTarget.style.color = "white";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = "rgba(139, 92, 246, 0.1)";
            e.currentTarget.style.color = "var(--secondary)";
          }}
        >
          {isMockLoading ? "Processing..." : "Coach Login"}
        </button>

        {/* Admin Mock */}
        <button
          type="button"
          disabled={isMockLoading}
          onClick={() => onMockLogin("admin@flexify.com", "Admin@Flexify")}
          className={`px-2 py-2 text-[11px] font-bold uppercase tracking-wider rounded-xl transition-all duration-300 ${isMockLoading ? "opacity-70 cursor-wait" : ""}`}
          style={{
            backgroundColor: "rgba(239, 68, 68, 0.1)",
            color: "var(--danger)",
            border: "1px solid var(--danger)",
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = "var(--danger)";
            e.currentTarget.style.color = "white";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = "rgba(239, 68, 68, 0.1)";
            e.currentTarget.style.color = "var(--danger)";
          }}
        >
          {isMockLoading ? "Processing..." : "Admin Login"}
        </button>
      </div>
    </div>
  );
}
