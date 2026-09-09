import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { VisitorCounter } from "@/components/VisitorCounter";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Neel Bhatt | 3D Portfolio",
  description: "Personal 3D Developer Portfolio of Neel Bhatt showcasing full-stack and creative projects.",
  verification: {
    google: "googleae932ab363d7543c",
  },
  openGraph: {
    title: "Neel Bhatt | 3D Portfolio",
    description: "Personal 3D Developer Portfolio of Neel Bhatt showcasing full-stack and creative projects.",
    images: ["/og-image.jpg"],
  },
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
          <VisitorCounter />
        </nav>

        <main className="content-layer">
          {children}
        </main>
      </body>
    </html>
  );
}