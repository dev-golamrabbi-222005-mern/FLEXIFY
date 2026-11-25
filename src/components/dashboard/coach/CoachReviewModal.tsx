"use client";

import React from "react";
import { Star, Send, X } from "lucide-react";

interface CoachReviewModalProps {
  isOpen: boolean;
  coachName?: string;
  rating: number;
  setRating: (r: number) => void;
  comment: string;
  setComment: (c: string) => void;
  isSubmitting: boolean;
  onSubmit: () => void;
  onClose: () => void;
}

export default function CoachReviewModal({
  isOpen,
  coachName,
  rating,
  setRating,
  comment,
  setComment,
  isSubmitting,
  onSubmit,
  onClose,
}: CoachReviewModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-[var(--card-bg)] border border-[var(--border-color)] w-full max-w-md rounded-3xl p-8 shadow-2xl relative animate-in zoom-in-95 duration-300">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 hover:bg-[var(--bg-tertiary)] rounded-full transition text-[var(--text-muted)]"
        >
          <X size={20} />
        </button>

        <div className="text-center space-y-2 mb-8">
          <h3 className="text-2xl font-black tracking-tight">Review Your Coach</h3>
          <p className="text-sm text-[var(--text-muted)]">How was your experience with {coachName || "your coach"}?</p>
        </div>

        <div className="flex justify-center gap-2 mb-8">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              size={40}
              onClick={() => setRating(star)}
              className={`cursor-pointer transition-all hover:scale-110 ${
                rating >= star ? "fill-yellow-400 text-yellow-400" : "text-[var(--border-color)]"
              }`}
            />
          ))}
        </div>

        <div className="space-y-4">
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Tell us more about the training..."
            className="w-full min-h-[120px] bg-[var(--bg-secondary)] border border-[var(--border-color)] p-4 rounded-2xl outline-none focus:border-[var(--primary)] transition text-sm text-[var(--text-primary)] resize-none"
          />
          <button
            onClick={onSubmit}
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 py-4 bg-[var(--primary)] text-white rounded-2xl font-bold hover:opacity-90 disabled:opacity-50 shadow-xl transition-all active:scale-[0.98]"
          >
            {isSubmitting ? "Submitting..." : <><Send size={18} /> Submit Review</>}
          </button>
        </div>
      </div>
    </div>
  );
}
