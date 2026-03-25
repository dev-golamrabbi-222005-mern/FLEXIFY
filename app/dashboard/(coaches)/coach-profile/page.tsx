"use client";

import { useRef, useState } from "react";
import {
  Mail,
  Shield,
  Key,
  Camera,
  Save,
  User,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";

export default function CoachProfilePage() {
  const {register, handleSubmit, control} = useForm();
  const { data: session } = useSession();
  const { data: coaches = [], refetch } = useQuery({
      queryKey: ["coaches"],
      queryFn: async() => {
      const res = await axios.get("/api/coach");
      return res.data;
      }
  });

  const loggedInCoach = coaches.find(coach => coach?.email === session?.user?.email);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [profileImage, setProfileImage] = useState(loggedInCoach?.profileImage);

  const profile = {
    name: loggedInCoach?.fullName,
    email: loggedInCoach?.email,
    role: loggedInCoach?.role,
    joined: "Jan 2026",
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);
    }
  };

  const handleUpdateProfile = async(data) => {
    const res = await axios.patch("/api/coach/update-profile", {
      ...data,
      name: data.fullName,
      profileImage
    });
    if(res?.data?.modifiedCount){
      refetch();
      await Swal.fire("Success", "Coach profile updated successfully", "success");
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 bg-[var(--bg-primary)] space-y-10">
        <title>Coach-Profile | Dashboard - Flexify</title>

      {/* ===== PROFILE HEADER ===== */}

      <section className="bg-[var(--card-bg)] p-6 md:p-8 rounded-2xl shadow">

        <div className="flex flex-col items-center gap-8 md:flex-row md:items-start">

          {/* Profile Image */}

          <div className="relative">

            <img
              src={profileImage}
              alt="Coach"
              className="object-cover border-4 border-white rounded-full shadow w-28 h-28 md:w-32 md:h-32"
            />

            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-0 right-0 bg-[var(--primary)] text-white p-2 rounded-full shadow"
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

          {/* Coach Info */}

          <div className="flex-1 text-center md:text-left">

            <h1 className="text-xl font-bold md:text-2xl">
              {profile.name}
            </h1>

            <p className="text-[var(--text-secondary)] flex items-center justify-center md:justify-start gap-2 mt-2">
              <Mail size={16}/> {profile.email}
            </p>

            <div className="flex flex-wrap justify-center gap-3 mt-4 md:justify-start">

              <span className="px-3 py-1 text-sm text-blue-600 bg-blue-100 rounded-full">
                {profile.role}
              </span>

              <span className="px-3 py-1 text-sm text-green-600 bg-green-100 rounded-full">
                Joined {profile.joined}
              </span>

            </div>

          </div>

        </div>

      </section>

      {/* ===== EDIT PROFILE ===== */}

      <section className="bg-[var(--card-bg)] p-6 md:p-8 rounded-2xl shadow">

        <h2 className="mb-6 text-lg font-bold md:text-xl">
          Edit Profile
        </h2>

        <form onSubmit={handleSubmit(handleUpdateProfile)} className="grid grid-cols-1 gap-6 md:grid-cols-2">

          <div>
            <label className="block mb-2 text-sm">Full Name</label>
            <input
              type="text"
              defaultValue={profile.name}
              {...register("fullName")}
              className="w-full border p-3 rounded-lg bg-[var(--bg-primary)]"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm">Email</label>
            <input
              type="email"
              defaultValue={profile.email}
              disabled
              className="w-full border p-3 rounded-lg"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm">Role</label>
            <input
              type="text"
              defaultValue={profile.role}
              disabled
              className="w-full p-3 border rounded-lg "
            />
          </div>

          <div>
            <label className="block mb-2 text-sm">Join Date</label>
            <input
              type="text"
              defaultValue={profile.joined}
              disabled
              className="w-full p-3 border rounded-lg "
            />
          </div>

          <div>
            <button className="mt-6 bg-[var(--primary)] text-white px-6 py-3 rounded-lg flex items-center gap-2 hover:opacity-90">
              <Save size={18}/> Save Changes
            </button>
          </div>

        </form>

      </section>

      {/* ===== SECURITY SETTINGS ===== */}

      <section className="bg-[var(--card-bg)] p-6 md:p-8 rounded-2xl shadow">

        <h2 className="mb-6 text-lg font-bold md:text-xl">
          Security Settings
        </h2>

        <div className="space-y-6">

          <div>
            <label className="flex items-center gap-2 mb-2 text-sm">
              <Key size={16}/> Change Password
            </label>

            <input
              type="password"
              placeholder="New Password"
              className="w-full p-3 border rounded-lg"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 mb-2 text-sm">
              <Shield size={16}/> Two-Factor Authentication
            </label>

            <select className="w-full border p-3 rounded-lg bg-[var(--card-bg)]">
              <option>Enabled</option>
              <option>Disabled</option>
            </select>
          </div>

        </div>

      </section>

    </div>
  );
}