"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { cn } from "@/libs/utils";
const technologies = [
  { 
    name: "Python", 
    logo: "/logos/python.svg", 
    gradient: "from-blue-500 via-blue-400 to-yellow-400",
    glow: "shadow-blue-500/20"
  },
  { 
    name: "React", 
    logo: "/logos/react.svg", 
    gradient: "from-cyan-400 via-cyan-500 to-blue-500",
    glow: "shadow-cyan-500/20"
  },
  { 
    name: "Next.js", 
    logo: "/logos/nextdotjs.svg", 
    gradient: "from-zinc-400 via-zinc-200 to-white",
    glow: "shadow-white/10"
  },
  { 
    name: "Three.js", 
    logo: "/logos/threedotjs.svg", 
    gradient: "from-indigo-400 via-purple-500 to-pink-500",
    glow: "shadow-indigo-500/20"
  },
  { 
    name: "Node.js", 
    logo: "/logos/nodedotjs.svg", 
    gradient: "from-green-500 via-emerald-400 to-lime-400",
    glow: "shadow-emerald-500/20"
  },
  { 
    name: "Kotlin", 
    logo: "/logos/kotlin.svg", 
    gradient: "from-purple-600 via-violet-500 to-orange-400",
    glow: "shadow-purple-500/20"
  },
  { 
    name: "TypeScript", 
    logo: "/logos/tsnode.svg", 
    gradient: "from-blue-600 via-blue-500 to-sky-400",
    glow: "shadow-blue-600/20"
  }
];

const TechSlider = () => {
  // Duplicate the array to ensure a seamless infinite loop
  const duplicatedTech = [...technologies, ...technologies];

  return (
    <div className="relative w-300 py-20 bg-transparent overflow-hidden pl-60">
      {/* Optional: Section Heading */}
      <div className="max-w-7xl mx-auto px-10 mb-12">
        <h2 className="text-white/20 text-5xl font-black uppercase tracking-widest italic">
          Technologies
        </h2>
      </div>

      {/* Side Fades: Makes the "re-emerging" look seamless */}
      <div className="absolute  inset-y-0 left-0 w-32 bg-gradient-to-r from-[#000000] to-transparent z-10" />
      <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#000000] to-transparent z-10" />

      {/* The Animated Track */}
      <div className="flex overflow-hidden">
        <motion.div 
          className="flex whitespace-nowrap gap-10 mt-5"
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
  className={cn(
    "relative flex items-center gap-5 px-10 py-7 rounded-[2rem] transition-all duration-500 group cursor-default",
    // Glass base
    "bg-gradient-to-br from-white/10 to-transparent backdrop-blur-xl",
    "border border-white/10 hover:border-indigo-500/50",
    // The "Glow" container
    "hover:shadow-[0_0_40px_-10px_rgba(99,102,241,0.4)] hover:-translate-y-1"
  )}
>
  {/* Inner Glow/Shine effect */}
  <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-tr from-indigo-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

  {/* Icon Wrapper */}
  <div className="relative w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 overflow-hidden">
    {/* Animated background for the icon */}
    <div className="absolute inset-0 bg-indigo-600/20 group-hover:bg-indigo-600/40 transition-colors" />
    
    {/* The Icon/Text */}
    <span className="relative text-indigo-400 font-black text-2xl group-hover:scale-110 group-hover:text-white transition-all duration-500 drop-shadow-[0_0_10px_rgba(129,140,248,0.8)]">
      {tech.logo ? (
        <img 
          src={tech.logo}
          alt={tech.name}
          className="w-8 h-8 object-contain"  
        />
      ) : (
        tech.name[0] // Fallback: First letter of the technology name
      )}
    </span>
  </div>

  {/* Technology Name */}
  <div className="flex flex-col">
    <span className="text-white text-xl font-black uppercase tracking-widest opacity-40 group-hover:opacity-100 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-indigo-400 transition-all duration-500">
      {tech.name}
    </span>
    {/* Sub-line glow */}
    <div className="h-[2px] w-0 group-hover:w-full bg-gradient-to-r from-indigo-500 to-transparent transition-all duration-700 mt-1" />
  </div>
</div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default TechSlider;