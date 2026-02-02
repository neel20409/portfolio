"use client";
import React, { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useVelocity, useSpring } from 'framer-motion';

const JourneySection = () => {
  const containerRef = useRef(null);
  
  // 1. Track Scroll Progress
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // 2. Track Velocity to determine Walk vs Run
  const scrollVelocity = useVelocity(scrollYProgress);
  const smoothVelocity = useSpring(scrollVelocity, { stiffness: 100, damping: 30 });
  const [animationState, setAnimationState] = useState("idle");

  // 3. Transform avatar position: Start center-right, move to left on scroll
  const avatarX = useTransform(scrollYProgress, [0, 0.1], ["0%", "-35%"]);

  useEffect(() => {
    return smoothVelocity.onChange((v) => {
      if (Math.abs(v) > 0.1) {
        setAnimationState("run");
      } else if (Math.abs(v) > 0.01) {
        setAnimationState("walk");
      } else {
        setAnimationState("idle");
      }
    });
  }, [smoothVelocity]);

  return (
    <div ref={containerRef} className="relative bg-[#050816]">
      {/* 3D CANVAS WRAPPER (Fixed) 
          This moves the avatar to the left as you scroll 
      */}
      <motion.div 
        style={{ x: avatarX }}
        className="fixed inset-0 z-0 pointer-events-none"
      >
        {/* Pass animationState to your Canvas Component */}
        {/* <AvatarCanvas animation={animationState} /> */}
      </motion.div>

      {/* TIMELINE CONTENT (Right Side) */}
      <div className="relative z-10 flex flex-col items-end pr-10 lg:pr-20">
        
        {/* Spacer for Hero Section */}
        <section className="h-screen" />

        {/* Journey Step 1 */}
        <JourneyCard 
          year="2023" 
          title="Python & Mobile Foundations"
          desc="Mastered Python basics and started building mobile apps with React Native."
        />

        {/* Journey Step 2 */}
        <JourneyCard 
          year="2024" 
          title="3D Web Specialization"
          desc="Integrated Three.js and Framer Motion to create interactive 3D experiences."
        />

        {/* Journey Step 3 */}
        <JourneyCard 
          year="2025" 
          title="Full Stack Architect"
          desc="Developing robust blogging systems and high-performance Spotify clones."
        />

        <section className="h-[50vh]" />
      </div>
    </div>
  );
};

// Reusable Glassmorphism Card for the Timeline
const JourneyCard = ({ year, title, desc }) => (
  <motion.div 
    initial={{ opacity: 0, x: 50 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: false, amount: 0.5 }}
    className="w-full max-w-md my-20 p-8 rounded-3xl bg-white/5 backdrop-blur-lg border border-white/10 shadow-xl"
  >
    <span className="text-indigo-400 font-bold text-xl">{year}</span>
    <h3 className="text-white text-3xl font-bold mt-2">{title}</h3>
    <p className="text-gray-400 mt-4 leading-relaxed">{desc}</p>
  </motion.div>
);

export default JourneySection;