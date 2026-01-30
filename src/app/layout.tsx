import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import BottomNav from "@/components/navigation/BottomNav";
import ChatOverlay from "@/components/chat/ChatOverlay";
import AddSheet from "@/components/add/AddSheet";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "4track",
  description: "Track your life, films, sport, and books",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#0b0b0f] text-white`}
      >
        <div className="mx-auto max-w-md min-h-screen">
          {children}
        </div>
        <BottomNav />
        <ChatOverlay />
        <AddSheet />
      </body>
    </html>
  );
}
