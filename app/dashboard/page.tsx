"use client";

import { useSession } from "next-auth/react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import CoachDashboard from "./components/coach/dashboard/CoachDashboard";
import UserDashboard from "./components/user/dashboard/UserDashboard";
import AdminDashboard from "./components/admin/AdminDashboard";

export default function Dashboard() {
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

  const role = dbUser?.role;
  const userName = dbUser?.name ?? "User";

  return (
    <div className="max-w-full">
      {role === "user" && <UserDashboard name={userName} />}
      {role === "coach" && <CoachDashboard name={userName} />}
      {role === "admin" && <AdminDashboard name={userName} />}
    </div>
  );
}
