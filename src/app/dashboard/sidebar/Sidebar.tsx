"use client";

import React from "react";
import { useSession, signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { LogOut, X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { getPlan, PlanId } from "@/lib/plans";
import { SidebarUserProfile } from "./SidebarUserProfile";
import { SidebarNavList } from "./SidebarNavList";
import { SidebarUpgradeCard } from "./SidebarUpgradeCard";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

function SidebarContent({ onClose }: { onClose: () => void }) {
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
  const userPlan = (dbUser?.plan as PlanId) || "free";

  const planOrder: Record<PlanId, number> = {
    free: 0,
    pro: 1,
    elite: 2,
  };
  const plan = getPlan(userPlan);
  const hasPlanAccess = (requiredPlan: PlanId) =>
    planOrder[plan.id] >= planOrder[requiredPlan];

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

      <SidebarUserProfile
        userName={userName}
        userRole={userRole}
        userImage={userImage}
        userInitial={userInitial}
        onClose={onClose}
      />

      <SidebarNavList
        userRole={userRole}
        userStatus={userStatus}
        hasPlanAccess={hasPlanAccess}
        onClose={onClose}
      />

      <SidebarUpgradeCard
        userRole={userRole}
        userStatus={userStatus}
        userPlan={userPlan}
      />

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

export default function Sidebar({ open, onClose }: SidebarProps) {
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
}
