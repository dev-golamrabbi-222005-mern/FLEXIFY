"use client";

import { useState } from "react";
import {
  FileText,
  HelpCircle,
  Trash2,
  Plus,
  Search,
  Loader2,
  Image as ImageIcon,
  X,
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import Swal from "sweetalert2";
import { Article, FAQ, MutationPayload, ContentType } from "@/types/content";
import { toast } from "react-toastify";
import ImageUpload from "@/components/ImageUpload/page";

export default function AdminContentManagementPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState<string>("");

  // --- MODAL & FORM STATE ---
  const [isArticleModalOpen, setIsArticleModalOpen] = useState(false);
  const [tempImageUrl, setTempImageUrl] = useState<string>("");
  const [articleData, setArticleData] = useState({
    title: "",
    content: "",
  });

  // --- QUERIES ---
  const { data: blogs = [], isLoading: bLoading } = useQuery<Article[]>({
    queryKey: ["articles"],
    queryFn: async () =>
      (await axios.get("/api/admin/content?type=articles")).data,
  });

  const { data: faqs = [], isLoading: fLoading } = useQuery<FAQ[]>({
    queryKey: ["faqs"],
    queryFn: async () => (await axios.get("/api/admin/content?type=faqs")).data,
  });

  // --- MUTATIONS ---
  const mutation = useMutation({
    mutationFn: async (payload: MutationPayload) => {
      if (payload.id) return axios.patch("/api/admin/content", payload);
      return axios.post("/api/admin/content", payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries();
      toast.success("Content Updated Successfully");
      closeAndResetModal();
    },
    onError: () => {
      toast.error("Failed to save content");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async ({ type, id }: { type: ContentType; id: string }) =>
      axios.delete(`/api/admin/content?type=${type}&id=${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries();
      toast.error("Item Deleted");
    },
  });

  // --- HANDLERS ---
  const closeAndResetModal = () => {
    setIsArticleModalOpen(false);
    setTempImageUrl("");
    setArticleData({ title: "", content: "" });
  };

  const handlePublishArticle = () => {
    if (!articleData.title || !articleData.content || !tempImageUrl) {
      toast.warning("Please fill all fields and upload an image");
      return;
    }

    mutation.mutate({
      type: "articles",
      title: articleData.title,
      content: articleData.content,
      image: tempImageUrl,
      status: "Published",
    });
  };

  const handleAddFAQ = async () => {
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
    <div className="space-y-8 relative">
      <title>Content Management | Flexify</title>

      {/* --- SEARCH HEADER --- */}
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <h1 className="font-bold text-3xl md:text-4xl tracking-tight uppercase text-[var(--text-primary)]">
          Content Manager
        </h1>
        <div className="relative w-full md:max-w-72 flex items-center gap-4">
          <Search
            className="absolute left-3 text-[var(--text-muted)]"
            size={18}
          />
          <input
            type="text"
            placeholder="Search articles..."
            className="input-style pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* --- STATS --- */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <StatCard
          title="Total Articles"
          value={blogs.length}
          Icon={FileText}
          colorClass="from-emerald-400 to-emerald-600"
        />
        <StatCard
          title="Total FAQs"
          value={faqs.length}
          Icon={HelpCircle}
          colorClass="from-violet-400 to-violet-600"
        />
      </div>

      {/* --- ARTICLES SECTION --- */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-2xl font-black">
            <FileText className="text-[var(--primary)]" /> ARTICLES
          </h2>
          <button
            onClick={() => setIsArticleModalOpen(true)}
            className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold bg-[var(--primary)] text-white hover:scale-105 transition-all shadow-lg shadow-[var(--primary)]/20"
          >
            <Plus size={18} /> Create Article
          </button>
        </div>

        <div className="card-glass p-0 overflow-hidden min-h-[300px]">
          {filteredBlogs.length > 0 ? (
            filteredBlogs.map((blog) => (
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
                    <p className="font-bold text-[var(--text-primary)]">
                      {blog.title}
                    </p>
                    <span className="text-[10px] font-black px-2 py-0.5 rounded bg-[var(--primary)]/10 text-[var(--primary)] uppercase">
                      {blog.status}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() =>
                    blog._id &&
                    deleteMutation.mutate({ type: "articles", id: blog._id })
                  }
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

      {/* --- FAQ SECTION --- */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-xl font-bold">
            <HelpCircle className="text-[var(--secondary)]" /> FAQs
          </h2>
          <button
            onClick={handleAddFAQ}
            className="btn-secondary flex items-center gap-2 px-4 py-2 rounded-lg"
          >
            <Plus size={18} /> Add FAQ
          </button>
        </div>
        <div className="card-glass p-0 overflow-hidden">
          {faqs.map((faq) => (
            <div
              key={faq._id}
              className="flex justify-between p-5 border-b border-[var(--border-color)] items-center"
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
                className="text-red-500 p-2"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* --- NATIVE REACT MODAL FOR ARTICLES --- */}
      {isArticleModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] w-full max-w-2xl rounded-3xl p-8 shadow-2xl space-y-6 relative animate-in fade-in zoom-in duration-200">
            <button
              onClick={closeAndResetModal}
              className="absolute top-6 right-6 text-[var(--text-muted)] hover:text-white"
            >
              <X size={24} />
            </button>

            <h2 className="text-3xl font-black text-[var(--text-primary)] tracking-tighter">
              NEW ARTICLE
            </h2>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[var(--text-muted)] uppercase">
                      Title
                    </label>
                    <input
                      className="input-style"
                      placeholder="Catchy fitness title..."
                      value={articleData.title}
                      onChange={(e) =>
                        setArticleData({
                          ...articleData,
                          title: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[var(--text-muted)] uppercase">
                      Content
                    </label>
                    <textarea
                      className="input-style"
                      placeholder="Write the body of the article..."
                      rows={6}
                      value={articleData.content}
                      onChange={(e) =>
                        setArticleData({
                          ...articleData,
                          content: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-[var(--text-muted)] uppercase">
                    Thumbnail Image
                  </label>
                  <ImageUpload
                    onUploadSuccess={(url) => setTempImageUrl(url)}
                    className="min-h-[220px]"
                  />
                  {tempImageUrl && (
                    <p className="text-[10px] text-emerald-400 font-bold text-center">
                      ✓ Image Uploaded Ready
                    </p>
                  )}
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  onClick={closeAndResetModal}
                  className="flex-1 py-4 font-bold text-[var(--text-muted)] hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  disabled={
                    !tempImageUrl || !articleData.title || mutation.isPending
                  }
                  onClick={handlePublishArticle}
                  className="flex-[2] py-4 rounded-2xl font-black bg-[var(--primary)] text-white shadow-xl shadow-[var(--primary)]/20 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-95 transition-all"
                >
                  {mutation.isPending ? "Publishing..." : "PUBLISH NOW"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// --- STAT CARD COMPONENT ---
function StatCard({
  title,
  value,
  Icon,
  colorClass,
}: {
  title: string;
  value: number | string;
  Icon: React.ElementType;
  colorClass: string;
}) {
  return (
    <div className="card-glass flex items-center justify-between p-6">
      <div>
        <p className="text-xs text-[var(--text-muted)] font-bold uppercase tracking-widest">
          {title}
        </p>
        <h2 className="text-4xl font-black text-[var(--text-primary)]">
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
