"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SectionTitle from "@/app/(website)/components/ui/section-title";

type Article = {
  id: number;
  title: string;
  short: string;
};

const fullContent =
  "Staying fit requires consistency, proper nutrition, and a balanced workout routine. Start with simple exercises like push-ups, squats, and walking. Gradually increase intensity as your body adapts. Combine strength training with cardio for best results. Maintain a healthy diet rich in protein, vitamins, and hydration. Avoid junk food and ensure proper sleep. Most importantly, stay consistent and motivated throughout your fitness journey.";

const articles: Article[] = [
  { id: 1, title: "Beginner Workout Plan", short: fullContent.slice(0, 60) + "..." },
  { id: 2, title: "Healthy Diet Tips", short: fullContent.slice(0, 70) + "..." },
  { id: 3, title: "Stay Consistent", short: fullContent.slice(0, 65) + "..." },
  { id: 4, title: "Fat Loss Guide", short: fullContent.slice(0, 75) + "..." },
  { id: 5, title: "Muscle Building", short: fullContent.slice(0, 60) + "..." },
  { id: 6, title: "Morning Routine", short: fullContent.slice(0, 70) + "..." },
  { id: 7, title: "Cardio Benefits", short: fullContent.slice(0, 65) + "..." },
  { id: 8, title: "Home Workout", short: fullContent.slice(0, 75) + "..." },
];

export default function Articles() {
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Article | null>(null);

  const itemsPerPage = 4;
  const totalPages = Math.ceil(articles.length / itemsPerPage);

  const start = (page - 1) * itemsPerPage;
  const currentArticles = articles.slice(start, start + itemsPerPage);

  return (
    <section className="pb-12 px-6 bg-[var(--bg-primary)] min-h-screen">
      <div className="mx-auto max-w-6xl">

        {/* Heading */}
        <SectionTitle title="Articles" />

        {/* Grid */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 mt-10">
          {currentArticles.map((article, index) => (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className="p-6 rounded-2xl bg-white/5 backdrop-blur-lg border border-white/10 shadow-xl"
            >
              <h3 className="text-lg font-bold mb-2">{article.title}</h3>
              <p className="text-sm text-zinc-400">{article.short}</p>
              <button
                onClick={() => setSelected(article)}
                className="mt-4 w-full py-2 rounded-lg bg-[var(--primary)] text-white font-semibold"
              >
                Read More
              </button>
            </motion.div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-center gap-3 mt-10">
          {/* Previous */}
          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
            className="px-3 py-1 rounded-md border border-white/20 hover:bg-[var(--primary)] hover:text-white transition-colors"
          >
            {"<"}
          </button>

          {/* Page Numbers */}
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`px-3 py-1 rounded-md border border-white/20 transition-colors
                ${page === i + 1 ? "bg-[var(--primary)] text-white" : "hover:bg-[var(--primary)] hover:text-white"}`}
            >
              {i + 1}
            </button>
          ))}

          {/* Next */}
          <button
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={page === totalPages}
            className="px-3 py-1 rounded-md border border-white/20 hover:bg-[var(--primary)] hover:text-white transition-colors"
          >
            {">"}
          </button>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-[var(--bg-primary)] border border-white/10 rounded-2xl p-6 max-w-xl w-full shadow-xl"
            >
              <h2 className="text-xl font-bold mb-4">{selected.title}</h2>
              <p className="text-zinc-400 leading-relaxed">{fullContent}</p>
              <button
                onClick={() => setSelected(null)}
                className="mt-6 w-full py-2 rounded-lg bg-[var(--primary)] text-white font-semibold"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}