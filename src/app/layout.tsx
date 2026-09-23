import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VELVET HOUR — Nightlife, Dining & Music",
  description:
    "VELVET HOUR — a late-night dining room, bar and music space in London.",
  keywords: [
    "Velvet Hour",
    "London nightlife",
    "London restaurant",
    "London bar",
    "music",
    "events",
    "late night dining",
  ],
  robots: {
    index: false,
    follow: false,
  },
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