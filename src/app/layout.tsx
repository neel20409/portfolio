import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Neel Bhatt | 3D Portfolio",
  description: "Next.js & Framer Motion 3D Portfolio",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* Navigation is usually shared across all pages */}
        <nav className="fixed top-0 w-full z-50">
          {/* We will build this next */}
        </nav>

        <main className="content-layer">
          {children}
        </main>
      </body>
    </html>
  );
}