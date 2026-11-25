"use client";

import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import { useSession } from "next-auth/react";
import { Video, MessageSquare, ShieldCheck, Star } from "lucide-react";
import ChatBox from "../../components/live-chat/ChatBox";
import { toast } from "react-toastify";
import CoachReviewModal from "@/components/dashboard/coach/CoachReviewModal";
import type { IMessage } from "@/types";

interface ICoachRelation {
  _id: string;
  coachId: string;
  userId: string;
  coachName?: string;
  coachEmail?: string;
  messages?: any[];
  status: string;
}

interface IReviewData {
  coachId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
}

export default function MyCoachPage() {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const [showChat, setShowChat] = useState<boolean>(false);
  const [showReviewModal, setShowReviewModal] = useState<boolean>(false);
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>("");
  const [isSticky, setIsSticky] = useState<boolean>(false);
  const stickyRef = useRef<HTMLDivElement>(null);

  const { data: relation, isLoading } = useQuery<ICoachRelation | null>({
    queryKey: ["my-coach", session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return null;
      const res = await api.get<ICoachRelation[]>(`/api/coach-users?userId=${session.user.id}`);
      return res.data[0] || null;
    },
    enabled: !!session?.user?.id,
  });

  const reviewMutation = useMutation({
    mutationFn: async (reviewData: IReviewData) => {
      return await api.post("/api/coach-users/review", reviewData);
    },
    onSuccess: () => {
      toast.success("Feedback submitted successfully!");
      setRating(0);
      setComment("");
      setShowReviewModal(false);
      queryClient.invalidateQueries({ queryKey: ["my-coach"] });
    },
    onError: () => toast.error("Failed to submit feedback"),
  });

  useEffect(() => {
    const currentRef = stickyRef.current;
    const observer = new IntersectionObserver(
      ([entry]) => setIsSticky(entry.intersectionRatio < 1),
      { threshold: [1], rootMargin: "-1px 0px 0px 0px" }
    );
    if (currentRef) observer.observe(currentRef);
    return () => { if (currentRef) observer.unobserve(currentRef); };
  }, [relation]);

  const handleReviewSubmit = () => {
    if (!relation?.coachId || !session?.user?.id) return toast.error("Required info missing");
    if (rating === 0) return toast.error("Please select a rating");
    reviewMutation.mutate({
      coachId: relation.coachId,
      userId: session.user.id,
      userName: session.user.name || "User",
      rating,
      comment,
    });
  };

  if (isLoading) return <div className="p-10 text-center font-bold animate-pulse text-[var(--primary)]">Loading...</div>;
  if (!relation) return (
    <div className="p-10 text-center border-2 border-dashed border-[var(--border-color)] rounded-2xl m-6">
      <p className="text-[var(--text-muted)]">No active coach found. Please subscribe to an Elite plan.</p>
    </div>
  );

  return (
    <div className="space-y-8 md:space-y-12 lg:space-y-16 text-[var(--text-primary)] pb-10 relative">
      <title>My Coach | Dashboard - Flexify</title>
      <div 
        ref={stickyRef}
        className={`card-glass p-6 border border-[var(--border-color)] flex flex-col md:flex-row justify-between items-center gap-6 sticky top-0 z-20 transition-all duration-300 ${
          isSticky ? "rounded-b-none shadow-2xl bg-[var(--card-bg)] border-b-transparent" : "rounded-2xl shadow-xl"
        }`}
      >
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-[var(--primary)]/10 flex items-center justify-center text-[var(--primary)]">
            <ShieldCheck size={28} />
          </div>
          <div>
            <h2 className="text-xl font-black text-[var(--primary)]">{relation.coachName || "Coach"}</h2>
            <p className="text-[var(--text-secondary)] text-xs flex items-center gap-2">
              <span className="w-2 h-2 bg-[var(--success)] rounded-full animate-pulse"></span> Elite Program
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 w-full md:w-auto">
          <button 
            onClick={() => setShowReviewModal(true)} 
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 rounded-xl font-bold hover:bg-yellow-500 hover:text-white transition shadow-sm"
          >
            <Star size={18} /> Rate Coach
          </button>
          <button 
            onClick={() => setShowChat(!showChat)} 
            className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-bold transition ${
              showChat ? "bg-[var(--primary)] text-white shadow-lg" : "bg-[var(--bg-tertiary)] hover:bg-[var(--primary)] hover:text-white border border-[var(--border-color)]"
            }`}
          >
            <MessageSquare size={18} /> Messaging
          </button>
          <a 
            href="https://meet.google.com/new" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-[var(--success)] px-6 py-2.5 rounded-xl font-bold text-white hover:opacity-90 shadow-lg transition"
          >
            <Video size={18} /> Live Meet
          </a>
        </div>
      </div>

      {showChat && session?.user?.id && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <ChatBox coachUserId={relation._id} currentUserId={session.user.id} initialMessages={relation.messages || []} />
        </div>
      )}

      <CoachReviewModal
        isOpen={showReviewModal}
        coachName={relation.coachName}
        rating={rating}
        setRating={setRating}
        comment={comment}
        setComment={setComment}
        isSubmitting={reviewMutation.isPending}
        onSubmit={handleReviewSubmit}
        onClose={() => setShowReviewModal(false)}
      />
    </div>
  );
}
