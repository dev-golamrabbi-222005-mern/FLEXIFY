"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
  ArrowLeft,
  Clock,
  Calendar,
  Share2,
  Bookmark,
  Loader2,
} from "lucide-react";

interface Article {
  _id: string;
  title: string;
  content: string;
  createdAt?: string;
}

export default function BlogDetails() {
  const { id } = useParams();
  const router = useRouter();

  const { data: blogs = [], isLoading } = useQuery<Article[]>({
    queryKey: ["articles"],
    queryFn: async () =>
      (await axios.get("/api/admin/content?type=articles")).data,
  });

  const blog = blogs.find((b) => b._id === id);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-[var(--primary)]" />
        <p className="text-[var(--text-muted)] font-bold uppercase tracking-widest text-xs">
          Loading Article...
        </p>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="max-w-xl mx-auto py-20 text-center space-y-6">
        <h2 className="text-3xl font-black text-[var(--text-primary)]">
          Article Not Found
        </h2>
        <p className="text-[var(--text-secondary)]">
          The insights you're looking for might have been moved or archived.
        </p>
        <button
          onClick={() => router.push("/blog")}
          className="btn-primary inline-flex items-center gap-2"
        >
          <ArrowLeft size={18} /> Back to Journal
        </button>
      </div>
    );
  }

  // Calculate estimated reading time
  const wordsPerMinute = 200;
  const noOfWords = blog.content.split(/\s/g).length;
  const minutes = Math.ceil(noOfWords / wordsPerMinute);

  return (
    <article className="min-h-screen pb-20">
      {/* Article Header */}
      <header className="max-w-4xl mx-auto px-4 pt-12 md:pt-20 pb-8 space-y-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-[var(--primary)] font-bold text-sm hover:translate-x-[-4px] transition-transform"
        >
          <ArrowLeft size={16} />
          <span className="uppercase tracking-widest">Back to Journal</span>
        </button>

        <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-[var(--text-primary)] leading-[1.1]">
          {blog.title}
        </h1>

        <div className="flex flex-wrap items-center gap-6 py-6 border-y border-[var(--border-color)]">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-[var(--primary)] flex items-center justify-center text-white font-bold">
              F
            </div>
            <div>
              <p className="text-xs font-black uppercase text-[var(--text-primary)]">
                Flexify Team
              </p>
              <p className="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-tighter">
                Verified Expert
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-[var(--text-muted)] text-xs font-bold border-l border-[var(--border-color)] pl-6">
            <div className="flex items-center gap-1.5">
              <Calendar size={14} className="text-[var(--primary)]" />
              <span>
                {blog.createdAt
                  ? new Date(blog.createdAt).toLocaleDateString()
                  : "Recent"}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock size={14} className="text-[var(--primary)]" />
              <span>{minutes} MIN READ</span>
            </div>
          </div>

          <div className="ml-auto flex items-center gap-3">
            <button className="p-2 rounded-full bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--primary)] transition-colors">
              <Share2 size={18} />
            </button>
            <button className="p-2 rounded-full bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--primary)] transition-colors">
              <Bookmark size={18} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <section className="max-w-4xl mx-auto px-4">
        {/* Abstract/Intro highlight */}
        <div className="card-glass border-l-4 border-l-[var(--primary)] mb-12">
          <p className="text-xl italic font-medium text-[var(--text-primary)] leading-relaxed">
            Quick Summary: This article explores the core strategies behind{" "}
            {blog.title.toLowerCase()} and how you can implement these tips into
            your Flexify routine today.
          </p>
        </div>

        {/* Content Body */}
        <div className="prose prose-lg max-w-none prose-invert">
          <p className="text-xl md:text-2xl text-[var(--text-secondary)] leading-[1.8] whitespace-pre-wrap font-medium">
            {blog.content}
          </p>
        </div>

        {/* Footer Navigation */}
        <div className="mt-20 pt-10 border-t border-[var(--border-color)] flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-4">
            <p className="font-black uppercase tracking-widest text-sm text-[var(--text-muted)]">
              Enjoyed the read?
            </p>
            <div className="flex gap-2">
              {["#Fitness", "#Health", "#Flexify"].map((tag) => (
                <span
                  key={tag}
                  className="text-xs font-bold text-[var(--primary)] bg-[var(--primary-light)]/20 px-3 py-1 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <button
            onClick={() => router.push("/blogs")}
            className="btn-secondary w-full md:w-auto text-center"
          >
            Explore More Articles
          </button>
        </div>
      </section>
    </article>
  );
}
