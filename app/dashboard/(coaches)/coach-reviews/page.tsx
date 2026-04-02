"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import { motion } from "framer-motion";
import { Star, Quote, MessageSquare } from "lucide-react";

interface IReview {
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string; 
}

export default function CoachReviews() {
  const { data: reviews = [], isLoading } = useQuery<IReview[]>({
    queryKey: ["coach-reviews"],
    queryFn: async () => {
      const res = await api.get<IReview[]>("/api/coach/reviews");
      return res.data;
    },
  });

  const avgRating =
    reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : "0.0";

  const ratingDistribution = [5, 4, 3, 2, 1].map((stars) => {
    const count = reviews.filter((rv) => rv.rating === stars).length;
    const pct = reviews.length > 0 ? Math.round((count / reviews.length) * 100) : 0;
    return { stars, count, pct };
  });

  const formatDate = (dateStr: string) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    }).format(new Date(dateStr));
  };

  if (isLoading) {
    return (
      <div className="p-10 text-center animate-pulse text-[var(--primary)] font-bold">
        Loading Reviews...
      </div>
    );
  }

  return (
    <div className="max-w-full space-y-8 pb-10">
      <title>Reviews | Coach Dashboard</title>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-black text-3xl md:text-4xl tracking-tight uppercase text-[var(--text-primary)]">
            Client Reviews
          </h1>
          <p className="text-[var(--text-secondary)]">Manage and monitor your professional ratings</p>
        </div>
        <div className="px-4 py-2 bg-[var(--primary)]/10 rounded-xl border border-[var(--primary)]/20 text-[var(--primary)] font-bold flex items-center gap-2 w-fit">
          <MessageSquare size={18} /> Total: {reviews.length}
        </div>
      </div>

      {/* Summary Section */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <motion.div 
          initial={{ opacity: 0, y: 10 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="p-8 text-center card-glass border border-[var(--border-color)]"
        >
          <div className="text-6xl font-black text-[var(--primary)] mb-2">{avgRating}</div>
          <div className="flex justify-center gap-1 mb-3">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star 
                key={s} 
                size={22} 
                className={s <= Math.round(Number(avgRating)) ? "fill-yellow-400 text-yellow-400" : "text-[var(--bg-tertiary)]"} 
              />
            ))}
          </div>
          <p className="text-sm font-medium text-[var(--text-muted)]">Average Rating</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 10 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.1 }} 
          className="p-8 card-glass md:col-span-2 border border-[var(--border-color)]"
        >
          <h3 className="mb-6 font-bold text-[var(--text-primary)]">Rating Breakdown</h3>
          <div className="space-y-4">
            {ratingDistribution.map((r) => (
              <div key={r.stars} className="flex items-center gap-4">
                <span className="text-sm font-bold w-12 text-[var(--text-secondary)]">{r.stars} Star</span>
                <div className="flex-1 h-3 bg-[var(--bg-tertiary)] rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }} 
                    animate={{ width: `${r.pct}%` }} 
                    transition={{ duration: 1 }}
                    className="h-full bg-[var(--primary)] rounded-full" 
                  />
                </div>
                <span className="w-8 text-sm font-bold text-[var(--text-primary)]">{r.count}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Reviews List */}
      <div className="grid grid-cols-1 gap-4">
        {reviews.length === 0 ? (
          <div className="p-10 text-center border-2 border-dashed border-[var(--border-color)] rounded-3xl text-[var(--text-muted)]">
            No reviews received yet.
          </div>
        ) : (
          reviews.map((r, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, x: -10 }} 
              animate={{ opacity: 1, x: 0 }} 
              transition={{ delay: i * 0.05 }}
              className="p-6 card-glass border border-[var(--border-color)] hover:border-[var(--primary)]/50 transition-all group"
            >
              <div className="flex gap-5">
                <div className="w-12 h-12 rounded-2xl bg-[var(--primary)] text-white flex items-center justify-center font-black text-xl shadow-lg shrink-0">
                  {r.userName?.charAt(0) || "U"}
                </div>
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
                    <h4 className="font-bold text-[var(--text-primary)]">{r.userName}</h4>
                    <span className="text-xs font-medium text-[var(--text-muted)] bg-[var(--bg-tertiary)] px-3 py-1 rounded-full">
                      {formatDate(r.createdAt)}
                    </span>
                  </div>
                  <div className="flex gap-1 mb-3">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star 
                        key={s} 
                        size={14} 
                        className={s <= r.rating ? "fill-yellow-400 text-yellow-400" : "text-[var(--bg-tertiary)]"} 
                      />
                    ))}
                  </div>
                  <div className="flex gap-3 items-start bg-[var(--bg-tertiary)]/30 p-4 rounded-2xl">
                    <Quote size={18} className="text-[var(--primary)] shrink-0" />
                    <p className="text-sm italic leading-relaxed text-[var(--text-secondary)]">
                      {r.comment}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}