import type { Metadata } from "next";
import { Hanken_Grotesk } from "next/font/google";
import "./globals.css";

const hanken = Hanken_Grotesk({ subsets: ["latin"], variable: "--font-hanken", weight: ["300", "400", "500", "600", "700"] });

export const metadata: Metadata = {
  title: "KYCBridge | Full-lifecycle identity & fraud intelligence",
  description: "KYCBridge is the AI-powered identity and fraud prevention platform that accelerates onboarding, stops fraud and simplifies compliance.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={hanken.variable}>
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
