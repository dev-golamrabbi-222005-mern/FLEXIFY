"use client";

import React from "react";
import { FileText, Plus, Trash2, Image as ImageIcon } from "lucide-react";
import { Article } from "@/types/content";

interface ContentArticlesListProps {
  blogs: Article[];
  onOpenCreate: () => void;
  onDelete: (id: string) => void;
}

export default function ContentArticlesList({
  blogs,
  onOpenCreate,
  onDelete,
}: ContentArticlesListProps) {
  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-2xl font-black">
          <FileText className="text-[var(--primary)]" /> ARTICLES
        </h2>
        <button
          onClick={onOpenCreate}
          className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold bg-[var(--primary)] text-white hover:scale-105 transition-all shadow-lg shadow-[var(--primary)]/20"
        >
          <Plus size={18} /> Create Article
        </button>
      </div>

      <div className="card-glass p-0 overflow-hidden min-h-[300px]">
        {blogs.length > 0 ? (
          blogs.map((blog) => (
            <div
              key={blog._id}
              className="flex justify-between p-5 border-b border-[var(--border-color)] items-center hover:bg-[var(--bg-tertiary)] transition-colors"
            >
              <div className="flex items-center gap-4">
                <img
                  src={blog.image}
                  className="w-14 h-14 rounded-xl object-cover border border-[var(--border-color)]"
                  alt=""
                />
                <div>
                  <p className="font-bold text-[var(--text-primary)]">{blog.title}</p>
                  <span className="text-[10px] font-black px-2 py-0.5 rounded bg-[var(--primary)]/10 text-[var(--primary)] uppercase">
                    {blog.status}
                  </span>
                </div>
              </div>
              <button
                onClick={() => blog._id && onDelete(blog._id)}
                className="text-red-500 hover:bg-red-500/10 p-3 rounded-full transition-all"
              >
                <Trash2 size={20} />
              </button>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-20 opacity-30">
            <ImageIcon size={48} />
            <p className="mt-4 font-bold">No articles found</p>
          </div>
        )}
      </div>
    </section>
  );
}
