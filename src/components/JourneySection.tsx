"use client";
import React, { useRef } from 'react';
import { motion, useScroll, useSpring, useTransform, MotionValue } from 'framer-motion';

interface JourneyCardProps {
  year: string;
  title: string;
  desc: string;
  progress: MotionValue<number>;
  threshold: number;
}

const JourneySection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"] 
  });

  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
  });

  return (
    <div className="relative min-h-screen py-16 sm:py-20 bg-transparent">
      <div ref={containerRef} className="relative max-w-7xl mx-auto px-4 sm:px-6 md:px-10 flex justify-end"> 
        {/* Timeline Line */}
        <div className="absolute left-[24px] sm:left-[39px] md:left-[59%] top-0 bottom-0 w-0.5 bg-white/10">
          <motion.div
            style={{ scaleY, originY: 0 }}
            className="absolute top-0 left-0 w-full h-full bg-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.6)]"
          />
          
          {/* Watermark heading (Desktop only) */}
          <div className="sticky top-1/3 -translate-y-1/2 -translate-x-full pr-10 z-20 ml-12 hidden md:block">
            <h2 className="text-white text-7xl font-black uppercase tracking-tighter italic -rotate-90 origin-center whitespace-nowrap opacity-10 pointer-events-none">
              Journey
            </h2>
          </div>
        </div>

        {/* Timeline Content Cards */}
        <div className="relative z-10 w-full md:w-[40%] space-y-12 sm:space-y-20 md:space-y-40 py-8 md:py-20 pl-7 sm:pl-10">
          <JourneyCard 
            year="2023" 
            title="Mobile & Python Foundations"
            desc="Built cross-platform React Native apps (Virtual Hat AR App) and core algorithmic backend architectures."
            progress={scrollYProgress}
            threshold={0.1} 
          />
          <JourneyCard 
            year="2024" 
            title="3D Web & Interactive Graphics"
            desc="Specialized in Three.js, React Three Fiber, custom shaders, and immersive spatial web experiences."
            progress={scrollYProgress}
            threshold={0.5} 
          />
          <JourneyCard 
            year="2025–2026" 
            title="Production SaaS Architect"
            desc="Architecting OBIX 360: Full-stack enterprise POS & billing ecosystem with NestJS, PostgreSQL, and live OTA client updates."
            progress={scrollYProgress}
            threshold={0.9} 
          />
        </div>
      </div>
    </div>
  );
};

const JourneyCard = ({ year, title, desc, progress, threshold }: JourneyCardProps) => {
  const dotColor = useTransform(
    progress,
    [threshold - 0.05, threshold], 
    ["#1e293b", "#6366f1"] 
  );

  const dotGlow = useTransform(
    progress,
    [threshold - 0.05, threshold],
    ["0px 0px 0px rgba(0,0,0,0)", "0px 0px 20px rgba(99,102,241,1)"]
  );

  const dotScale = useTransform(progress, [threshold - 0.05, threshold], [0.8, 1.3]);

  return (
    <motion.div className="relative group">
      <motion.div 
        style={{ 
          backgroundColor: dotColor, 
          boxShadow: dotGlow,
          scale: dotScale 
        }}
        className="absolute -left-[35px] sm:-left-[47px] md:-left-[53px] top-8 w-4 h-4 md:w-6 md:h-6 rounded-full border-4 border-[#050816] z-30 transition-colors"
      />

      <motion.div 
        initial={{ opacity: 0.2 }}
        whileInView={{ opacity: 1 }}
        className="p-5 sm:p-8 rounded-3xl bg-white/5 backdrop-blur-lg border border-white/10 shadow-xl"
      >
        <span className="text-indigo-400 font-bold text-lg sm:text-xl font-mono">{year}</span>
        <h3 className="text-white text-xl sm:text-3xl font-bold mt-1.5">{title}</h3>
        <p className="text-gray-400 mt-3 text-xs sm:text-sm leading-relaxed">{desc}</p>
      </motion.div>
    </motion.div>
  );
};

export default JourneySection;