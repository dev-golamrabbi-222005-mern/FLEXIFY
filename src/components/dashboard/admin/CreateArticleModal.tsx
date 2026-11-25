"use client";

import React from "react";
import { X } from "lucide-react";
import ImageUpload from "@/components/ImageUpload/page";

interface CreateArticleModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  setTitle: (v: string) => void;
  content: string;
  setContent: (v: string) => void;
  tempImageUrl: string;
  setTempImageUrl: (url: string) => void;
  isPending: boolean;
  onPublish: () => void;
}

export default function CreateArticleModal({
  isOpen,
  onClose,
  title,
  setTitle,
  content,
  setContent,
  tempImageUrl,
  setTempImageUrl,
  isPending,
  onPublish,
}: CreateArticleModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] w-full max-w-2xl rounded-3xl p-8 shadow-2xl space-y-6 relative animate-in fade-in zoom-in duration-200">
        <button onClick={onClose} className="absolute top-6 right-6 text-[var(--text-muted)] hover:text-white">
          <X size={24} />
        </button>
        <h2 className="text-3xl font-black text-[var(--text-primary)] tracking-tighter">NEW ARTICLE</h2>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-[var(--text-muted)] uppercase">Title</label>
                <input
                  className="input-style"
                  placeholder="Catchy fitness title..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-[var(--text-muted)] uppercase">Content</label>
                <textarea
                  className="input-style"
                  placeholder="Write the body of the article..."
                  rows={6}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-[var(--text-muted)] uppercase">Thumbnail Image</label>
              <ImageUpload onUploadSuccess={(url) => setTempImageUrl(url)} className="min-h-[220px]" />
              {tempImageUrl && (
                <p className="text-[10px] text-emerald-400 font-bold text-center">✓ Image Uploaded Ready</p>
              )}
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button onClick={onClose} className="flex-1 py-4 font-bold text-[var(--text-muted)] hover:text-white transition-colors">
              Cancel
            </button>
            <button
              disabled={!tempImageUrl || !title || isPending}
              onClick={onPublish}
              className="flex-[2] py-4 rounded-2xl font-black bg-[var(--primary)] text-white shadow-xl shadow-[var(--primary)]/20 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-95 transition-all"
            >
              {isPending ? "Publishing..." : "PUBLISH NOW"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
