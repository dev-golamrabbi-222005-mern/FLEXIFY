"use client";

import { useState } from "react";
import { FileText, HelpCircle, Search, Loader2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import Swal from "sweetalert2";
import { Article, FAQ, MutationPayload, ContentType } from "@/types/content";
import { toast } from "react-toastify";
import CreateArticleModal from "@/components/dashboard/admin/CreateArticleModal";
import ContentArticlesList from "@/components/dashboard/admin/ContentArticlesList";
import ContentFaqList from "@/components/dashboard/admin/ContentFaqList";

export default function AdminContentManagementPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState<string>("");
  const [isArticleModalOpen, setIsArticleModalOpen] = useState(false);
  const [tempImageUrl, setTempImageUrl] = useState<string>("");
  const [articleData, setArticleData] = useState({ title: "", content: "" });

  const { data: blogs = [], isLoading: bLoading } = useQuery<Article[]>({
    queryKey: ["articles"],
    queryFn: async () => (await axios.get("/api/admin/content?type=articles")).data,
  });

  const { data: faqs = [], isLoading: fLoading } = useQuery<FAQ[]>({
    queryKey: ["faqs"],
    queryFn: async () => (await axios.get("/api/admin/content?type=faqs")).data,
  });

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
    onError: () => toast.error("Failed to save content"),
  });

  const deleteMutation = useMutation({
    mutationFn: async ({ type, id }: { type: ContentType; id: string }) =>
      axios.delete(`/api/admin/content?type=${type}&id=${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries();
      toast.error("Item Deleted");
    },
  });

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

  const filteredBlogs = blogs.filter((b) => b.title.toLowerCase().includes(search.toLowerCase()));

  if (bLoading || fLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[var(--bg-primary)]">
        <Loader2 className="animate-spin text-[var(--primary)]" size={40} />
      </div>
    );
  }

  return (
    <div className="space-y-8 md:space-y-12 lg:space-y-16 relative">
      <title>Content Management | Flexify</title>
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <h1 className="font-bold text-3xl md:text-4xl tracking-tight uppercase text-[var(--text-primary)]">
          Content Manager
        </h1>
        <div className="relative w-full md:max-w-72 flex items-center gap-4">
          <Search className="absolute left-3 text-[var(--text-muted)]" size={18} />
          <input
            type="text"
            placeholder="Search articles..."
            className="input-style pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <ContentStatCard title="Total Articles" value={blogs.length} Icon={FileText} colorClass="from-emerald-400 to-emerald-600" />
        <ContentStatCard title="Total FAQs" value={faqs.length} Icon={HelpCircle} colorClass="from-violet-400 to-violet-600" />
      </div>

      <ContentArticlesList blogs={filteredBlogs} onOpenCreate={() => setIsArticleModalOpen(true)} onDelete={(id) => deleteMutation.mutate({ type: "articles", id })} />
      <ContentFaqList faqs={faqs} onAddFAQ={handleAddFAQ} onDeleteFAQ={(id) => deleteMutation.mutate({ type: "faqs", id })} />

      <CreateArticleModal
        isOpen={isArticleModalOpen}
        onClose={closeAndResetModal}
        title={articleData.title}
        setTitle={(v) => setArticleData((prev) => ({ ...prev, title: v }))}
        content={articleData.content}
        setContent={(v) => setArticleData((prev) => ({ ...prev, content: v }))}
        tempImageUrl={tempImageUrl}
        setTempImageUrl={setTempImageUrl}
        isPending={mutation.isPending}
        onPublish={handlePublishArticle}
      />
    </div>
  );
}

function ContentStatCard({ title, value, Icon, colorClass }: { title: string; value: number; Icon: React.ElementType; colorClass: string }) {
  return (
    <div className="card-glass relative overflow-hidden flex items-center justify-between p-6">
      <div className="absolute -bottom-3 -right-3 pointer-events-none opacity-[0.07] transform -rotate-12 select-none text-[var(--text-primary)]">
        <Icon size={76} />
      </div>
      <div className="relative z-10">
        <p className="text-xs text-[var(--text-muted)] font-bold uppercase tracking-widest">{title}</p>
        <h2 className="text-4xl font-black text-[var(--text-primary)]">{value}</h2>
      </div>
      <div className={`relative z-10 p-4 rounded-2xl bg-gradient-to-br ${colorClass} text-white shadow-lg`}>
        <Icon size={28} />
      </div>
    </div>
  );
}
