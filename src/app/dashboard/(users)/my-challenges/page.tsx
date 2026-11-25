"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Loader2, Swords } from "lucide-react";
import StreakSection, { type ChallengeRecord } from "@/components/dashboard/challenges/StreakSection";
import ChallengeGlobalStats from "@/components/dashboard/challenges/ChallengeGlobalStats";
import ChallengeCard from "@/components/dashboard/challenges/ChallengeCard";
import RecentActivityList from "@/components/dashboard/challenges/RecentActivityList";
import EmptyChallengesState from "@/components/dashboard/challenges/EmptyChallengesState";

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number];

function fmtTime(secs: number) {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${m}m ${s}s`;
}

export default function MyChallengesPage() {
  const [records, setRecords] = useState<ChallengeRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const [upper, lower] = await Promise.all([
          fetch("/api/challenges/progress?type=upper-body").then((r) => r.json()),
          fetch("/api/challenges/progress?type=lower-body").then((r) => r.json()),
        ]);
        const results: ChallengeRecord[] = [];
        if (upper.progress) results.push(upper.progress);
        if (lower.progress) results.push(lower.progress);
        setRecords(results);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProgress();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3">
        <Loader2 size={32} className="animate-spin text-[var(--primary)]" />
        <p className="text-[11px] font-black uppercase tracking-widest animate-pulse text-[var(--text-muted)]">
          Loading your challenges...
        </p>
      </div>
    );
  }

  const totalDays = records.reduce((s, r) => s + (r.completedDays?.length ?? 0), 0);
  const totalCal = records.reduce((s, r) => s + r.completedDays.reduce((a, d) => a + (d.caloriesBurned ?? 0), 0), 0);
  const totalSecs = records.reduce((s, r) => s + r.completedDays.reduce((a, d) => a + (d.durationSecs ?? 0), 0), 0);

  return (
    <div className="max-w-full space-y-8 md:space-y-12 lg:space-y-16">
      <title>My Challenges | Dashboard - Flexify</title>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, ease }}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.25em] mb-1 text-[var(--primary)]">— Your Arena</p>
            <h1 className="font-bold text-3xl md:text-4xl tracking-tight uppercase text-[var(--text-primary)]">
              My Challenges
            </h1>
          </div>
          <div
            className="w-15 h-15 rounded-2xl flex items-center justify-center"
            style={{ background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.25)" }}
          >
            <Swords size={20} className="text-[var(--primary)]" />
          </div>
        </div>
      </motion.div>

      <StreakSection records={records} />

      <ChallengeGlobalStats totalDays={totalDays} totalCal={totalCal} totalSecs={totalSecs} fmtTime={fmtTime} />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {(["upper-body", "lower-body"] as const).map((type, i) => (
          <ChallengeCard
            key={type}
            type={type}
            index={i}
            record={records.find((r) => r.type === type)}
            fmtTime={fmtTime}
          />
        ))}
      </div>

      <RecentActivityList records={records} fmtTime={fmtTime} />

      {records.length === 0 && !loading && <EmptyChallengesState />}
    </div>
  );
}
