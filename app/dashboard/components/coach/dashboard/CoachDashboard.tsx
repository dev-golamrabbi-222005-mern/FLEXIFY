import { ChartCard, fadeUp, greeting, SectionHeader, StatCard } from '@/app/dashboard/page';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { CalendarCheck, MessageSquare, Star, TrendingUp, Users, Zap } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { motion } from "framer-motion";
import React from 'react';

const COACH_CLIENT_PROGRESS = [
    { name: "Ali", progress: 82 },
    { name: "Sara", progress: 67 },
    { name: "James", progress: 91 },
    { name: "Mia", progress: 54 },
    { name: "Rafi", progress: 76 },
];

const CoachDashboard = ({ name }: { name: string }) => {
    const { data: session } = useSession();
    const { data: coaches = [] } = useQuery({
        queryKey: ["coaches"],
        queryFn: async() => {
        const res = await axios.get("/api/coach");
        return res.data;
        }
    });

    const singleCoach = coaches.find(coach => coach.email === session.email);

    const { data: monthlyEarning } = useQuery({
        queryKey: ["monthlyEarning"],
        queryFn: async() => {
        const res = await axios.get("/api/monthly-earnings");
        return res.data;
        }
    });

    const stats = [
        {
            icon: Users,
            label: "Active Clients",
            value: singleCoach?.maxClients,
            sub: "2 new this week",
            iconColor: "#4b9eff",
            iconBg: "#dbeeff",
            trend: { val: 20 },
            delay: 0.1,
        },
        {
            icon: CalendarCheck,
            label: "Sessions Today",
            value: "4",
            sub: "Next at 3:00 PM",
            iconColor: "#f47920",
            iconBg: "#fff3e0",
            delay: 0.16,
        },
        {
            icon: MessageSquare,
            label: "Unread Messages",
            value: "7",
            sub: "3 need response",
            iconColor: "#f0a500",
            iconBg: "#fef3c7",
            delay: 0.22,
        },
        {
            icon: Star,
            label: "Avg Rating",
            value: "4.9",
            sub: "from 38 reviews",
            iconColor: "#f0a500",
            iconBg: "#fef3c7",
            trend: { val: 2 },
            delay: 0.28,
        },
        {
            icon: TrendingUp,
            label: "Monthly Earnings",
            value: `৳${monthlyEarning?.total}`,
            sub: "this month",
            iconColor: "#27ae60",
            iconBg: "#dcfce7",
            trend: { val: 14 },
            delay: 0.34,
        },
        {
            icon: Zap,
            label: "Completion Rate",
            value: "94%",
            sub: "avg across clients",
            iconColor: "#7c5cbf",
            iconBg: "#ede9fe",
            delay: 0.4,
        },
    ];

    const clients = [
        {
            name: "Ali Hassan",
            plan: "Hypertrophy",
            nextSession: "Today 3 PM",
            status: "on-track",
        },
        {
            name: "Sara Khan",
            plan: "Fat Loss",
            nextSession: "Tomorrow 10 AM",
            status: "needs-attention",
        },
        {
            name: "James Lee",
            plan: "Strength",
            nextSession: "Wed 5 PM",
            status: "excellent",
        },
        {
            name: "Mia Patel",
            plan: "Endurance",
            nextSession: "Thu 8 AM",
            status: "on-track",
        },
    ];

    const statusStyle: Record<
        string,
        { bg: string; color: string; label: string }
    > = {
        excellent: { bg: "#dcfce7", color: "#16a34a", label: "Excellent" },
        "on-track": { bg: "#dbeeff", color: "#2563eb", label: "On Track" },
        "needs-attention": {
            bg: "#fee2e2",
            color: "#dc2626",
            label: "Needs Attention",
        },
    };

    return (
        <div className="space-y-6">
        {/* Greeting */}
        <motion.div {...fadeUp(0)}>
            <p
            className="text-sm font-medium mb-0.5"
            style={{ color: "var(--text-secondary)" }}
            >
            {greeting()}, Coach
            </p>
            <h1
            className="font-black tracking-tight"
            style={{
                fontSize: "clamp(22px, 4vw, 32px)",
                color: "var(--text-primary)",
            }}
            >
            {name} 💪
            </h1>
        </motion.div>

        {/* Banner */}
        <motion.div
            {...fadeUp(0.05)}
            className="relative p-5 overflow-hidden rounded-2xl"
            style={{
            background: "linear-gradient(135deg, #f0a500 0%, #c17d00 100%)",
            }}
        >
            <div className="absolute w-40 h-40 rounded-full -right-8 -top-8 bg-white/10" />
            <div className="relative z-10">
            <p className="text-white/70 text-[11px] font-black uppercase tracking-widest mb-1">
                Today's Schedule
            </p>
            <p className="text-lg font-black text-white">4 Sessions · 6 Hours</p>
            <p className="mt-1 text-xs text-white/70">
                Next: Ali Hassan at 3:00 PM — Hypertrophy Day 3
            </p>
            </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {stats.map((s) => (
            <StatCard key={s.label} {...s} />
            ))}
        </div>

        {/* Client Progress Chart */}
        <ChartCard title="Client Progress Overview" delay={0.2}>
            <div className="space-y-3">
            {COACH_CLIENT_PROGRESS.map((c, i) => (
                <div key={i} className="flex items-center gap-3">
                <span
                    className="w-12 text-xs font-bold shrink-0"
                    style={{ color: "var(--text-secondary)" }}
                >
                    {c.name}
                </span>
                <div
                    className="flex-1 h-2 rounded-full"
                    style={{ background: "var(--border-color)" }}
                >
                    <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${c.progress}%` }}
                    transition={{
                        delay: 0.3 + i * 0.08,
                        duration: 0.7,
                        ease: [0.22, 1, 0.36, 1],
                    }}
                    className="h-full rounded-full"
                    style={{
                        background:
                        c.progress > 80
                            ? "#27ae60"
                            : c.progress > 60
                            ? "#f47920"
                            : "#f0a500",
                    }}
                    />
                </div>
                <span
                    className="w-10 text-xs font-black text-right"
                    style={{ color: "var(--text-primary)" }}
                >
                    {c.progress}%
                </span>
                </div>
            ))}
            </div>
        </ChartCard>

        {/* Client List */}
        <motion.div
            {...fadeUp(0.3)}
            className="p-5 rounded-2xl"
            style={{
            background: "var(--bg-secondary)",
            border: "1px solid var(--border-color)",
            }}
        >
            <SectionHeader title="Your Clients" action="View All" />
            <div className="space-y-2">
            {clients.map((c, i) => {
                const s = statusStyle[c.status];
                return (
                <div
                    key={i}
                    className="flex items-center justify-between py-3 border-b last:border-0"
                    style={{ borderColor: "var(--border-color)" }}
                >
                    <div className="flex items-center gap-3">
                    <div
                        className="flex items-center justify-center text-sm font-black text-white rounded-full w-9 h-9"
                        style={{
                        background: "linear-gradient(135deg, #f0a500, #f47920)",
                        }}
                    >
                        {c.name[0]}
                    </div>
                    <div>
                        <p
                        className="text-sm font-bold"
                        style={{ color: "var(--text-primary)" }}
                        >
                        {c.name}
                        </p>
                        <p
                        className="text-[11px]"
                        style={{ color: "var(--text-secondary)" }}
                        >
                        {c.plan} · {c.nextSession}
                        </p>
                    </div>
                    </div>
                    <span
                    className="text-[10px] font-black px-2.5 py-1 rounded-full"
                    style={{ background: s.bg, color: s.color }}
                    >
                    {s.label}
                    </span>
                </div>
                );
            })}
            </div>
        </motion.div>
        </div>
    );
};

export default CoachDashboard;