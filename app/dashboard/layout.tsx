import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import "../../styles/globals.css"
import Providers from "./providers";
import DashboardNavbar from "./Share/DashboardNavbar";


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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
     <html lang="en" suppressHydrationWarning>

      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased `}
      >
        <Providers>
          <DashboardNavbar />
          {children}
        </Providers>
      </body>
      </html>
  );
}

