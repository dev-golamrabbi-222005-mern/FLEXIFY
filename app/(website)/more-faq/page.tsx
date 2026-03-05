"use client";

import SectionTitle from "@/app/(website)/components/ui/section-title";
import {
  FiBarChart2,
  FiCoffee,
  FiTrendingUp,
  FiHeart,
  FiUserCheck,
  FiZap,
  FiCompass,
  FiStar,
  FiShieldOff,
  FiSmile,
} from "react-icons/fi";
import Link from "next/link";

const newFaqs = [
  {
    question: "How long does it take to see results?",
    answer:
      "Results vary depending on consistency, nutrition, and exercise intensity. Most users notice improvements within 4–6 weeks.",
    icon: <FiTrendingUp />,
  },
  {
    question: "Can beginners use Flexify safely?",
    answer:
      "Yes, Flexify adapts recommendations for all fitness levels, ensuring safe and effective routines for beginners.",
    icon: <FiUserCheck />,
  },
  {
    question: "Do I need equipment to follow workouts?",
    answer:
      "Many workouts can be done using bodyweight. Optional equipment enhances variety but isn’t mandatory.",
    icon: <FiBarChart2 />,
  },
  {
    question: "Does Flexify track nutrition?",
    answer:
      "Currently, we provide nutrition guidance based on logic rules. Full tracking features may be added in future updates.",
    icon: <FiCoffee />,
  },
  {
    question: "Can I personalize my goals?",
    answer:
      "Yes, you can set personal goals and adjust focus areas, such as weight loss, strength, or endurance.",
    icon: <FiCompass />,
  },
  {
    question: "Is Flexify suitable for remote training?",
    answer:
      "Absolutely. Flexify’s platform works on mobile, tablet, and desktop, making it perfect for home or remote workouts.",
    icon: <FiZap />,
  },
  {
    question: "Are my personal data and privacy safe?",
    answer:
      "Yes. Flexify does not permanently store sensitive health information, ensuring your data stays private.",
    icon: <FiShieldOff />,
  },
  {
    question: "Can I combine Flexify with other fitness apps?",
    answer:
      "Yes, Flexify’s recommendations can complement other apps, but tracking remains independent within Flexify.",
    icon: <FiStar />,
  },
  {
    question: "Does Flexify motivate long-term?",
    answer:
      "Flexify provides adaptive routines and progress tracking to keep you motivated over the long term.",
    icon: <FiHeart />,
  },
  {
    question: "Is support available if I have questions?",
    answer:
      "Yes, our team is ready to help with any inquiries or technical support to ensure smooth use.",
    icon: <FiSmile />,
  },
];

export default function MoreFAQPage() {
  return (
    <section className="py-16 bg-[var(--bg-primary)] min-h-screen">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <SectionTitle
          title="More Frequently Asked Questions"
          subtitle="Explore additional details about Flexify and get answers to common questions."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
          {newFaqs.map((faq, index) => (
            <div
              key={index}
              className="bg-[var(--card-bg)] rounded-2xl p-8 text-left shadow-sm"
            >
              <div className="flex items-start gap-4 mb-4">
                <div
                  className="w-10 h-10 flex items-center justify-center rounded-lg 
                             border border-[var(--primary)]
                             text-[var(--primary)] text-lg"
                >
                  {faq.icon}
                </div>

                <h3 className="text-xl font-bold text-[var(--text-primary)]">
                  {faq.question}
                </h3>
              </div>

              <p className="text-[var(--text-secondary)] leading-relaxed">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>

        {/* Back To Home Page Button */}
        <div className="mt-12">
          <Link
            href="/"
            className="inline-block px-8 py-3 rounded-xl font-semibold
                       bg-[var(--primary)] text-white
                       transition-all duration-300
                       hover:opacity-90
                       hover:-translate-y-1
                       hover:shadow-lg"
          >
            Back To Home
          </Link>
        </div>
      </div>
    </section>
  );
}