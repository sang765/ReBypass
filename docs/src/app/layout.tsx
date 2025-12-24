import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ThemeToggle from "../components/ThemeToggle";

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
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100`}
      >
        <header className="bg-blue-600 dark:bg-blue-800 text-white p-4">
          <nav className="container mx-auto flex justify-between items-center">
            <h1 className="text-xl font-bold">ReBypass</h1>
            <div className="flex items-center space-x-4">
              <a href="#home" className="hover:underline">Trang chủ</a>
              <a href="#domains" className="hover:underline">Tên miền</a>
              <a href="https://github.com/sang765/ReBypass" className="hover:underline">GitHub</a>
              <ThemeToggle />
            </div>
          </nav>
        </header>
        <main className="flex-1">
          {children}
        </main>
        <footer className="bg-gray-200 dark:bg-gray-800 text-center p-4">
          <p>&copy; 2024 ReBypass. Liên hệ: <a href="mailto:your@email.com" className="text-blue-600">your@email.com</a></p>
          <p><a href="https://github.com/sang765/ReBypass" className="text-blue-600">GitHub Repository</a></p>
        </footer>
      </body>
    </html>
  );
}
