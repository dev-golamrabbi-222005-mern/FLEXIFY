"use client";

import { useState } from "react";
import {
  Settings,
  Bell,
  Mail,
  Shield,
  Save,
  Globe,
} from "lucide-react";

export default function SystemSettingsPage() {

  const [features, setFeatures] = useState({
    aiWorkout: true,
    coachChat: true,
    leaderboard: false,
    publicProfiles: true,
    analytics: true,
  });

  const toggleFeature = (key: string) => {
    setFeatures({
      ...features,
      [key]: !features[key as keyof typeof features],
    });
  };

  return (
    <div className="space-y-10 bg-[var(--bg-primary)]">
      <title>System Settings | Dashboard - Flexify</title>

      {/* ================= PAGE HEADER ================= */}
      <div className="flex items-center gap-3">
        <Settings className="text-[var(--primary)]" />
        <h1 className="text-2xl md:text-3xl font-bold">
          System Settings
        </h1>
      </div>

      {/* ================= APP CONFIG ================= */}
      <section className="bg-[var(--card-bg)] p-6 md:p-8 rounded-2xl shadow-md hover:shadow-xl transition">
        <div className="flex items-center gap-2 mb-6">
          <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white">
            <Globe size={22} />
          </div>
          <h2 className="text-xl font-semibold">App Configuration</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-sm block mb-2">Application Name</label>
            <input
              type="text"
              defaultValue="Flexify"
              className="w-full border p-3 rounded-lg bg-[var(--bg-primary)]"
            />
          </div>

          <div>
            <label className="text-sm block mb-2">Default Language</label>
            <select className="w-full border p-3 rounded-lg bg-[var(--card-bg)]">
              <option>English</option>
              <option>Bangla</option>
              <option>Spanish</option>
            </select>
          </div>

          <div>
            <label className="text-sm block mb-2">Timezone</label>
            <select className="w-full border p-3 rounded-lg bg-[var(--card-bg)]">
              <option>Asia/Dhaka</option>
              <option>UTC</option>
              <option>Europe/London</option>
            </select>
          </div>

          <div>
            <label className="text-sm block mb-2">Maintenance Mode</label>
            <select className="w-full border p-3 rounded-lg bg-[var(--card-bg)]">
              <option>Disabled</option>
              <option>Enabled</option>
            </select>
          </div>
        </div>
      </section>

  {/* ================= FEATURE TOGGLES ================= */}
<section className="bg-[var(--card-bg)] p-6 md:p-8 rounded-2xl shadow-md hover:shadow-xl transition">
  <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
    <div className="p-4 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white">
      <Settings size={24} />
    </div>
    Feature Toggles
  </h2>

  <div className="space-y-5">
    {Object.entries(features).map(([key, value], idx) => {
      const gradientColors = [
        "from-blue-400 to-indigo-600",
        "from-green-400 to-emerald-500",
        "from-yellow-400 to-orange-500",
        "from-pink-400 to-red-500",
        "from-purple-400 to-pink-500",
      ];
      return (
        <div key={key} className="flex items-center justify-between border-b pb-4">
          <div className="flex items-center gap-3">

            <div>
              <p className="font-medium capitalize">
                {key.replace(/([A-Z])/g, " $1")}
              </p>
              <p className="text-sm text-gray-500">
                Enable or disable this feature globally
              </p>
            </div>
          </div>

          {/* Toggle Switch */}
          <button
            onClick={() => toggleFeature(key)}
            className={`w-12 h-6 flex items-center rounded-full p-1 transition ${
              value ? "bg-green-500" : "bg-gray-300"
            }`}
          >
            <div
              className={`bg-white w-4 h-4 rounded-full shadow transform transition ${
                value ? "translate-x-6" : ""
              }`}
            />
          </button>
        </div>
      );
    })}
  </div>
</section>

      {/* ================= EMAIL CONFIG ================= */}
      <section className="bg-[var(--card-bg)] p-6 md:p-8 rounded-2xl shadow-md hover:shadow-xl transition">
        <div className="flex items-center gap-2 mb-6">
          <div className="p-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white">
            <Mail size={22} />
          </div>
          <h2 className="text-xl font-semibold">Email / SMTP Configuration</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <input type="text" placeholder="SMTP Host" className="border p-3 rounded-lg" />
          <input type="number" placeholder="SMTP Port" className="border p-3 rounded-lg" />
          <input type="text" placeholder="SMTP Username" className="border p-3 rounded-lg" />
          <input type="password" placeholder="SMTP Password" className="border p-3 rounded-lg" />
        </div>
      </section>

      {/* ================= NOTIFICATION SETTINGS ================= */}
      <section className="bg-[var(--card-bg)] p-6 md:p-8 rounded-2xl shadow-md hover:shadow-xl transition">
        <div className="flex items-center gap-2 mb-6">
          <div className="p-3 rounded-xl bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
            <Bell size={22} />
          </div>
          <h2 className="text-xl font-semibold">Notification Settings</h2>
        </div>
        <div className="space-y-4">
          <div className="flex justify-between border-b pb-3">
            <span>New User Signup</span>
            <input type="checkbox" defaultChecked />
          </div>
          <div className="flex justify-between border-b pb-3">
            <span>Subscription Payments</span>
            <input type="checkbox" defaultChecked />
          </div>
          <div className="flex justify-between border-b pb-3">
            <span>Coach Applications</span>
            <input type="checkbox" />
          </div>
        </div>
      </section>

      {/* ================= SECURITY SETTINGS ================= */}
      <section className="bg-[var(--card-bg)] p-6 md:p-8 rounded-2xl shadow-md hover:shadow-xl transition">
        <div className="flex items-center gap-2 mb-6">
          <div className="p-3 rounded-xl bg-gradient-to-r from-red-400 to-pink-500 text-white">
            <Shield size={22} />
          </div>
          <h2 className="text-xl font-semibold">Security Settings</h2>
        </div>
        <div className="space-y-4">
          <div className="flex justify-between border-b pb-3">
            <span>Two Factor Authentication</span>
            <input type="checkbox" defaultChecked />
          </div>
          <div className="flex justify-between border-b pb-3">
            <span>Login Alerts</span>
            <input type="checkbox" defaultChecked />
          </div>
          <div className="flex justify-between border-b pb-3">
            <span>Admin Activity Logs</span>
            <input type="checkbox" defaultChecked />
          </div>
        </div>
      </section>

      {/* ================= SAVE BUTTON ================= */}
      <div className="flex justify-end">
        <button className="flex items-center gap-2 bg-[var(--primary)] text-white px-6 py-3 rounded-lg hover:opacity-90 transition">
          <Save size={18} /> Save Settings
        </button>
      </div>
    </div>
  );
}