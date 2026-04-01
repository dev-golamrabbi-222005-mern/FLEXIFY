"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import ChatBox from "../../components/live-chat/ChatBox";
import { useSession } from "next-auth/react";

interface CoachUser {
  _id: string;
  coachId: string;
  userId: string;
  userName: string;
  userEmail: string;
  totalPaid: number;
  createdAt: string;
}

interface Trainee {
  _id: string;
  userId: string;
  userName: string;
  userEmail: string;
  totalPaid: number;
  createdAt: string;
}

export default function MyTrainees() {
  const { data: session, status } = useSession();
  const coachId = session?.user?.id || null;
  const [selectedTrainee, setSelectedTrainee] = useState<Trainee | null>(null);

  const {
    data: trainees,
    isLoading,
    error,
  } = useQuery<Trainee[]>({
    queryKey: ["trainees", coachId],
    queryFn: async () => {
      const res = await api.get<CoachUser[]>(
        `/api/coach-users?coachId=${coachId}`,
      );
      return res.data.map((cu) => ({
        _id: cu._id,
        userId: cu.userId,
        userName: cu.userName,
        userEmail: cu.userEmail,
        totalPaid: cu.totalPaid,
        createdAt: cu.createdAt,
      }));
    },
    enabled: !!coachId,
  });

  if (!coachId || status === "loading")
    return <p className="p-6">Loading session...</p>;

  if (isLoading) return <p className="p-6">Loading trainees...</p>;
  if (error) return <p className="p-6 text-red-500">Error loading trainees</p>;
  if (!trainees || trainees.length === 0)
    return <p className="p-6 text-muted">No trainees assigned yet.</p>;

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {trainees.map((t) => (
          <div key={t.userId} className="card-glass flex flex-col p-4">
            <h3 className="text-lg font-semibold">{t.userName}</h3>
            <p className="text-accent">{t.userEmail}</p>
            <p>Total Paid: ${t.totalPaid}</p>

            <div className="flex gap-2 mt-3">
              <button
                className="btn-primary flex-1"
                onClick={() => setSelectedTrainee(t)}
              >
                Messaging
              </button>
              <a
                href={`https://meet.google.com/new`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary flex-1 flex items-center justify-center gap-1"
              >
                Live Session
                <span className="material-icons">videocam</span>
              </a>
            </div>
          </div>
        ))}
      </div>

      {selectedTrainee && (
        <div className="mt-6">
          <button
            className="btn-secondary mb-2"
            onClick={() => setSelectedTrainee(null)}
          >
            Close Chat
          </button>
          <ChatBox userId={selectedTrainee.userId} coachId={coachId} />
        </div>
      )}
    </div>
  );
}
