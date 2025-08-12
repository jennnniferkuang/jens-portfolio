import type { Metadata } from "next";
import { Forum, Almendra } from "next/font/google";
import "./globals.css";
import Navbar from '@/components/navbar';

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
  description: "#1 software engineer unreal fortnite player and reels scroller",
  icons: {
    icon: '/me.png'
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${body.className} antialiased`}>
        <Navbar/>
        {children}
      </body>
    </html>
  );
}
