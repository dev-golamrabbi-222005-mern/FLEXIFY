import { Metadata } from "next";
import DashboardLayoutClient from "./DashboardLayoutClient";
import { ToastContainer } from "react-toastify";

export const metadata: Metadata = {
  title: "Dashboard - Flexify",
  description: "Your personal fitness dashboard.",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayoutClient>
      {children}
      <ToastContainer />
    </DashboardLayoutClient>;
}
