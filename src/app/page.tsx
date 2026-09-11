// src/app/page.tsx
"use client";
import { useRef, useEffect, useState } from "react";
import Content from "@/components/content";
import NightSky from "@/components/NightSky";
import JourneySection from "@/components/JourneySection";
import TechSlider from "@/components/TechSlider";
import ProjectSection from "@/components/ProjectSection";
import ContactSection from "@/components/ContactSection";

import SocialModal from "@/components/SocialModel";
import { FloatingNav } from "@/components/ui/floating-navbar";
import { IconHome, IconMessage, IconUser } from "@tabler/icons-react";
import { PulseBeam } from "@/components/ui/PulseBeam";
import { AvatarPointer } from "@/components/AvatarPointer";
import dynamic from 'next/dynamic';
import { ScrollIndicator } from "@/components/ui/ScrollIndicator";
import AudioVisualizer from "@/components/AudioVisualizer";
import OrbitConsole, { DISCIPLINE_SIGNALS } from "@/components/OrbitConsole";
import HoloBeam from "@/components/HoloBeam";
import OverdriveOverlay from "@/components/OverdriveOverlay";
import MetricsBentoGrid from "@/components/MetricsBentoGrid";
import GithubCommitChart from "@/components/GithubCommitChart";
import DataLabPlayground from "@/components/DataLabPlayground";

// Dynamically import the AvatarController
const AvatarController = dynamic(
  () => import('@/components/canvas/AvatarController'),
  { ssr: false }
);

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeDiscipline, setActiveDiscipline] = useState(0);
  const [isOverdrive, setIsOverdrive] = useState(false);

  const navItems = [
    {
      name: "Home",
      link: "/",
      icon: <IconHome className="h-4 w-4 text-neutral-400 dark:text-white" />,
    },
    {
      name: "About",
      link: "/about",
      icon: <IconUser className="h-4 w-4 text-neutral-400 dark:text-white" />,
    },
    {
      name: "Contact",
      link: "#contact",
      icon: <IconMessage className="h-4 w-4 text-neutral-400 dark:text-white" />,
    },
  ];

  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    window.scrollTo(0, 0);
  }, []);

  return (
    <main ref={containerRef} className="relative bg-transparent overflow-x-hidden min-h-screen">
      <NightSky />
      <OverdriveOverlay isActive={isOverdrive} />
      
      <AvatarPointer>
        <div className="relative">
          <AvatarController />
        </div>
      </AvatarPointer>

      {/* Hologram Projection Beam from 3D Avatar to Orbit Console */}
      <HoloBeam 
        isOverdrive={isOverdrive} 
        activeColor={DISCIPLINE_SIGNALS[activeDiscipline]?.themeColor || "#38bdf8"} 
      />

      <FloatingNav navItems={navItems} />

      {/* FIXED GLOBAL BOTTOM HUD DOCK */}
      <div className="fixed bottom-3 sm:bottom-6 md:bottom-8 inset-x-0 w-full px-3 sm:px-6 md:px-10 flex justify-between items-center z-50 pointer-events-none max-w-7xl mx-auto">
        {/* Left: Audio Visualizer Control */}
        <div className="flex-1 flex justify-start pointer-events-auto">
          <AudioVisualizer />
        </div>

        {/* Center: Connect Button & Orbital Satellite Dock */}
        <div className="pointer-events-auto flex justify-center">
          <PulseBeam />
        </div>

        {/* Right: View CV Action */}
        <div className="flex-1 flex justify-end pointer-events-auto">
          <a
            href="/NeelBhatt_Resume.pdf"
            download="NeelBhatt_Resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="px-2.5 sm:px-3.5 py-1.5 rounded-full bg-zinc-950/80 border border-white/10 backdrop-blur-xl text-gray-300 hover:text-white transition-colors text-[10px] sm:text-xs md:text-sm font-medium tracking-wide flex items-center gap-1 sm:gap-1.5 group shadow-lg active:scale-95"
          >
            <span>CV</span>
            <span className="hidden sm:inline">VIEW</span>
            <span className="group-hover:translate-y-0.5 transition-transform text-cyan-400">↓</span>
          </a>
        </div>
      </div>

      <SocialModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      {/* HERO SECTION */}
      <section id="hero" className="relative min-h-screen w-full flex flex-col justify-center items-center lg:items-start pt-24 sm:pt-28 pb-16 lg:py-0 z-10">
        <div className="w-full lg:w-1/2 px-3.5 sm:px-6 md:px-10 lg:pl-16 xl:pl-20">
          <Content onCVClick={() => console.log("CV Downloaded")} />

          {/* Inline Mobile Orbit Console (< 1024px) */}
          <OrbitConsole
            activeIndex={activeDiscipline}
            onActiveIndexChange={setActiveDiscipline}
            isOverdrive={isOverdrive}
            onToggleOverdrive={() => setIsOverdrive(prev => !prev)}
            isMobileInline={true}
          />
        </div>

        {/* Desktop Floating Orbit Console (>= 1024px) */}
        <OrbitConsole 
          activeIndex={activeDiscipline}
          onActiveIndexChange={setActiveDiscipline}
          isOverdrive={isOverdrive}
          onToggleOverdrive={() => setIsOverdrive(prev => !prev)}
          isMobileInline={false}
        />

        <div className="hidden md:block">
          <ScrollIndicator />
        </div>
      </section>

      {/* SECTIONS */}
      <section id="journey" className="relative z-10"><JourneySection /></section>
      <section id="projects" className="relative z-10"><ProjectSection /></section>
      <section id="tech" className="relative z-20 bg-black/10 backdrop-blur-xs"><TechSlider /></section>
      <section id="metrics" className="relative z-20"><MetricsBentoGrid /></section>
      <section id="github" className="relative z-20"><GithubCommitChart /></section>
      <section id="datalab" className="relative z-20"><DataLabPlayground /></section>
      <section id="contact" className="relative z-10"><ContactSection /></section>
      
    </main>
  );
}