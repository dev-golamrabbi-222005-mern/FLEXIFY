"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Timer, X, Plus, Minus } from "lucide-react";

interface RestTimerProps {
  onClose: () => void;
}

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number];

export default function RestTimer({ onClose }: RestTimerProps) {
  const [currentTime, setCurrentTime] = useState(0);
  const [targetTime, setTargetTime] = useState(60);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // ── Audio feedback ────────────────────────────────────────────────────────
  const playSound = (type: "tick" | "warning" | "finish") => {
    try {
      const AC =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      const ctx = new AC();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      const now = ctx.currentTime;

      if (type === "tick") {
        osc.frequency.setValueAtTime(400, now);
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.05, now + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
        osc.start(now);
        osc.stop(now + 0.1);
      } else if (type === "warning") {
        osc.frequency.setValueAtTime(600, now);
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.08, now + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
        osc.start(now);
        osc.stop(now + 0.15);
      } else {
        osc.frequency.setValueAtTime(800, now);
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.1, now + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
        osc.start(now);
        osc.stop(now + 0.5);
        if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
      }
    } catch (e) {
      console.error("Audio playback failed", e);
    }
  };

  // ── Timer tick ────────────────────────────────────────────────────────────
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setCurrentTime((prev) => {
        const next = prev + 1;
        const remaining = targetTime - next;
        if (remaining === 4 || remaining === 3) playSound("tick");
        if (remaining === 2 || remaining === 1) playSound("warning");
        if (remaining === 0) playSound("finish");
        return next;
      });
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [targetTime]);

  useEffect(() => {
    if (currentTime >= targetTime) onClose();
  }, [currentTime, targetTime, onClose]);

  // ── Helpers ───────────────────────────────────────────────────────────────
  const remaining = Math.max(0, targetTime - currentTime);
  const pct = Math.min((currentTime / targetTime) * 100, 100);
  const isUrgent = remaining <= 5 && remaining > 0;

  function fmt(s: number) {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${String(sec).padStart(2, "0")}`;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-end justify-center p-4"
      style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(6px)" }}
    >
      <motion.div
        initial={{ y: 60, opacity: 0, scale: 0.96 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 60, opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.35, ease }}
        className="w-full max-w-sm rounded-3xl overflow-hidden"
        style={{
          background: "var(--bg-secondary)",
          border: "1px solid var(--border-color)",
          boxShadow: "0 24px 64px rgba(0,0,0,0.4)",
        }}
      >
        {/* ── Green top strip — same as challenge cards ── */}
        <div
          className="h-1.5 w-full"
          style={{ background: "var(--primary)" }}
        />

        <div className="p-5 space-y-5">
          {/* ── Header ── */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center"
                style={{
                  background: "rgba(16,185,129,0.1)",
                  border: "1px solid rgba(16,185,129,0.2)",
                }}
              >
                <Timer
                  size={15}
                  style={{ color: "var(--primary)" }}
                  className={isUrgent ? "animate-ping" : "animate-pulse"}
                />
              </div>
              <div>
                <p
                  className="text-[10px] font-black uppercase tracking-[0.2em]"
                  style={{ color: "var(--primary)" }}
                >
                  Rest Phase
                </p>
                <p
                  className="text-[9px] font-semibold"
                  style={{ color: "var(--text-muted)" }}
                >
                  Recover before next set
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-xl transition-colors hover:bg-[var(--bg-primary)]"
              style={{ color: "var(--text-secondary)" }}
            >
              <X size={15} />
            </button>
          </div>

          {/* ── Big timer display — same font style as challenges ── */}
          <div className="text-center py-2">
            <p
              className="text-[10px] font-black uppercase tracking-widest mb-1"
              style={{ color: "var(--text-muted)" }}
            >
              Remaining
            </p>
            <motion.span
              key={remaining}
              animate={isUrgent ? { scale: [1, 1.08, 1] } : {}}
              transition={{ duration: 0.3 }}
              className="font-black tabular-nums leading-none block"
              style={{
                fontSize: "clamp(64px, 18vw, 96px)",
                color: isUrgent ? "#ef4444" : "var(--primary)",
                letterSpacing: "-0.04em",
                transition: "color 0.3s",
              }}
            >
              {fmt(remaining)}
            </motion.span>
            <p
              className="text-xs font-semibold mt-1"
              style={{ color: "var(--text-muted)" }}
            >
              of {fmt(targetTime)} rest
            </p>
          </div>

          {/* ── Progress bar — same as challenges streak bars ── */}
          <div>
            <div
              className="h-2 rounded-full overflow-hidden"
              style={{ background: "var(--bg-primary)" }}
            >
              <motion.div
                className="h-full rounded-full transition-all duration-1000 ease-linear"
                style={{
                  width: `${pct}%`,
                  background: isUrgent ? "#ef4444" : "var(--primary)",
                }}
              />
            </div>
            <div className="flex justify-between mt-1.5">
              <span
                className="text-[9px] font-black uppercase tracking-wider"
                style={{ color: "var(--text-muted)" }}
              >
                {fmt(currentTime)} elapsed
              </span>
              <span
                className="text-[9px] font-black"
                style={{ color: isUrgent ? "#ef4444" : "var(--primary)" }}
              >
                {Math.round(pct)}%
              </span>
            </div>
          </div>

          {/* ── Last 7 days style dot row — visual rest indicator ── */}
          <div className="flex gap-1.5">
            {Array.from({ length: 6 }).map((_, i) => {
              const slotSecs = (targetTime / 6) * (i + 1);
              const isElapsed = currentTime >= slotSecs;
              const isCurrent =
                currentTime >= (targetTime / 6) * i && currentTime < slotSecs;
              return (
                <motion.div
                  key={i}
                  className="flex-1 h-6 rounded-lg flex items-center justify-center"
                  style={{
                    background: isElapsed
                      ? "var(--primary)"
                      : isCurrent
                        ? "rgba(16,185,129,0.2)"
                        : "var(--bg-primary)",
                    border: isCurrent
                      ? "1.5px solid var(--primary)"
                      : "1.5px solid var(--border-color)",
                  }}
                >
                  {isElapsed && (
                    <span
                      className="text-white font-black"
                      style={{ fontSize: 8 }}
                    >
                      ✓
                    </span>
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* ── Adjust time — +/- buttons same style as challenges action buttons ── */}
          <div className="flex gap-2">
            <button
              onClick={() => setTargetTime((p) => Math.max(10, p - 10))}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-black transition-all hover:text-[var(--primary)] hover:border-[var(--primary)]"
              style={{
                border: "1.5px solid var(--border-color)",
                color: "var(--text-secondary)",
              }}
            >
              <Minus size={12} /> 10s
            </button>
            <button
              onClick={() => setTargetTime((p) => p + 10)}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-black transition-all hover:text-[var(--primary)] hover:border-[var(--primary)]"
              style={{
                border: "1.5px solid var(--border-color)",
                color: "var(--text-secondary)",
              }}
            >
              <Plus size={12} /> 10s
            </button>
          </div>

          {/* ── Skip button — same green CTA as challenges ── */}
          <motion.button
            onClick={onClose}
            whileHover={{
              scale: 1.02,
              boxShadow: "0 8px 24px rgba(16,185,129,0.4)",
            }}
            whileTap={{ scale: 0.97 }}
            className="w-full py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest text-white"
            style={{
              background: "var(--primary)",
              boxShadow: "0 4px 16px rgba(16,185,129,0.3)",
            }}
          >
            Skip Rest
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}
