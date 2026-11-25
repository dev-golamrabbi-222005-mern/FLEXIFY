"use client";

import React from "react";
import Image from "next/image";
import { DbUser } from "./types";

export function SettingsHeroProfile({ user }: { user: DbUser }) {
  const avatarUrl = user.profileImage || user.imageUrl || "/default-avatar.png";
  const role = (user.role || "user").toUpperCase();

  return (
    <div className="card-glass p-5 rounded-2xl border border-[var(--border-color)] flex items-center gap-4">
      <div className="relative shrink-0 w-16 h-16 rounded-full overflow-hidden bg-[var(--bg-secondary)] border-2 border-[var(--border-color)]">
        <Image
          src={avatarUrl}
          alt={user.name || "User Avatar"}
          fill
          className="object-cover"
        />
        <span className="absolute bottom-1 right-1 w-3 h-3 rounded-full bg-emerald-500 border-2 border-[var(--bg-secondary)] shadow-sm" />
      </div>

      <div className="min-w-0 flex-1">
        <h2 className="text-lg font-black text-[var(--text-primary)] truncate">
          {user.name || "Flexify Member"}
        </h2>
        <p className="text-xs font-medium text-[var(--text-secondary)] truncate">
          {user.email || "user@flexify.com"}
        </p>
        <div className="mt-1.5">
          <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-widest bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            {role}
          </span>
        </div>
      </div>
    </div>
  );
}
