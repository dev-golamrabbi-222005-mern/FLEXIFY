import { RoleData } from "./types";

export const adminRole: RoleData = {
  id: "admin",
  num: "03",
  title: "ADMIN",
  subtitle: "Orchestrate the Platform",
  verb: "MANAGE",
  description: "Full platform visibility. Coach vetting. Revenue operations.",
  color: "#3B82F6",
  features: [
    {
      label: "Coach Center",
      sub: "Vet the talent",
      details: [
        "Incoming application queue",
        "Verify credentials & experience",
        "Approve, reject, or request info",
      ],
    },
    {
      label: "User Management",
      sub: "Total visibility",
      details: [
        "Browse all registered users",
        "View subscription tiers",
        "Manage roles & account status",
      ],
    },
    {
      label: "Payments & Revenue",
      sub: "Financial pulse",
      details: [
        "7-day rolling transaction view",
        "Success, pending & refund status",
        "Filter by plan, user, or date",
      ],
    },
    {
      label: "Coaches & Tokens",
      sub: "Connection oversight",
      details: [
        "Track active CS Token assignments",
        "Reassign or revoke tokens",
        "Monitor coach client loads",
      ],
    },
    {
      label: "Platform Control",
      sub: "System governance",
      details: [
        "View system health & audit logs",
        "Broadcast system announcements",
        "Role-based permission controls",
      ],
    },
  ],
  highlight: {
    icon: "⚡",
    title: "Complete Ecosystem Oversight",
    text: "When a user purchases membership, they receive a Coach Selection Token to connect with a specific coach. Admins oversee all token assignments via a dedicated coaches page.",
    stats: [
      { val: "100%", label: "Control" },
      { val: "7d", label: "Payment View" },
      { val: "∞", label: "Scalability" },
    ],
  },
};
