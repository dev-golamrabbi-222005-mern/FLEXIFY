"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { signOut } from "next-auth/react";
import {
  BarChart2,
  BrickWallShield,
  Calendar,
  ChartNoAxesGanttIcon,
  CircleDollarSign,
  Dumbbell,
  FileCog,
  Flag,
  Home,
  LayersPlus,
  LogOut,
  MessageSquareWarning,
  NotebookText,
  PlusCircle,
  Settings,
  Speech,
  SquareLibrary,
  TableOfContents,
  Trophy,
  UserPen,
  UserRoundCog,
  UserRoundPen,
  Utensils,
  Video,
  X,
  BookText,
} from "lucide-react";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

const menuConfig = [
  {
    label: "MAIN MENU",
    items: [
      {name: "Dashboard", href: "/dashboard", icon: Home, roles: ["user", "admin", "coach"]},
      {name: "Create Workout", href: "/dashboard/create-workout", icon: PlusCircle, roles: ["user"]},
      {name: "Your Workouts", href: "/dashboard/your-workouts", icon: Dumbbell, roles: ["user"]},
      {name: "User Form", href: "/dashboard/user-form", icon: BookText, roles: ["user"]},
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
        name: "Admin Management",
        href: "/dashboard/admin-management",
        icon: UserRoundCog,
        roles: ["admin"],
      },
       {
        name: "Coach Applications",
        href: "/dashboard/admin-coach-applications",
        icon: NotebookText,
        roles: ["admin"],
      },
       {
        name: "Coach Management",
        href: "/dashboard/admin-coach-management",
        icon: LayersPlus,
        roles: ["admin"],
      },
       {
        name: "Workout Library",
        href: "/dashboard/admin-workout-library",
        icon: SquareLibrary,
        roles: ["admin"],
      },
       {
        name: "Content Management",
        href: "/dashboard/admin-content-management",
        icon: TableOfContents,
        roles: ["admin"],
      },
       {
        name: "Reports & Analytics",
        href: "/dashboard/admin-reports-analytics",
        icon: MessageSquareWarning,
        roles: ["admin"],
      },
       {
        name: "Payments / Subscriptions",
        href: "/dashboard/admin-payments-subscriptions",
        icon: CircleDollarSign,
        roles: ["admin"],
      },
       {
        name: "System Settings",
        href: "/dashboard/admin-system-settings",
        icon: FileCog,
        roles: ["admin"],
      },
       {
        name: "Admin Profile",
        href: "/dashboard/admin-profile",
        icon: UserRoundPen,
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
  const router = useRouter();
  const { data: session } = useSession();
  const userRole = (session?.role as string) || "user";
  const userName = session?.user?.name || "User";
  const userImage = session?.user?.image;
  const userInitial = userName.charAt(0).toUpperCase();

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

      {/* ── Profile Card ── */}
      <div className="px-4 py-5">
        <button
          onClick={() => {
            router.push("/dashboard/profile");
            onClose();
          }}
          className="w-full flex items-center flex-col gap-3 px-4 py-6 rounded-2xl transition-all group hover:bg-[var(--bg-secondary)]"
          style={{ border: "1px solid var(--border-color)" }}
        >
          {/* Avatar */}
          <div className="relative shrink-0">
            {userImage ? (
              <img
                src={userImage}
                alt={userName}
                className="w-16 h-16 rounded-full object-cover"
              />
            ) : (
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-base text-white"
                style={{ background: "var(--primary)" }}
              >
                {userInitial}
              </div>
            )}
            {/* Online dot */}
            <span
              className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2"
              style={{
                background: "#22c55e",
                borderColor: "var(--bg-nav-footer)",
              }}
            />
          </div>

          {/* Name + role */}
          <div className="flex-1 min-w-0 text-center">
            <p
              className="font-extrabold truncate leading-tight"
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
        <div className="bg-gradient-to-br from-[#F59E0B] to-[#059669] rounded-[1.5rem] p-5 text-white shadow-lg relative overflow-hidden">
          <div className="absolute -right-4 -top-4 w-20 h-20 bg-white/10 rounded-full" />
          <div className="bg-white/20 w-9 h-9 rounded-xl flex items-center justify-center mb-3 backdrop-blur-sm">
            <Trophy size={18} />
          </div>
          <h4 className="mb-1 text-sm font-bold">Upgrade to Pro</h4>
          <p className="text-[11px] text-emerald-100 mb-3 leading-relaxed">
            Your trial ends in 7 days. Unlock all features.
          </p>
          <button className="w-full bg-white text-(--primary-dark) py-2 rounded-xl text-xs font-extrabold hover:bg-emerald-50 transition-all active:scale-95">
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
