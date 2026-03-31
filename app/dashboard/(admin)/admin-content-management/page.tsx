"use client";

import { useState } from "react";
import { FileText, HelpCircle, Home, Edit, Trash2, Plus, Search, Loader2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import Swal from "sweetalert2";
import { Article, FAQ, HomeContent, MutationPayload, ContentType } from "@/types/content";
import { toast } from "react-toastify";

interface StatCardProps {
  title: string;
  value: number | string;
  Icon: React.ElementType;
  colorClass: string;
}

export default function AdminContentManagementPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState<string>("");

  // Queries
  const { data: blogs = [], isLoading: bLoading } = useQuery<Article[]>({
    queryKey: ["articles"],
    queryFn: async () => (await axios.get("/api/admin/content?type=articles")).data,
  });

  const { data: faqs = [], isLoading: fLoading } = useQuery<FAQ[]>({
    queryKey: ["faqs"],
    queryFn: async () => (await axios.get("/api/admin/content?type=faqs")).data,
  });

  const { data: home } = useQuery<HomeContent[]>({
    queryKey: ["homeContent"],
    queryFn: async () => (await axios.get("/api/admin/content?type=homeContent")).data,
  });

  // Mutations
  const mutation = useMutation({
    mutationFn: async (payload: MutationPayload) => {
      if (payload.id) return axios.patch("/api/admin/content", payload);
      return axios.post("/api/admin/content", payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries();
      toast.success("Operation Completed");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async ({ type, id }: { type: ContentType; id: string }) => 
      axios.delete(`/api/admin/content?type=${type}&id=${id}`),
    onSuccess: () => queryClient.invalidateQueries(),
  });

  // Handlers
  const handleAddArticle = async (): Promise<void> => {
    const { value: formValues } = await Swal.fire({
      title: 'Add New Article',
      background: 'var(--bg-secondary)',
      color: 'var(--text-primary)',
      html: `
        <input id="swal-title" class="input-style mb-4" placeholder="Title" style="margin-bottom: 10px">
        <textarea id="swal-content" class="input-style" placeholder="Content" rows="4"></textarea>
      `,
      confirmButtonColor: 'var(--primary)',
      showCancelButton: true,
      preConfirm: () => ({
        title: (document.getElementById('swal-title') as HTMLInputElement).value,
        content: (document.getElementById('swal-content') as HTMLTextAreaElement).value,
      })
    });
    if (formValues?.title) {
      mutation.mutate({ type: "articles", ...formValues, status: "Published" });
    }
  };

  const handleAddFAQ = async (): Promise<void> => {
    const { value: formValues } = await Swal.fire({
      title: 'Add New FAQ',
      background: 'var(--bg-secondary)',
      color: 'var(--text-primary)',
      html: `
        <input id="swal-q" class="input-style mb-4" placeholder="Question" style="margin-bottom: 10px">
        <input id="swal-a" class="input-style" placeholder="Answer">
      `,
      confirmButtonColor: 'var(--primary)',
      showCancelButton: true,
      preConfirm: () => ({
        question: (document.getElementById('swal-q') as HTMLInputElement).value,
        answer: (document.getElementById('swal-a') as HTMLInputElement).value,
      })
    });
    if (formValues?.question) mutation.mutate({ type: "faqs", ...formValues });
  };

  const filteredBlogs = blogs.filter(b => b.title.toLowerCase().includes(search.toLowerCase()));

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
        <h1 className="text-3xl font-black text-[var(--text-primary)]">Content Manager</h1>
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={18} />
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
        <StatCard title="Articles" value={blogs.length} Icon={FileText} colorClass="from-emerald-400 to-emerald-600" />
        <StatCard title="FAQs" value={faqs.length} Icon={HelpCircle} colorClass="from-violet-400 to-violet-600" />
        <StatCard title="Sections" value="12" Icon={Home} colorClass="from-orange-400 to-pink-500" />
      </div>

      {/* Articles */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-xl font-bold"><FileText className="text-[var(--primary)]" /> Articles</h2>
          <button onClick={handleAddArticle} className="flex items-center gap-2 btn-primary">
            <Plus size={18} /> Add Article
          </button>
        </div>
        <div className="p-0 overflow-hidden card-glass">
          {filteredBlogs.length > 0 ? filteredBlogs.map((blog) => (
            <div key={blog._id} className="flex justify-between p-5 border-b border-[var(--border-color)] items-center hover:bg-[var(--bg-tertiary)] transition-colors">
              <div>
                <p className="font-bold text-[var(--text-primary)]">{blog.title}</p>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-[var(--primary-light)] text-[var(--primary-dark)]">
                  {blog.status}
                </span>
              </div>
              <button 
                onClick={() => blog._id && deleteMutation.mutate({type: 'articles', id: blog._id})} 
                className="text-[var(--danger)] hover:bg-red-50 p-2 rounded-full transition-all"
              >
                <Trash2 size={18}/>
              </button>
            </div>
          )) : <p className="p-5 text-[var(--text-muted)]">No articles found.</p>}
        </div>
      </section>

      {/* FAQs */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-xl font-bold"><HelpCircle className="text-[var(--secondary)]" /> FAQs</h2>
          <button onClick={handleAddFAQ} className="flex items-center gap-2 btn-secondary">
            <Plus size={18} /> Add FAQ
          </button>
        </div>
        <div className="p-0 overflow-hidden card-glass">
          {faqs.map((faq) => (
            <div key={faq._id} className="flex justify-between p-5 border-b border-[var(--border-color)] items-center hover:bg-[var(--bg-tertiary)] transition-colors">
              <div>
                <p className="font-bold text-[var(--text-primary)]">{faq.question}</p>
                <p className="text-sm text-[var(--text-secondary)]">{faq.answer}</p>
              </div>
              <button 
                onClick={() => faq._id && deleteMutation.mutate({type: 'faqs', id: faq._id})} 
                className="text-[var(--danger)] p-2 rounded-full"
              >
                <Trash2 size={18}/>
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Home Settings */}
      {/* <section className="space-y-6 card-glass">
         <h2 className="flex items-center gap-2 text-xl font-bold"><Home className="text-[var(--warning)]" /> Homepage Settings</h2>
         <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <label>Hero Title</label>
              <input id="h-title" defaultValue={home?.[0]?.heroTitle} className="input-style" placeholder="e.g. Transform Your Life" />
            </div>
            <div className="space-y-2">
              <label>Hero Subtitle</label>
              <input id="h-sub" defaultValue={home?.[0]?.heroSubtitle} className="input-style" placeholder="e.g. Best Fitness App" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label>Hero Description</label>
              <textarea id="h-desc" defaultValue={home?.[0]?.heroDescription} className="input-style" placeholder="Description..." rows={3} />
            </div>
         </div>
         <button 
           onClick={() => mutation.mutate({
             type: "homeContent", 
             id: home?.[0]?._id,
             heroTitle: (document.getElementById('h-title') as HTMLInputElement).value,
             heroSubtitle: (document.getElementById('h-sub') as HTMLInputElement).value,
             heroDescription: (document.getElementById('h-desc') as HTMLTextAreaElement).value
           })} 
           className="w-full btn-primary md:w-auto">Save Changes</button>
      </section> */}
    </div>
  );
}

function StatCard({ title, value, Icon, colorClass }: StatCardProps) {
  return (
    <div className="card-glass flex items-center justify-between group hover:border-[var(--primary)] transition-all">
      <div>
        <p className="text-xs text-[var(--text-muted)] font-bold uppercase tracking-widest">{title}</p>
        <h2 className="text-3xl font-black text-[var(--text-primary)]">{value}</h2>
      </div>
      <div className={`p-4 rounded-2xl bg-gradient-to-br ${colorClass} text-white shadow-lg`}>
        <Icon size={28} />
      </div>
    </div>
  );
}