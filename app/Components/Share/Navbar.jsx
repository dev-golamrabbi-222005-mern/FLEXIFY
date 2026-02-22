"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { FiMenu, FiX } from "react-icons/fi";
import ThemeToggle from "./ThemeToggle";
import { motion } from "framer-motion";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "How it works", path: "/howItWorks"},
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
    { name: "Pricing", path: "/pricing" },
  ];

  return (
    <nav className="bg-[var(--bg-nav-footer)] sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-1 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.png" alt="logo" width={140} height={140} />
        </Link>

        {/* Navigation Links */}
        <ul className="hidden md:flex gap-4 text-sm font-medium">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              href={link.path}
              className={`transition text-[var(--primary)] ${
                pathname === link.path
                  ? "border-b-3 border-(--border-highlight) font-bold p-2 rounded-lg"
                  : " hover:text-(--secondary) px-3 py-2 rounded-lg"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </ul>
        {/* Auth Buttons */}
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              href="/auth-login"
              className="btn-primary text-[1.05rem] font-semibold text-center"
            >
              Get Started
            </Link>
          </motion.div>
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden text-2xl" onClick={() => setOpen(!open)}>
          {open ? <FiX /> : <FiMenu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden px-6 pb-6 space-y-4 text-sm w-44">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              href={link.path}
              className={`font-medium block transition text-[var(--primary)] ${
                pathname === link.path
                  ? "border-b-3 border-blue-600 px-3 py-2 rounded-lg"
                  : "hover:text-(--secondary) px-3 py-2 rounded-lg"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
