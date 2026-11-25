"use client";

import React from "react";
import { useRouter } from "next/navigation";

interface SidebarUserProfileProps {
  userName: string;
  userRole: string;
  userImage?: string | null;
  userInitial: string;
  onClose: () => void;
}

export function SidebarUserProfile({
  userName,
  userRole,
  userImage,
  userInitial,
  onClose,
}: SidebarUserProfileProps) {
  const router = useRouter();

  return (
    <div className="px-4 py-5">
      <button
        onClick={() => {
          router.push("/dashboard/profile");
          onClose();
        }}
        className="w-full flex items-center flex-col gap-3 px-4 py-6 rounded-2xl transition-all group hover:bg-[var(--bg-secondary)]"
        style={{ border: "1px solid var(--border-color)" }}
      >
        <div className="relative shrink-0">
          {userImage ? (
            <img
              src={userImage}
              alt={userName}
              className="object-cover w-16 h-16 rounded-full"
            />
          ) : (
            <div
              className="flex items-center justify-center w-10 h-10 text-base font-black text-white rounded-xl"
              style={{ background: "var(--primary)" }}
            >
              {userInitial}
            </div>
          )}
          <span
            className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2"
            style={{
              background: "#22c55e",
              borderColor: "var(--bg-nav-footer)",
            }}
          />
        </div>
        <div className="flex-1 min-w-0 text-center">
          <p
            className="font-extrabold leading-tight truncate"
            style={{ color: "var(--text-primary)" }}
          >
            {userName}
          </p>
          <p
            className="text-[10px] font-bold uppercase tracking-wider mt-0.5"
            style={{ color: "var(--primary)" }}
          >
            {userRole}
          </p>
        </div>
      </button>
    </div>
  );
}
