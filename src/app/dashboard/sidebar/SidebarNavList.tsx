"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SIDEBAR_MENU_CONFIG } from "./sidebarMenuConfig";
import { PlanId } from "@/lib/plans";

interface SidebarNavListProps {
  userRole: string;
  userStatus: string;
  hasPlanAccess: (minPlan: PlanId) => boolean;
  onClose: () => void;
}

export function SidebarNavList({
  userRole,
  userStatus,
  hasPlanAccess,
  onClose,
}: SidebarNavListProps) {
  const pathname = usePathname();

  return (
    <nav className="flex-1 px-4 py-5 space-y-7">
      {SIDEBAR_MENU_CONFIG.map((group) => {
        const filtered = group.items.filter((item) => {
          const hasRole = item.roles.includes(userRole);
          const requiredPlan = item.minPlan ?? "free";
          const hasPlan = hasPlanAccess(requiredPlan);

          if (userRole === "coach" && userStatus === "pending") {
            return hasRole && item.name === "Dashboard";
          }
          if (!hasRole) return false;
          if (userRole === "user" && !hasPlan) return false;
          return true;
        });

        if (filtered.length === 0) return null;

        return (
          <div key={group.label}>
            <h3 className="px-4 text-[10px] font-black text-[var(--text-secondary)] tracking-[0.18em] mb-2.5">
              {group.label}
            </h3>
            <div className="space-y-0.5">
              {filtered.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/dashboard" && pathname.startsWith(item.href));

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={onClose}
                    className={`flex items-center justify-between px-4 py-2.5 rounded-2xl transition-all group ${
                      isActive
                        ? "bg-[var(--primary)]/10 font-semibold"
                        : "text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]"
                    }`}
                    style={{ color: isActive ? "var(--primary)" : undefined }}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon size={18} />
                      <span className="text-[13px]">{item.name}</span>
                    </div>
                    {isActive && (
                      <div className="w-1.5 h-1.5 rounded-full bg-[var(--primary)]" />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        );
      })}
    </nav>
  );
}
