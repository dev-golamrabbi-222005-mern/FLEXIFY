import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import "../../styles/globals.css"



import Navbar from "./components/Share/Navbar";
import Footer from "./components/Share/Footer";
import ReactQueryProvider from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Flexify",
  description: "A fitness Planner Platform.",
  icons: {
    icon: '/favicon.ico',
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased `}
      >
        <ReactQueryProvider>
          <Navbar/>
          {children}
          <Footer />
        </ReactQueryProvider>
      </body>
    </html>
  );
}

