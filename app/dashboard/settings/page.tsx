"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Bell,
  Shield,
  Dumbbell,
  Moon,
  Settings,
  Loader2,
  Save,
  DollarSign,
  Calendar,
  Award,
  Heart,
  Activity,
  LayoutDashboard,
} from "lucide-react";
import ThemeToggle from "../Share/ThemeToggle";
import { useSession } from "next-auth/react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-toastify";
import ImageUpload from "@/components/ImageUpload/page";

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number];

// ── Types ─────────────────────────────────────────────────────────────────────
type DbUser = {
  name?: string;
  email?: string;
  role?: string;
  phone?: string;
  location?: string;
  imageUrl?: string;
  profileImage?: string;
  plan?: string;
  planExpiry?: string;
  fitnessProfile?: Record<string, string | number>;
  pricing?: Record<string, number>;
  availableDays?: string[];
  trainingTypes?: string[];
  preferredClients?: string[];
  specialties?: string;
  bio?: string;
  languages?: string;
  education?: string;
  experienceYears?: number;
  maxClients?: number;
  status?: string;
};

// ── Shared Input Components ───────────────────────────────────────────────────
function Field({
  label,
  name,
  value,
  onChange,
  type = "text",
  placeholder,
  disabled,
}: {
  label: string;
  name: string;
  value: string | number;
  placeholder?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  disabled?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        className="text-[10px] font-black uppercase tracking-widest"
        style={{ color: "var(--text-secondary)" }}
      >
        {label}
      </label>
      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder ?? label}
        disabled={disabled}
        className="input-style disabled:opacity-50 disabled:cursor-not-allowed"
      />
    </div>
  );
}

function SelectField({
  label,
  name,
  value,
  onChange,
  options,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: string[];
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        className="text-[10px] font-black uppercase tracking-widest"
        style={{ color: "var(--text-secondary)" }}
      >
        {label}
      </label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="input-style"
        style={{
          background: "var(--bg-secondary)",
          color: "var(--text-primary)",
        }}
      >
        <option value="">Select {label}</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}

// ✅ Fix 1: children typed as React.ReactNode (not unknown)
function SectionCard({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode; // ← was causing TS error
}) {
  return (
    <div
      className="rounded-2xl p-5 space-y-4"
      style={{
        background: "var(--bg-secondary)",
        border: "1px solid var(--border-color)",
      }}
    >
      <div className="flex items-center gap-2.5 mb-1">
        <div
          className="w-8 h-8 rounded-xl flex items-center justify-center"
          style={{
            background: "rgba(16,185,129,0.1)",
            border: "1px solid rgba(16,185,129,0.2)",
          }}
        >
          <Icon size={15} style={{ color: "var(--primary)" }} />
        </div>
        <h3
          className="font-black text-sm"
          style={{ color: "var(--text-primary)" }}
        >
          {title}
        </h3>
      </div>
      {children}
    </div>
  );
}

function SaveButton({
  loading,
  onClick,
}: {
  loading: boolean;
  onClick: () => void;
}) {
  return (
    <motion.button
      onClick={onClick}
      disabled={loading}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      className="flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-sm text-white disabled:opacity-60"
      style={{
        background: "var(--primary)",
        boxShadow: "0 4px 16px rgba(16,185,129,0.3)",
      }}
    >
      {loading ? (
        <>
          <Loader2 size={14} className="animate-spin" /> Saving…
        </>
      ) : (
        <>
          <Save size={14} /> Save Changes
        </>
      )}
    </motion.button>
  );
}

// ── Days of week toggle ───────────────────────────────────────────────────────
const DAYS = ["Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri"];

function DaysToggle({
  selected,
  onChange,
}: {
  selected: string[];
  onChange: (days: string[]) => void;
}) {
  const toggle = (day: string) =>
    onChange(
      selected.includes(day)
        ? selected.filter((d) => d !== day)
        : [...selected, day],
    );
  return (
    <div className="flex flex-wrap gap-2">
      {DAYS.map((day) => (
        <button
          key={day}
          type="button"
          onClick={() => toggle(day)}
          className="px-3 py-1.5 rounded-xl text-xs font-black transition-all"
          style={{
            background: selected.includes(day)
              ? "var(--primary)"
              : "var(--bg-primary)",
            border: `1px solid ${selected.includes(day) ? "var(--primary)" : "var(--border-color)"}`,
            color: selected.includes(day) ? "#fff" : "var(--text-secondary)",
          }}
        >
          {day}
        </button>
      ))}
    </div>
  );
}

function PillToggle({
  options,
  selected,
  onChange,
}: {
  options: string[];
  selected: string[];
  onChange: (vals: string[]) => void;
}) {
  const toggle = (v: string) =>
    onChange(
      selected.includes(v) ? selected.filter((x) => x !== v) : [...selected, v],
    );
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => (
        <button
          key={o}
          type="button"
          onClick={() => toggle(o)}
          className="px-3 py-1.5 rounded-xl text-xs font-black transition-all"
          style={{
            background: selected.includes(o)
              ? "var(--primary)"
              : "var(--bg-primary)",
            border: `1px solid ${selected.includes(o) ? "var(--primary)" : "var(--border-color)"}`,
            color: selected.includes(o) ? "#fff" : "var(--text-secondary)",
          }}
        >
          {o}
        </button>
      ))}
    </div>
  );
}

