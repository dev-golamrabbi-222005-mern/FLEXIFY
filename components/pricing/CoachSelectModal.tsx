"use client";

// components/pricing/CoachSelectModal.tsx
// Opens when user clicks "Go Elite"
// Flow: Coach List → (optional) Coach Detail → Order Confirm → onProceedToPayment()

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Star,
  Clock,
  DollarSign,
  ChevronRight,
  ArrowLeft,
  Loader2,
  CheckCircle2,
  Award,
  User,
} from "lucide-react";

export interface Coach {
  _id: string;
  name: string;
  experience: number;
  expertise: string;
  charge: number;
  bio?: string;
  certifications?: string[];
  specialties?: string[];
  imageUrl?: string;
  rating?: number;
  clients?: number;
  status?: string;
}

interface Props {
  open: boolean;
  eliteBasePrice: number; // 29
  onClose: () => void;
  onProceedToPayment: (coach: Coach, totalAmount: number) => void;
}

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number];

// ── Reusable avatar ───────────────────────────────────────────────────────────
function CoachAvatar({ coach, size = 44 }: { coach: Coach; size?: number }) {
  const [imgErr, setImgErr] = useState(false);
  const src = coach.imageUrl;
  const letter = (coach.name ?? "C").charAt(0).toUpperCase();

  if (src && !imgErr) {
    return (
      <img
        src={src}
        alt={coach.name}
        className="rounded-full object-cover shrink-0"
        style={{ width: size, height: size }}
        onError={() => setImgErr(true)}
      />
    );
  }
  return (
    <div
      className="rounded-full flex items-center justify-center font-black text-white shrink-0"
      style={{
        width: size,
        height: size,
        background: "var(--primary)",
        fontSize: Math.round(size * 0.38),
      }}
    >
      {letter}
    </div>
  );
}

// ── Price breakdown card ──────────────────────────────────────────────────────
function PriceBreakdown({ base, coach }: { base: number; coach: Coach }) {
  const total = base + (coach.charge ?? 0);
  return (
    <div
      className="rounded-2xl p-4 space-y-2.5"
      style={{
        background: "rgba(16,185,129,0.05)",
        border: "1px solid rgba(16,185,129,0.2)",
      }}
    >
      <p
        className="text-[10px] font-black uppercase tracking-widest"
        style={{ color: "var(--text-secondary)" }}
      >
        Price Breakdown
      </p>
      <div className="flex justify-between">
        <span className="text-sm" style={{ color: "var(--text-secondary)" }}>
          Elite Plan
        </span>
        <span
          className="text-sm font-bold"
          style={{ color: "var(--text-primary)" }}
        >
          ${base}/mo
        </span>
      </div>
      <div className="flex justify-between">
        <span className="text-sm" style={{ color: "var(--text-secondary)" }}>
          Coach: {coach.name}
        </span>
        <span
          className="text-sm font-bold"
          style={{ color: "var(--text-primary)" }}
        >
          ${coach.charge}/mo
        </span>
      </div>
      <div
        className="flex justify-between pt-2.5 border-t"
        style={{ borderColor: "rgba(16,185,129,0.2)" }}
      >
        <span
          className="font-black text-sm"
          style={{ color: "var(--text-primary)" }}
        >
          Total
        </span>
        <span
          className="font-black text-xl"
          style={{ color: "var(--primary)" }}
        >
          ${total}/mo
        </span>
      </div>
    </div>
  );
}

