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
    <div className="max-w-7xl mx-auto px-4 py-10 space-y-10 bg-[var(--bg-primary)]">

      {/* ================= PAGE HEADER ================= */}

      <div className="flex items-center gap-3">
        <Settings />
        <h1 className="text-2xl md:text-3xl font-bold">
          System Settings
        </h1>
      </div>

      {/* ================= APP CONFIG ================= */}

      <section className="bg-[var(--card-bg)] p-6 md:p-8 rounded-2xl shadow">

        <div className="flex items-center gap-2 mb-6">
          <Globe />
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

      <section className="bg-[var(--card-bg)] p-6 md:p-8 rounded-2xl shadow">

        <h2 className="text-xl font-semibold mb-6">Feature Toggles</h2>

        <div className="space-y-5">

          {Object.entries(features).map(([key, value]) => (

            <div
              key={key}
              className="flex items-center justify-between border-b pb-4"
            >

              <div>
                <p className="font-medium capitalize">
                  {key.replace(/([A-Z])/g, " $1")}
                </p>
                <p className="text-sm text-gray-500">
                  Enable or disable this feature globally
                </p>
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

          ))}

        </div>
      </section>

      {/* ================= EMAIL CONFIG ================= */}

      <section className="bg-[var(--card-bg)] p-6 md:p-8 rounded-2xl shadow">

        <div className="flex items-center gap-2 mb-6">
          <Mail />
          <h2 className="text-xl font-semibold">
            Email / SMTP Configuration
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <input
            type="text"
            placeholder="SMTP Host"
            className="border p-3 rounded-lg"
          />

          <input
            type="number"
            placeholder="SMTP Port"
            className="border p-3 rounded-lg"
          />

          <input
            type="text"
            placeholder="SMTP Username"
            className="border p-3 rounded-lg"
          />

          <input
            type="password"
            placeholder="SMTP Password"
            className="border p-3 rounded-lg"
          />

        </div>
      </section>

      {/* ================= NOTIFICATION SETTINGS ================= */}

      <section className="bg-[var(--card-bg)] p-6 md:p-8 rounded-2xl shadow">

        <div className="flex items-center gap-2 mb-6">
          <Bell />
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

      <section className="bg-[var(--card-bg)] p-6 md:p-8 rounded-2xl shadow">

        <div className="flex items-center gap-2 mb-6">
          <Shield />
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

        <button className="flex items-center gap-2 bg-[var(--primary)] text-white px-6 py-3 rounded-lg hover:opacity-90">

          <Save size={18} />

          Save Settings

        </button>

      </div>

    </div>
  );
}