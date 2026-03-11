"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { signOut } from "next-auth/react";
import {Home, Flag, Utensils, Calendar, Trophy, BarChart2, Settings,Video, BrickWallShield, UserRoundCog, ChartNoAxesGanttIcon, UserPen, Speech, X, LogOut,} from "lucide-react";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

const menuConfig = [
  {
    label: "MAIN MENU",
    items: [
      {name: "Dashboard", href: "/dashboard", icon: Home, roles: ["user", "admin", "coach"]},
      {name: "Exercise", href: "/dashboard/workout-builder", icon: ChartNoAxesGanttIcon, roles: ["user"]},
      {name: "My Goals", href: "/dashboard/my-goals",icon: Flag, roles: ["user"]},
      {name: "Nutrition", href: "/dashboard/nutrition-tracker", icon: Utensils, roles: ["user"]},
      {name: "Schedule",  href: "/dashboard/schedule", icon: Calendar, roles: ["user"]},
      {name: "Achievements", href: "/dashboard/achievements", icon: Trophy, roles: ["user"]},
      {name: "Live Sessions", href: "/dashboard/live-sessions", icon: Video, roles: ["user"]},
    ],
  },
  {
    label: "ADMIN",
    items: [
      {
        name: "Admin Stats",
        href: "/dashboard/admin-stats",
        icon: BrickWallShield,
        roles: ["admin"],
      },
      {
        name: "User Management",
        href: "/dashboard/admin-management",
        icon: UserRoundCog,
        roles: ["admin"],
      },
    ],
  },
  {
    label: "COACH",
    items: [
      {
        name: "Client Progress",
        href: "/dashboard/client-progress",
        icon: UserPen,
        roles: ["coach"],
      },
      {
        name: "Session Planner",
        href: "/dashboard/session-planner",
        icon: Speech,
        roles: ["coach"],
      },
    ],
  },
  {
    label: "ACCOUNT",
    items: [
      {
        name: "Statistics",
        href: "/dashboard/statistics",
        icon: BarChart2,
        roles: ["user", "admin", "coach"],
      },
      {name: "Live Sessions", href: "/dashboard/live-sessions", icon: Video, roles: ["coach"]},
      {
        name: "Settings",
        href: "/dashboard/settings",
        icon: Settings,
        roles: ["user", "admin", "coach"],
      },
    ],
  },
];

// ─── Sidebar Content (shared between desktop & mobile drawer) ─────────────────
function SidebarContent({ onClose }: { onClose: () => void }) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const userRole = (session?.role as string) || "user";

  return (
    <div className="flex flex-col h-full overflow-y-auto custom-scrollbar">
      {/* ── Close button — mobile drawer only ── */}
      <div className="md:hidden flex items-center justify-between px-5 py-4 border-b border-[var(--border-color)]">
        <span className="text-sm font-black tracking-widest text-[var(--text-secondary)] uppercase">
          Menu
        </span>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg hover:bg-[var(--bg-secondary)] transition-colors"
        >
          <X size={18} className="text-[var(--text-secondary)]" />
        </button>
      </div>

      {/* ── Navigation ── */}
      <nav className="flex-1 px-4 py-5 space-y-7">
        {menuConfig.map((group) => {
          const filtered = group.items.filter((i) =>
            i.roles.includes(userRole),
          );
          if (filtered.length === 0) return null;

          return (
            <div key={group.label}>
              <h3 className="px-4 text-[10px] font-black text-[var(--text-secondary)] tracking-[0.18em] mb-2.5">
                {group.label}
              </h3>
              <div className="space-y-0.5">
                {filtered.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={onClose}
                      className={`flex items-center justify-between px-4 py-2.5 rounded-2xl transition-all group
                        ${
                          isActive
                            ? "bg-[var(--primary)]/10 text-[var(--primary)] font-semibold"
                            : "text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)]"
                        }`}
                    >
                      <div className="flex items-center gap-3">
                        <item.icon
                          size={18}
                          className={
                            isActive
                              ? "text-[var(--primary)]"
                              : "text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]"
                          }
                        />
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

      {/* ── Upgrade Card ── */}
      <div className="px-4 pb-4">
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-[1.5rem] p-5 text-white shadow-lg relative overflow-hidden">
          <div className="absolute -right-4 -top-4 w-20 h-20 bg-white/10 rounded-full" />
          <div className="bg-white/20 w-9 h-9 rounded-xl flex items-center justify-center mb-3 backdrop-blur-sm">
            <Trophy size={18} />
          </div>
          <h4 className="text-sm font-bold mb-1">Upgrade to Pro</h4>
          <p className="text-[11px] text-orange-100 mb-3 leading-relaxed">
            Your trial ends in 7 days. Unlock all features.
          </p>
          <button className="w-full bg-white text-orange-600 py-2 rounded-xl text-xs font-extrabold hover:bg-orange-50 transition-all active:scale-95">
            Upgrade Now
          </button>
        </div>
      </div>

      {/* ── Logout ── */}
      <div className="px-4 pb-5">
        <button
          onClick={() => signOut()}
          className="flex items-center gap-3 w-full px-4 py-3 text-[var(--text-secondary)] hover:text-red-500 hover:bg-red-500/10 rounded-2xl transition-all group"
        >
          <LogOut size={18} className="group-hover:text-red-500" />
          <span className="text-sm font-semibold">Log Out</span>
        </button>
      </div>
    </div>
  );
}

// ─── Main Sidebar (desktop static + mobile drawer) ────────────────────────────
const Sidebar = ({ open, onClose }: SidebarProps) => {
  return (
    <>
      {/* ── Desktop sidebar — sticky with own scroll ── */}
      <aside className="hidden md:flex flex-col w-64 shrink-0 h-full overflow-hidden border-r border-[var(--border-color)] bg-[var(--bg-nav-footer)]">
        <SidebarContent onClose={onClose} />
      </aside>

      {/* ── Mobile drawer — slides from RIGHT ── */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 z-40 bg-black/50 md:hidden"
            />

            {/* Drawer from right */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 32 }}
              className="fixed top-0 right-0 z-50 h-full w-72 md:hidden bg-[var(--bg-nav-footer)] border-l border-[var(--border-color)]"
            >
              <SidebarContent onClose={onClose} />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
