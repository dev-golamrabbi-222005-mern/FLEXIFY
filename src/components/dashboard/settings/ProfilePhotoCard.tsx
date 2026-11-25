"use client";

import React, { useState } from "react";
import Image from "next/image";
import { User, X, Camera, Loader2 } from "lucide-react";
import ImageUpload from "@/components/ImageUpload/page";
import axios from "axios";
import { toast } from "react-toastify";
import { DbUser } from "./types";

interface ProfilePhotoCardProps {
  user: DbUser;
  onPhotoUpdated: (url: string) => void;
}

export function ProfilePhotoCard({ user, onPhotoUpdated }: ProfilePhotoCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const photoUrl = user.profileImage || user.imageUrl || "/default-avatar.png";

  const handleRemove = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      setIsRemoving(true);
      await axios.patch("/api/user/me", { profileImage: "" });
      onPhotoUpdated("");
      toast.success("Profile photo removed");
    } catch {
      toast.error("Failed to remove photo");
    } finally {
      setIsRemoving(false);
    }
  };

  return (
    <div className="card-glass p-5 rounded-2xl border border-[var(--border-color)]">
      <div className="flex items-center gap-2 mb-3 text-[var(--text-primary)] font-bold text-sm">
        <div className="p-1 rounded-lg bg-[var(--primary)]/10 text-[var(--primary)]">
          <User size={16} />
        </div>
        <span>Profile Photo</span>
      </div>

      <div
        onClick={() => setIsModalOpen(true)}
        className="group relative cursor-pointer border-2 border-dashed border-[var(--primary)]/50 hover:border-[var(--primary)] rounded-2xl p-3 flex flex-col items-center justify-center transition-all bg-[var(--bg-secondary)]/50"
      >
        <div className="relative w-20 h-20 rounded-full overflow-hidden bg-[var(--bg-secondary)]">
          <Image
            src={photoUrl}
            alt="Profile Avatar"
            fill
            className="object-cover group-hover:opacity-60 transition-opacity"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white transition-opacity">
            <Camera size={18} />
            <span className="text-[9px] font-black uppercase mt-1 tracking-wider text-center">
              Click to change
            </span>
          </div>
        </div>

        {user.profileImage && (
          <button
            onClick={handleRemove}
            disabled={isRemoving}
            className="absolute -top-2 -right-2 p-1.5 rounded-full bg-rose-500 hover:bg-rose-600 text-white shadow-md transition-transform hover:scale-110"
            title="Remove Photo"
          >
            {isRemoving ? <Loader2 size={12} className="animate-spin" /> : <X size={12} />}
          </button>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-md bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl p-6 shadow-2xl">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            >
              <X size={18} />
            </button>
            <h3 className="text-lg font-black text-[var(--text-primary)] mb-4">
              Upload Profile Photo
            </h3>
            <ImageUpload
              defaultImage={photoUrl}
              onUploadSuccess={async (url: string) => {
                try {
                  await axios.patch("/api/user/me", { profileImage: url });
                  onPhotoUpdated(url);
                  setIsModalOpen(false);
                  toast.success("Profile photo updated!");
                } catch {
                  toast.error("Failed to save image");
                }
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
