"use client";
import React from 'react';
import { motion } from 'framer-motion';

const technologies = [
  { name: "Python", logo: "/logos/python.svg" },
  { name: "React", logo: "/logos/react.svg" },
  { name: "Next.js", logo: "/logos/next.svg" },
  { name: "Three.js", logo: "/logos/three.svg" },
  { name: "Node.js", logo: "/logos/node.svg" },
  { name: "TypeScript", logo: "/logos/typescript.svg" },
];

const TechSlider = () => {
  // Duplicate the array to ensure a seamless infinite loop
  const duplicatedTech = [...technologies, ...technologies];

  return (
    <div className="relative w-full py-20 bg-transparent overflow-hidden">
      {/* Optional: Section Heading */}
      <div className="max-w-7xl mx-auto px-10 mb-12">
        <h2 className="text-white/10 text-5xl font-black uppercase tracking-widest italic">
          Technologies
        </h2>
      </div>

      {/* Side Fades: Makes the "re-emerging" look seamless */}
      <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#050816] to-transparent z-10" />
      <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#050816] to-transparent z-10" />

      {/* The Animated Track */}
      <div className="flex overflow-hidden">
        <motion.div 
          className="flex whitespace-nowrap gap-10"
          animate={{
            // x: Moves exactly half of the total width of the duplicated list
            x: ["0%", "-50%"], 
          }}
          transition={{
            ease: "linear",
            duration: 20, // Adjust speed: higher = slower
            repeat: Infinity,
          }}
        >
          {duplicatedTech.map((tech, index) => (
            <div 
              key={index} 
              className="flex items-center gap-4 px-8 py-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md min-w-[220px] justify-center hover:border-indigo-500/50 transition-colors group"
            >
              <div className="w-10 h-10 bg-indigo-500/20 rounded-lg flex items-center justify-center grayscale group-hover:grayscale-0 transition-all">
                {/* Fallback if logo path doesn't exist yet */}
                <span className="text-indigo-300 font-bold text-lg">{tech.name[0]}</span>
              </div>
              <span className="text-white text-xl font-bold opacity-50 group-hover:opacity-100 transition-opacity">
                {tech.name}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default TechSlider;