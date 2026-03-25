"use client";

import { useRef, useState } from "react";
import { Mail, Shield, Key, Camera, Save } from "lucide-react";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";

// 1. Define Interfaces for Type Safety
interface Coach {
  fullName: string;
  email: string;
  role: string;
  profileImage?: string;
}

interface ProfileFormData {
  fullName: string;
}

export default function CoachProfilePage() {
  const { register, handleSubmit } = useForm<ProfileFormData>();
  const { data: session } = useSession();

  // 2. Fetch Coach Data
  const { data: coaches = [], refetch } = useQuery<Coach[]>({
    queryKey: ["coaches"],
    queryFn: async () => {
      const res = await axios.get("/api/coach");
      return res.data;
    },
  });

  const loggedInCoach = coaches.find(
    (coach) => coach?.email === session?.user?.email,
  );

  // 3. Image Logic: Use State ONLY for the new preview
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  /**
   * DERIVED STATE:
   * This calculates which image to show during the render process.
   * No useEffect needed, so no "cascading render" error.
   */
  const displayImage =
    previewImage || loggedInCoach?.profileImage || "/default-avatar.png";

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Cleanup old preview URL to prevent memory leaks
      if (previewImage) URL.revokeObjectURL(previewImage);

      const imageUrl = URL.createObjectURL(file);
      setPreviewImage(imageUrl);
    }
  };

  const handleUpdateProfile = async (data: ProfileFormData) => {
    try {
      const payload = {
        ...data,
        // Send the new preview if it exists, otherwise keep the old one
        profileImage: previewImage || loggedInCoach?.profileImage,
      };

      const res = await axios.patch("/api/coach/update-profile", payload);

      if (res?.data?.modifiedCount || res?.data?.acknowledged) {
        await refetch();
        setPreviewImage(null); // Clear preview since it's now saved in DB
        await Swal.fire("Success", "Profile updated successfully", "success");
      }
    } catch (error) {
      console.error("Update Error:", error);
      Swal.fire("Error", "Failed to update profile", "error");
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 bg-[var(--bg-primary)] space-y-10">
        <title>Profile | Dashboard - Flexify</title>

      {/* ===== PROFILE HEADER ===== */}
      <section className="bg-[var(--card-bg)] p-6 md:p-8 rounded-2xl shadow">
        <div className="flex flex-col items-center gap-8 md:flex-row md:items-start">
          {/* Profile Image with Preview Logic */}
          <div className="relative">
            <img
              src={displayImage}
              alt="Coach Profile"
              className="object-cover border-4 border-white rounded-full shadow w-28 h-28 md:w-32 md:h-32"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-0 right-0 bg-[var(--primary)] text-white p-2 rounded-full shadow hover:scale-110 transition-transform"
            >
              <Camera size={16} />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>

          {/* Coach Info Display */}
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-xl font-bold md:text-2xl">
              {loggedInCoach?.fullName || "Loading..."}
            </h1>
            <p className="text-[var(--text-secondary)] flex items-center justify-center md:justify-start gap-2 mt-2">
              <Mail size={16} /> {loggedInCoach?.email}
            </p>
            <div className="flex flex-wrap justify-center gap-3 mt-4 md:justify-start">
              <span className="px-3 py-1 text-sm text-blue-600 bg-blue-100 rounded-full">
                {loggedInCoach?.role || "Coach"}
              </span>
              <span className="px-3 py-1 text-sm text-green-600 bg-green-100 rounded-full">
                Joined Jan 2026
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ===== EDIT PROFILE FORM ===== */}
      <section className="bg-[var(--card-bg)] p-6 md:p-8 rounded-2xl shadow">
        <h2 className="mb-6 text-lg font-bold md:text-xl">Edit Profile</h2>

        <form
          onSubmit={handleSubmit(handleUpdateProfile)}
          className="grid grid-cols-1 gap-6 md:grid-cols-2"
        >
          <div>
            <label className="block mb-2 text-sm font-medium">Full Name</label>
            <input
              type="text"
              key={loggedInCoach?.fullName} // Helps re-sync defaultValue when data loads
              defaultValue={loggedInCoach?.fullName}
              {...register("fullName")}
              className="w-full border p-3 rounded-lg bg-[var(--bg-primary)] focus:ring-2 focus:ring-[var(--primary)] outline-none"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium">
              Email (Permanent)
            </label>
            <input
              type="email"
              value={loggedInCoach?.email || ""}
              disabled
              className="w-full border p-3 rounded-lg bg-gray-100 cursor-not-allowed opacity-70"
            />
          </div>

          <div className="md:col-span-2">
            <button
              type="submit"
              className="bg-[var(--primary)] text-white px-6 py-3 rounded-lg flex items-center gap-2 hover:opacity-90 transition-opacity"
            >
              <Save size={18} /> Save Changes
            </button>
          </div>
        </form>
      </section>

      {/* ===== SECURITY SETTINGS ===== */}
      <section className="bg-[var(--card-bg)] p-6 md:p-8 rounded-2xl shadow">
        <h2 className="mb-6 text-lg font-bold md:text-xl">Security Settings</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="flex items-center gap-2 mb-2 text-sm font-medium">
              <Key size={16} /> Change Password
            </label>
            <input
              type="password"
              placeholder="New Password"
              className="w-full p-3 border rounded-lg bg-[var(--bg-primary)]"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 mb-2 text-sm font-medium">
              <Shield size={16} /> Two-Factor Authentication
            </label>
            <select className="w-full border p-3 rounded-lg bg-[var(--bg-primary)]">
              <option>Enabled</option>
              <option>Disabled</option>
            </select>
          </div>
        </div>
      </section>
    </div>
  );
}
