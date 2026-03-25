
"use client";


import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";


export default function CoachReviews() {
  // const reviews = [
  //   {
  //     client: "Arif Hossain",
  //     rating: 5,
  //     comment:
  //       "Best coach I've ever worked with! My strength has increased dramatically in just 2 months.",
  //     date: "Feb 28, 2025",
  //     avatar: "A",
  //   },
  //   {
  //     client: "Nadia Akter",
  //     rating: 5,
  //     comment:
  //       "Coach Rahim is very knowledgeable and supportive. He customizes everything for my needs.",
  //     date: "Feb 20, 2025",
  //     avatar: "N",
  //   },
  //   {
  //     client: "Kamal Uddin",
  //     rating: 4,
  //     comment:
  //       "Great programming and very responsive. Would love more nutrition guidance.",
  //     date: "Feb 15, 2025",
  //     avatar: "K",
  //   },
  //   {
  //     client: "Rashed Khan",
  //     rating: 5,
  //     comment:
  //       "Amazing results! Lost 8kg in 3 months with proper guidance and accountability.",
  //     date: "Feb 10, 2025",
  //     avatar: "R",
  //   },
  //   {
  //     client: "Sabrina Islam",
  //     rating: 4,
  //     comment:
  //       "Very patient and professional. The yoga program has really helped my flexibility.",
  //     date: "Jan 30, 2025",
  //     avatar: "S",
  //   },
  // ];

  const {data: reviews = []} = useQuery({
    queryKey: ["reviews"],
    queryFn: async() => {
      const res = await axios.get("/api/coach/reviews");
      return res.data;
    }
  });
  
  const avgRating = (
    reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
  ).toFixed(1);
  
  const ratingDistribution = [5, 4, 3, 2, 1].map((r) => ({
    stars: r,
    count: reviews.filter((rv) => rv.rating === r).length,
    pct: Math.round(
      (reviews.filter((rv) => rv.rating === r).length / reviews.length) * 100
    ),
  }));
  return (
    <>
      <div className="max-w-6xl px-4 mx-auto space-y-8">
          <title>Coach-Reviews | Dashboard - Flexify</title>

        {/* Header */}
        <div>
          <h1
            className="text-2xl font-bold"
            style={{ color: "var(--text-primary)" }}
          >
            Reviews & Ratings
          </h1>
          <p
            className="mt-1 text-sm"
            style={{ color: "var(--text-muted)" }}
          >
            Client feedback and public coach profile
          </p>
        </div>

        {/* Rating Summary */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">

          {/* Average Rating */}
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

            <span
              className="text-sm"
              style={{ color: "var(--text-muted)" }}
            >
              {reviews.length} reviews
            </span>
          </motion.div>

          {/* Distribution */}
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
                      className="h-full rounded-full"
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

          {reviews.map((r, i) => (
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
                  style={{
                    background: "var(--primary)",
                    color: "white",
                  }}
                >
                  {r.avatar}
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
                      style={{ color: "var(--text-muted)" }}
                    />

                    <p
                      className="text-sm"
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