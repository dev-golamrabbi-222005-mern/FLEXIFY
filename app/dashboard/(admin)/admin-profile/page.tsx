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

export default function AdminProfilePage() {

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [profileImage, setProfileImage] = useState(
    "https://images.unsplash.com/photo-1599566150163-29194dcaad36"
  );

  const [profile, setProfile] = useState({
    name: "Flexify Admin",
    email: "admin@flexify.com",
    role: "Super Admin",
    joined: "Jan 2026",
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 bg-[var(--bg-primary)] space-y-10">

      {/* ===== PROFILE HEADER ===== */}

      <section className="bg-[var(--card-bg)] p-6 md:p-8 rounded-2xl shadow">

        <div className="flex flex-col md:flex-row items-center md:items-start gap-8">

          {/* Profile Image */}

          <div className="relative">

            <img
              src={profileImage}
              alt="admin"
              className="w-28 h-28 md:w-32 md:h-32 rounded-full object-cover border-4 border-white shadow"
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

          {/* Admin Info */}

          <div className="flex-1 text-center md:text-left">

            <h1 className="text-xl md:text-2xl font-bold">
              {profile.name}
            </h1>

            <p className="text-[var(--text-secondary)] flex items-center justify-center md:justify-start gap-2 mt-2">
              <Mail size={16}/> {profile.email}
            </p>

            <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-4">

              <span className="px-3 py-1 bg-blue-100 text-blue-600 text-sm rounded-full">
                {profile.role}
              </span>

              <span className="px-3 py-1 bg-green-100 text-green-600 text-sm rounded-full">
                Joined {profile.joined}
              </span>

            </div>

          </div>

        </div>

      </section>

      {/* ===== EDIT PROFILE ===== */}

      <section className="bg-[var(--card-bg)] p-6 md:p-8 rounded-2xl shadow">

        <h2 className="text-lg md:text-xl font-bold mb-6">
          Edit Profile
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <div>
            <label className="text-sm block mb-2">Full Name</label>
            <input
              type="text"
              defaultValue={profile.name}
              className="w-full border p-3 rounded-lg bg-[var(--bg-primary)]"
            />
          </div>

          <div>
            <label className="text-sm block mb-2">Email</label>
            <input
              type="email"
              defaultValue={profile.email}
              className="w-full border p-3 rounded-lg bg-[var(--bg-primary)]"
            />
          </div>

          <div>
            <label className="text-sm block mb-2">Role</label>
            <input
              type="text"
              defaultValue={profile.role}
              disabled
              className="w-full border p-3 rounded-lg "
            />
          </div>

          <div>
            <label className="text-sm block mb-2">Join Date</label>
            <input
              type="text"
              defaultValue={profile.joined}
              disabled
              className="w-full border p-3 rounded-lg "
            />
          </div>

        </div>

        <button className="mt-6 bg-[var(--primary)] text-white px-6 py-3 rounded-lg flex items-center gap-2 hover:opacity-90">
          <Save size={18}/> Save Changes
        </button>

      </section>

      {/* ===== SECURITY SETTINGS ===== */}

      <section className="bg-[var(--card-bg)] p-6 md:p-8 rounded-2xl shadow">

        <h2 className="text-lg md:text-xl font-bold mb-6">
          Security Settings
        </h2>

        <div className="space-y-6">

          <div>
            <label className="flex items-center gap-2 text-sm mb-2">
              <Key size={16}/> Change Password
            </label>

            <input
              type="password"
              placeholder="New Password"
              className="w-full border p-3 rounded-lg"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm mb-2">
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