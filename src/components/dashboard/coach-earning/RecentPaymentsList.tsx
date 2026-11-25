"use client";

import React from "react";
import Image from "next/image";

export interface PaymentItem {
  user: {
    name: string;
    planName: string;
    imageUrl: string;
  };
  totalPaid: string;
  status: "success" | "failed" | "pending";
}

interface RecentPaymentsListProps {
  payments: PaymentItem[];
}

export default function RecentPaymentsList({ payments }: RecentPaymentsListProps) {
  return (
    <div className="lg:col-span-2 card-glass">
      <h3 className="font-bold text-lg mb-4 text-[var(--text-primary)]">Recent Payments</h3>
      <div className="space-y-2">
        {payments.map((p, i) => (
          <div key={i} className="flex items-center justify-between p-2">
            <div className="flex items-center gap-3">
              <Image
                src={p?.user?.imageUrl || "/default-avatar.png"}
                alt={p?.user?.name}
                width={40}
                height={40}
                className="flex items-center justify-center w-10 h-10 rounded-full bg-[var(--primary-light)] text-[var(--primary)] text-xs font-bold"
              />
              <div>
                <p className="text-sm font-semibold">{p?.user?.name}</p>
                <p className="text-xs text-[var(--text-muted)]">{p?.user?.planName} Plan</p>
              </div>
            </div>

            <div className="text-right">
              <p className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>{p?.totalPaid}</p>
              <p
                className={`text-[10px] font-bold uppercase ${
                  p?.status === "success"
                    ? "text-[var(--success)]"
                    : p?.status === "failed"
                      ? "text-[var(--danger)]"
                      : "text-[var(--warning)]"
                }`}
              >
                {p?.status}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
