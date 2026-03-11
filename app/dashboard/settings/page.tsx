"use client";

import { useState } from "react";
import { User, Bell, Moon, Save } from "lucide-react";

export default function SettingsPage() {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);

  return (
    <div className="p-3 sm:p-4 md:p-6 space-y-6 md:space-y-8">

      {/* Title */}
      <div className="flex items-center gap-3">
        <User className="w-6 h-6 md:w-7 md:h-7 text-orange-500" />
        <h1 className="text-xl md:text-2xl font-bold">Settings</h1>
      </div>

      {/* Profile Settings */}
      <div className="bg-[var(--card-bg)] p-4 sm:p-5 md:p-6 rounded-2xl shadow space-y-4">
        <h2 className="text-base md:text-lg font-semibold">Profile Information</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
          <input
            type="text"
            placeholder="Full Name"
            className="p-3 rounded-lg bg-transparent border border-gray-400/40 focus:outline-none text-sm md:text-base"
          />

          <input
            type="email"
            placeholder="Email Address"
            className="p-3 rounded-lg bg-transparent border border-gray-400/40 focus:outline-none text-sm md:text-base"
          />

          <input
            type="number"
            placeholder="Age"
            className="p-3 rounded-lg bg-transparent border border-gray-400/40 focus:outline-none text-sm md:text-base"
          />

          <select className="p-3 rounded-lg bg-transparent border border-gray-400/40 focus:outline-none text-sm md:text-base">
            <option>Male</option>
            <option>Female</option>
          </select>
        </div>
      </div>

      {/* Body Info */}
      <div className="bg-[var(--card-bg)] p-4 sm:p-5 md:p-6 rounded-2xl shadow space-y-4">
        <h2 className="text-base md:text-lg font-semibold">Body Information</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
          <input
            type="number"
            placeholder="Height (cm)"
            className="p-3 rounded-lg bg-transparent border border-gray-400/40 focus:outline-none text-sm md:text-base"
          />

          <input
            type="number"
            placeholder="Weight (kg)"
            className="p-3 rounded-lg bg-transparent border border-gray-400/40 focus:outline-none text-sm md:text-base"
          />
        </div>
      </div>

      {/* Preferences */}
      <div className="bg-[var(--card-bg)] p-4 sm:p-5 md:p-6 rounded-2xl shadow space-y-6">
        <h2 className="text-base md:text-lg font-semibold">Preferences</h2>

        {/* Dark Mode */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-sm md:text-base">
            <Moon className="text-orange-500 w-5 h-5" />
            <span>Dark Mode</span>
          </div>

          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`w-11 h-6 flex items-center rounded-full p-1 transition ${
              darkMode ? "bg-orange-500" : "bg-gray-400"
            }`}
          >
            <div
              className={`bg-white w-4 h-4 rounded-full shadow-md transform transition ${
                darkMode ? "translate-x-5" : ""
              }`}
            />
          </button>
        </div>

        {/* Notifications */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-sm md:text-base">
            <Bell className="text-orange-500 w-5 h-5" />
            <span>Notifications</span>
          </div>

          <button
            onClick={() => setNotifications(!notifications)}
            className={`w-11 h-6 flex items-center rounded-full p-1 transition ${
              notifications ? "bg-orange-500" : "bg-gray-400"
            }`}
          >
            <div
              className={`bg-white w-4 h-4 rounded-full shadow-md transform transition ${
                notifications ? "translate-x-5" : ""
              }`}
            />
          </button>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-start md:justify-end">
        <button className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 md:px-6 md:py-3 rounded-xl font-medium transition text-sm md:text-base">
          <Save size={18} />
          Save Changes
        </button>
      </div>

    </div>
  );
}