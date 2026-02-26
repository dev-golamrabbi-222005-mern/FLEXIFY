"use client";

import { useState } from "react";
import { User, Bell, Moon, Save } from "lucide-react";

export default function SettingsPage() {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);

  return (
    <div className="p-6 space-y-8">
      {/* Title */}
      <div className="flex items-center gap-3">
        <User className="w-7 h-7 text-orange-500" />
        <h1 className="text-2xl font-bold">Settings</h1>
      </div>

      {/* Profile Settings */}
      <div className="bg-[var(--card-bg)] p-6 rounded-2xl shadow space-y-4">
        <h2 className="text-lg font-semibold mb-2">Profile Information</h2>

        <div className="grid md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Full Name"
            className="p-3 rounded-lg bg-transparent border border-gray-400/40 focus:outline-none"
          />
          <input
            type="email"
            placeholder="Email Address"
            className="p-3 rounded-lg bg-transparent border border-gray-400/40 focus:outline-none"
          />
          <input
            type="number"
            placeholder="Age"
            className="p-3 rounded-lg bg-transparent border border-gray-400/40 focus:outline-none"
          />
          <select className="p-3 rounded-lg bg-transparent border border-gray-400/40 focus:outline-none">
            <option>Male</option>
            <option>Female</option>
          </select>
        </div>
      </div>

      {/* Body Info */}
      <div className="bg-[var(--card-bg)] p-6 rounded-2xl shadow space-y-4">
        <h2 className="text-lg font-semibold mb-2">Body Information</h2>

        <div className="grid md:grid-cols-2 gap-4">
          <input
            type="number"
            placeholder="Height (cm)"
            className="p-3 rounded-lg bg-transparent border border-gray-400/40 focus:outline-none"
          />
          <input
            type="number"
            placeholder="Weight (kg)"
            className="p-3 rounded-lg bg-transparent border border-gray-400/40 focus:outline-none"
          />
        </div>
      </div>

      {/* Preferences */}
      <div className="bg-[var(--card-bg)] p-6 rounded-2xl shadow space-y-6">
        <h2 className="text-lg font-semibold mb-2">Preferences</h2>

        {/* Dark Mode */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Moon className="text-orange-500" />
            <span>Dark Mode</span>
          </div>

          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`w-12 h-6 flex items-center rounded-full p-1 transition ${
              darkMode ? "bg-orange-500" : "bg-gray-400"
            }`}
          >
            <div
              className={`bg-white w-4 h-4 rounded-full shadow-md transform transition ${
                darkMode ? "translate-x-6" : ""
              }`}
            />
          </button>
        </div>

        {/* Notifications */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Bell className="text-orange-500" />
            <span>Notifications</span>
          </div>

          <button
            onClick={() => setNotifications(!notifications)}
            className={`w-12 h-6 flex items-center rounded-full p-1 transition ${
              notifications ? "bg-orange-500" : "bg-gray-400"
            }`}
          >
            <div
              className={`bg-white w-4 h-4 rounded-full shadow-md transform transition ${
                notifications ? "translate-x-6" : ""
              }`}
            />
          </button>
        </div>
      </div>

      {/* Save Button */}
      <div>
        <button className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-medium transition">
          <Save size={18} />
          Save Changes
        </button>
      </div>
    </div>
  );
}