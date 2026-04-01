"use client";

import {
  FiChevronDown,
  FiTrendingUp,
  FiUserCheck,
  FiBarChart2,
  FiCoffee,
  FiCompass,
  FiZap,
  FiShieldOff,
  FiStar,
  FiHeart,
  FiSmile,
} from "react-icons/fi";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Link from "next/link";

// Define the FAQ type
interface FAQ {
  _id: string;
  question: string;
  answer: string;
}

const icons = [
  <FiTrendingUp key="icon-1" />,
  <FiUserCheck key="icon-2" />,
  <FiBarChart2 key="icon-3" />,
  <FiCoffee key="icon-4" />,
  <FiCompass key="icon-5" />,
  <FiZap key="icon-6" />,
  <FiShieldOff key="icon-7" />,
  <FiStar key="icon-8" />,
  <FiHeart key="icon-9" />,
  <FiSmile key="icon-10" />,
];

export default function FAQPage() {
  // Fetch FAQs from backend
  const { data: faqs = [] } = useQuery<FAQ[]>({
    queryKey: ["faqs"],
    queryFn: async () => {
      const res = await axios.get<FAQ[]>("/api/admin/content?type=faqs");
      return res.data;
    },
  });

  return (
    <main className="min-h-screen mt-8 mb-10 md:mt-12 max-w-7xl px-6 mx-auto relative overflow-hidden">
      <h1 className="text-3xl md:text-5xl font-bold mb-10 text-center text-[var(--text-primary)]">
        Frequently Asked Questions
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-6 mt-8">
        {faqs.map((faq, index) => (
          <div
            key={faq._id}
            className="group cursor-default bg-[var(--card-bg)] rounded-2xl p-8 text-left relative
                       transition-all duration-300
                       hover:bg-[var(--primary)]
                       hover:-translate-y-2
                       hover:shadow-[0_20px_40px_rgba(0,0,0,0.25)]"
          >
            {/* Icon + Question + Arrow */}
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex items-start gap-4">
                <div
                  className="w-10 h-10 flex items-center justify-center rounded-lg 
                             border border-[var(--primary)]
                             text-[var(--primary)] text-lg
                             transition-colors duration-300
                             group-hover:border-white
                             group-hover:text-white"
                >
                  {icons[index % icons.length]}
                </div>

                <h3
                  className="text-xl font-bold 
                             text-[var(--text-primary)]
                             transition-colors
                             group-hover:text-white"
                >
                  {faq.question}
                </h3>
              </div>
            </div>

            {/* Answer (always visible) */}
            <div className="overflow-hidden transition-all duration-500 max-h-40 opacity-100">
              <p
                className="text-[var(--text-secondary)] leading-relaxed
                           transition-colors
                           group-hover:text-white/90"
              >
                {faq.answer}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* See More Button */}
      <div className="mt-12 flex justify-center items-center">
        <Link
          href="/"
          className="inline-block px-8 py-3 rounded-xl font-semibold
                     bg-[var(--primary)] text-white
                     transition-all duration-300
                     hover:opacity-90
                     hover:-translate-y-1
                     hover:shadow-lg"
        >
          Back to Home
        </Link>
      </div>
    </main>
  );
}
