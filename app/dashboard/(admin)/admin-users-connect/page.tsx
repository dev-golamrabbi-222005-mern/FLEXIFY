"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

interface ContactMessage {
  _id: string;
  name: string;
  email: string;
  message: string;
  status: "pending" | "replied";
  date: string;
  repliedAt?: string;
}

export default function ContactRequests() {
  const queryClient = useQueryClient();
  const [loadingIds, setLoadingIds] = useState<string[]>([]);

  // Fetch contact messages
  const { data, isLoading } = useQuery<ContactMessage[]>({
    queryKey: ["contacts"],
    queryFn: async () => {
      const res = await axios.get("/api/contact");
      return res.data;
    },
  });

  // Mark as replied mutation
  const markAsReplied = useMutation({
    mutationFn: async (id: string) => {
      await axios.patch(`/api/contact/${id}`, { status: "replied" });
    },
    onMutate: (id: string) => {
      setLoadingIds((prev) => [...prev, id]);
    },
    onSuccess: (_, id) => {
      queryClient.setQueryData<ContactMessage[]>(["contacts"], (old) =>
        old?.map((msg) =>
          msg._id === id
            ? { ...msg, status: "replied", repliedAt: new Date().toISOString() }
            : msg,
        ),
      );
    },
    onSettled: () => setLoadingIds([]),
  });

  if (isLoading)
    return (
      <div className="flex justify-center py-20 text-gray-500">Loading...</div>
    );

  return (
    <div>
      <h1 className="text-3xl md:text-4xl font-bold mb-8">User Feedback</h1>

      <div className="grid gap-6 md:grid-cols-2">
        {data?.map((item) => {
          const isDisabled =
            item.status === "replied" || loadingIds.includes(item._id);

          const mailto = `mailto:${item.email}?subject=${encodeURIComponent(
            "Regarding your message",
          )}&body=${encodeURIComponent(
            `Hi ${item.name},\n\nThank you for your message.\n\nBest regards,\nYour Team`,
          )}`;

          return (
            <div
              key={item._id}
              className="p-6 border rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              {/* Header */}
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg md:text-xl font-semibold">
                  {item.name}
                </h3>
                <span
                  className={`px-3 py-1 text-sm rounded-full font-medium ${
                    item.status === "replied"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {item.status === "replied" ? "Replied" : "Pending"}
                </span>
              </div>

              {/* Email & Message */}
              <p className="text-sm text-gray-500 mb-2">{item.email}</p>
              <p className="text-gray-700 mb-4">{item.message}</p>

              {/* Buttons */}
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => markAsReplied.mutate(item._id)}
                  disabled={isDisabled}
                  className={`flex-1 px-4 py-2 rounded-lg font-medium text-white transition ${
                    isDisabled
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  {loadingIds.includes(item._id)
                    ? "Updating..."
                    : "Mark as Replied"}
                </button>

                <a
                  href={mailto}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex-1 px-4 py-2 rounded-lg font-medium text-white text-center transition ${
                    isDisabled
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-green-600 hover:bg-green-700"
                  }`}
                >
                  Gmail
                </a>
              </div>

              {item.repliedAt && (
                <p className="mt-2 text-xs text-gray-500">
                  Replied at: {new Date(item.repliedAt).toLocaleString()}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
