import type { Metadata } from "next";
import { Geist, Geist_Mono, Public_Sans } from "next/font/google";
import { AsgardeoProvider } from '@asgardeo/nextjs/server';
import "./globals.css";

const publicSans = Public_Sans({ subsets: ['latin'], variable: '--font-sans' });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "OpenATS",
  description: "Modern Applicant Tracking System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={publicSans.variable}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased overflow-x-hidden`}
      >
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        <AsgardeoProvider>{children as any}</AsgardeoProvider>
      </body>
    </html>
  );
}
