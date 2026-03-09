"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
<<<<<<< HEAD
import { Home, Flag, Calendar, Trophy, BarChart2, Settings, BrickWallShield, UserRoundCog, Speech, UserPen, ChartNoAxesGanttIcon, Utensils} from "lucide-react";
=======
import {Home, Flag, Calendar, Trophy, BarChart2, Settings, UserCheck, Users, MessageCircle, BrickWallShield, UserRoundCog, Speech, UserPen, ChartNoAxesGanttIcon, Utensils} from "lucide-react";

>>>>>>> 960e5da8cc7e2458e3f109b0e4fd0ed4f022f7c3

import { useSession } from "next-auth/react";

const Sidebar = () => {
  const pathname = usePathname();
  const { data: session } = useSession();

  // user role
  const userRole = session?.role;

  // Menu Items
  const menuItems = [
<<<<<<< HEAD
    // USER
    { name: "Home", href: "/dashboard", icon: Home, role: ["user", "admin", "coach"] },
    { name: "My goals", href: "/dashboard/my-goals", icon: Flag, role: ["user"] },
    { name: "Nutrition", href: "/dashboard/nutrition-tracker", icon: Utensils, role: ["user"] },
    { name: "Schedule", href: "/dashboard/schedule", icon: Calendar, role: ["user"] },
    { name: "Achievements", href: "/dashboard/achievements", icon: Trophy, role: ["user"] },
    { name: "Statistics", href: "/dashboard/statistics", icon: BarChart2, role: ["user"] },

    // ADMIN
    { name: "Admin Stats", href: "/dashboard/admin-stats", icon: BrickWallShield, role: ["admin"] },
    { name: "User Management", href: "/dashboard/admin-management", icon: UserRoundCog, role: ["admin"] },

    // COACH
    { name: "Coach Stats", href: "/dashboard/coach-stats", icon: UserRoundCog, role: ["coach"] },
    { name: "Client Management", href: "/dashboard/client-management", icon: ChartNoAxesGanttIcon, role: ["coach"] },
    { name: "Client Progress", href: "/dashboard/client-progress", icon: UserPen, role: ["coach"] },
    { name: "Session Planner", href: "/dashboard/session-planner", icon: Speech, role: ["coach"] },

    { name: "Settings", href: "/dashboard/settings", icon: Settings, role: ["user","admin","coach"] },
=======
    { name: "Home", href: "/dashboard", icon: Home },
    { name: "My goals", href: "/dashboard/my-goals", icon: Flag },
    { name: "Nutrition", href: "/dashboard/nutrition-tracker", icon: Utensils },
    { name: "Schedule", href: "/dashboard/schedule", icon: Calendar },
    { name: "Achievements", href: "/dashboard/achievements", icon: Trophy },

   
    // Coaches section
    { name: "Assigned Coach", href: "/dashboard/assigned-coach", icon: UserCheck },
    { name: "Browse Coaches", href: "/dashboard/browse-coach", icon: Users},
    { name: "Messages", href: "/dashboard/messages", icon: MessageCircle },

    { name: "Statistics", href: "/dashboard/statistics", icon: BarChart2},
    { name: "Admin Stats", href: "/dashboard/admin-stats", icon:  BrickWallShield },
    { name: "User Management", href: "/dashboard/admin-management", icon:  UserRoundCog },
    { name: "Coach Stats", href: "/dashboard/coach-stats", icon:  UserRoundCog },
    { name: "Client Management", href: "/dashboard/client-management", icon:  ChartNoAxesGanttIcon },
    { name: "Client Progress", href: "/dashboard/client-progress", icon:  UserPen },
    { name: "Session Planner", href: "/dashboard/session-planner", icon:  Speech },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
>>>>>>> 960e5da8cc7e2458e3f109b0e4fd0ed4f022f7c3
  ];

  // Role menu filter
  const filteredMenu = menuItems.filter((item) =>
    item.role.includes(userRole)
   );

    console.log(session);

  return (
    <aside className="w-[260px] bg-[var(--card-bg)] min-h-screen rounded-2xl p-4 shadow-lg flex flex-col justify-between">
      
      {/* TOP SECTION */}
      <div>

        {/* Profile */}
        <div className="text-center pb-4">
          <div className="relative w-fit mx-auto">
            <img
              src={session?.user?.image || "https://i.postimg.cc/FzTr6D42/JUBAYER_Photo.jpg"}
              className="w-16 h-16 rounded-full object-cover mx-auto"
            />

            <span className="absolute -right-8 top-1 text-xs text-pink-400 cursor-pointer">
              EDIT
            </span>
          </div>

          <h3 className="mt-2 font-semibold">
            {session?.user?.name || "User"}
          </h3>

          <p className="text-xs text-[var(--text-secondary)] capitalize">
            {userRole}
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
              76 <span className="text-sm text-gray-400">kg</span>
            </p>
          </div>
        </div>

        {/* MENU */}
        <nav className="mt-4 space-y-2">
          {filteredMenu.map((item) => {
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

      {/* BOTTOM CARD */}
      <div className="bg-[var(--primary)] text-[var(--text-primary)] text-center p-4 rounded-xl text-sm mt-6">
        <h4 className="font-semibold">CONGRATULATIONS!</h4>
        <p>You have unlocked the “Expert” level.</p>
      </div>
    </aside>
  );
};

export default Sidebar;