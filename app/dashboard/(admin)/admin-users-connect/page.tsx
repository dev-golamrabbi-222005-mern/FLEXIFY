"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

interface ContactMessage {
  _id: string;
  name: string;
  email: string;
  message: string;
  isRead: boolean;
}

export default function ContactRequests() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery<ContactMessage[]>({
    queryKey: ["contacts"],
    queryFn: async () => {
      const res = await axios.get("/api/contact");
      return res.data;
    },
  });

  // ✅ Mark as read mutation
  const markAsRead = useMutation({
    mutationFn: async (id: string) => {
      await axios.patch(`/api/contact/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
    },
  });

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Wants to Connect</h1>

      <div className="space-y-4">
        {data?.map((item) => (
          <div
            key={item._id}
            className={`p-5 border rounded-lg ${
              item.isRead ? "opacity-60" : ""
            }`}
          >
            <h3 className="font-bold">{item.name}</h3>
            <p>{item.email}</p>
            <p className="my-2">{item.message}</p>

            {/* ✅ Reply Gmail */}
            <a
              href={`mailto:${item.email}?subject=Flexify Support&body=Hi ${item.name},%0D%0A%0D%0AThanks for contacting us.%0D%0A`}
              className="btn-primary mr-3"
            >
              Reply via Gmail
            </a>

            {/* ✅ Mark as Read */}
            {!item.isRead && (
              <button
                onClick={() => markAsRead.mutate(item._id)}
                className="px-4 py-2 bg-[var-(--primary-light)] text-white rounded"
              >
                Mark as Read
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
