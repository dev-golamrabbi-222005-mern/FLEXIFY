"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Link from "next/link";

interface Article {
  _id: string;
  title: string;
  content: string;
  status: string;
}

export default function Blog() {
  const { data: blogs = [], isLoading } = useQuery<Article[]>({
    queryKey: ["articles"],
    queryFn: async () =>
      (await axios.get("/api/admin/content?type=articles")).data,
  });

  if (isLoading) return <p>Loading...</p>;

  return (
    <section className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">Blogs</h1>

      <div className="grid md:grid-cols-2 gap-6">
        {blogs.map((blog) => (
          <div
            key={blog._id}
            className="p-6 border rounded-xl hover:shadow-lg transition"
          >
            <h2 className="text-xl font-bold">{blog.title}</h2>

            <p className="text-sm text-gray-500 mt-2">
              {blog.content.slice(0, 100)}...
            </p>

            <Link
              href={`/blog/${blog._id}`}
              className="text-blue-600 mt-3 inline-block"
            >
              Read More →
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
