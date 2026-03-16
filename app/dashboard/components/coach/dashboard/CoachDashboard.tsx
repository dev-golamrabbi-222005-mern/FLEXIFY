import { fadeUp, greeting, StatCard } from '@/app/dashboard/page';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { CalendarCheck, MessageSquare, Star, TrendingUp, Users, Zap } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { motion } from "framer-motion";
import React from 'react';
import ClientProgressChart from './ClientProgressChart';
import ClientList from './ClientList';

const CoachDashboard = ({ name }: { name: string }) => {
    const { data: session } = useSession();
    const { data: coaches = [] } = useQuery({
        queryKey: ["coaches"],
        queryFn: async() => {
        const res = await axios.get("/api/coach");
        return res.data;
        }
    });

    const singleCoach = coaches.find(coach => coach?.email === session?.user?.email);

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
        <ClientProgressChart/>

        {/* Client List */}
        <ClientList/>
        
        </div>
    );
};

export default CoachDashboard;