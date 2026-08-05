import type { Metadata } from "next";
import { Forum, Almendra, Geist } from "next/font/google";
import "./globals.css";
import Navbar from '@/components/navbar';
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const body = Forum({
  weight: '400',
  subsets: ["latin"],
});

const title = Almendra({
  weight: '700',
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Jennifer's Epic Portfolio",
  description: "#1 software engineer d1 fortnite player and reels scroller",
  icons: {
    icon: '/key-white.webp'
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("font-sans", geist.variable)}>
      <body className={`${body.className} antialiased`}>
        <Navbar/>
        {children}
      </body>
    </html>
  );
}
