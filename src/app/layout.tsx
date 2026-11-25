import type { Metadata } from "next";
import { Hanken_Grotesk } from "next/font/google";
import "./globals.css";

const hanken = Hanken_Grotesk({ subsets: ["latin"], variable: "--font-hanken", weight: ["300", "400", "500", "600", "700"] });

export const metadata: Metadata = {
  title: "KYCBridge | The AI decision engine for identity risk",
  description: "KYCBridge analyzes every applicant, predicts fraud, decides who to approve and automates the review queue for banks, credit unions and fintechs.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={hanken.variable} data-scroll-behavior="smooth">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
