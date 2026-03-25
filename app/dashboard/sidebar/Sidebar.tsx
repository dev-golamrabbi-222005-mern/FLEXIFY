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
  User,
  BookText,
  MessageCircle,
  Workflow,
  EarIcon,
  Swords,
  Apple,
  Calendar1,
  Star,
  Magnet,
  UserCheck2,
  Shield,
  MessageCircleCode,
  ShieldAlertIcon,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

// ── Menu config — MAIN MENU items was accidentally double-wrapped in an array ──
const menuConfig = [
  {
    label: "MAIN MENU",
    items: 
[
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: Home,
    roles: ["user", "admin", "coach"],
  },
  {
    name: "Create Workout",
    href: "/dashboard/create-workout",
    icon: PlusCircle,
    roles: ["user"],
  },
  {
    name: "Your Workouts",
    href: "/dashboard/your-workouts",
    icon: Dumbbell,
    roles: ["user"],
  },
  {
    name: "Assigned",
    href: "/dashboard/assigned-coach",
    icon: UserCheck2,
    roles: ["user"],
  },
  {
    name: "Progress",
    href: "/dashboard/user-progress",
    icon: Shield,
    roles: ["user"],
  },
  {
    name: "Update Profile",
    href: "/dashboard/user-form",
    icon: UserPen,
    roles: ["user"],
  },
  {
    name: "User Profile",
    href: "/dashboard/user-profile",
    icon: ShieldAlertIcon,
    roles: ["user"],
  },
  {
    name: "My Goals",
    href: "/dashboard/my-goals",
    icon: Flag,
    roles: ["user"],
  },
  {
    name: "Nutrition",
    href: "/dashboard/nutrition-tracker",
    icon: Utensils,
    roles: ["user"],
  },
  {
    name: "Schedule",
    href: "/dashboard/schedule",
    icon: Calendar,
    roles: ["user"],
  },
  {
    name: "Achievements",
    href: "/dashboard/achievements",
    icon: Trophy,
    roles: ["user"],
  },
  {
    name: "Challenges",
    href: "/dashboard/my-challenges",
    icon: Swords,
    roles: ["user"],
  },
  {
    name: "Notification",
    href: "/dashboard/user-notification",
    icon: MessageCircleCode,
    roles: ["user"],
  },
  {
    name: "Live Sessions",
    href: "/dashboard/live-sessions",
    icon: Video,
    roles: ["user"],
  },
  {
    name: "User Update Form",
    href: "/dashboard/fitness-update-form",
    icon: BookText,
    roles: ["user"],
  },
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
        name: "Wants to connect",
        href: "/dashboard/admin-users-connect",
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
      {
        name: "My Trainees",
        href: "/dashboard/coach-traines",
        icon: User,
        roles: ["coach"],
      },
      {
        name: "Message",
        href: "/dashboard/coach-messages",
        icon: MessageCircle,
        roles: ["coach"],
      },
      {
        name: "Workouts",
        href: "/dashboard/coach-workouts",
        icon: Workflow,
        roles: ["coach"],
      },
      {
        name: "Earning",
        href: "/dashboard/coach-earning",
        icon: EarIcon,
        roles: ["coach"],
      },
      {
        name: "Nutrition",
        href: "/dashboard/coach-nutrition",
        icon: Apple,
        roles: ["coach"],
      },
      {
        name: "Schedule",
        href: "/dashboard/coach-schedule",
        icon: Calendar,
        roles: ["coach"],
      },
      {
        name: "Reviews",
        href: "/dashboard/coach-reviews",
        icon: Star,
        roles: ["coach"],
      },
      {
        name: "Profile",
        href: "/dashboard/coach-profile",
        icon: UserRoundPen,
        roles: ["coach"],
      },
    ],
  },
  {
    label: "ACCOUNT",
    items: [
      {
        name: "Live Sessions",
        href: "/dashboard/live-sessions",
        icon: Video,
        roles: ["coach"],
      },
      {
        name: "Settings",
        href: "/dashboard/settings",
        icon: Settings,
        roles: ["user", "admin", "coach"],
      },
    ],
  },
];

