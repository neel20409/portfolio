"use client";
import React, { useRef } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';

const JourneySection = () => {
  const containerRef = useRef(null);
  
  // 1. Track scroll progress specifically for the timeline container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"] // Line grows as container moves through center
  });

  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
  });

  return (
    <div className="relative min-h-screen py-20 bg-transparent">
      <div ref={containerRef} className="relative max-w-7xl mx-auto px-10 flex justify-end">
        
        {/* THE TIMELINE LINE */}
        <div className="absolute left-1/2 md:left-[56%] top-0 bottom-0 w-0.5 bg-white/10">
          <motion.div 
            style={{ scaleY, originY: 0 }}
            className="absolute top-0 left-0 w-full h-full bg-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.6)]"
          />
          
          {/* VERTICAL JOURNEY TEXT */}
          <div className="sticky top-3/4 -translate-y-1/2 -translate-x-full pr-10 z-20">
          <h2 className="text-white text-7xl font-black uppercase tracking-tighter italic -rotate-90 origin-center whitespace-nowrap opacity-10 pointer-events-none">
              Journey
            </h2>
          </div>
        </div>

        {/* JOURNEY STEPS */}
        <div className="relative z-10 w-full md:w-[40%] space-y-40 py-20">
          {/* We pass the progress thresholds: 0.1, 0.5, 0.9 depending on position */}
          <JourneyCard 
            year="2023" 
            title="Python Foundations"
            desc="Mastered Python basics and React Native."
            progress={scrollYProgress}
            threshold={0.1} 
          />
          <JourneyCard 
            year="2024" 
            title="3D Web Specialization"
            desc="Integrated Three.js and Framer Motion."
            progress={scrollYProgress}
            threshold={0.5}
          />
          <JourneyCard 
            year="2025" 
            title="Full Stack Architect"
            desc="Developing robust blogging systems."
            progress={scrollYProgress}
            threshold={0.9}
          />
        </div>
      </div>
    </div>
  );
};

const JourneyCard = ({ year, title, desc, progress, threshold }) => {
  // 2. Sychronize Dot Glow with Line Progress
  // When the animated line (progress) passes the threshold, change color/glow
  const dotColor = useTransform(
    progress,
    [threshold - 0.05, threshold], 
    ["#1e293b", "#6366f1"] // From Slate to Indigo
  );

  const dotGlow = useTransform(
    progress,
    [threshold - 0.05, threshold],
    ["0px 0px 0px rgba(0,0,0,0)", "0px 0px 20px rgba(99,102,241,1)"]
  );

  const dotScale = useTransform(progress, [threshold - 0.05, threshold], [0.8, 1.3]);

  return (
    <motion.div className="relative group">
      {/* THE DOT: Style is linked to the scroll progress directly */}
      <motion.div 
        style={{ 
          backgroundColor: dotColor, 
          boxShadow: dotGlow,
          scale: dotScale 
        }}
        className="absolute -left-[43px] md:-left-[53px] top-1/2 -translate-y-1/2 w-6 h-6 rounded-full border-4 border-[#050816] z-30 transition-colors"
      />

      <motion.div 
        initial={{ opacity: 0.2 }}
        whileInView={{ opacity: 1 }}
        className="p-8 rounded-3xl bg-white/5 backdrop-blur-lg border border-white/10"
      >
        <span className="text-indigo-400 font-bold text-xl">{year}</span>
        <h3 className="text-white text-3xl font-bold mt-2">{title}</h3>
        <p className="text-gray-400 mt-4 leading-relaxed">{desc}</p>
      </motion.div>
    </motion.div>
  );
};

export default JourneySection;