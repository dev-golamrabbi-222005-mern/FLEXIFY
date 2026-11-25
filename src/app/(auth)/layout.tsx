import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ToastContainer } from "react-toastify";
import ReactQueryProvider from "../(website)/providers";
import { AuthShowcase } from "@/components/auth/AuthShowcase";

export const metadata: Metadata = {
  title: "Flexify - Authentication",
  description: "Secure login and registration for Flexify fitness platform.",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ReactQueryProvider>
      <div className="min-h-screen w-full flex flex-col lg:flex-row bg-[#080b11] text-white relative overflow-hidden">
        {/* Floating Top-Left Flexify Logo */}
        <Link
          href="/"
          className="absolute top-6 left-6 z-50 flex items-center gap-2.5 px-3 py-2 rounded-xl bg-black/40 hover:bg-black/60 backdrop-blur-md border border-white/10 text-white/80 hover:text-white transition-all group shadow-lg"
        >
          <Image
            src="/Logo-Flexify.png"
            alt="Flexify Logo"
            width={95}
            height={32}
            className="object-contain"
          />
          <span className="hidden sm:inline-flex items-center text-xs font-semibold text-gray-300 group-hover:text-emerald-400 transition-colors gap-1 border-l border-white/10 pl-2.5 ml-1">
            ← Back to Home
          </span>
        </Link>

        {/* Left Side (50% on Desktop): Interactive Showcase */}
        <div className="hidden lg:flex lg:w-1/2 relative bg-[#07090e] border-r border-white/5 items-center justify-center p-8 xl:p-14 overflow-hidden">
          <AuthShowcase />
        </div>

        {/* Right Side (50% on Desktop): Form with background intact */}
        <div className="w-full lg:w-1/2 relative flex items-center justify-center min-h-screen overflow-y-auto">
          {children}
        </div>

        <ToastContainer />
      </div>
    </ReactQueryProvider>
  );
}
