"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { FiMenu, FiX } from "react-icons/fi";
import ThemeToggle from "./TheamToggle";

const Navbar = () => {
  const [open, setOpen] = useState(false);
const pathname = usePathname();

    const navLinks = [
    { name: "Home", path: "/" },
    { name: "How it Works", path: "/how-it-works" },
    { name: "Success Stories", path: "/success-stories" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
    { name: "Pricing", path: "/pricing" },
  ];

  return (
    <nav className="bg-[#F8F4E3] text-[#374151] dark:bg-[#191919] dark:text-[#E5E7EB] shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
        <Image src="/logo.png" alt="logo" width={140} height={140} />
          {/* Light Logo */}
      {/* <Image
        src="/logo-light.png"
        alt="Flexify Logo"
        width={140}
        height={40}
        className="block dark:hidden"
      /> */}

      {/* Dark Logo */}
      {/* <Image
        src="/logo-dark.png"
        alt="Flexify Logo"
        width={140}
        height={40}
        className="hidden dark:block"
      /> */}
        </Link>

      {/* Navigation Links */}
        <ul className="hidden md:flex gap-4 text-sm font-medium">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              href={link.path}
              className={`font-medium transition ${
                pathname === link.path
                  ? "border-b-3 border-blue-600 p-2 rounded-lg"
                  : " hover:text-blue-500 px-3 py-2 rounded-lg"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </ul>
        {/* Auth Buttons */}
        <div className="hidden md:flex gap-4">
        <ThemeToggle />
          
          <Link href="/login" className="border-green-500 px-4 py-1 rounded hover:bg-green-500 hover:text-black transition">
            Login
          </Link>
          {/* <Link href="/signup" className="bg-green-500 text-black px-4 py-1 rounded hover:bg-green-400 transition">
            Register
          </Link> */}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-2xl"
          onClick={() => setOpen(!open)}
        >
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
              className={`font-medium block transition ${
                pathname === link.path
                  ? "border-b-3 border-blue-600 px-3 py-2 rounded-lg"
                  : "hover:text-blue-500 px-3 py-2 rounded-lg"
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

