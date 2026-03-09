"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { FiMenu, FiX } from "react-icons/fi";
import ThemeToggle from "./ThemeToggle";
import { motion } from "framer-motion";
import { LogOut, BellDot } from "lucide-react";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import { signOut } from "next-auth/react";


const DashboardNavbar = () => {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const [currentDate, setCurrentDate] = useState(new Date());

  // Format Date Function
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-GB", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // Optional: Change Day with Arrows
  const changeDay = (type: "prev" | "next") => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + (type === "next" ? 1 : -1));
    setCurrentDate(newDate);
  };


  const navLinks = [
    { name: "Dashboard", path: "/dashboard" },
    
    
  ];

  return (
    <nav className="bg-[var(--bg-nav-footer)] sticky top-0 z-50 shadow-md">
      <div className="flex items-center justify-between px-2 py-1 mx-auto max-w-7xl">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.png" alt="logo" width={140} height={140} />
        </Link>

        {/* Date & Times */}
        <div className="px-6 py-3 flex items-center justify-between">
          {/* Left Section */}
          <div className="flex items-center gap-4">
            <CalendarDays className="text-gray-400" size={22} />

            <div className="leading-tight">
              <p className="text-xs text-[var(--primary)] font-semibold uppercase tracking-wide">
                Day {currentDate.getDate()}, Week{" "}
                {Math.ceil(currentDate.getDate() / 7)}
              </p>

              <p className="text-sm text-gray-500">
                Today, {formatDate(currentDate)}
              </p>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-3 text-gray-500">
            <button
              onClick={() => changeDay("prev")}
              className="p-2 rounded-full hover:bg-gray-100 transition"
            >
              <ChevronLeft size={20} />
            </button>

            <button
              onClick={() => changeDay("next")}
              className="p-2 rounded-full hover:bg-gray-100 transition"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>


        {/* Navigation Links */}
        <ul className="hidden gap-4 text-sm font-medium md:flex">
          <Link href={"/dashboard"} className="text-xl font-bold">Dashboard</Link>
        </ul>

        <div className="flex items-center gap-4">
          <ThemeToggle />
          <BellDot className="w-6 h-6 cursor-pointer" />
          <LogOut onClick={() => signOut()} className="w-6 h-6 cursor-pointer" />
        </div>

       {/* Mobile Menu Button */}
      <button className="text-2xl md:hidden" onClick={() => setOpen(!open)}>
        {open ? <FiX /> : <FiMenu />}
      </button>
    </div>

    {/* Mobile Menu Drawer */}
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: open ? 0 : "100%" }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="fixed top-0 right-0 z-50 w-64 h-full shadow-2xl md:hidden"
      style={{
        backgroundColor: "var(--bg-nav-footer)",
        borderLeft: "1px solid var(--border-color)",
      }}
    >
      {/* Close button inside drawer */}
      <div className="flex justify-end p-6">
        <button onClick={() => setOpen(false)} className="text-2xl">
          <FiX style={{ color: "var(--text-primary)" }} />
        </button>
      </div>

      {/* Menu Links */}
      <div className="flex flex-col px-6 space-y-4 text-sm">
        {navLinks.map((link) => (
          <Link
            key={link.path}
            href={link.path}
            onClick={() => setOpen(false)}
            className={`font-medium transition px-3 py-2 rounded-lg ${
              pathname === link.path
                ? "text-[var(--success)] bg-[var(--card-bg)]"
                : "text-[var(--primary)] hover:text-[var(--secondary)] hover:bg-[var(--card-bg)]"
            }`}
          >
            {link.name}
          </Link>
        ))}
      </div>
    </motion.div>

    {/* Backdrop Overlay */}
    {open && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setOpen(false)}
        className="fixed inset-0 z-40 bg-black/50 md:hidden"
      />
    )}
    </nav>
  );
};

export default DashboardNavbar;
