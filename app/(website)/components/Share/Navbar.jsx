"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { FiMenu, FiX } from "react-icons/fi";
import ThemeToggle from "./ThemeToggle";
import { motion } from "framer-motion";
import { signOut, useSession } from "next-auth/react";



const Navbar = () => {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const session = useSession();

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "How it works", path: "/howItWorks"},
    {name: "Features", path: "/features"},
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
    { name: "Dashboard", path: "/dashboard" },
  ];

  return (
    <nav className="bg-[var(--bg-nav-footer)] sticky top-0 z-50 shadow-md">
      <div className="flex items-center justify-between px-2 py-1 mx-auto max-w-7xl">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.png" alt="logo" width={140} height={140} />
        </Link>

        {/* Navigation Links */}
        <ul className="hidden gap-4 text-sm font-medium md:flex">
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
          <motion.button
            className="relative z-10 font-semibold shadow-xl btn-primary"
            whileHover={{
              scale: 1.05,
              boxShadow: "0 10px 40px rgba(249, 115, 22, 0.3)",
            }}
            whileTap={{ scale: 0.95 }}
          >
            {session?.status === "authenticated" ? <span onClick={() => signOut()}>Logout</span> : <>
              <Link href={"/register"}>Get Started</Link>
            </>}
          </motion.button>
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

export default Navbar;
