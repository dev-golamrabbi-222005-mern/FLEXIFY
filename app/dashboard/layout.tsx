import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import "../../styles/globals.css"
// import Providers from "./providers";
import DashboardNavbar from "./Share/DashboardNavbar";
import Providers from "../(website)/providers";
import Sidebar from "./sidebar/Sidebar";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Flexify | Dashboard",
  description: "A fitness Planner Platform.",
  icons: {
    icon: '/favicon.ico'
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
     <html lang="en" suppressHydrationWarning>

      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <div className="min-h-screen max-w-7xl mx-auto">
            <div className="sticky top-0 z-50 shadow-md">
              {/* TOP NAVBAR */}
              <DashboardNavbar />
            </div>

            

            {/* RIGHT CONTENT */}
            <div className="flex flex-1">
              {/* SIDEBAR */}
            <aside className="w-64 shrink-0">
              <Sidebar />
            </aside>
              

              {/* PAGE CONTENT */}
              <main className="flex-1 min-w-0 p-6 bg-[var(--bg-primary)]">
                {children}
              </main>

            </div>
          </div>
        </Providers>
      </body>
      </html>
  );
}

