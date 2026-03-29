"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

interface Article {
  _id: string;
  title: string;
  content: string;
}

export default function BlogDetails() {
  const { id } = useParams();

  const { data: blogs = [] } = useQuery<Article[]>({
    queryKey: ["articles"],
    queryFn: async () =>
      (await axios.get("/api/admin/content?type=articles")).data,
  });

  const blog = blogs.find((b) => b._id === id);

  if (!blog) return <p>Not found</p>;

  return (
    <section className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-6">{blog.title}</h1>
      <p className="text-lg text-[var(--text-secondary)]">{blog.content}</p>
    </section>
  );
}
