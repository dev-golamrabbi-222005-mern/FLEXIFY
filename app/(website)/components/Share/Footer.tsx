"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaFacebookF, FaLinkedinIn, FaGithub, FaMediumM } from "react-icons/fa";

const Footer = () => {
  const pathname = usePathname();

  const linkClass = (path: string) =>
    `cursor-pointer hover:text-[var(--secondary)] transition-colors ${
      pathname === path ? "text-[var(--secondary)] font-semibold" : ""
    }`;

  return (
    <footer className="pt-10 shadow-md bg-[var(--bg-nav-footer)] border-t-2 border-[#add4c7]">
      {/* Updated grid to support 4 columns on large screens */}
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* 1. Left Section */}
        <div>
          <Link href="/" className="flex items-center gap-2 mb-4">
            <Image
              src="/Logo-Flexify.png"
              alt="logo"
              width={123}
              height={123}
            />
          </Link>
          <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
            <strong>A fitness Planner Platform</strong> <br /> that helps users
            create personalized workout plans, track progress, and achieve
            fitness goals with ease.
          </p>
        </div>

        {/* 2. Quick Links */}
        <div>
          <h3 className="font-bold mb-4 text-[var(--text-primary)]">
            Quick Links
          </h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/" className={linkClass("/")}>
                Home
              </Link>
            </li>
            <li>
              <Link href="/exercises" className={linkClass("/services")}>
                All Workouts
              </Link>
            </li>
            <li>
              <Link href="/about" className={linkClass("/about")}>
                About Us
              </Link>
            </li>
            <li>
              <Link href="/contact" className={linkClass("/contact")}>
                Contact Us
              </Link>
            </li>
          </ul>
        </div>

        {/* 3. NEW COLUMN: Resources (Dynamic Content) */}
        <div>
          <h3 className="font-bold mb-4 text-[var(--text-primary)]">
            Resources
          </h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/blogs" className={linkClass("/articles")}>
                Fitness Articles
              </Link>
            </li>
            <li>
              <Link href="/faqs" className={linkClass("/faqs")}>
                Common FAQs
              </Link>
            </li>
            <li>
              <Link href="/nutrition-guide" className={linkClass("/nutrition")}>
                Nutrition Guide
              </Link>
            </li>
            <li>
              <Link
                href="/success-stories"
                className={linkClass("/success-stories")}
              >
                Success Stories
              </Link>
            </li>
          </ul>
        </div>

        {/* 4. Contact */}
        <div>
          <h3 className="font-bold mb-4 text-[var(--text-primary)]">
            Get In Touch
          </h3>
          <p className="text-sm mb-2 text-[var(--text-secondary)]">
            Email: info@flexify.com
          </p>
          <p className="text-sm mb-4 text-[var(--text-secondary)]">
            Phone: +880 1234 567 890
          </p>

          <div className="flex gap-4 text-lg">
            <FaFacebookF className="hover:text-[var(--secondary)] cursor-pointer transition-colors" />
            <FaLinkedinIn className="hover:text-[var(--secondary)] cursor-pointer transition-colors" />
            <FaGithub className="hover:text-[var(--secondary)] cursor-pointer transition-colors" />
            <FaMediumM className="hover:text-[var(--secondary)] cursor-pointer transition-colors" />
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t-2 border-[#add4c7] mt-10">
        <p className="text-center text-[15px] font-semibold py-6 text-gray-500">
          © 2026 Flexify. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
