"use client";

import React from "react";
import { HelpCircle, Plus, Trash2 } from "lucide-react";
import { FAQ } from "@/types/content";

interface ContentFaqListProps {
  faqs: FAQ[];
  onAddFAQ: () => void;
  onDeleteFAQ: (id: string) => void;
}

export default function ContentFaqList({
  faqs,
  onAddFAQ,
  onDeleteFAQ,
}: ContentFaqListProps) {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-xl font-bold">
          <HelpCircle className="text-[var(--secondary)]" /> FAQs
        </h2>
        <button onClick={onAddFAQ} className="btn-secondary flex items-center gap-2 px-4 py-2 rounded-lg">
          <Plus size={18} /> Add FAQ
        </button>
      </div>
      <div className="card-glass p-0 overflow-hidden">
        {faqs.map((faq) => (
          <div
            key={faq._id}
            className="flex justify-between p-5 border-b border-[var(--border-color)] items-center"
          >
            <div>
              <p className="font-bold text-[var(--text-primary)]">{faq.question}</p>
              <p className="text-sm text-[var(--text-secondary)]">{faq.answer}</p>
            </div>
            <button onClick={() => faq._id && onDeleteFAQ(faq._id)} className="text-red-500 p-2">
              <Trash2 size={18} />
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