// ── Coach detail view ─────────────────────────────────────────────────────────
function DetailView({
  coach,
  base,
  onBack,
  onGetCoach,
}: {
  coach: Coach;
  base: number;
  onBack: () => void;
  onGetCoach: () => void;
}) {
  return (
    <motion.div
      key="detail"
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 40 }}
      transition={{ duration: 0.28, ease }}
      className="flex flex-col h-full"
    >
      <div
        className="flex items-center gap-3 px-5 py-4 border-b shrink-0"
        style={{ borderColor: "var(--border-color)" }}
      >
        <button
          onClick={onBack}
          className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-[var(--bg-primary)] transition-colors"
          style={{ color: "var(--text-secondary)" }}
        >
          <ArrowLeft size={16} />
        </button>
        <h3
          className="font-black text-base flex-1"
          style={{ color: "var(--text-primary)" }}
        >
          Coach Profile
        </h3>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-5">
        {/* Hero */}
        <div className="flex items-start gap-4">
          <CoachAvatar coach={coach} size={64} />
          <div className="flex-1 min-w-0">
            <h2
              className="font-black text-xl leading-tight"
              style={{ color: "var(--text-primary)" }}
            >
              {coach.name}
            </h2>
            <p
              className="text-sm font-semibold capitalize mt-0.5"
              style={{ color: "var(--primary)" }}
            >
              {coach.expertise}
            </p>
            {coach.rating && (
              <div className="flex items-center gap-1 mt-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={12}
                    fill={
                      i < Math.round(coach.rating ?? 0) ? "#f59e0b" : "none"
                    }
                    stroke="#f59e0b"
                  />
                ))}
                <span
                  className="text-xs font-bold ml-1"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {coach.rating.toFixed(1)}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          {[
            {
              icon: Clock,
              label: "Experience",
              val: `${coach.experience} yrs`,
            },
            { icon: DollarSign, label: "Monthly", val: `$${coach.charge}` },
            {
              icon: User,
              label: "Clients",
              val: coach.clients ? `${coach.clients}+` : "Active",
            },
          ].map((s) => (
            <div
              key={s.label}
              className="rounded-2xl p-3 text-center"
              style={{
                background: "var(--bg-primary)",
                border: "1px solid var(--border-color)",
              }}
            >
              <s.icon
                size={14}
                className="mx-auto mb-1"
                style={{ color: "var(--primary)" }}
              />
              <p
                className="font-black text-sm leading-none"
                style={{ color: "var(--text-primary)" }}
              >
                {s.val}
              </p>
              <p
                className="text-[9px] font-black uppercase tracking-wider mt-0.5"
                style={{ color: "var(--text-secondary)" }}
              >
                {s.label}
              </p>
            </div>
          ))}
        </div>

        {coach.bio && (
          <div>
            <p
              className="text-[10px] font-black uppercase tracking-widest mb-2"
              style={{ color: "var(--text-secondary)" }}
            >
              About
            </p>
            <p
              className="text-sm leading-relaxed"
              style={{ color: "var(--text-primary)" }}
            >
              {coach.bio}
            </p>
          </div>
        )}

        {coach.certifications && coach.certifications.length > 0 && (
          <div>
            <p
              className="text-[10px] font-black uppercase tracking-widest mb-2"
              style={{ color: "var(--text-secondary)" }}
            >
              Certifications
            </p>
            <div className="flex flex-wrap gap-2">
              {coach.certifications.map((c, i) => (
                <div
                  key={i}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold"
                  style={{
                    background: "rgba(16,185,129,0.08)",
                    border: "1px solid rgba(16,185,129,0.2)",
                    color: "var(--primary)",
                  }}
                >
                  <Award size={10} />
                  {c}
                </div>
              ))}
            </div>
          </div>
        )}

        {coach.specialties && coach.specialties.length > 0 && (
          <div>
            <p
              className="text-[10px] font-black uppercase tracking-widest mb-2"
              style={{ color: "var(--text-secondary)" }}
            >
              Specialties
            </p>
            <div className="flex flex-wrap gap-1.5">
              {coach.specialties.map((s, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded-lg text-xs font-semibold capitalize"
                  style={{
                    background: "var(--bg-primary)",
                    border: "1px solid var(--border-color)",
                    color: "var(--text-secondary)",
                  }}
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}

        <PriceBreakdown base={base} coach={coach} />
      </div>

      <div
        className="px-5 py-4 border-t shrink-0 flex gap-2"
        style={{ borderColor: "var(--border-color)" }}
      >
        <button
          onClick={onBack}
          className="py-3 px-5 rounded-2xl font-bold text-sm"
          style={{
            border: "1.5px solid var(--border-color)",
            color: "var(--text-secondary)",
          }}
        >
          Back
        </button>
        <button
          onClick={onGetCoach}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl font-black text-sm text-white hover:brightness-110"
          style={{
            background: "var(--primary)",
            boxShadow: "0 4px 16px rgba(16,185,129,0.3)",
          }}
        >
          <CheckCircle2 size={15} /> Get Coach · ${base + coach.charge}/mo
        </button>
      </div>
    </motion.div>
  );
}

// ── Order confirm view ────────────────────────────────────────────────────────
function ConfirmView({
  coach,
  base,
  onBack,
  onProceed,
}: {
  coach: Coach;
  base: number;
  onBack: () => void;
  onProceed: () => void;
}) {
  const total = base + coach.charge;
  return (
    <motion.div
      key="confirm"
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.28, ease }}
      className="flex flex-col h-full"
    >
      <div
        className="flex items-center gap-3 px-5 py-4 border-b shrink-0"
        style={{ borderColor: "var(--border-color)" }}
      >
        <button
          onClick={onBack}
          className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-[var(--bg-primary)] transition-colors"
          style={{ color: "var(--text-secondary)" }}
        >
          <ArrowLeft size={16} />
        </button>
        <h3
          className="font-black text-base flex-1"
          style={{ color: "var(--text-primary)" }}
        >
          Order Summary
        </h3>
      </div>

      <div className="flex-1 p-5 space-y-4 overflow-y-auto">
        <div
          className="flex items-center gap-4 p-4 rounded-2xl"
          style={{
            background: "var(--bg-primary)",
            border: "1px solid var(--border-color)",
          }}
        >
          <CoachAvatar coach={coach} size={52} />
          <div>
            <p
              className="font-black text-base"
              style={{ color: "var(--text-primary)" }}
            >
              {coach.name}
            </p>
            <p
              className="text-xs font-semibold capitalize"
              style={{ color: "var(--primary)" }}
            >
              {coach.expertise}
            </p>
            <p
              className="text-xs mt-0.5"
              style={{ color: "var(--text-secondary)" }}
            >
              {coach.experience} yrs experience
            </p>
          </div>
        </div>

        <PriceBreakdown base={base} coach={coach} />

        <div
          className="rounded-2xl p-4"
          style={{
            background: "var(--bg-primary)",
            border: "1px solid var(--border-color)",
          }}
        >
          <p
            className="text-[10px] font-black uppercase tracking-widest mb-3"
            style={{ color: "var(--text-secondary)" }}
          >
            What&apos;s Included
          </p>
          {[
            "Full Elite plan features",
            "Personal coach assigned to you",
            "Direct messaging with coach",
            "Custom workout plan by coach",
            "Weekly check-ins & progress review",
          ].map((item) => (
            <div key={item} className="flex items-center gap-2.5 py-1.5">
              <CheckCircle2
                size={14}
                style={{ color: "var(--primary)" }}
                className="shrink-0"
              />
              <span
                className="text-sm"
                style={{ color: "var(--text-primary)" }}
              >
                {item}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div
        className="px-5 py-4 border-t shrink-0 flex gap-2"
        style={{ borderColor: "var(--border-color)" }}
      >
        <button
          onClick={onBack}
          className="py-3 px-5 rounded-2xl font-bold text-sm"
          style={{
            border: "1.5px solid var(--border-color)",
            color: "var(--text-secondary)",
          }}
        >
          Cancel
        </button>
        <button
          onClick={onProceed}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl font-black text-sm text-white hover:brightness-110"
          style={{
            background: "var(--primary)",
            boxShadow: "0 4px 16px rgba(16,185,129,0.3)",
          }}
        >
          <CheckCircle2 size={15} /> Proceed to Payment · ${total}/mo
        </button>
      </div>
    </motion.div>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────
export function CoachSelectModal({
  open,
  eliteBasePrice,
  onClose,
  onProceedToPayment,
}: Props) {
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [detailCoach, setDetailCoach] = useState<Coach | null>(null);
  const [selectedCoach, setSelectedCoach] = useState<Coach | null>(null);

  // Reset on close
  useEffect(() => {
    if (!open) {
      const t = setTimeout(() => {
        setDetailCoach(null);
        setSelectedCoach(null);
        setError(null);
      }, 0);
      return () => clearTimeout(t);
    }
  }, [open]);

  // Fetch coaches
  useEffect(() => {
    if (!open) return;
    let cancelled = false;

    const load = async () => {
      setTimeout(() => {
        if (!cancelled) setLoading(true);
      }, 0);
      try {
        // ── Try /api/coach first, fallback to /api/coaches ─────────────────
        // Coaches are users with role:"coach" — no status filter needed
        const res = await fetch("/api/coach");

        if (!res.ok) throw new Error(`HTTP ${res.status}: ${await res.text()}`);

        const data = await res.json();
        console.log("[CoachSelectModal] raw data sample:", data[0]); // check field names

        const raw: Coach[] = Array.isArray(data)
          ? data
          : (data.coaches ?? data.data ?? []);

        if (!cancelled) setCoaches(raw);
      } catch (err) {
        console.error("[CoachSelectModal] fetch error:", err);
        if (!cancelled) setError("Failed to load coaches. Please try again.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [open]);

  const activeView = detailCoach
    ? "detail"
    : selectedCoach
      ? "confirm"
      : "list";

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(6px)" }}
          onClick={(e) => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            initial={{ scale: 0.93, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.93, opacity: 0, y: 20 }}
            transition={{ duration: 0.35, ease }}
            className="w-full max-w-lg rounded-3xl overflow-hidden flex flex-col"
            style={{
              background: "var(--bg-secondary)",
              border: "1px solid var(--border-color)",
              height: "88vh", // ← explicit height so h-full works on children
              maxHeight: "88vh",
            }}
          >
            <AnimatePresence mode="wait">
              {activeView === "detail" && detailCoach && (
                <DetailView
                  key="detail"
                  coach={detailCoach}
                  base={eliteBasePrice}
                  onBack={() => setDetailCoach(null)}
                  onGetCoach={() => {
                    setSelectedCoach(detailCoach);
                    setDetailCoach(null);
                  }}
                />
              )}

              {activeView === "confirm" && selectedCoach && (
                <ConfirmView
                  key="confirm"
                  coach={selectedCoach}
                  base={eliteBasePrice}
                  onBack={() => setSelectedCoach(null)}
                  onProceed={() =>
                    onProceedToPayment(
                      selectedCoach,
                      eliteBasePrice + selectedCoach.charge,
                    )
                  }
                />
              )}

              {activeView === "list" && (
                <motion.div
                  key="list"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.28, ease }}
                  className="flex flex-col h-full"
                >
                  {/* Header */}
                  <div
                    className="flex items-center justify-between px-5 py-4 border-b shrink-0"
                    style={{ borderColor: "var(--border-color)" }}
                  >
                    <div>
                      <p
                        className="text-[10px] font-black uppercase tracking-widest mb-0.5"
                        style={{ color: "var(--primary)" }}
                      >
                        Elite Plan
                      </p>
                      <h3
                        className="font-black text-lg"
                        style={{ color: "var(--text-primary)" }}
                      >
                        Choose Your Coach
                      </h3>
                    </div>
                    <button
                      onClick={onClose}
                      className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-[var(--bg-primary)] transition-colors"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      <X size={16} />
                    </button>
                  </div>

                  {/* Subtitle */}
                  <div
                    className="px-5 py-2.5 shrink-0"
                    style={{ borderBottom: "1px solid var(--border-color)" }}
                  >
                    <p
                      className="text-xs"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      Elite base:{" "}
                      <strong style={{ color: "var(--text-primary)" }}>
                        ${eliteBasePrice}/mo
                      </strong>{" "}
                      + coach charge = your total monthly cost.
                    </p>
                  </div>

                  {/* List body */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {loading && (
                      <div className="flex items-center justify-center py-16 gap-3">
                        <Loader2
                          size={24}
                          className="animate-spin"
                          style={{ color: "var(--primary)" }}
                        />
                        <span
                          className="text-sm font-semibold"
                          style={{ color: "var(--text-secondary)" }}
                        >
                          Loading coaches...
                        </span>
                      </div>
                    )}

                    {error && (
                      <div className="text-center py-12">
                        <p className="text-3xl mb-3">⚠️</p>
                        <p
                          className="font-black text-sm mb-1"
                          style={{ color: "var(--text-primary)" }}
                        >
                          Could not load coaches
                        </p>
                        <p
                          className="text-xs"
                          style={{ color: "var(--text-secondary)" }}
                        >
                          {error}
                        </p>
                      </div>
                    )}

                    {!loading && !error && coaches.length === 0 && (
                      <div className="text-center py-16">
                        <p className="text-4xl mb-3">🏋️</p>
                        <p
                          className="font-black text-base"
                          style={{ color: "var(--text-primary)" }}
                        >
                          No coaches available
                        </p>
                        <p
                          className="text-sm mt-1"
                          style={{ color: "var(--text-secondary)" }}
                        >
                          Check back soon
                        </p>
                      </div>
                    )}

                    {!loading &&
                      !error &&
                      coaches.map((coach, i) => (
                        <motion.div
                          key={coach._id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.05 }}
                          className="rounded-2xl p-4"
                          style={{
                            background: "var(--bg-primary)",
                            border: "1px solid var(--border-color)",
                          }}
                        >
                          {/* Coach row */}
                          <div className="flex items-center gap-3 mb-3">
                            <CoachAvatar coach={coach} size={44} />
                            <div className="flex-1 min-w-0">
                              <p
                                className="font-black text-sm leading-tight"
                                style={{ color: "var(--text-primary)" }}
                              >
                                {coach.name || "Coach"}
                              </p>
                              <p
                                className="text-xs font-semibold capitalize mt-0.5"
                                style={{ color: "var(--primary)" }}
                              >
                                {coach.expertise || "Fitness Expert"}
                              </p>
                            </div>
                            {/* Total price */}
                            <div className="text-right shrink-0">
                              <p
                                className="font-black text-base leading-none"
                                style={{ color: "var(--text-primary)" }}
                              >
                                ${eliteBasePrice + (coach.charge ?? 0)}
                              </p>
                              <p
                                className="text-[9px] font-black uppercase tracking-wider mt-0.5"
                                style={{ color: "var(--text-secondary)" }}
                              >
                                /mo total
                              </p>
                            </div>
                          </div>

                          {/* Info chips */}
                          <div className="flex items-center gap-2 mb-3 flex-wrap">
                            <span
                              className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold"
                              style={{
                                background: "var(--bg-secondary)",
                                border: "1px solid var(--border-color)",
                                color: "var(--text-secondary)",
                              }}
                            >
                              <Clock size={10} />
                              {coach.experience ?? 0} yrs exp
                            </span>
                            <span
                              className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold"
                              style={{
                                background: "var(--bg-secondary)",
                                border: "1px solid var(--border-color)",
                                color: "var(--text-secondary)",
                              }}
                            >
                              <DollarSign size={10} />${coach.charge ?? 0}/mo
                            </span>
                            {coach.rating && (
                              <span
                                className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold"
                                style={{
                                  background: "var(--bg-secondary)",
                                  border: "1px solid var(--border-color)",
                                  color: "#f59e0b",
                                }}
                              >
                                <Star size={10} fill="#f59e0b" />
                                {coach.rating.toFixed(1)}
                              </span>
                            )}
                          </div>

                          {/* Action buttons */}
                          <div className="flex gap-2">
                            <button
                              onClick={() => setDetailCoach(coach)}
                              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition-all hover:text-[var(--primary)] hover:border-[var(--primary)]"
                              style={{
                                border: "1.5px solid var(--border-color)",
                                color: "var(--text-secondary)",
                              }}
                            >
                              View Details <ChevronRight size={12} />
                            </button>
                            <button
                              onClick={() => setSelectedCoach(coach)}
                              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-black text-white hover:brightness-110 transition-all"
                              style={{
                                background: "var(--primary)",
                                boxShadow: "0 3px 10px rgba(16,185,129,0.25)",
                              }}
                            >
                              Get Coach
                            </button>
                          </div>
                        </motion.div>
                      ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
