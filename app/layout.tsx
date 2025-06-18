import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/app/Navbar";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Samparka Records",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body
        style={{
          backgroundColor: "#f9fafb",
          minHeight: "100vh",
          fontFamily: "var(--font-geist-sans), sans-serif",
          margin: 0,
          padding: 0,
        }}
      >
        <Navbar /> {/* ✅ use the component here */}

        <main
          style={{
            maxWidth: "72rem",
            margin: "0 auto",
            padding: "1.5rem",
          }}
        >
          {children}
        </main>
      </body>
    </html>
  );
}
