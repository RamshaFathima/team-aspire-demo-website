import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: {
    default: "Team Aspire — Rooted in deen, sisterhood & humanitarian service",
    template: "%s | Team Aspire",
  },
  description:
    "A women-only space rooted in deen, sisterhood & humanitarian service. Building community for 10+ years — projects, courses, and giving that changes lives.",
  icons: {
    icon: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'%3E%3Ccircle cx='24' cy='24' r='24' fill='%23faf6ef'/%3E%3Cpath d='M27.2 8.5c-1.4 3.8-4.2 6.7-6.4 10-2.2 3.3-3.9 7-3.6 11.1.3 3.4 2 6.6 4.6 8.7.9.8 2 1.4 3.2 1.9-2-2.3-3.1-5.4-2.8-8.5.3-3.3 2-6.2 3.9-8.8 2-2.9 4-5.9 4.5-9.5.3-1.8 0-3.5-.8-5.1-.7.1-1.9-.5-2.6.2z' fill='%237a2231'/%3E%3C/svg%3E",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body className="flex min-h-screen flex-col font-sans">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
