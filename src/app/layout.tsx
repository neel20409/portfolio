import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import CommandPalette from "@/components/CommandPalette";
import MagneticCursor from "@/components/MagneticCursor";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Neel Bhatt | Full-Stack & 3D Web Developer Portfolio",
  description: "Personal portfolio of Neel Bhatt — Full-Stack Engineer specializing in Next.js, NestJS, PostgreSQL, React Native & 3D Interactive Web Experiences.",
  keywords: [
    "Neel Bhatt",
    "Neel Bhatt Portfolio",
    "Full-Stack Developer",
    "Next.js Developer",
    "Three.js Developer",
    "React Native Developer",
    "NestJS",
    "PostgreSQL",
    "OBIX 360",
    "Software Engineer",
  ],
  authors: [{ name: "Neel Bhatt", url: "https://github.com/neel20409" }],
  creator: "Neel Bhatt",
  verification: {
    google: "googleae932ab363d7543c",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Neel Bhatt | Full-Stack & 3D Web Developer",
    description: "Personal portfolio showcasing production SaaS architectures, mobile applications, and 3D web experiences.",
    images: ["/proof/obix.jpeg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Neel Bhatt | Developer Portfolio",
    description: "Full-Stack Developer & 3D Interactive Specialist.",
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
        <MagneticCursor />
        <CommandPalette />
        <main className="content-layer">
          {children}
        </main>
      </body>
    </html>
  );
}