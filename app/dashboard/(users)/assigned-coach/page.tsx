

"use client";

import { User, MessageCircle } from "lucide-react";

export default function Coaches() {
  return (
    <div className="space-y-8">
       <title>Assigned Coach | Dashboard - Flexify</title>
      {/* Header */}
      <div className="flex items-center gap-3">
        <User className="text-[var(--primary)]" />
        <h2 className="text-2xl font-extrabold uppercase tracking-tight text-[var(--text-primary)]">
          Coaches
        </h2>
      </div>

      {/* Assigned Coach */}
      <div className="p-5 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-color)]">
        <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[var(--text-muted)]">
          Assigned Coach
        </p>

        <div className="flex justify-between items-center mt-3">
          <h3 className="text-lg font-bold tracking-tight text-[var(--text-primary)]">
            Rahim Coach
          </h3>

          <button className="flex items-center gap-2 text-[11px] font-semibold tracking-wide bg-[var(--primary)] text-white px-4 py-1.5 rounded-lg">
            <MessageCircle size={14} />
            Message
          </button>
        </div>
      </div>

      {/* Coach List */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Coach 1 */}
        <div className="p-5 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-color)] flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold tracking-tight text-[var(--text-primary)]">
              Karim Coach
            </h3>
            <p className="text-[12px] font-medium tracking-wide text-[var(--text-muted)] mt-1">
              Weight Loss Specialist
            </p>
          </div>

          <button className="mt-5 text-[11px] font-bold uppercase tracking-widest bg-[var(--primary)] text-white py-2.5 rounded-xl">
            Request Coach
          </button>
        </div>

        {/* Coach 2 */}
        <div className="p-5 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-color)] flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold tracking-tight text-[var(--text-primary)]">
              Hasan Coach
            </h3>
            <p className="text-[12px] font-medium tracking-wide text-[var(--text-muted)] mt-1">
              Muscle Gain Expert
            </p>
          </div>

          <button className="mt-5 text-[11px] font-bold uppercase tracking-widest bg-[var(--primary)] text-white py-2.5 rounded-xl">
            Request Coach
          </button>
        </div>

        {/* Coach 3 */}
        <div className="p-5 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-color)] flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold tracking-tight text-[var(--text-primary)]">
              Ali Coach
            </h3>
            <p className="text-[12px] font-medium tracking-wide text-[var(--text-muted)] mt-1">
              Strength Training
            </p>
          </div>

          <button className="mt-5 text-[11px] font-bold uppercase tracking-widest bg-[var(--primary)] text-white py-2.5 rounded-xl">
            Request Coach
          </button>
        </div>
      </div>
    </div>
  );
}



