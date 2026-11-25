"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { FiMenu, FiX } from "react-icons/fi";
import { motion } from "framer-motion";
import { signOut, useSession } from "next-auth/react";
import ThemeToggle from "./ThemeToggle";
import { NavTabletMenu } from "./NavTabletMenu";
import { NavMobileDrawer } from "./NavMobileDrawer";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const { status } = useSession();
  const isLoggedIn = status === "authenticated";

  const baseLinks = [
    { name: "Home", path: "/" },
    { name: "Exercises", path: "/exercises" },
    { name: "Coaches", path: "/coaches" },
    { name: "How it works", path: "/howItWorks" },
    { name: "Features", path: "/features" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  const allLinks = isLoggedIn
    ? [...baseLinks, { name: "Dashboard", path: "/dashboard" }]
    : baseLinks;

  const tabletPrimary = [
    { name: "Home", path: "/" },
    { name: "Exercises", path: "/exercises" },
    { name: "Coaches", path: "/coaches" },
    ...(isLoggedIn ? [{ name: "Dashboard", path: "/dashboard" }] : []),
  ];

  const tabletSecondary = allLinks.filter(
    (l) => !tabletPrimary.some((p) => p.path === l.path)
  );

  const activeCls =
    "border-b-2 border-[var(--border-highlight)] font-bold px-2.5 py-1.5 rounded-lg text-[var(--primary)] text-sm";
  const normalCls =
    "hover:text-[var(--primary)] px-2.5 py-1.5 rounded-lg transition-colors text-sm";
  const linkCls = (path: string) => (pathname === path ? activeCls : normalCls);

  return (
    <nav className="bg-[var(--bg-nav-footer)] sticky top-0 z-50 shadow-md">
      <div className="flex items-center justify-between px-4 py-3 mx-auto max-w-7xl">
        <Link href="/" className="flex items-center gap-2 my-2 shrink-0">
          <Image src="/Logo-Flexify.png" alt="logo" width={110} height={110} />
        </Link>

        {/* Desktop links */}
        <ul className="hidden lg:flex gap-0.5 items-center">
          {allLinks.map((link) => (
            <li key={link.path}>
              <Link href={link.path} className={linkCls(link.path)}>
                {link.name}
              </Link>
            </li>
          ))}
        </ul>

        {/* Tablet links + overflow */}
        <NavTabletMenu
          primaryLinks={tabletPrimary}
          secondaryLinks={tabletSecondary}
          pathname={pathname}
          linkCls={linkCls}
        />

        {/* Right action buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <ThemeToggle />

          <motion.button
            className="hidden md:flex btn-primary font-semibold shadow-xl py-2 cursor-pointer"
            whileHover={{
              scale: 1.05,
              boxShadow: "0 10px 40px rgba(16,185,129,0.3)",
            }}
            whileTap={{ scale: 0.95 }}
          >
            {isLoggedIn ? (
              <span onClick={() => signOut()}>Logout</span>
            ) : (
              <Link href="/login">Get Started</Link>
            )}
          </motion.button>

          <button
            className="md:hidden text-2xl p-1 transition-colors cursor-pointer"
            onClick={() => setMobileOpen(!mobileOpen)}
            style={{ color: "var(--text-primary)" }}
          >
            {mobileOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </div>

      <NavMobileDrawer
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        links={allLinks}
        pathname={pathname}
        isLoggedIn={isLoggedIn}
        onSignOut={() => signOut()}
      />
    </nav>
  );
}
