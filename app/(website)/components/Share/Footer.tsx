"use client"
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaFacebookF, FaLinkedinIn, FaGithub, FaMediumM } from "react-icons/fa";

const Footer = () => {
  const pathname = usePathname();

  const linkClass = (path: string) =>
    `cursor-pointer hover:text-[var(--secondary)] ${
      pathname === path ? "text-[var(--secondary)] font-semibold" : ""
    }`;

  return (
    <footer className="pt-10 shadow-md bg-[var(--bg-nav-footer)] border-t-2 border-[#add4c7]">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Left Section */}
        <div>
          <Link href="/" className="flex items-center gap-2 mb-4">
            <Image
              src="/Logo-Flexify.png"
              alt="logo"
              width={123}
              height={123}
            />
          </Link>
          <p className="text-sm leading-relaxed">
            <strong>A fitness Planner Platform</strong> <br /> that helps users
            create personalized workout plans, track their progress, and achieve
            their fitness goals with ease.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="font-semibold mb-4">Quick Links</h3>

          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/" className={linkClass("/")}>
                Home
              </Link>
            </li>

            <li>
              <Link href="/services" className={linkClass("/services")}>
                All Services
              </Link>
            </li>

            <li>
              <Link href="/about" className={linkClass("/about")}>
                About
              </Link>
            </li>

            <li>
              <Link href="/contact" className={linkClass("/contact")}>
                Contact Us
              </Link>
            </li>
            <li>
              <Link
                href="/terms-privacy"
                className={linkClass("/terms-privacy")}
              >
                Terms & Privacy
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="font-semibold mb-4">Contact Us</h3>
          <p className="text-sm mb-2">Email: info@flexify.com</p>
          <p className="text-sm mb-4">Phone: +8801 23456789</p>

          <div className="flex gap-4 text-lg">
            <FaFacebookF className="hover:text-(--secondary) cursor-pointer" />
            <FaLinkedinIn className="hover:text-(--secondary) cursor-pointer" />
            <FaGithub className="hover:text-(--secondary) cursor-pointer" />
            <FaMediumM className="hover:text-(--secondary) cursor-pointer" />
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t-2 border-[#add4c7] mt-10">
        <p className="text-center text-[15px] font-semibold py-5 text-gray-500">
          © 2026 Flexify. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
