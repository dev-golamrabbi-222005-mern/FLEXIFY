"use client";

import { TrendingUp, Activity, DollarSign, Loader2, LucideIcon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import AnalyticsChartsGrid from "@/components/dashboard/admin/AnalyticsChartsGrid";

interface AnalyticsData {
  summary: { totalUsers: number; totalRevenue: number; engagement: string };
  userGrowth: { month: string; users: number }[];
  revenueStats: { month: string; revenue: number }[];
  engagementData: { name: string; value: number }[];
}

export default function ReportsAnalyticsPage() {
  const { data, isLoading } = useQuery<AnalyticsData>({
    queryKey: ["admin-analytics"],
    queryFn: async () => (await axios.get("/api/admin/analytics")).data,
  });

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[var(--bg-primary)]">
        <Loader2 className="animate-spin text-[var(--primary)]" size={40} />
      </div>
    );
  }

  return (
    <div className="space-y-8 md:space-y-12 lg:space-y-16 min-h-screen text-[var(--text-primary)]">
      <title>Reports Analytics | Dashboard - Flexify</title>
      <div>
        <h1 className="font-bold text-3xl md:text-4xl tracking-tight uppercase text-[var(--text-primary)]">
          Analytics Dashboard
        </h1>
        <p className="leading-relaxed mt-2 text-[var(--text-secondary)]">
          Platform performance based on real-time data
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <AnalyticsStatCard title="Total Users" value={data?.summary.totalUsers || 0} Icon={TrendingUp} color="from-emerald-400 to-emerald-600" />
        <AnalyticsStatCard title="Engagement" value={data?.summary.engagement || "0"} Icon={Activity} color="from-blue-400 to-indigo-600" />
        <AnalyticsStatCard title="Total Revenue" value={`৳${data?.summary.totalRevenue?.toLocaleString() || 0}`} Icon={DollarSign} color="from-orange-400 to-pink-500" />
      </div>

      <AnalyticsChartsGrid userGrowth={data?.userGrowth} engagementData={data?.engagementData} />
    </div>
  );
}

function AnalyticsStatCard({ title, value, Icon, color }: { title: string; value: number | string; Icon: LucideIcon; color: string }) {
  return (
    <div className="card-glass relative overflow-hidden flex items-center justify-between p-6">
      <div className="relative z-10">
        <p className="text-xs text-[var(--text-secondary)] font-bold uppercase tracking-widest">{title}</p>
        <h2 className="text-4xl font-black text-[var(--text-primary)]">{value}</h2>
      </div>
      <div className={`relative z-10 p-4 rounded-2xl bg-gradient-to-br ${color} text-white shadow-lg`}>
        <Icon size={28} />
      </div>
    </div>
  );
}
