"use client";
import ExerciseDetails from "@/components/ExerciseDetails";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useParams } from "next/navigation";

export default function ExercisePage() {
  const params = useParams();
  const id = params.id as string;

  const { data: exercise, isLoading, isError } = useQuery({
    queryKey: ["exercise", id],
    queryFn: async () => {
      const res = await axios.get(`/api/exercises/${id}`);
      return res.data;
    },
    enabled: !!id,
  });

  if (isLoading) {
    return <div className="p-10 text-center">Loading...</div>;
  }

  if (isError) {
    return <div className="p-10 text-center">Failed to load exercise.</div>;
  }
  return (
    <div className="min-h-screen px-4 py-10 bg-(--bg-primary)">
      <ExerciseDetails exercise={exercise} />
    </div>
  );
}