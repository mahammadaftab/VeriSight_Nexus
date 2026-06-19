import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = {
  title: "VeriSight Nexus — Multi-Modal Evidence Intelligence Platform",
  description:
    "NexusVerify combines Vision AI, Evidence Intelligence, Risk Analytics, and Multi-Agent Reasoning to automate damage claim verification with explainable decisions. Enterprise-grade claim intelligence for insurance, warranty, and logistics.",
  keywords: [
    "AI claim verification",
    "evidence intelligence",
    "damage detection",
    "multi-modal AI",
    "insurance automation",
    "computer vision",
    "claim review automation",
    "enterprise AI",
  ],
  authors: [{ name: "VeriSight Nexus" }],
  openGraph: {
    title: "VeriSight Nexus — Multi-Modal Evidence Intelligence Platform",
    description:
      "Transform images, claims, and history into trusted, explainable decisions with NexusVerify.",
    type: "website",
    siteName: "VeriSight Nexus",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "VeriSight Nexus — Evidence Intelligence Platform",
    description:
      "AI-powered damage claim verification with explainable decisions.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`}>
      <body className="bg-space-900 text-white antialiased">
        {/* Noise texture overlay */}
        <div className="noise-overlay" />
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
