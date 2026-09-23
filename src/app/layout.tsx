import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VELVET HOUR — Nightlife, Dining & Music",
  description:
    "VELVET HOUR — a late-night dining room, bar and music space.",
  keywords: [
    "Velvet Hour",
    "nightlife",
    "restaurant",
    "bar",
    "music",
    "events",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}