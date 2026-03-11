import type { Metadata } from "next";

import "../../styles/globals.css"

import Navbar from "./components/Share/Navbar";
import Footer from "./components/Share/Footer";
import ReactQueryProvider from "./providers";

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
        <ReactQueryProvider>
          <Navbar/>
          {children}
          <Footer />
        </ReactQueryProvider>
  );
}

