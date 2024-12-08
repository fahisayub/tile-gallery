import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Mukalel Paving Stone & Tiles - Premium Natural Stone & Tiles in Kotamangalam",
  description: "Leading stone and tile provider in Pallarimangalam, Kotamangalam. Visit our showroom for premium natural stones, tiles, and expert installation services.",
  keywords: "Mukalel Paving Stone & Tiles, Pallarimangalam, Kotamangalam, Kerala, natural stone, tiles, paving",
  openGraph: {
    title: "Mukalel Paving Stone & Tiles - Premium Natural Stone & Tiles in Kotamangalam",
    description: "Leading stone and tile provider in Pallarimangalam, Kotamangalam",
    images: ['/mlogo.png'],
  },
  icons: {
    icon: [
      {
        url: '/Mlogoonly.png',
        href: '/Mlogoonly.png',
      }
    ],
    shortcut: '/Mlogoonly.png',
    apple: '/Mlogoonly.png',
    other: {
      rel: 'apple-touch-icon-precomposed',
      url: '/Mlogoonly.png',
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-stone-50`} suppressHydrationWarning>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
