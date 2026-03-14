import { ChartCard } from '@/app/dashboard/page';
import React from 'react';
import { motion } from "framer-motion";

const COACH_CLIENT_PROGRESS = [
    { name: "Ali", progress: 82 },
    { name: "Sara", progress: 67 },
    { name: "James", progress: 91 },
    { name: "Mia", progress: 54 },
    { name: "Rafi", progress: 76 },
];

const ClientProgressChart = () => {
    return (
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
    );
};

export default ClientProgressChart;