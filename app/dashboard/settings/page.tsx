"use client";

import { useState } from "react";
import { User, Bell, Shield, Dumbbell, Moon, BellDot } from "lucide-react";
import ThemeToggle from "../Share/ThemeToggle";
import { useSession } from "next-auth/react";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");
   const { data: session } = useSession();

   console.log(session);

  const menu = [
    { id: "profile", label: "Profile", icon: User },
    { id: "fitness", label: "Fitness", icon: Dumbbell },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Security", icon: Shield },
    { id: "appearance", label: "Appearance", icon: Moon },
  ];

  return (
    <div className="p-4 md:p-6 bg-[var(--bg-primary)] min-h-screen">

      <div className="flex items-center gap-3">
        <User className="w-6 h-6 md:w-7 md:h-7 text-2xl md:text-3xl font-bold mb-6" />
        <h1 className="text-2xl md:text-3xl font-bold mb-6">Settings</h1>
      </div>

      <div className="flex flex-col md:grid md:grid-cols-4 gap-6">

        {/* Sidebar */}
        <div className="bg-[var(--card-bg)] rounded-xl shadow p-3 md:p-4 md:col-span-1">

          {/* Mobile Tabs */}
          <div className="flex md:hidden overflow-x-auto gap-3 pb-2">
            {menu.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg whitespace-nowrap
                  ${activeTab === item.id ? "bg-[var(--primary)]" : "text-[var(--text-primary)]"}`}
                >
                  <Icon size={16} />
                  {item.label}
                </button>
              );
            })}
          </div>

          {/* Desktop Sidebar */}
          <ul className="hidden md:block space-y-2">
            {menu.map((item) => {
              const Icon = item.icon;
              return (
                <li
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 cursor-pointer p-2 rounded-lg
                  ${activeTab === item.id ? "bg-[var(--primary)]/10 text-[var(--primary)] font-semibold" : "text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)]"}`}
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
              <h2 className="text-xl font-semibold mb-4">
                Profile Settings
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium">Full Name</label>
                  <input
                  placeholder="Full Name"
                  className="border p-2 rounded-lg"
                  defaultValue={session?.user?.name}
                />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium">Email</label>
                  <input
                  placeholder="Email"
                  className="border p-2 rounded-lg"
                  defaultValue={session?.user?.email}
                />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium">Phone</label>
                  <input
                  placeholder="Phone"
                  className="border p-2 rounded-lg"
                  defaultValue={session?.phone}
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium">Location</label>
                  <input
                    placeholder="Location"
                    className="border p-2 rounded-lg"
                    defaultValue={session?.user?.location}
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium">Photo</label>
                  <input
                  placeholder="Photo"
                  className="border p-2 rounded-lg"
                  defaultValue={session?.user?.image}
                  />
                </div>

              </div>

              <button className="mt-5 btn-primary ">
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
                  placeholder="Height (cm)"
                  className="border p-2 rounded-lg"
                />

                <input
                  placeholder="Weight (kg)"
                  className="border p-2 rounded-lg"
                />

                <select className="border p-2 rounded-lg bg-[var(--bg-secondary)] text-[var(--text-primary)]">
                  <option>Fitness Goal</option>
                  <option>Weight Loss</option>
                  <option>Muscle Gain</option>
                </select>

                <select className="border p-2 rounded-lg bg-[var(--bg-secondary)] text-[var(--text-primary)]">
                  <option>Activity Level</option>
                  <option>Sedentary</option>
                  <option>Moderately Active</option>
                  <option>Very Active</option>
                </select>

              </div>

              <button className="mt-5 btn-primary">
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

                <label className="flex justify-between items-center">
                  Email Notifications
                  <input type="checkbox" />
                </label>

                <label className="flex justify-between items-center">
                  Workout Reminder
                  <input type="checkbox" />
                </label>

                <label className="flex justify-between items-center">
                  Diet Tips
                  <input type="checkbox" />
                </label>

              </div>
            </div>
          )}

          {/* Security */}
          {activeTab === "security" && (
            <div>
              <h2 className="text-xl font-semibold mb-4">
                Security
              </h2>

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
              <h2 className="text-xl font-semibold mb-4">
                Appearance
              </h2>
                <div >
                <ThemeToggle />                    
                </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}