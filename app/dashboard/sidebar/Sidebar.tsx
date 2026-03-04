"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {Home, Flag, Calendar, Trophy, BarChart2, Settings, BrickWallShield, UserRoundCog, Speech, UserPen, ChartNoAxesGanttIcon} from "lucide-react";


const Sidebar = () => {
  const pathname = usePathname();

  const menuItems = [
    { name: "Home", href: "/dashboard", icon: Home },
    { name: "My goals", href: "/dashboard/my-goals", icon: Flag },
    { name: "Schedule", href: "/dashboard/schedule", icon: Calendar },
    { name: "Achievements", href: "/dashboard/achievements", icon: Trophy },
    { name: "Statistics", href: "/dashboard/statistics", icon: BarChart2 },
    { name: "Admin Stats", href: "/dashboard/admin-stats", icon:  BrickWallShield },
    { name: "User Management", href: "/dashboard/admin-management", icon:  UserRoundCog },
    { name: "Coach Stats", href: "/dashboard/coach-stats", icon:  UserRoundCog },
    { name: "Client Management", href: "/dashboard/client-management", icon:  ChartNoAxesGanttIcon },
    { name: "Client Progress", href: "/dashboard/client-progress", icon:  UserPen },
    { name: "Session Planner", href: "/dashboard/session-planner", icon:  Speech },

    { name: "Settings", href: "/dashboard/settings", icon: Settings },
  ];

  return (
    <aside className="w-[260px] bg-[var(--card-bg)] min-h-screen rounded-2xl p-4 shadow-lg flex flex-col justify-between">
      {/* Top */}
      <div>
        {/* Profile */}
        <div className="text-center pb-4">
          <div className="relative w-fit mx-auto">
            <img
              src="https://i.postimg.cc/FzTr6D42/JUBAYER_Photo.jpg"
              className="w-16 h-16 rounded-full object-cover mx-auto"
            />
            <span className="absolute -right-8 top-1 text-xs text-pink-400 cursor-pointer">
              EDIT
            </span>
          </div>

          <h3 className="mt-2 font-semibold">Jubayer Hossain</h3>
          <p className="text-xs text-[var(--text-secondary)]">
            Male, 28 years
          </p>
        </div>

        {/* Height Weight */}
        <div className="flex border border-gray-300/50 rounded-xl overflow-hidden mb-6">
          <div className="w-1/2 text-center py-3 border-r border-gray-300/50">
            <p className="text-xs text-orange-500 font-semibold">HEIGHT</p>
            <p className="font-bold">
              185 <span className="text-sm text-gray-400">cm</span>
            </p>
          </div>

          <div className="w-1/2 text-center py-3">
            <p className="text-xs text-orange-500 font-semibold">WEIGHT</p>
            <p className="font-bold">
              176 <span className="text-sm text-gray-400">kg</span>
            </p>
          </div>
        </div>

        {/* Menu */}
        <nav className="mt-4 space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all
                  ${
                    isActive
                      ? "bg-orange-500/20 text-orange-500 font-semibold"
                      : "text-[var(--text-primary)] hover:bg-gray-500/10"
                  }
                `}
              >
                <item.icon size={18} />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Card */}
      <div className="bg-[var(--primary)] text-[var(--text-primary)] text-center p-4 rounded-xl text-sm mt-6">
        <h4 className="font-semibold">CONGRATULATIONS!</h4>
        <p>You have unlocked the “Expert” level.</p>
      </div>
    </aside>
  );
};

export default Sidebar;