function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <div
      className="flex items-center justify-between py-3 border-b last:border-0"
      style={{ borderColor: "var(--border-color)" }}
    >
      <span
        className="text-sm font-semibold"
        style={{ color: "var(--text-primary)" }}
      >
        {label}
      </span>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className="relative w-11 h-6 rounded-full transition-colors"
        style={{
          background: checked ? "var(--primary)" : "var(--border-color)",
        }}
      >
        <motion.div
          animate={{ x: checked ? 20 : 2 }}
          transition={{ type: "spring", stiffness: 500, damping: 38 }}
          className="absolute top-1 w-4 h-4 rounded-full bg-white shadow"
        />
      </button>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// ── Tab Components
// ════════════════════════════════════════════════════════════════════════════

// ── Profile tab — uses ImageUpload instead of URL field ───────────────────────
function ProfileTab({
  dbUser,
  onSaved,
}: {
  dbUser: DbUser;
  onSaved: () => void;
}) {
  const [form, setForm] = useState({
    name: dbUser.name ?? "",
    phone: dbUser.phone ?? "",
    location: dbUser.location ?? "",
    imageUrl: dbUser.imageUrl ?? dbUser.profileImage ?? "",
  });
  const [saving, setSaving] = useState(false);

  const handle = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const save = async () => {
    setSaving(true);
    try {
      await axios.patch("/api/user/me", form);
      toast.success("Profile updated!");
      onSaved();
    } catch {
      toast.error("Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Avatar preview */}
      <div
        className="flex items-center gap-4 p-4 rounded-2xl"
        style={{
          background: "var(--bg-primary)",
          border: "1px solid var(--border-color)",
        }}
      >
        {form.imageUrl ? (
          <img
            src={form.imageUrl}
            alt="avatar"
            className="w-16 h-16 rounded-full object-cover"
          />
        ) : (
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center font-black text-2xl text-white"
            style={{ background: "var(--primary)" }}
          >
            {form.name?.charAt(0).toUpperCase() || "U"}
          </div>
        )}
        <div>
          <p
            className="font-black text-base"
            style={{ color: "var(--text-primary)" }}
          >
            {form.name || "Your Name"}
          </p>
          <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
            {dbUser.email ?? ""}
          </p>
          <p
            className="text-[10px] font-black uppercase tracking-wider mt-0.5"
            style={{ color: "var(--primary)" }}
          >
            {dbUser.role ?? ""}
          </p>
        </div>
      </div>

      <SectionCard title="Profile Photo" icon={User}>
        {/* ✅ ImageUpload replaces the URL text field */}
        <ImageUpload
          defaultImage={form.imageUrl}
          onUploadSuccess={(url) => setForm((p) => ({ ...p, imageUrl: url }))}
          className="h-36"
        />
      </SectionCard>

      <SectionCard title="Basic Info" icon={User}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field
            label="Full Name"
            name="name"
            value={form.name}
            onChange={handle}
          />
          <Field
            label="Email"
            name="email"
            value={dbUser.email ?? ""}
            onChange={() => {}}
            disabled
          />
          <Field
            label="Phone"
            name="phone"
            value={form.phone}
            onChange={handle}
            placeholder="+880..."
          />
          <Field
            label="Location"
            name="location"
            value={form.location}
            onChange={handle}
          />
        </div>
      </SectionCard>

      <div className="flex justify-end">
        <SaveButton loading={saving} onClick={save} />
      </div>
    </div>
  );
}

// ── User: Fitness Profile tab ─────────────────────────────────────────────────
function UserFitnessTab({
  dbUser,
  onSaved,
}: {
  dbUser: DbUser;
  onSaved: () => void;
}) {
  const fp = dbUser.fitnessProfile ?? {};
  const [form, setForm] = useState({
    age: String(fp.age ?? ""),
    gender: String(fp.gender ?? ""),
    height: String(fp.height ?? ""),
    weight: String(fp.weight ?? ""),
    goal: String(fp.goal ?? ""),
    activityLevel: String(fp.activityLevel ?? ""),
    workoutDays: String(fp.workoutDays ?? ""),
    sleepHours: String(fp.sleepHours ?? ""),
    waterIntake: String(fp.waterIntake ?? ""),
    injuries: String(fp.injuries ?? ""),
    medicalCondition: String(fp.medicalCondition ?? ""),
    dietType: String(fp.dietType ?? ""),
  });
  const [saving, setSaving] = useState(false);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const save = async () => {
    setSaving(true);
    try {
      await axios.patch("/api/user/me", { fitnessProfile: form });
      toast.success("Fitness profile updated!");
      onSaved();
    } catch {
      toast.error("Failed to update.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <SectionCard title="Body Metrics" icon={Activity}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field
            label="Age"
            name="age"
            value={form.age}
            onChange={handleInput}
            type="number"
          />
          <SelectField
            label="Gender"
            name="gender"
            value={form.gender}
            onChange={handleSelect}
            options={["Male", "Female", "Other"]}
          />
          <Field
            label="Height (cm)"
            name="height"
            value={form.height}
            onChange={handleInput}
            type="number"
          />
          <Field
            label="Weight (kg)"
            name="weight"
            value={form.weight}
            onChange={handleInput}
            type="number"
          />
        </div>
      </SectionCard>

      <SectionCard title="Goals & Activity" icon={Dumbbell}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <SelectField
            label="Fitness Goal"
            name="goal"
            value={form.goal}
            onChange={handleSelect}
            options={[
              "Weight Loss",
              "Muscle Gain",
              "Endurance",
              "Flexibility",
              "General Fitness",
            ]}
          />
          <SelectField
            label="Activity Level"
            name="activityLevel"
            value={form.activityLevel}
            onChange={handleSelect}
            options={[
              "Sedentary",
              "Lightly Active",
              "Moderately Active",
              "Very Active",
              "Extra Active",
            ]}
          />
          <SelectField
            label="Workout Days/Week"
            name="workoutDays"
            value={form.workoutDays}
            onChange={handleSelect}
            options={[
              "1 Day",
              "2 Days",
              "3 Days",
              "4 Days",
              "5 Days",
              "6 Days",
              "7 Days",
            ]}
          />
          <SelectField
            label="Diet Type"
            name="dietType"
            value={form.dietType}
            onChange={handleSelect}
            options={[
              "No Restriction",
              "Vegetarian",
              "Vegan",
              "Keto",
              "Paleo",
              "Halal",
            ]}
          />
        </div>
      </SectionCard>

      <SectionCard title="Health & Lifestyle" icon={Heart}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field
            label="Sleep Hours/Night"
            name="sleepHours"
            value={form.sleepHours}
            onChange={handleInput}
            type="number"
          />
          <Field
            label="Water Intake (glasses)"
            name="waterIntake"
            value={form.waterIntake}
            onChange={handleInput}
            type="number"
          />
          <Field
            label="Injuries (if any)"
            name="injuries"
            value={form.injuries}
            onChange={handleInput}
            placeholder="e.g. Knee injury, None"
          />
          <Field
            label="Medical Conditions"
            name="medicalCondition"
            value={form.medicalCondition}
            onChange={handleInput}
            placeholder="e.g. Hypertension, None"
          />
        </div>
      </SectionCard>

      {dbUser.plan && (
        <div
          className="flex items-center justify-between p-4 rounded-2xl"
          style={{
            background: "rgba(16,185,129,0.05)",
            border: "1px solid rgba(16,185,129,0.2)",
          }}
        >
          <div>
            <p
              className="text-[10px] font-black uppercase tracking-widest"
              style={{ color: "var(--text-secondary)" }}
            >
              Current Plan
            </p>
            <p
              className="font-black text-lg capitalize"
              style={{ color: "var(--primary)" }}
            >
              {dbUser.plan}
            </p>
          </div>
          {dbUser.planExpiry && (
            <div className="text-right">
              <p
                className="text-[10px] font-black uppercase tracking-widest"
                style={{ color: "var(--text-secondary)" }}
              >
                Expires
              </p>
              <p
                className="font-bold text-sm"
                style={{ color: "var(--text-primary)" }}
              >
                {new Date(dbUser.planExpiry).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </p>
            </div>
          )}
        </div>
      )}

      <div className="flex justify-end">
        <SaveButton loading={saving} onClick={save} />
      </div>
    </div>
  );
}

// ── Coach: Schedule & Pricing tab ────────────────────────────────────────────
function CoachScheduleTab({
  dbUser,
  onSaved,
}: {
  dbUser: DbUser;
  onSaved: () => void;
}) {
  const pricing = dbUser.pricing ?? {};
  const [form, setForm] = useState({
    monthlyRate: String(pricing.monthly ?? ""),
    perSessionRate: String(pricing.perSession ?? ""),
    maxClients: String(dbUser.maxClients ?? ""),
    specialties: String(dbUser.specialties ?? ""),
    bio: String(dbUser.bio ?? ""),
    languages: String(dbUser.languages ?? ""),
    education: String(dbUser.education ?? ""),
    experienceYears: String(dbUser.experienceYears ?? ""),
  });
  const [availableDays, setAvailableDays] = useState<string[]>(
    dbUser.availableDays ?? [],
  );
  const [trainingTypes, setTrainingTypes] = useState<string[]>(
    dbUser.trainingTypes ?? [],
  );
  const [preferredClients, setPreferredClients] = useState<string[]>(
    dbUser.preferredClients ?? [],
  );
  const [saving, setSaving] = useState(false);

  const handleInput = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const save = async () => {
    setSaving(true);
    try {
      await axios.patch("/api/user/me", {
        pricing: {
          monthly: Number(form.monthlyRate),
          perSession: Number(form.perSessionRate),
        },
        maxClients: Number(form.maxClients),
        specialties: form.specialties,
        bio: form.bio,
        languages: form.languages,
        education: form.education,
        experienceYears: Number(form.experienceYears),
        availableDays,
        trainingTypes,
        preferredClients,
      });
      toast.success("Coach profile updated!");
      onSaved();
    } catch {
      toast.error("Failed to update.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <SectionCard title="Pricing" icon={DollarSign}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field
            label="Monthly Rate ($)"
            name="monthlyRate"
            value={form.monthlyRate}
            onChange={handleInput}
            type="number"
            placeholder="e.g. 30"
          />
          <Field
            label="Per Session Rate ($)"
            name="perSessionRate"
            value={form.perSessionRate}
            onChange={handleInput}
            type="number"
            placeholder="e.g. 10"
          />
          <Field
            label="Max Clients"
            name="maxClients"
            value={form.maxClients}
            onChange={handleInput}
            type="number"
          />
          <Field
            label="Experience Years"
            name="experienceYears"
            value={form.experienceYears}
            onChange={handleInput}
            type="number"
          />
        </div>
      </SectionCard>

      <SectionCard title="Availability" icon={Calendar}>
        <label
          className="text-[10px] font-black uppercase tracking-widest"
          style={{ color: "var(--text-secondary)" }}
        >
          Available Days
        </label>
        <DaysToggle selected={availableDays} onChange={setAvailableDays} />
      </SectionCard>

      <SectionCard title="Training Preferences" icon={Dumbbell}>
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <label
              className="text-[10px] font-black uppercase tracking-widest"
              style={{ color: "var(--text-secondary)" }}
            >
              Training Types
            </label>
            <PillToggle
              options={["Online", "1-on-1", "Group", "Hybrid"]}
              selected={trainingTypes}
              onChange={setTrainingTypes}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label
              className="text-[10px] font-black uppercase tracking-widest"
              style={{ color: "var(--text-secondary)" }}
            >
              Preferred Clients
            </label>
            <PillToggle
              options={["Beginner", "Intermediate", "Advanced"]}
              selected={preferredClients}
              onChange={setPreferredClients}
            />
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Professional Info" icon={Award}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field
            label="Specialties"
            name="specialties"
            value={form.specialties}
            onChange={handleInput}
            placeholder="e.g. Gym, HIIT"
          />
          <Field
            label="Languages"
            name="languages"
            value={form.languages}
            onChange={handleInput}
            placeholder="e.g. English, Bangla"
          />
          <Field
            label="Education"
            name="education"
            value={form.education}
            onChange={handleInput}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label
            className="text-[10px] font-black uppercase tracking-widest"
            style={{ color: "var(--text-secondary)" }}
          >
            Bio
          </label>
          <textarea
            name="bio"
            value={form.bio}
            onChange={
              handleInput as React.ChangeEventHandler<HTMLTextAreaElement>
            }
            rows={3}
            className="input-style resize-none"
            placeholder="Tell clients about yourself..."
          />
        </div>
      </SectionCard>

      <div className="flex justify-end">
        <SaveButton loading={saving} onClick={save} />
      </div>
    </div>
  );
}

// ── Admin: Info panel ─────────────────────────────────────────────────────────
function AdminInfoTab({ dbUser }: { dbUser: DbUser }) {
  return (
    <div className="space-y-4">
      <div
        className="flex items-center gap-4 p-5 rounded-2xl"
        style={{
          background: "rgba(16,185,129,0.05)",
          border: "1px solid rgba(16,185,129,0.2)",
        }}
      >
        {dbUser.imageUrl ? (
          <img
            src={dbUser.imageUrl}
            alt="admin"
            className="w-20 h-20 rounded-full object-cover"
          />
        ) : (
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center font-black text-3xl text-white"
            style={{ background: "var(--primary)" }}
          >
            {dbUser.name?.charAt(0)?.toUpperCase() ?? "A"}
          </div>
        )}
        <div>
          <p
            className="font-black text-xl"
            style={{ color: "var(--text-primary)" }}
          >
            {dbUser.name}
          </p>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            {dbUser.email}
          </p>
          <span
            className="inline-block mt-1 px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider"
            style={{
              background: "rgba(16,185,129,0.12)",
              color: "var(--primary)",
              border: "1px solid rgba(16,185,129,0.2)",
            }}
          >
            Administrator
          </span>
        </div>
      </div>

      <SectionCard title="Account Details" icon={Shield}>
        {[
          { label: "Full Name", val: dbUser.name ?? "—" },
          { label: "Email", val: dbUser.email ?? "—" },
          { label: "Phone", val: dbUser.phone ?? "—" },
          { label: "Role", val: dbUser.role ?? "—" },
          { label: "Status", val: dbUser.status ?? "Active" },
        ].map((r) => (
          <div
            key={r.label}
            className="flex items-center justify-between py-3 border-b last:border-0"
            style={{ borderColor: "var(--border-color)" }}
          >
            <span
              className="text-sm font-semibold"
              style={{ color: "var(--text-secondary)" }}
            >
              {r.label}
            </span>
            <span
              className="text-sm font-bold capitalize"
              style={{ color: "var(--text-primary)" }}
            >
              {r.val}
            </span>
          </div>
        ))}
      </SectionCard>

      <div
        className="p-4 rounded-2xl text-center"
        style={{
          background: "var(--bg-secondary)",
          border: "1px solid var(--border-color)",
        }}
      >
        <p
          className="text-[10px] font-black uppercase tracking-widest mb-1"
          style={{ color: "var(--text-muted)" }}
        >
          Admin Access
        </p>
        <p className="font-black text-base" style={{ color: "var(--primary)" }}>
          Full Platform Control
        </p>
        <p className="text-xs mt-1" style={{ color: "var(--text-secondary)" }}>
          Manage coaches, users, payments and content.
        </p>
      </div>
    </div>
  );
}

// ── Notifications tab ─────────────────────────────────────────────────────────
function NotificationsTab() {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    workoutReminder: true,
    dietTips: false,
    coachMessages: true,
    weeklyReport: false,
  });
  const labels: Record<keyof typeof settings, string> = {
    emailNotifications: "Email Notifications",
    workoutReminder: "Workout Reminder",
    dietTips: "Diet Tips",
    coachMessages: "Coach Messages",
    weeklyReport: "Weekly Progress Report",
  };
  return (
    <div className="space-y-4">
      <SectionCard title="Notification Preferences" icon={Bell}>
        {(Object.keys(settings) as (keyof typeof settings)[]).map((key) => (
          <Toggle
            key={key}
            label={labels[key]}
            checked={settings[key]}
            onChange={(v) => setSettings((p) => ({ ...p, [key]: v }))}
          />
        ))}
      </SectionCard>
      <div className="flex justify-end">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => toast.success("Notification preferences saved!")}
          className="flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-sm text-white"
          style={{
            background: "var(--primary)",
            boxShadow: "0 4px 16px rgba(16,185,129,0.3)",
          }}
        >
          <Save size={14} /> Save Preferences
        </motion.button>
      </div>
    </div>
  );
}

// ── Security tab ──────────────────────────────────────────────────────────────
function SecurityTab() {
  const [form, setForm] = useState({ current: "", next: "", confirm: "" });
  const [saving, setSaving] = useState(false);
  const handle = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const save = async () => {
    if (form.next !== form.confirm) {
      toast.error("Passwords do not match.");
      return;
    }
    if (form.next.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return;
    }
    setSaving(true);
    try {
      await axios.patch("/api/user/me/password", {
        currentPassword: form.current,
        newPassword: form.next,
      });
      toast.success("Password changed successfully!");
      setForm({ current: "", next: "", confirm: "" });
    } catch {
      toast.error("Failed. Check your current password.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <SectionCard title="Change Password" icon={Shield}>
        <div className="flex flex-col gap-4">
          <Field
            label="Current Password"
            name="current"
            value={form.current}
            onChange={handle}
            type="password"
          />
          <Field
            label="New Password"
            name="next"
            value={form.next}
            onChange={handle}
            type="password"
          />
          <Field
            label="Confirm Password"
            name="confirm"
            value={form.confirm}
            onChange={handle}
            type="password"
          />
        </div>
      </SectionCard>
      <div className="flex justify-end">
        <SaveButton loading={saving} onClick={save} />
      </div>
    </div>
  );
}

// ── Appearance tab ────────────────────────────────────────────────────────────
function AppearanceTab() {
  return (
    <div className="space-y-4">
      <SectionCard title="Theme" icon={Moon}>
        <p className="text-sm mb-3" style={{ color: "var(--text-secondary)" }}>
          Switch between light and dark mode.
        </p>
        <ThemeToggle />
      </SectionCard>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// ── MAIN PAGE ────────────────────────────────────────────────────────────────
// ════════════════════════════════════════════════════════════════════════════
export default function SettingsPage() {
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  const { data: dbUser, isLoading } = useQuery<DbUser | null>({
    queryKey: ["currentUser", session?.user?.email],
    queryFn: async () => {
      if (!session?.user?.email) return null;
      const res = await axios.get(`/api/user/me?email=${session.user.email}`);
      return res.data as DbUser;
    },
    enabled: !!session?.user?.email,
  });

  const role = dbUser?.role ?? "user";

  const allTabs: Record<
    string,
    { id: string; label: string; icon: React.ElementType }[]
  > = {
    user: [
      { id: "profile", label: "Profile", icon: User },
      { id: "fitness", label: "Fitness Info", icon: Dumbbell },
      { id: "notifications", label: "Notifications", icon: Bell },
      { id: "security", label: "Security", icon: Shield },
      { id: "appearance", label: "Appearance", icon: Moon },
    ],
    coach: [
      { id: "profile", label: "Profile", icon: User },
      { id: "schedule", label: "Schedule & Rates", icon: Calendar },
      { id: "notifications", label: "Notifications", icon: Bell },
      { id: "security", label: "Security", icon: Shield },
      { id: "appearance", label: "Appearance", icon: Moon },
    ],
    admin: [
      { id: "info", label: "Admin Info", icon: LayoutDashboard },
      { id: "profile", label: "Profile", icon: User },
      { id: "security", label: "Security", icon: Shield },
      { id: "appearance", label: "Appearance", icon: Moon },
    ],
  };

  const tabs = allTabs[role] ?? allTabs.user;
  const [activeTab, setActiveTab] = useState(tabs[0]?.id ?? "profile");

  // ✅ Fix 2: wrap setState in setTimeout to avoid synchronous setState in effect
  useEffect(() => {
    if (!tabs.find((t) => t.id === activeTab)) {
      const t = setTimeout(() => setActiveTab(tabs[0]?.id ?? "profile"), 0);
      return () => clearTimeout(t);
    }
  }, [role]); // eslint-disable-line react-hooks/exhaustive-deps

  const onSaved = () =>
    queryClient.invalidateQueries({
      queryKey: ["currentUser", session?.user?.email],
    });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3">
        <Loader2
          size={32}
          className="animate-spin"
          style={{ color: "var(--primary)" }}
        />
        <p
          className="text-[11px] font-black uppercase tracking-widest animate-pulse"
          style={{ color: "var(--text-muted)" }}
        >
          Loading settings...
        </p>
      </div>
    );
  }

  if (!dbUser) return null;

  return (
    <div className="space-y-6">
      <title>Settings | Dashboard - Flexify</title>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease }}
      >
        <div className="flex items-center justify-between">
          <div>
            <p
              className="text-[10px] font-black uppercase tracking-[0.25em] mb-1"
              style={{ color: "var(--primary)" }}
            >
              — Preferences
            </p>
            <h1 className="font-bold text-3xl md:text-4xl tracking-tight uppercase text-[var(--text-primary)]">
              Settings
            </h1>
          </div>
          <div
            className="w-11 h-11 rounded-2xl flex items-center justify-center"
            style={{
              background: "rgba(16,185,129,0.12)",
              border: "1px solid rgba(16,185,129,0.25)",
            }}
          >
            <Settings size={20} style={{ color: "var(--primary)" }} />
          </div>
        </div>
      </motion.div>

      <div className="flex flex-col md:grid md:grid-cols-4 gap-5">
        {/* Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1, duration: 0.4, ease }}
          className="rounded-2xl p-3 md:col-span-1 self-start"
          style={{
            background: "var(--bg-secondary)",
            border: "1px solid var(--border-color)",
          }}
        >
          <div
            className="px-3 py-2 mb-2 rounded-xl"
            style={{ background: "var(--bg-primary)" }}
          >
            <p
              className="text-[9px] font-black uppercase tracking-widest"
              style={{ color: "var(--text-muted)" }}
            >
              Logged in as
            </p>
            <p
              className="font-black text-sm capitalize"
              style={{ color: "var(--primary)" }}
            >
              {role}
            </p>
          </div>
          <ul className="space-y-0.5">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <li key={tab.id}>
                  <button
                    onClick={() => setActiveTab(tab.id)}
                    className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-all text-left"
                    style={{
                      background: isActive
                        ? "rgba(16,185,129,0.1)"
                        : "transparent",
                      color: isActive
                        ? "var(--primary)"
                        : "var(--text-secondary)",
                      fontWeight: isActive ? 700 : 500,
                    }}
                  >
                    <Icon size={16} />
                    <span className="text-sm">{tab.label}</span>
                    {isActive && (
                      <div
                        className="ml-auto w-1.5 h-1.5 rounded-full"
                        style={{ background: "var(--primary)" }}
                      />
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.4, ease }}
          className="md:col-span-3"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === "profile" && (
                <ProfileTab dbUser={dbUser} onSaved={onSaved} />
              )}
              {activeTab === "fitness" && (
                <UserFitnessTab dbUser={dbUser} onSaved={onSaved} />
              )}
              {activeTab === "schedule" && (
                <CoachScheduleTab dbUser={dbUser} onSaved={onSaved} />
              )}
              {activeTab === "info" && <AdminInfoTab dbUser={dbUser} />}
              {activeTab === "notifications" && <NotificationsTab />}
              {activeTab === "security" && <SecurityTab />}
              {activeTab === "appearance" && <AppearanceTab />}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
