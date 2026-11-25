"use client";

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { MoreHorizontal } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface NavLinkItem {
  name: string;
  path: string;
}

interface NavTabletMenuProps {
  primaryLinks: NavLinkItem[];
  secondaryLinks: NavLinkItem[];
  pathname: string;
  linkCls: (path: string) => string;
}

export function NavTabletMenu({
  primaryLinks,
  secondaryLinks,
  pathname,
  linkCls,
}: NavTabletMenuProps) {
  const [dotMenuOpen, setDotMenuOpen] = useState(false);
  const dotMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dotMenuRef.current && !dotMenuRef.current.contains(e.target as Node)) {
        setDotMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="hidden md:flex lg:hidden items-center gap-0.5">
      {primaryLinks.map((link) => (
        <Link key={link.path} href={link.path} className={linkCls(link.path)}>
          {link.name}
        </Link>
      ))}

      {secondaryLinks.length > 0 && (
        <div className="relative ml-1" ref={dotMenuRef}>
          <button
            onClick={() => setDotMenuOpen((o) => !o)}
            className="w-9 h-9 flex items-center justify-center rounded-xl transition-colors cursor-pointer"
            style={{
              color: dotMenuOpen ? "var(--primary)" : "var(--text-secondary)",
              background: dotMenuOpen ? "var(--bg-secondary)" : "transparent",
            }}
            aria-label="More navigation links"
          >
            <MoreHorizontal size={20} />
          </button>

          <AnimatePresence>
            {dotMenuOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.93, y: -4 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.93, y: -4 }}
                transition={{
                  duration: 0.16,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="absolute right-0 top-full mt-2 w-48 rounded-2xl overflow-hidden shadow-2xl"
                style={{
                  background: "var(--bg-secondary)",
                  border: "1px solid var(--border-color)",
                  zIndex: 100,
                }}
              >
                <div className="py-2">
                  {secondaryLinks.map((link, i) => {
                    const isActive = pathname === link.path;
                    return (
                      <motion.div
                        key={link.path}
                        initial={{ opacity: 0, x: -6 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.04 }}
                      >
                        <Link
                          href={link.path}
                          onClick={() => setDotMenuOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium transition-colors hover:bg-[var(--bg-primary)]"
                          style={{
                            color: isActive ? "var(--primary)" : "var(--text-primary)",
                            fontWeight: isActive ? 700 : 500,
                          }}
                        >
                          {isActive && (
                            <span
                              className="w-1.5 h-1.5 rounded-full shrink-0"
                              style={{ background: "var(--primary)" }}
                            />
                          )}
                          {link.name}
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