function SidebarContent({ onClose }: { onClose: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();

  const { data: dbUser, isLoading } = useQuery({
    queryKey: ["currentUser", session?.user?.email],
    queryFn: async () => {
      if (!session?.user?.email) return null;
      const res = await axios.get(`/api/user/me?email=${session.user.email}`);
      return res.data;
    },
    enabled: !!session?.user?.email,
  });

  if (isLoading) return null;

  const userRole = dbUser?.role || "user";
  const userStatus = dbUser?.status || "approved";
  const userName = dbUser?.name || "User";
  const userImage = dbUser?.image || session?.user?.image;
  const userInitial = userName.charAt(0).toUpperCase();
  const userPlan = dbUser?.plan ?? "free";

  return (
    <div className="flex flex-col h-full overflow-y-auto custom-scrollbar">
      {/* Mobile close */}
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

      {/* Profile card */}
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

      {/* Nav */}
      <nav className="flex-1 px-4 py-5 space-y-7">
        {menuConfig.map((group) => {
          const filtered = group.items.filter((item) => {
            const hasRole = item.roles.includes(userRole);
            if (userRole === "coach" && userStatus === "pending") {
              return hasRole && item.name === "Dashboard";
            }
            return hasRole;
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
                    (item.href !== "/dashboard" &&
                      pathname.startsWith(item.href));
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

      {/* Upgrade card — dynamic based on plan */}
      {userRole === "user" &&
        userStatus === "approved" &&
        (() => {
          if (userPlan === "elite") {
            return (
              <div className="px-4 pb-4">
                <div className="bg-gradient-to-br from-[#7c3aed] to-[#059669] rounded-[1.5rem] p-5 text-white shadow-lg relative overflow-hidden">
                  <div className="absolute -right-4 -top-4 w-20 h-20 bg-white/10 rounded-full" />
                  <div className="bg-white/20 w-9 h-9 rounded-xl flex items-center justify-center mb-3 backdrop-blur-sm text-lg">
                    🏆
                  </div>
                  <h4 className="mb-1 text-sm font-bold">
                    You&apos;re on Elite!
                  </h4>
                  <p className="text-[11px] text-purple-100 mb-1 leading-relaxed">
                    You have full access — AI coaching, personal coach, and
                    everything in between.
                  </p>
                  <p className="text-[10px] text-white/50 font-semibold uppercase tracking-wider">
                    Maximum level unlocked 🎉
                  </p>
                </div>
              </div>
            );
          }
          if (userPlan === "pro") {
            return (
              <div className="px-4 pb-4">
                <div className="bg-gradient-to-br from-[#f47920] to-[#dc2626] rounded-[1.5rem] p-5 text-white shadow-lg relative overflow-hidden">
                  <div className="absolute -right-4 -top-4 w-20 h-20 bg-white/10 rounded-full" />
                  <div className="bg-white/20 w-9 h-9 rounded-xl flex items-center justify-center mb-3 backdrop-blur-sm">
                    <Trophy size={18} />
                  </div>
                  <h4 className="mb-1 text-sm font-bold">Upgrade to Elite</h4>
                  <p className="text-[11px] text-orange-100 mb-3 leading-relaxed">
                    Get a personal coach, custom plans, and direct messaging.
                  </p>
                  <button
                    onClick={() => (window.location.href = "/#pricing")}
                    className="w-full bg-white py-2 rounded-xl text-xs font-extrabold hover:bg-orange-50 transition-all active:scale-95"
                    style={{ color: "#f47920" }}
                  >
                    Go Elite →
                  </button>
                </div>
              </div>
            );
          }
          return (
            <div className="px-4 pb-4">
              <div className="bg-gradient-to-br from-[#F59E0B] to-[#059669] rounded-[1.5rem] p-5 text-white shadow-lg relative overflow-hidden">
                <div className="absolute -right-4 -top-4 w-20 h-20 bg-white/10 rounded-full" />
                <div className="bg-white/20 w-9 h-9 rounded-xl flex items-center justify-center mb-3 backdrop-blur-sm">
                  <Trophy size={18} />
                </div>
                <h4 className="mb-1 text-sm font-bold">Upgrade to Pro</h4>
                <p className="text-[11px] text-emerald-100 mb-3 leading-relaxed">
                  Unlock AI coaching, full workout library, and advanced
                  analytics.
                </p>
                <button
                  onClick={() => (window.location.href = "/#pricing")}
                  className="w-full bg-white py-2 rounded-xl text-xs font-extrabold hover:bg-emerald-50 transition-all active:scale-95"
                  style={{ color: "var(--primary)" }}
                >
                  Upgrade Now
                </button>
              </div>
            </div>
          );
        })()}

      {/* Logout */}
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

const Sidebar = ({ open, onClose }: SidebarProps) => {
  return (
    <>
      <aside className="hidden md:flex flex-col w-64 shrink-0 h-full overflow-hidden border-r border-[var(--border-color)] bg-[var(--bg-nav-footer)]">
        <SidebarContent onClose={onClose} />
      </aside>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 z-40 bg-black/50 md:hidden"
            />
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
