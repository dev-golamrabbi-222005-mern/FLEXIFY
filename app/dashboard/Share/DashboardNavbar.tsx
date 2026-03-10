"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import ThemeToggle from "./ThemeToggle";
import { BellDot } from "lucide-react";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";

interface DashboardNavbarProps {
  sidebarOpen: boolean;
  onMenuToggle: () => void;
}

const DashboardNavbar = ({
  sidebarOpen,
  onMenuToggle,
}: DashboardNavbarProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const formatDate = (date: Date) =>
    date.toLocaleDateString("en-GB", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  const changeDay = (type: "prev" | "next") => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + (type === "next" ? 1 : -1));
    setCurrentDate(newDate);
  };

  return (
    <nav className="bg-[var(--bg-nav-footer)] sticky top-0 z-50 shadow-md w-full">
      <div className="flex items-center justify-between px-4 py-2 w-full">
        {/* ── Logo ── */}
        <Link href="/" className="flex items-center shrink-0">
          <Image
            src="/Logo-Flexify.png"
            alt="Flexify"
            width={100}
            height={100}
            className="w-24 md:w-28"
          />
        </Link>

        {/* ── Date Navigator — sm+ ── */}
        <div className="hidden sm:flex items-center gap-3 px-3 py-2 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)]">
          <CalendarDays
            className="text-[var(--text-secondary)] shrink-0"
            size={18}
          />
          <div className="leading-tight">
            <p className="text-[10px] text-[var(--primary)] font-bold uppercase tracking-wide">
              Day {currentDate.getDate()}, Week{" "}
              {Math.ceil(currentDate.getDate() / 7)}
            </p>
            <p className="text-xs text-[var(--text-secondary)]">
              {formatDate(currentDate)}
            </p>
          </div>
          <div className="flex items-center gap-1 ml-1">
            <button
              onClick={() => changeDay("prev")}
              className="p-1 rounded-lg hover:bg-[var(--bg-primary)] transition-colors"
            >
              <ChevronLeft size={16} className="text-[var(--text-secondary)]" />
            </button>
            <button
              onClick={() => changeDay("next")}
              className="p-1 rounded-lg hover:bg-[var(--bg-primary)] transition-colors"
            >
              <ChevronRight
                size={16}
                className="text-[var(--text-secondary)]"
              />
            </button>
          </div>
        </div>

        {/* ── Right Actions ── */}
        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeToggle />

          <button className="p-2 rounded-lg hover:bg-[var(--bg-secondary)] transition-colors">
            <BellDot className="w-5 h-5 text-[var(--text-primary)]" />
          </button>

          {/* ── Hamburger — triggers sidebar, mobile & tablet only ── */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-[var(--bg-secondary)] transition-colors"
            onClick={onMenuToggle}
            aria-label="Toggle menu"
          >
            {sidebarOpen ? (
              <FiX className="w-5 h-5 text-[var(--text-primary)]" />
            ) : (
              <FiMenu className="w-5 h-5 text-[var(--text-primary)]" />
            )}
          </button>
        </div>
      </div>

      {/* ── Mobile date strip — xs only ── */}
      <div className="sm:hidden w-full flex items-center justify-between px-4 py-2 border-t border-[var(--border-color)] bg-[var(--bg-secondary)]">
        <div className="flex items-center gap-2">
          <CalendarDays size={14} className="text-[var(--text-secondary)]" />
          <p className="text-[11px] font-semibold text-[var(--text-secondary)]">
            {formatDate(currentDate)}
          </p>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => changeDay("prev")}
            className="p-1 rounded hover:bg-[var(--bg-primary)] transition-colors"
          >
            <ChevronLeft size={14} className="text-[var(--text-secondary)]" />
          </button>
          <span className="text-[11px] font-bold text-[var(--primary)] px-1">
            Day {currentDate.getDate()}
          </span>
          <button
            onClick={() => changeDay("next")}
            className="p-1 rounded hover:bg-[var(--bg-primary)] transition-colors"
          >
            <ChevronRight size={14} className="text-[var(--text-secondary)]" />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default DashboardNavbar;
