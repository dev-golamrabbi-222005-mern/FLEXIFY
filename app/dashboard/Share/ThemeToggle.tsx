"use client";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(t);
  }, []);

  // Placeholder — same size, no flash
  if (!mounted) {
    return (
      <div
        className="w-[72px] h-8 rounded-full shrink-0"
        style={{ background: "var(--border-color)" }}
      />
    );
  }

  const isDark = theme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="relative flex items-center w-[72px] h-8 rounded-full p-1 shrink-0 transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-1"
      style={{
        background: isDark ? "var(--bg-tertiary)" : "var(--primary-light)",
        border: `1.5px solid ${isDark ? "var(--border-color)" : "var(--primary)"}`,
      }}
    >
      {/* ── Label text on inactive side ── */}
      <span
        className="absolute text-[9px] font-black uppercase tracking-wider select-none"
        style={{
          // When dark: show "dark" on the right (thumb is right)
          // When light: show "light" on the left (thumb is left)
          left: isDark ? undefined : "28px",
          right: isDark ? "28px" : undefined,
          color: isDark ? "var(--text-muted)" : "var(--primary-dark)",
          opacity: 0.7,
        }}
      >
        {isDark ? "Dark" : "Light"}
      </span>

      {/* ── Sliding thumb ── */}
      <motion.div
        layout
        transition={{ type: "spring", stiffness: 500, damping: 38 }}
        className="relative z-10 w-6 h-6 rounded-full flex items-center justify-center shadow"
        style={{
          marginLeft: isDark ? "auto" : "0",
          background: isDark ? "var(--bg-secondary)" : "var(--primary)",
          boxShadow: isDark
            ? "0 1px 4px rgba(0,0,0,0.5)"
            : "0 1px 6px rgba(16,185,129,0.45)",
        }}
      >
        <AnimatePresence mode="wait" initial={false}>
          {isDark ? (
            <motion.span
              key="moon"
              initial={{ rotate: -20, opacity: 0, scale: 0.5 }}
              animate={{ rotate: 0, opacity: 1, scale: 1 }}
              exit={{ rotate: 20, opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.18 }}
            >
              <Moon size={13} color="var(--primary)" />
            </motion.span>
          ) : (
            <motion.span
              key="sun"
              initial={{ rotate: 20, opacity: 0, scale: 0.5 }}
              animate={{ rotate: 0, opacity: 1, scale: 1 }}
              exit={{ rotate: -20, opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.18 }}
            >
              <Sun size={13} color="#fff" />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>
    </button>
  );
}
