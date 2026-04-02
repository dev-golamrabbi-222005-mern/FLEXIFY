"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import NextLink from "next/link";
import {
  BookOpen,
  ArrowRight,
  Clock,
  ChevronRight,
  Sparkles,
  Loader2,
  ArrowUpRight,
} from "lucide-react";

interface Article {
  _id: string;
  title: string;
  content: string;
  status: string;
  createdAt?: string;
  image?: string;
}

export default function Articles() {
  const { data: blogs = [], isLoading } = useQuery<Article[]>({
    queryKey: ["articles"],
    queryFn: async () =>
      (await axios.get("/api/admin/content?type=articles")).data,
  });

  if (isLoading)
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-[var(--primary)]" />
        <p className="text-[var(--text-muted)] font-medium uppercase tracking-widest text-xs">
          Fetching Latest Insights
        </p>
      </div>
    );

  // LOGIC: 1 Featured + Top 3 Latest
  const featuredBlog = blogs[0];
  const remainBlogs = blogs.slice(1);

  return (
    <section className="max-w-7xl mx-auto px-6 mt-8 md:mt-12 lg:mt-16 mb-10 space-y-12">
      {/* Header Section */}
      <div className="text-center space-y-4">
        {" "}
        {/* Added spacing between elements */}
        <div className="mb-2">
          <div className="flex items-center justify-center mb-1 gap-2 text-[var(--primary)] font-bold text-sm uppercase tracking-widest">
            <Sparkles size={16} />
            <span>Flexify Knowledge Hub</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)]">
            THE JOURNAL
          </h1>
        </div>
        {/* The Divider Line - Fixed Version */}
        <span className="block mx-auto h-1 w-14 rounded-full bg-[var(--primary)]" />
        <p className="text-[var(--text-secondary)] max-w-md mx-auto">
          Expert advice on fitness and performance to help you reach your peak.
        </p>
      </div>

      {/* Featured Blog Layout */}
      {featuredBlog && (
        <NextLink href={`/blogs/${featuredBlog._id}`} className="group block">
          <div className="card-glass overflow-hidden !p-0 border-none relative min-h-[400px] flex flex-col md:flex-row hover:shadow-2xl transition-all duration-500">
            <div className="md:w-1/2 bg-[var(--bg-tertiary)] relative overflow-hidden flex items-center justify-center border-r border-[var(--border-color)]">
              {featuredBlog.image ? (
                <img
                  src={featuredBlog.image}
                  alt="Featured"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              ) : (
                <BookOpen
                  size={80}
                  className="text-[var(--primary)] opacity-20 group-hover:scale-110 transition-transform duration-500"
                />
              )}
            </div>

            <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center space-y-6">
              <span className="bg-[var(--primary)] text-white text-[10px] font-black px-3 py-1 rounded-full uppercase w-fit">
                Featured Highlight
              </span>
              <h2 className="text-3xl md:text-4xl font-black text-[var(--text-primary)] group-hover:text-[var(--primary)] transition-colors leading-tight">
                {featuredBlog.title}
              </h2>
              <p className="text-[var(--text-secondary)] line-clamp-3 leading-relaxed">
                {featuredBlog.content}
              </p>
              <div className="flex items-center gap-1 text-[var(--primary)] font-bold">
                <span>Read Full Article</span>
                <ArrowRight
                  size={16}
                  className="group-hover:translate-x-2 transition-transform"
                />
              </div>
            </div>
          </div>
        </NextLink>
      )}

      {/* Grid Layout for exactly 3 Blogs */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {remainBlogs.map((blog) => (
          <NextLink
            key={blog._id}
            href={`/blogs/${blog._id}`}
            className="group flex flex-col h-full card-glass !p-0 border-transparent hover:border-[var(--primary)] transition-all duration-300 overflow-hidden"
          >
            <div className="h-48 bg-[var(--bg-primary)] flex items-center justify-center border-b border-[var(--border-color)] relative">
              {blog.image ? (
                <img
                  src={blog.image}
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                />
              ) : (
                <span className="text-[var(--text-muted)] font-black text-xs uppercase tracking-widest opacity-30">
                  Flexify Article
                </span>
              )}
            </div>

            <div className="p-6 flex flex-col flex-grow space-y-4">
              <h3 className="text-xl font-bold text-[var(--text-primary)] group-hover:text-[var(--primary)] transition-colors line-clamp-2 leading-snug">
                {blog.title}
              </h3>
              <p className="text-sm text-[var(--text-secondary)] line-clamp-3 flex-grow leading-relaxed italic">
                "{blog.content}"
              </p>
              <div className="pt-4 border-t border-[var(--border-color)] flex items-center justify-between text-[var(--primary)] text-xs font-bold">
                <span>View Details</span>
                <ChevronRight
                  size={14}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </div>
            </div>
          </NextLink>
        ))}
      </div>

      {/* Empty State */}
      {blogs.length === 0 && (
        <div className="text-center py-20 card-glass border-dashed border-2">
          <BookOpen
            className="mx-auto text-[var(--text-muted)] opacity-20 mb-4"
            size={48}
          />
          <h3 className="text-xl font-bold text-[var(--text-secondary)]">
            No articles yet.
          </h3>
        </div>
      )}
    </section>
  );
}
