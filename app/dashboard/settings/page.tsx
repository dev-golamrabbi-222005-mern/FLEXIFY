"use client";

import { useState, useEffect } from "react";
import { User, Bell, Shield, Dumbbell, Moon } from "lucide-react";
import ThemeToggle from "../Share/ThemeToggle";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";

type Profile = {
  name: string;
  email: string;
  phone: string;
  location: string;
  photo: string;
};

type Fitness = {
  height: string;
  weight: string;
  goal: string;
  activity: string;
};

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const { data: session } = useSession();

const [profile, setProfile] = useState<Profile>(() => ({
  name: session?.user?.name || "",
  email: session?.user?.email || "",
  phone: (session?.user as { phone?: string })?.phone || "",
  location: "",
  photo: session?.user?.image || "",
}));

  const [fitness, setFitness] = useState<Fitness>({
    height: "",
    weight: "",
    goal: "",
    activity: "",
  });

  const menu = [
    { id: "profile", label: "Profile", icon: User },
    { id: "fitness", label: "Fitness", icon: Dumbbell },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Security", icon: Shield },
    { id: "appearance", label: "Appearance", icon: Moon },
  ];

  // ✅ FIXED: Proper typing
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ✅ FIXED: Supports input + select
  const handleFitnessChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    setFitness((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleProfileSave = () => {
    toast.success("Profile Updated Successfully!");

    setProfile({
      name: "",
      email: "",
      phone: "",
      location: "",
      photo: "",
    });
  };

  const handleFitnessSave = () => {
    toast.success("Fitness Info Updated!");

    setFitness({
      height: "",
      weight: "",
      goal: "",
      activity: "",
    });
  };

  return (
    <div className="p-4 md:p-6 bg-[var(--bg-primary)] min-h-screen">
        <title>Settings | Dashboard - Flexify</title>
      <div className="flex items-center gap-3">
        <User className="w-6 h-6 md:w-7 md:h-7" />
        <h1 className="text-2xl md:text-3xl font-bold mb-6">Settings</h1>
      </div>

      <div className="flex flex-col md:grid md:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="bg-[var(--card-bg)] rounded-xl shadow p-3 md:p-4 md:col-span-1">
          <ul className="space-y-2">
            {menu.map((item) => {
              const Icon = item.icon;
              return (
                <li
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 cursor-pointer p-2 rounded-lg
                  ${
                    activeTab === item.id
                      ? "bg-[var(--primary)]/10 text-[var(--primary)] font-semibold"
                      : "text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]"
                  }`}
                >
                  <Icon size={18} />
                  {item.label}
                </li>
              );
            })}
          </ul>
        </div>

        {/* Content */}
        <div className="bg-[var(--card-bg)] rounded-xl shadow p-4 md:p-6 md:col-span-3">
          {/* Profile */}
          {activeTab === "profile" && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Profile Settings</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  name="name"
                  value={profile.name}
                  onChange={handleProfileChange}
                  placeholder="Full Name"
                  className="border p-2 rounded-lg"
                />
                <input
                  name="email"
                  value={profile.email}
                  onChange={handleProfileChange}
                  placeholder="Email"
                  className="border p-2 rounded-lg"
                />
                <input
                  name="phone"
                  value={profile.phone}
                  onChange={handleProfileChange}
                  placeholder="Phone"
                  className="border p-2 rounded-lg"
                />
                <input
                  name="location"
                  value={profile.location}
                  onChange={handleProfileChange}
                  placeholder="Location"
                  className="border p-2 rounded-lg"
                />
                <input
                  name="photo"
                  value={profile.photo}
                  onChange={handleProfileChange}
                  placeholder="Photo URL"
                  className="border p-2 rounded-lg"
                />
              </div>

              <button onClick={handleProfileSave} className="mt-5 btn-primary">
                Save Changes
              </button>
            </div>
          )}

          {/* Fitness */}
          {activeTab === "fitness" && (
            <div>
              <h2 className="text-xl font-semibold mb-4">
                Fitness Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  name="height"
                  value={fitness.height}
                  onChange={handleFitnessChange}
                  placeholder="Height (cm)"
                  className="border p-2 rounded-lg"
                />
                <input
                  name="weight"
                  value={fitness.weight}
                  onChange={handleFitnessChange}
                  placeholder="Weight (kg)"
                  className="border p-2 rounded-lg"
                />

                <select
                  name="goal"
                  value={fitness.goal}
                  onChange={handleFitnessChange}
                  className="border p-2 rounded-lg"
                >
                  <option value="">Fitness Goal</option>
                  <option>Weight Loss</option>
                  <option>Muscle Gain</option>
                </select>

                <select
                  name="activity"
                  value={fitness.activity}
                  onChange={handleFitnessChange}
                  className="border p-2 rounded-lg"
                >
                  <option value="">Activity Level</option>
                  <option>Sedentary</option>
                  <option>Moderately Active</option>
                  <option>Very Active</option>
                </select>
              </div>

              <button onClick={handleFitnessSave} className="mt-5 btn-primary">
                Update Fitness Info
              </button>
            </div>
          )}

          {/* Notifications */}
          {activeTab === "notifications" && (
            <div>
              <h2 className="text-xl font-semibold mb-4">
                Notification Settings
              </h2>

              <div className="space-y-4">
                <label className="flex justify-between">
                  Email Notifications
                  <input type="checkbox" />
                </label>

                <label className="flex justify-between">
                  Workout Reminder
                  <input type="checkbox" />
                </label>

                <label className="flex justify-between">
                  Diet Tips
                  <input type="checkbox" />
                </label>
              </div>
            </div>
          )}

          {/* Security */}
          {activeTab === "security" && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Security</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="password"
                  placeholder="Current Password"
                  className="border p-2 rounded-lg"
                />
                <input
                  type="password"
                  placeholder="New Password"
                  className="border p-2 rounded-lg"
                />
              </div>

              <button className="mt-5 bg-red-500 text-white px-5 py-2 rounded-lg">
                Change Password
              </button>
            </div>
          )}

          {/* Appearance */}
          {activeTab === "appearance" && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Appearance</h2>
              <ThemeToggle />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
