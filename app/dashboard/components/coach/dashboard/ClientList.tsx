import { fadeUp, SectionHeader } from '@/app/dashboard/page';
import { motion } from "framer-motion";

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

const ClientList = () => {
    return (
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
    );
};

export default ClientList;