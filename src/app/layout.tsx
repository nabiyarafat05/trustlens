import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TrustLens — Pause. Scan. Know.",
  description:
    "Multimodal AI-powered digital safety assistant. Analyze suspicious screenshots, messages, emails, documents, and URLs with an evidence-first approach.",
  keywords: [
    "digital safety",
    "scam scanner",
    "phishing detection",
    "smishing",
    "cybersecurity assistant",
    "TrustLens",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#080c14] text-slate-100 selection:bg-cyan-500/30 selection:text-cyan-200`}
      >
        {children}
      </body>
    </html>
  );
}
