"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LogIn } from "lucide-react";

interface Props {
  open: boolean;
  onLogin: () => void;
  onCancel: () => void;
}

export function LoginWarningModal({ open, onLogin, onCancel }: Props) {
  const [confirmLose, setConfirmLose] = useState(false);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            className="w-full max-w-sm rounded-3xl p-6"
            style={{
              background: "var(--bg-secondary)",
              border: "1px solid var(--border-color)",
            }}
          >
            {!confirmLose ? (
              <>
                <div className="text-4xl mb-4 text-center">⚠️</div>
                <h3
                  className="font-black text-base text-center mb-3"
                  style={{ color: "var(--text-primary)" }}
                >
                  Save Your Progress
                </h3>
                <p
                  className="text-sm text-center mb-6 leading-relaxed"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Please login to keep your progress recorded, otherwise it will
                  be lost.
                </p>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={onLogin}
                    className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl font-black text-sm text-white"
                    style={{
                      background: "var(--primary)",
                      boxShadow: "0 4px 20px rgba(244,121,32,0.4)",
                    }}
                  >
                    <LogIn size={16} /> Login to Save
                  </button>
                  <button
                    onClick={() => setConfirmLose(true)}
                    className="w-full py-3 rounded-2xl font-semibold text-sm transition-colors"
                    style={{
                      border: "1px solid var(--border-color)",
                      color: "var(--text-secondary)",
                    }}
                  >
                    Continue without saving
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="text-4xl mb-4 text-center">🗑️</div>
                <h3
                  className="font-black text-base text-center mb-3"
                  style={{ color: "var(--text-primary)" }}
                >
                  Are you sure?
                </h3>
                <p
                  className="text-sm text-center mb-6"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Your workout record for today will be permanently lost.
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setConfirmLose(false)}
                    className="flex-1 py-3 rounded-2xl font-bold text-sm"
                    style={{
                      background: "var(--bg-primary)",
                      border: "1px solid var(--border-color)",
                      color: "var(--text-primary)",
                    }}
                  >
                    Go Back
                  </button>
                  <button
                    onClick={onCancel}
                    className="flex-1 py-3 rounded-2xl font-black text-sm text-white bg-red-500"
                  >
                    Yes, Lose It
                  </button>
                </div>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
