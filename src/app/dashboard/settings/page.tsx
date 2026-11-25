"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Loader2 } from "lucide-react";

import { TabKey, DbUser } from "@/components/dashboard/settings/types";
import { SettingsHeader } from "@/components/dashboard/settings/SettingsHeader";
import { SettingsTabsNav } from "@/components/dashboard/settings/SettingsTabsNav";
import { SettingsHeroProfile } from "@/components/dashboard/settings/SettingsHeroProfile";
import { ProfilePhotoCard } from "@/components/dashboard/settings/ProfilePhotoCard";
import { ProfileTab } from "@/components/dashboard/settings/ProfileTab";
import { FitnessInfoTab } from "@/components/dashboard/settings/FitnessInfoTab";
import { CoachScheduleTab } from "@/components/dashboard/settings/CoachScheduleTab";
import { AdminInfoTab } from "@/components/dashboard/settings/AdminInfoTab";
import { NotificationsTab } from "@/components/dashboard/settings/NotificationsTab";
import { SecurityTab } from "@/components/dashboard/settings/SecurityTab";
import { AppearanceTab } from "@/components/dashboard/settings/AppearanceTab";

export default function SettingsPage() {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<TabKey>("profile");

  const { data: dbUser, isLoading } = useQuery<DbUser | null>({
    queryKey: ["currentUser", session?.user?.email],
    queryFn: async () => {
      if (!session?.user?.email) return null;
      const res = await axios.get(`/api/user/me?email=${session.user.email}`);
      return res.data;
    },
    enabled: !!session?.user?.email,
  });

  if (isLoading || !dbUser) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <Loader2 className="animate-spin text-[var(--primary)]" size={40} />
        <p className="text-sm font-bold text-[var(--text-secondary)]">
          Loading preferences...
        </p>
      </div>
    );
  }

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ["currentUser"] });
  };

  return (
    <div className="space-y-8 md:space-y-12 lg:space-y-16">
      <title>Settings | Dashboard - Flexify</title>
      <SettingsHeader />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Tab Navigation */}
        <div className="lg:col-span-3">
          <SettingsTabsNav
            user={dbUser}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        </div>

        {/* Right Column: Hero Profile + Active Tab */}
        <div className="lg:col-span-9 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
            <div className="md:col-span-2">
              <SettingsHeroProfile user={dbUser} />
            </div>
            <div className="md:col-span-1">
              <ProfilePhotoCard user={dbUser} onPhotoUpdated={handleRefresh} />
            </div>
          </div>

          <div className="transition-all duration-200">
            {activeTab === "profile" && (
              <ProfileTab user={dbUser} onSaveSuccess={handleRefresh} />
            )}
            {activeTab === "fitness" && (
              <FitnessInfoTab user={dbUser} onSaveSuccess={handleRefresh} />
            )}
            {activeTab === "coach" && (
              <CoachScheduleTab user={dbUser} onSaveSuccess={handleRefresh} />
            )}
            {activeTab === "admin" && <AdminInfoTab user={dbUser} />}
            {activeTab === "notifications" && <NotificationsTab user={dbUser} />}
            {activeTab === "security" && <SecurityTab user={dbUser} />}
            {activeTab === "appearance" && <AppearanceTab user={dbUser} />}
          </div>
        </div>
      </div>
    </div>
  );
}
