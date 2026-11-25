import {
  Calendar,
  CircleDollarSign,
  Dumbbell,
  FileCog,
  Home,
  LayersPlus,
  MessageSquareWarning,
  PlusCircle,
  Settings,
  SquareLibrary,
  TableOfContents,
  Trophy,
  UserRoundCog,
  Utensils,
  User,
  Workflow,
  Swords,
  Star,
  UserCheck2,
  LucideIcon,
} from "lucide-react";
import { PlanId } from "@/lib/plans";

export interface MenuItem {
  name: string;
  href: string;
  icon: LucideIcon;
  roles: string[];
  minPlan?: PlanId;
}

export interface MenuGroup {
  label: string;
  items: MenuItem[];
}

export const SIDEBAR_MENU_CONFIG: MenuGroup[] = [
  {
    label: "MAIN MENU",
    items: [
      {
        name: "Dashboard",
        href: "/dashboard",
        icon: Home,
        roles: ["user", "admin", "coach"],
        minPlan: "free",
      },
      {
        name: "Create Workout",
        href: "/dashboard/create-workout",
        icon: PlusCircle,
        roles: ["user"],
        minPlan: "pro",
      },
      {
        name: "Your Workouts",
        href: "/dashboard/your-workouts",
        icon: Dumbbell,
        roles: ["user"],
        minPlan: "free",
      },
      {
        name: "Challenges",
        href: "/dashboard/my-challenges",
        icon: Swords,
        roles: ["user"],
        minPlan: "free",
      },
      {
        name: "My Coach",
        href: "/dashboard/my-coach",
        icon: UserCheck2,
        roles: ["user"],
        minPlan: "elite",
      },
      {
        name: "Nutrition",
        href: "/dashboard/nutrition-tracker",
        icon: Utensils,
        roles: ["user"],
        minPlan: "pro",
      },
      {
        name: "Schedule",
        href: "/dashboard/schedule",
        icon: Calendar,
        roles: ["user"],
        minPlan: "free",
      },
      {
        name: "Achievements",
        href: "/dashboard/achievements",
        icon: Trophy,
        roles: ["user"],
        minPlan: "pro",
      },
    ],
  },
  {
    label: "ADMIN",
    items: [
      {
        name: "Users Management",
        href: "/dashboard/admin-management",
        icon: UserRoundCog,
        roles: ["admin"],
      },
      {
        name: "Coach Management",
        href: "/dashboard/admin-coach-management",
        icon: LayersPlus,
        roles: ["admin"],
      },
      {
        name: "Workout Library",
        href: "/dashboard/admin-workout-library",
        icon: SquareLibrary,
        roles: ["admin"],
      },
      {
        name: "Content Management",
        href: "/dashboard/admin-content-management",
        icon: TableOfContents,
        roles: ["admin"],
      },
      {
        name: "Reports & Analytics",
        href: "/dashboard/admin-reports-analytics",
        icon: MessageSquareWarning,
        roles: ["admin"],
      },
      {
        name: "Payments / Subscriptions",
        href: "/dashboard/admin-payments-subscriptions",
        icon: CircleDollarSign,
        roles: ["admin"],
      },
      {
        name: "Wants to connect",
        href: "/dashboard/admin-users-connect",
        icon: FileCog,
        roles: ["admin"],
      },
    ],
  },
  {
    label: "COACH",
    items: [
      {
        name: "My Trainees",
        href: "/dashboard/coach-my-trainees",
        icon: User,
        roles: ["coach"],
      },
      {
        name: "Workouts",
        href: "/dashboard/coach-workouts",
        icon: Workflow,
        roles: ["coach"],
      },
      {
        name: "Earning",
        href: "/dashboard/coach-earning",
        icon: CircleDollarSign,
        roles: ["coach"],
      },
      {
        name: "Schedule",
        href: "/dashboard/coach-schedule",
        icon: Calendar,
        roles: ["coach"],
      },
      {
        name: "Reviews",
        href: "/dashboard/coach-reviews",
        icon: Star,
        roles: ["coach"],
      },
    ],
  },
  {
    label: "ACCOUNT",
    items: [
      {
        name: "Settings",
        href: "/dashboard/settings",
        icon: Settings,
        roles: ["user", "admin", "coach"],
      },
    ],
  },
];
