// app/dashboard/DashboardLayoutClient.tsx
"use client";

import { useState } from "react";
import DashboardNavbar from "./Share/DashboardNavbar";
import Sidebar from "./sidebar/Sidebar";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import RoleSelectionModal from "@/components/auth/RoleSelectionModal";
import { Clock, Loader2 } from "lucide-react";

export default function DashboardLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { data: session, status } = useSession();

  const { data: dbUser, isLoading } = useQuery({
    queryKey: ["currentUser", session?.user?.email],
    queryFn: async () => {
      if (!session?.user?.email) return null;
      const res = await axios.get(`/api/user/me?email=${session.user.email}`);
      return res.data;
    },
    enabled: !!session?.user?.email,
  });

  if (status === "loading" || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[var(--bg-primary)]">
        <Loader2
          className="animate-spin"
          size={48}
          style={{ color: "var(--primary)" }}
        />
      </div>
    );
  }

  if (dbUser.role === "" && dbUser.status === "pending") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[var(--bg-primary)] p-6 text-center">
        <div
          className="p-4 rounded-full mb-6 bg-[var(--bg-secondary)]"
          style={{ border: "1px solid var(--border-color)" }}
        >
          <Clock size={48} style={{ color: "var(--primary)" }} />
        </div>
        <h2
          className="text-3xl font-black mb-2"
          style={{ color: "var(--text-primary)" }}
        >
          Application Pending
        </h2>
        <p
          className="text-sm max-w-md mb-8"
          style={{ color: "var(--text-secondary)" }}
        >
          Thanks for applying to be a coach. Our team is currently reviewing
          your profile. You will be notified once your application is approved.
        </p>
        <button
          onClick={() => (window.location.href = "/")}
          className="btn-primary"
        >
          Return to Homepage
        </button>
      </div>
    );
  }
  if (!dbUser || dbUser.role === "") {
    return <RoleSelectionModal email={session?.user?.email || ""} />;
  }

  return (
    // ❶ h-screen + overflow-hidden — locks the whole layout to viewport height
    <div className="h-screen overflow-hidden flex flex-col bg-[var(--bg-primary)]">
      {/* Navbar — fixed at top, never scrolls */}
      <DashboardNavbar
        sidebarOpen={sidebarOpen}
        onMenuToggle={() => setSidebarOpen((o) => !o)}
        user={dbUser}
      />

      {/* ❷ flex-1 + overflow-hidden — fills remaining height, clips children */}
      <div className="flex flex-1 overflow-hidden">
        {/* ❸ Sidebar — h-full keeps it exactly as tall as this row */}
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* ❹ Only this scrolls — sidebar stays put */}
        <main className="flex-1 overflow-y-auto bg-[var(--bg-primary)] pl-4 md:pr-2 md:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
