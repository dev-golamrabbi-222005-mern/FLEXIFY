"use client";

import { useState } from "react";
import {
  FileText,
  HelpCircle,
  Home,
  Edit,
  Trash2,
  Plus,
  Search,
} from "lucide-react";

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

  const deleteBlog = (id: number) => {
    setBlogs(blogs.filter((blog) => blog.id !== id));
  };

  const deleteFaq = (id: number) => {
    setFaqs(faqs.filter((faq) => faq.id !== id));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 space-y-10 bg-[var(--bg-primary)]">

      {/* PAGE HEADER */}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

        <div className="flex items-center gap-3">
          <FileText />
          <h1 className="text-2xl md:text-3xl font-bold">
            Content Management
          </h1>
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

      {/* ================= BLOG MANAGEMENT ================= */}

      <section className="bg-[var(--card-bg)] p-6 md:p-8 rounded-2xl shadow">

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">

          <div className="flex items-center gap-2">
            <FileText />
            <h2 className="text-xl font-semibold">Blog / Articles</h2>
          </div>

          <button className="flex items-center gap-2 bg-[var(--primary)] text-white px-4 py-2 rounded-lg">
            <Plus size={16} />
            Add Article
          </button>

        </div>

        <div className="space-y-4">

          {filteredBlogs.map((blog) => (

            <div
              key={blog.id}
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b pb-3"
            >

              <div>
                <p className="font-medium">{blog.title}</p>

                <span
                  className={`text-sm ${
                    blog.status === "Published"
                      ? "text-green-600"
                      : "text-gray-500"
                  }`}
                >
                  {blog.status}
                </span>
              </div>

              <div className="flex gap-4">

                <button className="text-blue-600 flex items-center gap-1">
                  <Edit size={16}/> Edit
                </button>

                <button
                  onClick={() => deleteBlog(blog.id)}
                  className="text-red-600 flex items-center gap-1"
                >
                  <Trash2 size={16}/> Delete
                </button>

              </div>

            </div>

          ))}

        </div>

      </section>

      {/* ================= FAQ MANAGEMENT ================= */}

      <section className="bg-[var(--card-bg)] p-6 md:p-8 rounded-2xl shadow">

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">

          <div className="flex items-center gap-2">
            <HelpCircle />
            <h2 className="text-xl font-semibold">FAQs</h2>
          </div>

          <button className="flex items-center gap-2 bg-[var(--primary)] text-white px-4 py-2 rounded-lg">
            <Plus size={16}/>
            Add FAQ
          </button>

        </div>

        <div className="space-y-4">

          {faqs.map((faq) => (

            <div
              key={faq.id}
              className="flex flex-col sm:flex-row sm:justify-between gap-4 border-b pb-3"
            >

              <div>
                <p className="font-medium">{faq.question}</p>
                <p className="text-sm text-gray-500">{faq.answer}</p>
              </div>

              <div className="flex gap-4">

                <button className="text-blue-600 flex items-center gap-1">
                  <Edit size={16}/> Edit
                </button>

                <button
                  onClick={() => deleteFaq(faq.id)}
                  className="text-red-600 flex items-center gap-1"
                >
                  <Trash2 size={16}/> Delete
                </button>

              </div>

            </div>

          ))}

        </div>

      </section>

      {/* ================= HOMEPAGE CONTENT ================= */}

      <section className="bg-[var(--card-bg)] p-6 md:p-8 rounded-2xl shadow">

        <div className="flex items-center gap-2 mb-6">
          <Home />
          <h2 className="text-xl font-semibold">
            Homepage Content
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <div>
            <label className="text-sm block mb-2">Hero Title</label>

            <input
              type="text"
              placeholder="Transform Your Fitness Journey"
              className="w-full border p-3 rounded-lg"
            />
          </div>

          <div>
            <label className="text-sm block mb-2">Hero Subtitle</label>

            <input
              type="text"
              placeholder="Track workouts and achieve goals"
              className="w-full border p-3 rounded-lg"
            />
          </div>

          <div className="md:col-span-2">

            <label className="text-sm block mb-2">
              Hero Description
            </label>

            <textarea
              rows={4}
              placeholder="Write homepage description..."
              className="w-full border p-3 rounded-lg"
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