import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import MatrixBackground from "../components/MatrixBackground";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BYPASS.VIP Userscript (Remake)",
  description: "Bypass ad-links using the bypass.vip API and get to your destination without ads! A remake of the official userscript.",
  keywords: "userscript, bypass, ad-links, bypass.vip, remake",
  authors: [{ name: "sang765" }],
  openGraph: {
    title: "BYPASS.VIP Userscript (Remake)",
    description: "Automatic bypass of ad-links on supported sites using bypass.vip API.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <MatrixBackground />
        {children}
      </body>
    </html>
  );
}
