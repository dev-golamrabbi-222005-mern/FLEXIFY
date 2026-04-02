"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import ChatBox from "../../components/live-chat/ChatBox";
import { useSession } from "next-auth/react";
import PlanAccessModal from "@/components/modals/PlanAccessModal";
import { PlanId } from "@/lib/plans";

interface CoachUser {
  _id: string;
  coachId: string;
  userId: string;
  name: string;
  email: string;
  totalPaid: number;
  meetLink?: string;
}

interface Coach {
  _id: string;
  name: string;
  email: string;
  status: string;
  meetLink?: string;
}

export default function MyCoach() {
  const { data: session, status } = useSession();
  const userId = session?.user?.id || null;
  const [showChat, setShowChat] = useState(false);

  // Fetch user data to check plan
  const { data: dbUser } = useQuery({
    queryKey: ["currentUser", session?.user?.email],
    queryFn: async () => {
      if (!session?.user?.email) return null;
      const res = await api.get(`/api/user/me?email=${session.user.email}`);
      return res.data;
    },
    enabled: !!session?.user?.email,
  });

  const userPlan = (dbUser?.plan as PlanId) || "free";

  const {
    data: coaches,
    isLoading,
    error,
  } = useQuery<Coach[]>({
    queryKey: ["coach", userId],
    queryFn: async () => {
      const res = await api.get<CoachUser[]>(
        `/api/coach-users?userId=${userId}`,
      );
      return res.data.map((cu) => ({
        _id: cu._id,
        name: cu.name, // optionally map actual coach name from your db
        email: cu.email,
        status: "approved",
        meetLink: cu.meetLink,
      }));
    },
    enabled: !!userId,
  });

  if (!userId || status === "loading")
    return <p className="p-6">Loading session...</p>;

  if (userPlan === "free" || userPlan === "pro") {
    return (
      <PlanAccessModal
        currentPlan={userPlan}
        requiredPlan="elite"
        isOpen={true}
        onClose={() => {}}
      />
    );
  }

  if (isLoading) return <p className="p-6">Loading coach...</p>;
  if (error) return <p className="p-6 text-red-500">Error loading coach</p>;

  const coach = coaches?.find((c) => c.status === "approved");

  if (!coach)
    return (
      <div className="p-6 text-center">
        <p className="text-muted">No approved coach assigned yet.</p>
      </div>
    );


  return (
    <div className="p-6 space-y-6">
      <div className="card-glass">
        <h2 className="text-xl font-semibold">{coach.name}</h2>
        <p className="text-accent">{coach.email}</p>

        <div className="flex gap-4 mt-4">
          <button
            className="btn-primary"
            onClick={() => setShowChat((prev) => !prev)}
          >
            Messaging
          </button>
          {coach.meetLink && (
            <a
              href={coach.meetLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 btn-secondary"
            >
              Live Session
              <span className="material-icons">videocam</span>
            </a>
          )}
        </div>
      </div>

      {showChat && <ChatBox userId={userId} coachId={coach._id} />}
    </div>
  );
}
