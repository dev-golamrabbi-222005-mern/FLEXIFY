import Image from "next/image";
import Link from "next/link";
import { FaFacebookF, FaLinkedinIn, FaGithub, FaMediumM } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="pt-10 shadow-md bg-[#F8F4E3] text-[#374151] dark:bg-[#191919] dark:text-[#E5E7EB]  ">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-10">

        {/* Left Section */}
        <div>
          <Link href="/" className="flex items-center gap-2 mb-4">
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
          <p className="text-sm leading-relaxed">
           A fitness Planner Platform <br /> that helps users create personalized workout plans, track their progress, and achieve their fitness goals with ease.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="font-semibold mb-4">
            Quick Links
          </h3>
          <ul className="space-y-2 text-sm">
            <li className="hover:text-white cursor-pointer">Home</li>
            <li className="hover:text-white cursor-pointer">All Services</li>
            <li className="hover:text-white cursor-pointer">About</li>
            <li className="hover:text-white cursor-pointer">Contact Us</li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="font-semibold mb-4">
            Contact Us
          </h3>
          <p className="text-sm mb-2">
            Email: info@flexify.com
          </p>
          <p className="text-sm mb-4">
            Phone: +8801 23456789
          </p>

          <div className="flex gap-4 text-lg">
            <FaFacebookF className="hover:text-white cursor-pointer" />
            <FaLinkedinIn className="hover:text-white cursor-pointer" />
            <FaGithub className="hover:text-white cursor-pointer" />
            <FaMediumM className="hover:text-white cursor-pointer" />
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-600 mt-10">
        <p className="text-center text-sm py-5 text-gray-400">
          © 2026 Flexify. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
