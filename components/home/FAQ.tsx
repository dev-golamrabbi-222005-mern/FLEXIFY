"use client";

import { useState } from "react";
import SectionTitle from "@/app/(website)/components/ui/section-title";
import {
  FiActivity,
  FiUser,
  FiLogIn,
  FiShield,
  FiCalendar,
  FiSettings,
  FiChevronDown,
} from "react-icons/fi";

const faqs = [
  {
    question: "What is BMI and how does it work?",
    answer:
      "BMI (Body Mass Index) calculates body fat using your height and weight. It helps determine whether you are underweight, normal, overweight, or obese.",
    icon: <FiActivity />,
  },
  {
    question: "Is Flexify suitable for beginners?",
    answer:
      "Yes, Flexify is designed for all fitness levels. Beginners and advanced users both receive structured and adaptive guidance.",
    icon: <FiUser />,
  },
  {
    question: "Do I need to create an account?",
    answer:
      "No account is required to use the platform. You can instantly access the BMI calculator and explore exercises.",
    icon: <FiLogIn />,
  },
  {
    question: "Is my personal data stored?",
    answer:
      "No, we do not permanently store your health data. All calculations are processed instantly without saving information.",
    icon: <FiShield />,
  },
  {
    question: "How often should I exercise?",
    answer:
      "For best results, exercise 3–5 times per week. Consistency and balanced nutrition are equally important.",
    icon: <FiCalendar />,
  },
  {
    question: "Can I customize my workout plan?",
    answer:
      "Yes, Flexify allows personalization. You can adjust workout intensity and focus areas based on your goals.",
    icon: <FiSettings />,
  },
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="pb-8 md:pb-12 max-w-7xl px-6 mx-auto relative overflow-hidden">
        <SectionTitle title="Frequently Asked Questions" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {faqs.map((faq, index) => (
            <div
              key={index}
              onClick={() => toggleFAQ(index)}
              className="group cursor-pointer bg-[var(--card-bg)] rounded-2xl p-4 md:p-6 text-left relative
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
                    {faq.icon}
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

                {/* Down Arrow */}
                <FiChevronDown
                  className={`text-[var(--primary)] text-xl transition-all duration-300
                              group-hover:text-white
                              ${openIndex === index ? "rotate-180" : ""}`}
                />
              </div>

              {/* Answer */}
              <div
                className={`overflow-hidden transition-all duration-500 ${
                  openIndex === index
                    ? "max-h-40 opacity-100"
                    : "max-h-0 opacity-0"
                }`}
              >
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
          <a
            href="/faqs"
            className="inline-block px-8 py-3 rounded-xl font-semibold
                       bg-[var(--primary)] text-white
                       transition-all duration-300
                       hover:opacity-90
                       hover:-translate-y-1
                       hover:shadow-lg"
          >
            See More FAQs
          </a>
        </div>
      
    </section>
  );
};

export default FAQ;