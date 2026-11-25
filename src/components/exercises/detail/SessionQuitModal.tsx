"use client";

import React from "react";
import { motion } from "framer-motion";

export function SessionQuitModal({
  open,
  onCancel,
  onConfirm,
}: {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  if (!open) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{
        background: "rgba(0,0,0,0.5)",
        backdropFilter: "blur(4px)",
      }}
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.9 }}
        className="rounded-2xl p-6 w-full max-w-xs text-center"
        style={{
          background: "var(--bg-secondary)",
          border: "1px solid var(--border-color)",
        }}
      >
        <p className="text-3xl mb-3">⚠️</p>
        <p
          className="font-black text-base mb-1"
          style={{ color: "var(--text-primary)" }}
        >
          Quit workout?
        </p>
        <p
          className="text-sm mb-5"
          style={{ color: "var(--text-secondary)" }}
        >
          Your current progress will be lost.
        </p>
        <div className="flex gap-2">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-xl text-sm font-bold"
            style={{
              background: "var(--bg-primary)",
              border: "1px solid var(--border-color)",
              color: "var(--text-primary)",
            }}
          >
            Keep Going
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2.5 rounded-xl text-sm font-black text-white bg-red-500 hover:brightness-110"
          >
            Quit
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
