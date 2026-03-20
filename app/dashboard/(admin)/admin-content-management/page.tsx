"use client";

import { useState } from "react";
import { FileText, HelpCircle, Home, Edit, Trash2, Plus, Search } from "lucide-react";
import Swal from "sweetalert2";

export default function AdminContentManagementPage() {
  const [search, setSearch] = useState("");

  const [blogs, setBlogs] = useState([
    { id: 1, title: "Best Workout Tips", status: "Published" },
    { id: 2, title: "Nutrition Guide", status: "Draft" },
    { id: 3, title: "Muscle Gain Strategy", status: "Published" },
  ]);

  const [faqs, setFaqs] = useState([
    { id: 1, question: "How to start workout?", answer: "Start with warm-up." },
    { id: 2, question: "Do I need equipment?", answer: "Not always." },
  ]);

  const filteredBlogs = blogs.filter((blog) =>
    blog.title.toLowerCase().includes(search.toLowerCase())
  );

  const deleteBlog = (id: number) => setBlogs(blogs.filter((b) => b.id !== id));
  const deleteFaq = (id: number) => setFaqs(faqs.filter((f) => f.id !== id));

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 space-y-10 bg-[var(--bg-primary)] min-h-screen">

      {/* PAGE HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <FileText />
          <h1 className="text-2xl md:text-3xl font-bold">Content Management</h1>
        </div>

        <div className="flex items-center gap-2 border rounded-lg px-3 py-2 w-full sm:w-64">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search article..."
            className="outline-none bg-transparent w-full"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <div className="bg-[var(--card-bg)] rounded-2xl shadow-md p-5 hover:shadow-xl transition flex items-center justify-between">
          <div>
            <p className="text-sm text-[var(--text-secondary)]">Total Articles</p>
            <h2 className="text-2xl font-bold">{blogs.length}</h2>
          </div>
          <div className="p-3 rounded-xl bg-gradient-to-r from-blue-400 to-indigo-600 text-white">
            <FileText size={22} />
          </div>
        </div>

        <div className="bg-[var(--card-bg)] rounded-2xl shadow-md p-5 hover:shadow-xl transition flex items-center justify-between">
          <div>
            <p className="text-sm text-[var(--text-secondary)]">Total FAQs</p>
            <h2 className="text-2xl font-bold">{faqs.length}</h2>
          </div>
          <div className="p-3 rounded-xl bg-gradient-to-r from-green-400 to-emerald-600 text-white">
            <HelpCircle size={22} />
          </div>
        </div>

        <div className="bg-[var(--card-bg)] rounded-2xl shadow-md p-5 hover:shadow-xl transition flex items-center justify-between">
          <div>
            <p className="text-sm text-[var(--text-secondary)]">Homepage Sections</p>
            <h2 className="text-2xl font-bold">1</h2>
          </div>
          <div className="p-3 rounded-xl bg-gradient-to-r from-orange-400 to-pink-500 text-white">
            <Home size={22} />
          </div>
        </div>

      </div>

      {/* BLOG / ARTICLES TABLE */}
      <section className="space-y-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <FileText />
            <h2 className="text-xl font-semibold">Blog / Articles</h2>
          </div>
          <button className="flex items-center gap-2 bg-[var(--primary)] text-white px-4 py-2 rounded-lg">
            <Plus size={16} /> Add Article
          </button>
        </div>

        <div className="card-glass overflow-hidden">
          <div className="grid grid-cols-3 gap-6 px-6 py-3 text-sm font-semibold border-b border-[var(--border-color)] text-[var(--text-secondary)]">
            <div>Title</div>
            <div>Status</div>
            <div className="text-right">Actions</div>
          </div>

          <div className="divide-y divide-[var(--border-color)]">
            {filteredBlogs.map((blog) => (
              <div
                key={blog.id}
                className="grid grid-cols-3 gap-6 px-6 py-4 items-center text-sm hover:bg-[var(--bg-tertiary)] transition"
              >
                <div className="font-medium">{blog.title}</div>
                <div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      blog.status === "Published" ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {blog.status}
                  </span>
                </div>
                <div className="flex justify-end gap-2">
                  <button className="px-3 py-1 text-xs rounded-md bg-blue-500/20 text-blue-500 hover:bg-blue-500/30 flex items-center gap-1">
                    <Edit size={14} /> Edit
                  </button>
                  <button
                    onClick={() => deleteBlog(blog.id)}
                    className="px-3 py-1 text-xs rounded-md bg-red-500/20 text-red-500 hover:bg-red-500/30 flex items-center gap-1"
                  >
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ TABLE */}
      <section className="space-y-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <HelpCircle />
            <h2 className="text-xl font-semibold">FAQs</h2>
          </div>
          <button className="flex items-center gap-2 bg-[var(--primary)] text-white px-4 py-2 rounded-lg">
            <Plus size={16} /> Add FAQ
          </button>
        </div>

        <div className="card-glass overflow-hidden">
          <div className="grid grid-cols-3 gap-6 px-6 py-3 text-sm font-semibold border-b border-[var(--border-color)] text-[var(--text-secondary)]">
            <div>Question</div>
            <div>Answer</div>
            <div className="text-right">Actions</div>
          </div>

          <div className="divide-y divide-[var(--border-color)]">
            {faqs.map((faq) => (
              <div
                key={faq.id}
                className="grid grid-cols-3 gap-6 px-6 py-4 items-center text-sm hover:bg-[var(--bg-tertiary)] transition"
              >
                <div className="font-medium">{faq.question}</div>
                <div>{faq.answer}</div>
                <div className="flex justify-end gap-2">
                  <button className="px-3 py-1 text-xs rounded-md bg-blue-500/20 text-blue-500 hover:bg-blue-500/30 flex items-center gap-1">
                    <Edit size={14} /> Edit
                  </button>
                  <button
                    onClick={() => deleteFaq(faq.id)}
                    className="px-3 py-1 text-xs rounded-md bg-red-500/20 text-red-500 hover:bg-red-500/30 flex items-center gap-1"
                  >
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOMEPAGE CONTENT */}
      <section className="bg-[var(--card-bg)] p-6 md:p-8 rounded-2xl shadow space-y-6">
        <div className="flex items-center gap-2 mb-4">
          <Home />
          <h2 className="text-xl font-semibold">Homepage Content</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-sm block mb-2">Hero Title</label>
            <input
              type="text"
              placeholder="Transform Your Fitness Journey"
              className="w-full border p-3 rounded-lg bg-[var(--card-bg)]"
            />
          </div>
          <div>
            <label className="text-sm block mb-2">Hero Subtitle</label>
            <input
              type="text"
              placeholder="Track workouts and achieve goals"
              className="w-full border p-3 rounded-lg bg-[var(--card-bg)]"
            />
          </div>
          <div className="md:col-span-2">
            <label className="text-sm block mb-2">Hero Description</label>
            <textarea
              rows={4}
              placeholder="Write homepage description..."
              className="w-full border p-3 rounded-lg bg-[var(--card-bg)]"
            />
          </div>
        </div>

        <button className="mt-6 bg-[var(--primary)] text-white px-6 py-3 rounded-lg">
          Save Homepage Content
        </button>
      </section>
    </div>
  );
}