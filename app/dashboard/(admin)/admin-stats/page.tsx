"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Users, UserCheck, CreditCard, DollarSign, UserPlus, Loader2 } from "lucide-react";
import { 
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  BarChart, Bar, PieChart, Pie, Cell 
} from "recharts";

// TypeScript Interfaces for Type Safety
interface ChartData {
  month: string;
  revenue?: number;
  users?: number;
}

interface SubscriptionItem {
  name: string;
  value: number;
}

interface ActivityLog {
  _id: string;
  count: number;
}

interface AdminDashboardStats {
  stats: {
    totalUsers: number;
    activeCoaches: number;
    totalRevenue: number;
    newSignupsToday: number;
  };
  revenueData: ChartData[];
  userGrowthData: ChartData[];
  subscriptionData: SubscriptionItem[];
  activityLogs: ActivityLog[];
}

const COLORS = ["#3b82f6", "#8b5cf6", "#f97316", "#10b981", "#ec4899"];

export default function AdminStatsSection() {
  const { data: dashboard, isLoading } = useQuery<AdminDashboardStats>({
    queryKey: ["admin-stats"],
    queryFn: async () => (await axios.get("/api/admin/stats")).data,
  });

  if (isLoading || !dashboard) {
    return (
      <div className="flex justify-center items-center py-40 text-[var(--primary)]">
        <Loader2 className="animate-spin" size={40} />
      </div>
    );
  }

  const stats = [
    { title: "Total Users", value: dashboard.stats.totalUsers, icon: Users, color: "from-blue-500 to-indigo-500" },
    { title: "Active Coaches", value: dashboard.stats.activeCoaches, icon: UserCheck, color: "from-emerald-500 to-green-500" },
    { title: "Monthly Revenue", value: `৳${dashboard.stats.totalRevenue.toLocaleString()}`, icon: DollarSign, color: "from-orange-500 to-amber-500" },
    { title: "New Signups", value: dashboard.stats.newSignupsToday, icon: UserPlus, color: "from-cyan-500 to-sky-500" },
    { 
      title: "Active Subscriptions", 
      value: dashboard.subscriptionData.reduce((acc, curr) => acc + curr.value, 0), 
      icon: CreditCard, 
      color: "from-purple-500 to-pink-500" 
    },
  ];

  const getIntensityColor = (dateStr: string) => {
    const log = dashboard.activityLogs.find((l) => l._id === dateStr);
    const count = log?.count || 0;
    if (count === 0) return "bg-gray-200 dark:bg-gray-800";
    if (count < 3) return "bg-green-200 dark:bg-green-900/30";
    if (count < 6) return "bg-green-400 dark:bg-green-600/50";
    return "bg-green-600 dark:bg-green-500";
  };

  const last35Days = Array.from({ length: 35 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (34 - i));
    return d.toISOString().split("T")[0];
  });

  return (
    <div className="space-y-8 bg-[var(--bg-primary)] rounded-2xl">
      <title>Flexify | Admin | Stats</title>
      
      {/* 1. TOP STATS CARDS */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-[var(--card-bg)] rounded-2xl p-5 border border-[var(--border-color)] hover:shadow-lg transition">
            <div className={`w-10 h-10 flex items-center justify-center rounded-xl bg-gradient-to-r ${stat.color} text-white mb-4 shadow-sm`}>
              <stat.icon size={20} />
            </div>
            <h4 className="text-[10px] text-[var(--text-secondary)] font-bold uppercase tracking-widest">{stat.title}</h4>
            <p className="mt-1 text-2xl font-black">{stat.value}</p>
          </div>
      )})}
      </div>

      <div className="grid grid-cols-1 gap-8 xl:grid-cols-2">
        
        {/* 2. REVENUE CHART */}
        <div className="bg-[var(--card-bg)] p-6 rounded-2xl border border-[var(--border-color)] shadow-sm">
          <h3 className="mb-6 font-bold text-sm uppercase tracking-wider text-[var(--text-secondary)]">Revenue Insights</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={dashboard.revenueData}>
              <XAxis dataKey="month" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis hide />
              <Tooltip 
                contentStyle={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '12px' }}
                itemStyle={{ color: '#3b82f6', fontWeight: 'bold' }}
              />
              <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={4} dot={{ r: 4, fill: '#3b82f6' }} activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* 3. USER GROWTH CHART */}
        <div className="bg-[var(--card-bg)] p-6 rounded-2xl border border-[var(--border-color)] shadow-sm">
          <h3 className="mb-6 font-bold text-sm uppercase tracking-wider text-[var(--text-secondary)]">User Growth</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={dashboard.userGrowthData}>
              <XAxis dataKey="month" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip cursor={{ fill: 'transparent' }} />
              <Bar dataKey="users" fill="#10b981" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* 4. SUBSCRIPTION DISTRIBUTION */}
        <div className="bg-[var(--card-bg)] p-6 rounded-2xl border border-[var(--border-color)] shadow-sm">
          <h3 className="mb-6 font-bold text-sm uppercase tracking-wider text-[var(--text-secondary)]">Subscription Mix</h3>
          <div className="flex flex-col md:flex-row items-center justify-around h-[250px]">
            <ResponsiveContainer width="60%" height="100%">
              <PieChart>
                <Pie data={dashboard.subscriptionData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {dashboard.subscriptionData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2">
              {dashboard.subscriptionData.map((item, index) => (
                <div key={index} className="flex items-center gap-2 text-xs font-semibold">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                  <span>{item.name}: {item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 5. ACTIVITY HEATMAP */}
        <div className="bg-[var(--card-bg)] p-6 rounded-2xl border border-[var(--border-color)] shadow-sm">
          <h3 className="mb-6 font-bold text-sm uppercase tracking-wider text-[var(--text-secondary)]">Activity Heatmap</h3>
          <div className="grid grid-cols-7 gap-2">
            {last35Days.map((date) => (
              <div 
                key={date} 
                title={date} 
                className={`h-6 w-full rounded-sm transition-all hover:ring-2 ring-blue-500/50 ${getIntensityColor(date)}`} 
              />
            ))}
          </div>
          <div className="mt-4 flex items-center justify-end gap-2 text-[10px] font-bold uppercase text-[var(--text-secondary)]">
            <span>Less</span>
            {[0, 1, 2, 3].map(i => (
              <div key={i} className={`w-3 h-3 rounded-sm ${i === 0 ? 'bg-gray-200' : i === 1 ? 'bg-green-200' : i === 2 ? 'bg-green-400' : 'bg-green-600'}`} />
            ))}
            <span>More</span>
          </div>
        </div>

      </div>
    </div>
  );
}