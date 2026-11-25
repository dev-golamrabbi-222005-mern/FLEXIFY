"use client";

import React from "react";
import Link from "next/link";
import { FiX } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

interface NavLinkItem {
  name: string;
  path: string;
}

interface NavMobileDrawerProps {
  open: boolean;
  onClose: () => void;
  links: NavLinkItem[];
  pathname: string;
  isLoggedIn: boolean;
  onSignOut: () => void;
}

export function NavMobileDrawer({
  open,
  onClose,
  links,
  pathname,
  isLoggedIn,
  onSignOut,
}: NavMobileDrawerProps) {
  return (
    <>
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
        <div className="flex justify-end p-6">
          <button
            onClick={onClose}
            className="text-2xl cursor-pointer"
            style={{ color: "var(--text-primary)" }}
          >
            <FiX />
          </button>
        </div>

        <div className="flex flex-col px-6 space-y-1 text-sm">
          {links.map((link) => (
            <Link
              key={link.path}
              href={link.path}
              onClick={onClose}
              className={`font-medium transition px-3 py-2.5 rounded-xl ${
                pathname === link.path
                  ? "text-[var(--primary)] bg-[var(--bg-secondary)] font-bold"
                  : "text-[var(--text-primary)] hover:text-[var(--primary)] hover:bg-[var(--bg-secondary)]"
              }`}
            >
              {link.name}
            </Link>
          ))}

          <div
            className="pt-3 mt-2 border-t"
            style={{ borderColor: "var(--border-color)" }}
          >
            {isLoggedIn ? (
              <button
                onClick={() => {
                  onSignOut();
                  onClose();
                }}
                className="w-full btn-primary text-center cursor-pointer"
              >
                Logout
              </button>
            ) : (
              <Link
                href="/login"
                onClick={onClose}
                className="block btn-primary text-center cursor-pointer"
              >
                Get Started
              </Link>
            )}
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/50 md:hidden"
          />
        )}
      </AnimatePresence>
    </>
  );
}
