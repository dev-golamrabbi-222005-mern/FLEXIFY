import { RoleData } from "./types";

export const coachRole: RoleData = {
  id: "coach",
  num: "02",
  title: "COACH",
  subtitle: "Deliver Elite Training",
  verb: "GUIDE",
  description: "Build your client base. Customize programs. Grow your coaching career.",
  color: "#f0a500",
  features: [
    {
      label: "Apply & Get Approved",
      sub: "Start your journey",
      details: [
        "Submit application form",
        "Reviewed and judged by admin",
        "Browse as user until approved",
      ],
    },
    {
      label: "Customize Packages",
      sub: "Shape the training",
      details: [
        "View all available packages",
        "Modify workout programs",
        "Create custom exercise sets",
      ],
    },
    {
      label: "Client Management",
      sub: "Track who you train",
      details: [
        "Client list via CS Tokens",
        "Log trainee progress & attendance",
        "Direct client messaging",
      ],
    },
    {
      label: "Video & Calls",
      sub: "Live coaching sessions",
      details: [
        "1-on-1 video consultations",
        "Live form check & feedback",
        "Scheduled call slots",
      ],
    },
    {
      label: "Review System",
      sub: "Build your reputation",
      details: [
        "Receive client reviews",
        "Display public coach rating",
        "Earn client trust badges",
      ],
    },
  ],
  highlight: {
    icon: "🎯",
    title: "CS Token — Client Connection",
    text: "Clients connect with you using their Coach Selection Token upon upgrading to a paid tier. Once connected, you get full access to their dashboard, logs, and a direct line for video and chat.",
    stats: [
      { val: "1:1", label: "Direct Access" },
      { val: "HD", label: "Video Calls" },
      { val: "★4.9", label: "Avg Rating" },
    ],
  },
};
