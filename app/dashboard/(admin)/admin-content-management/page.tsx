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
  Loader2,
  Image as ImageIcon,
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import Swal from "sweetalert2";
import {
  Article,
  FAQ,
  HomeContent,
  MutationPayload,
  ContentType,
} from "@/types/content";
import { toast } from "react-toastify";
import ImageUpload from "@/components/ImageUpload/page"; // Ensure this path is correct
import { string } from "zod";

export default function AdminContentManagementPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState<string>("");

  // 1. ADD STATE FOR IMAGE URL
  const [tempImageUrl, setTempImageUrl] = useState<string>("");

  // Queries (Unchanged)
  const { data: blogs = [], isLoading: bLoading } = useQuery<Article[]>({
    queryKey: ["articles"],
    queryFn: async () =>
      (await axios.get("/api/admin/content?type=articles")).data,
  });

  const { data: faqs = [], isLoading: fLoading } = useQuery<FAQ[]>({
    queryKey: ["faqs"],
    queryFn: async () => (await axios.get("/api/admin/content?type=faqs")).data,
  });

  const { data: home } = useQuery<HomeContent[]>({
    queryKey: ["homeContent"],
    queryFn: async () =>
      (await axios.get("/api/admin/content?type=homeContent")).data,
  });

  // Mutations (Unchanged)
  const mutation = useMutation({
    mutationFn: async (payload: MutationPayload) => {
      if (payload.id) return axios.patch("/api/admin/content", payload);
      return axios.post("/api/admin/content", payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries();
      toast.success("Operation Completed");
      setTempImageUrl(""); // 2. CLEAR IMAGE AFTER SUCCESS
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async ({ type, id }: { type: ContentType; id: string }) =>
      axios.delete(`/api/admin/content?type=${type}&id=${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries();
      toast.error("Item Deleted"); // Feedback is always good!
    },
  });

  // Handlers
  const handleAddArticle = async (): Promise<void> => {
    // 3. VALIDATE IMAGE BEFORE OPENING MODAL (Optional but recommended)
    if (!tempImageUrl) {
      toast.info("Please upload a cover image first!");
    }

    const { value: formValues } = await Swal.fire({
      title: "Article Details",
      background: "var(--bg-secondary)",
      color: "var(--text-primary)",
      html: `
        <div style="text-align: left; margin-bottom: 15px;">
           <p style="font-size: 12px; color: var(--text-muted); margin-bottom: 5px;">COVER IMAGE URL:</p>
           <input class="input-style" value="${tempImageUrl}" disabled style="opacity: 0.6; cursor: not-allowed">
        </div>
        <input id="swal-title" class="input-style mb-4" placeholder="Article Title" style="margin-bottom: 10px">
        <textarea id="swal-content" class="input-style" placeholder="Write your article content here..." rows="6"></textarea>
      `,
      confirmButtonColor: "var(--primary)",
      showCancelButton: true,
      confirmButtonText: "Publish Article",
      preConfirm: () => ({
        title: (document.getElementById("swal-title") as HTMLInputElement)
          .value,
        content: (
          document.getElementById("swal-content") as HTMLTextAreaElement
        ).value,
      }),
    });

    if (formValues?.title) {
      // 4. INCLUDE IMAGE URL IN MUTATION
      mutation.mutate({
        type: "articles",
        ...formValues,
        image: tempImageUrl, // This comes from our state
        status: "Published",
      });
    }
  };

  const handleAddFAQ = async (): Promise<void> => {
    const { value: formValues } = await Swal.fire({
      title: "Add New FAQ",
      background: "var(--bg-secondary)",
      color: "var(--text-primary)",
      html: `
        <input id="swal-q" class="input-style mb-4" placeholder="Question" style="margin-bottom: 10px">
        <input id="swal-a" class="input-style" placeholder="Answer">
      `,
      confirmButtonColor: "var(--primary)",
      showCancelButton: true,
      preConfirm: () => ({
        question: (document.getElementById("swal-q") as HTMLInputElement).value,
        answer: (document.getElementById("swal-a") as HTMLInputElement).value,
      }),
    });
    if (formValues?.question) mutation.mutate({ type: "faqs", ...formValues });
  };

  const filteredBlogs = blogs.filter((b) =>
    b.title.toLowerCase().includes(search.toLowerCase()),
  );

  if (bLoading || fLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[var(--bg-primary)]">
        <Loader2 className="animate-spin text-[var(--primary)]" size={40} />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <title>Content Management | Dashboard - Flexify</title>

      {/* Search Header */}
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <h1 className="text-3xl font-black text-[var(--text-primary)]">
          Content Manager
        </h1>
        <div className="relative w-full md:w-72">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
            size={18}
          />
          <input
            type="text"
            placeholder="Search articles..."
            className="pl-10 input-style"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <StatCard
          title="Articles"
          value={blogs.length}
          Icon={FileText}
          colorClass="from-emerald-400 to-emerald-600"
        />
        <StatCard
          title="FAQs"
          value={faqs.length}
          Icon={HelpCircle}
          colorClass="from-violet-400 to-violet-600"
        />
        <StatCard
          title="Sections"
          value={home?.length}
          Icon={Home}
          colorClass="from-orange-400 to-pink-500"
        />
      </div>

      {/* Home Settings */}
      <section className="space-y-6 card-glass">
        <h2 className="flex items-center gap-2 text-xl font-bold">
          <Home className="text-[var(--warning)]" /> Homepage Settings
        </h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <label>Hero Title</label>
            <input
              id="h-title"
              defaultValue={home?.[0]?.heroTitle}
              className="input-style"
              placeholder="e.g. Transform Your Life"
            />
          </div>
          <div className="space-y-2">
            <label>Hero Subtitle</label>
            <input
              id="h-sub"
              defaultValue={home?.[0]?.heroSubtitle}
              className="input-style"
              placeholder="e.g. Best Fitness App"
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <label>Hero Description</label>
            <textarea
              id="h-desc"
              defaultValue={home?.[0]?.heroDescription}
              className="input-style"
              placeholder="Description..."
              rows={3}
            />
          </div>
        </div>
        <button
          onClick={() =>
            mutation.mutate({
              type: "homeContent",
              id: home?.[0]?._id,
              heroTitle: (
                document.getElementById("h-title") as HTMLInputElement
              ).value,
              heroSubtitle: (
                document.getElementById("h-sub") as HTMLInputElement
              ).value,
              heroDescription: (
                document.getElementById("h-desc") as HTMLTextAreaElement
              ).value,
            })
          }
          className="w-full btn-primary md:w-auto"
        >
          Save Changes
        </button>
      </section>

      {/* Articles Section */}
      <section className="space-y-6">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <h2 className="flex items-center gap-2 text-2xl font-black text-[var(--text-primary)]">
            <FileText className="text-[var(--primary)]" /> ARTICLES
          </h2>

          {/* 5. THE ADD BUTTON (Only highlight if image is uploaded) */}
          <button
            onClick={handleAddArticle}
            disabled={!tempImageUrl}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${
              tempImageUrl
                ? "bg-[var(--primary)] text-white shadow-lg hover:scale-105"
                : "bg-[var(--bg-tertiary)] text-[var(--text-muted)] cursor-not-allowed border border-[var(--border-color)]"
            }`}
          >
            <Plus size={18} />{" "}
            {tempImageUrl ? "Create Post" : "Upload Image to Start"}
          </button>
        </div>

        {/* 6. THE IMAGE UPLOADER (Placed here for visibility) */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="space-y-2 lg:col-span-1">
            <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-tighter">
              1. Upload Background
            </label>
            <ImageUpload onUploadSuccess={(url) => setTempImageUrl(url)} />
          </div>

          <div className="space-y-2 lg:col-span-2">
            <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-tighter">
              2. Manage Content
            </label>
            <div className="p-0 overflow-hidden card-glass min-h-[220px]">
              {filteredBlogs.length > 0 ? (
                filteredBlogs.map((blog) => (
                  <div
                    key={blog._id}
                    className="flex justify-between p-5 border-b border-[var(--border-color)] items-center hover:bg-[var(--bg-tertiary)] transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      {blog.image && (
                        <img
                          src={blog.image}
                          className="w-12 h-12 rounded-lg object-cover border border-[var(--border-color)]"
                          alt=""
                        />
                      )}
                      <div>
                        <p className="font-bold text-[var(--text-primary)]">
                          {blog.title}
                        </p>
                        <span className="text-[10px] font-black px-2 py-0.5 rounded bg-[var(--primary-light)] text-[var(--primary)] uppercase">
                          {blog.status}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() =>
                        blog._id &&
                        deleteMutation.mutate({
                          type: "articles",
                          id: blog._id,
                        })
                      }
                      className="text-[var(--danger)] hover:bg-red-500/10 p-2 rounded-full transition-all"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-10 opacity-40">
                  <ImageIcon size={40} />
                  <p className="p-5 text-[var(--text-muted)] font-bold">
                    No articles found.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-xl font-bold">
            <HelpCircle className="text-[var(--secondary)]" /> FAQs
          </h2>
          <button
            onClick={handleAddFAQ}
            className="flex items-center gap-2 btn-secondary"
          >
            <Plus size={18} /> Add FAQ
          </button>
        </div>
        <div className="p-0 overflow-hidden card-glass">
          {faqs.map((faq) => (
            <div
              key={faq._id}
              className="flex justify-between p-5 border-b border-[var(--border-color)] items-center hover:bg-[var(--bg-tertiary)] transition-colors"
            >
              <div>
                <p className="font-bold text-[var(--text-primary)]">
                  {faq.question}
                </p>
                <p className="text-sm text-[var(--text-secondary)]">
                  {faq.answer}
                </p>
              </div>
              <button
                onClick={() =>
                  faq._id &&
                  deleteMutation.mutate({ type: "faqs", id: faq._id })
                }
                className="text-[var(--danger)] p-2 rounded-full"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: number | string | undefined;
  Icon: React.ElementType;
  colorClass: string;
}

function StatCard({ title, value, Icon, colorClass }: StatCardProps) {
  return (
    <div className="card-glass flex items-center justify-between group hover:border-[var(--primary)] transition-all">
      <div>
        <p className="text-xs text-[var(--text-muted)] font-bold uppercase tracking-widest">
          {title}
        </p>
        <h2 className="text-3xl font-black text-[var(--text-primary)]">
          {value}
        </h2>
      </div>
      <div
        className={`p-4 rounded-2xl bg-gradient-to-br ${colorClass} text-white shadow-lg`}
      >
        <Icon size={28} />
      </div>
    </div>
  );
}
