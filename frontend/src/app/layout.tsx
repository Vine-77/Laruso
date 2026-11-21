import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Newsreader } from "next/font/google";
import "./globals.css";
import "./motion.css";
import MotionRoot from "@/components/motion/MotionRoot";
import SceneTheme from "@/components/motion/SceneTheme";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Laruso — Never lose a returning guest",
  description:
    "A prototype AI assistant that spots hotel guests worth reaching out to, writes them a personal message, and waits for a person to approve it. Example data only.",
};

export const viewport: Viewport = {
  themeColor: "#f6f8ff",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${newsreader.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <MotionRoot />
        <SceneTheme />
        {children}
      </body>
    </html>
  );
}
