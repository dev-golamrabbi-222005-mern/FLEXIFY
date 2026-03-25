"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

// 1. Define the Review interface to fix all "implicit any" errors
interface Review {
  client: string;
  rating: number;
  comment: string;
  date: string;
  avatar: string;
}

export default function CoachReviews() {
  // 2. Add the type <Review[]> to useQuery
  const { data: reviews = [] } = useQuery<Review[]>({
    queryKey: ["reviews"],
    queryFn: async () => {
      const res = await axios.get("/api/coach/reviews");
      return res.data;
    },
  });

  // 3. Calculate Average Rating with a fallback to 0 to prevent NaN
  const avgRating =
    reviews.length > 0
      ? (
          reviews.reduce((sum: number, r: Review) => sum + r.rating, 0) /
          reviews.length
        ).toFixed(1)
      : "0.0";

  // 4. Calculate Distribution with proper typing
  const ratingDistribution = [5, 4, 3, 2, 1].map((stars: number) => {
    const count = reviews.filter((rv: Review) => rv.rating === stars).length;
    const pct =
      reviews.length > 0 ? Math.round((count / reviews.length) * 100) : 0;

    return {
      stars,
      count,
      pct,
    };
  });

  return (
    <>
      <div className="max-w-6xl px-4 mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1
            className="text-2xl font-bold"
            style={{ color: "var(--text-primary)" }}
          >
            Reviews & Ratings
          </h1>
          <p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>
            Client feedback and public coach profile
          </p>
        </div>

        {/* Rating Summary */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* Average Rating Card */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 text-center card-glass"
          >
            <div
              className="text-5xl font-bold"
              style={{ color: "var(--primary)" }}
            >
              {avgRating}
            </div>

            <div className="flex justify-center gap-1 my-2">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  size={20}
                  className={
                    s <= Math.round(Number(avgRating))
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-400"
                  }
                />
              ))}
            </div>

            <span className="text-sm" style={{ color: "var(--text-muted)" }}>
              {reviews.length} reviews
            </span>
          </motion.div>

          {/* Distribution Card */}
          <motion.div
            className="p-6 card-glass md:col-span-2"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h3
              className="mb-4 font-semibold"
              style={{ color: "var(--text-primary)" }}
            >
              Rating Distribution
            </h3>

            <div className="space-y-3">
              {ratingDistribution.map((r) => (
                <div key={r.stars} className="flex items-center gap-3">
                  <span
                    className="text-sm w-14"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {r.stars} star
                  </span>

                  <div
                    className="flex-1 h-2 rounded-full"
                    style={{ background: "var(--bg-secondary)" }}
                  >
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${r.pct}%`,
                        background: "var(--primary)",
                      }}
                    />
                  </div>

                  <span
                    className="w-6 text-sm"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {r.count}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Reviews List */}
        <div className="space-y-4">
          {reviews.map((r: Review, i: number) => (
            <motion.div
              key={i}
              className="p-5 card-glass"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.05 }}
            >
              <div className="flex gap-4">
                {/* Avatar */}
                <div
                  className="flex items-center justify-center w-10 h-10 text-sm font-bold rounded-full"
                  style={{ background: "var(--primary)", color: "white" }}
                >
                  {r.avatar || r.client.charAt(0)}
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex flex-col gap-1 mb-1 sm:flex-row sm:items-center sm:justify-between">
                    <span
                      className="text-sm font-medium"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {r.client}
                    </span>
                    <span
                      className="text-xs"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {r.date}
                    </span>
                  </div>

                  {/* Stars */}
                  <div className="flex gap-1 mb-2">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        size={14}
                        className={
                          s <= r.rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-400"
                        }
                      />
                    ))}
                  </div>

                  {/* Comment */}
                  <div className="flex gap-2">
                    <Quote
                      size={16}
                      className="mt-1"
                      style={{ color: "var(--text-muted)" }}
                    />
                    <p
                      className="text-sm italic"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {r.comment}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </>
  );
}
