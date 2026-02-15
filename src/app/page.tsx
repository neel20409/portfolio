// src/app/page.tsx
"use client";
import { useRef, useEffect, useState } from "react";
import Content from "@/components/content";
import NightSky from "@/components/NightSky";
import JourneySection from "@/components/JourneySection";
import TechSlider from "@/components/TechSlider";
import ProjectSection from "@/components/ProjectSection";
import ContactSection from "@/components/ContactSection";

import SocialModal from "@/components/SocialModel"; // Ensure this component is created
import { FloatingNav } from "@/components/ui/floating-navbar";
import { IconHome, IconMessage, IconUser } from "@tabler/icons-react";
import  {PulseBeam} from "@/components/ui/PulseBeam";

import { AvatarPointer } from "@/components/AvatarPointer"; // Ensure this component is created
import dynamic from 'next/dynamic';

// Dynamically import the AvatarController (or whatever component holds your Scene/Canvas)
const AvatarController = dynamic(
  () => import('@/components/canvas/AvatarController'),
  { ssr: false } // This is the key: it prevents the component from running during build/SSR
);


export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
 const navItems = [
    {
      name: "Home",
      link: "/",
      icon: <IconHome className="h-4 w-4 text-neutral-500 dark:text-white" />,
    },
    {
      name: "About",
      link: "/about",
      icon: <IconUser className="h-4 w-4 text-neutral-500 dark:text-white" />,
    },
    {
      name: "Contact",
      link: "#contact",
      icon: (
        <IconMessage className="h-4 w-4 text-neutral-500 dark:text-white" />
      ),
    },
  ];
  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    window.scrollTo(0, 0);
  }, []);

  return (
    <main ref={containerRef} className="relative bg-transparent overflow-x-hidden">
       
      <NightSky /> 
     <AvatarPointer>
        <div className="relative">
           <AvatarController />
        </div>
      </AvatarPointer>
      <FloatingNav navItems={navItems} />
      {/* FIXED GLOBAL FOOTER UI */}
      <div className="fixed bottom-5 md:bottom-10 left-0 w-full px-6 md:px-10 flex justify-between items-end z-50 pointer-events-none">
        <div className="flex-1" /> 
        <PulseBeam/>
        <div className="flex-1 flex justify-end">
          <a href="/cv.pdf" download="..." className="pointer-events-auto text-gray-400 hover:text-white transition-colors text-xs md:text-sm font-medium">
            CV ↓
          </a>
        </div>
      </div>

      <SocialModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      {/* SECTIONS */}
      <section id="hero" className="relative h-screen w-full flex items-center z-10">
        <div className="w-full md:w-1/2 px-6 md:px-10 lg:px-20">
          <Content onCVClick={() => console.log("CV Downloaded")} />
        </div>
      </section>

      <section id="journey" className="relative z-10"><JourneySection /></section>
      <section id="tech" className="relative z-20 bg-[#00000]/10 backdrop-blur-s"><TechSlider /></section>
      <section id="projects" className="relative z-10"><ProjectSection /></section>

      <section id="contact" className="relative z-10"><ContactSection /></section>
      
    </main>
  );
}