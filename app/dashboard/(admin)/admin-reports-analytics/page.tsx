"use client";

import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, CartesianGrid, PieLabelRenderProps
} from "recharts";
import { TrendingUp, Activity, DollarSign, Loader2, PieChart as PieIcon, BarChart3, LineChart as GrowthIcon, LucideIcon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

interface AnalyticsData {
  summary: { totalUsers: number; totalRevenue: number; engagement: string };
  userGrowth: { month: string; users: number }[];
  revenueStats: { month: string; revenue: number }[];
  engagementData: { name: string; value: number }[];
}


interface StatCardProps {
  title: string;
  value: number | string;
  Icon: LucideIcon;
  color: string;
}

const COLORS = ["#10B981", "#3B82F6", "#F97316", "#8B5CF6"];

const renderCustomizedLabel = (props: PieLabelRenderProps) => {
  const { month } = props.payload as { month: string };
  const percent = props.percent ? (Number(props.percent) * 100).toFixed(0) : 0;
  return `${month} ${percent}%`;
};

export default function ReportsAnalyticsPage() {
  const { data, isLoading } = useQuery<AnalyticsData>({
    queryKey: ["admin-analytics"],
    queryFn: async () => (await axios.get("/api/admin/analytics")).data,
  });

  if (isLoading) return (
    <div className="flex h-screen items-center justify-center bg-[var(--bg-primary)]">
      <Loader2 className="animate-spin text-[var(--primary)]" size={40} />
    </div>
  );

  return (
    <div className="space-y-8 min-h-screen text-[var(--text-primary)]">
      <title>Reports Analytics | Dashboard - Flexify</title>
      
      <div>
        <h1 className="text-3xl font-black tracking-tight">Analytics Dashboard</h1>
        <p className="text-[var(--text-secondary)]">Platform performance based on real-time data</p>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Total Users" value={data?.summary.totalUsers || 0} Icon={TrendingUp} color="from-emerald-400 to-emerald-600" />
        <StatCard title="Engagement" value={data?.summary.engagement || "0"} Icon={Activity} color="from-blue-400 to-indigo-600" />
        <StatCard title="Total Revenue" value={`৳${data?.summary.totalRevenue.toLocaleString()}`} Icon={DollarSign} color="from-orange-400 to-pink-500" />
      </div>

      {/* CHARTS SECTION */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        
        {/* User Growth Line Chart */}
        <div className="card-glass p-6">
          <h2 className="text-lg font-bold mb-6 flex items-center gap-2 text-[var(--primary)]">
            <GrowthIcon size={20} /> Platform Growth
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data?.userGrowth}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" opacity={0.3} />
              <XAxis dataKey="month" axisLine={false} tickLine={false} fontSize={12} stroke="var(--text-secondary)" />
              <YAxis allowDecimals={false} axisLine={false} tickLine={false} fontSize={12} stroke="var(--text-secondary)" />
              <Tooltip contentStyle={{ background: "var(--bg-secondary)", border: "1px solid var(--border-color)", borderRadius: "12px" }} />
              <Line type="monotone" dataKey="users" stroke="var(--primary)" strokeWidth={4} dot={{ r: 6, fill: "var(--primary)" }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Engagement Bar Chart */}
        <div className="card-glass p-6">
          <h2 className="text-lg font-bold mb-6 flex items-center gap-2 text-[var(--secondary)]">
            <BarChart3 size={20} /> Content Engagement
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data?.engagementData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" opacity={0.3} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={12} stroke="var(--text-secondary)" />
              <YAxis axisLine={false} tickLine={false} fontSize={12} stroke="var(--text-secondary)" />
              <Tooltip cursor={{fill: 'var(--bg-tertiary)', opacity: 0.2}} contentStyle={{ background: "var(--bg-secondary)", border: "1px solid var(--border-color)", borderRadius: "12px" }} />
              <Bar dataKey="value" fill="var(--secondary)" radius={[8, 8, 0, 0]} barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Revenue Pie Chart */}
        <div className="card-glass p-6 xl:col-span-2">
          <h2 className="text-lg font-bold mb-6 flex items-center justify-center gap-2 text-orange-500">
            <PieIcon size={20} /> Monthly Revenue Distribution
          </h2>
          <div className="flex justify-center items-center h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data?.revenueStats}
                  dataKey="revenue"
                  nameKey="month"
                  innerRadius={80}
                  outerRadius={120}
                  paddingAngle={8}
                  label={renderCustomizedLabel} 
                >
                  {data?.revenueStats?.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} stroke="none" />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: "var(--bg-secondary)", border: "1px solid var(--border-color)", borderRadius: "12px" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}

// StatCard Component with proper typing
function StatCard({ title, value, Icon, color }: StatCardProps) {
  return (
    <div className="card-glass flex items-center justify-between group hover:border-[var(--primary)] transition-all duration-300">
      <div>
        <p className="text-xs text-[var(--text-secondary)] font-bold uppercase tracking-widest">{title}</p>
        <h2 className="text-3xl font-black mt-1">{value}</h2>
      </div>
      <div className={`p-4 rounded-2xl bg-gradient-to-br ${color} text-white shadow-lg transform group-hover:scale-110 transition-transform`}>
        <Icon size={26} />
      </div>
    </div>
  );
}