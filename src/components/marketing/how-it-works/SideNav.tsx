"use client";

import React from "react";
import { motion } from "framer-motion";
import { ROLES } from "./rolesData";

export function SideNav({
  active,
  onChange,
}: {
  active: number;
  onChange: (i: number) => void;
}) {
  return (
    <div className="hidden xl:flex fixed left-5 top-1/2 -translate-y-1/2 z-50 flex-col gap-5">
      {ROLES.map((r, i) => (
        <button
          key={r.id}
          onClick={() => onChange(i)}
          className="flex items-center gap-2.5 group"
        >
          <motion.div
            animate={{
              width: active === i ? 24 : 10,
              backgroundColor: active === i ? r.color : "var(--border-color)",
            }}
            className="h-[2px] rounded-full"
            transition={{ duration: 0.3 }}
          />
          <motion.span
            animate={{
              opacity: active === i ? 1 : 0,
              x: active === i ? 0 : -4,
            }}
            className="text-[10px] font-black tracking-widest"
            style={{ color: r.color }}
          >
            {r.num}
          </motion.span>
        </button>
      ))}
    </div>
  );
}
