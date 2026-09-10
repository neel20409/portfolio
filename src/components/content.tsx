"use client";
import { motion } from 'framer-motion';
import React, { useState, useEffect } from 'react';
import { AvatarPointer } from './AvatarPointer';
import { Variants } from "framer-motion";

interface ContentProps {
  onCVClick?: () => void;
}

const Content = ({ onCVClick }: ContentProps) => {
  const name = "Neel Bhatt";
  const roles = ["Full-Stack Architecture", "Mobile Development", "3D & WebGL Systems", "AI & Data Science"];
  const [displayText, setDisplayText] = useState("");
  const [roleIndex, setRoleIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [speed, setSpeed] = useState(130);

  useEffect(() => {
    const handleTyping = () => {
      const currentRole = roles[roleIndex];
      
      if (isDeleting) {
        setDisplayText(currentRole.substring(0, displayText.length - 1));
        setSpeed(40);
      } else {
        setDisplayText(currentRole.substring(0, displayText.length + 1));
        setSpeed(120);
      }

      if (!isDeleting && displayText === currentRole) {
        setTimeout(() => setIsDeleting(true), 2200);
      } else if (isDeleting && displayText === "") {
        setIsDeleting(false);
        setRoleIndex((prev) => (prev + 1) % roles.length);
      }
    };

    const timer = setTimeout(handleTyping, speed);
    return () => clearTimeout(timer);
  }, [displayText, isDeleting, roleIndex, speed, roles]);

  const nameContainer = {
    show: { transition: { staggerChildren: 0.08 } }
  };

  const nameLetter: Variants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 120 } }
  };

  return (
    <div className="w-full flex flex-col justify-center items-start relative z-10 pointer-events-none">
      {/* --- HERO GLASS CARD --- */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7 }}
        className="w-full p-6 sm:p-8 md:p-10 rounded-3xl md:rounded-[2.5rem] bg-zinc-950/65 backdrop-blur-2xl border border-white/15 shadow-[0_20px_60px_rgba(0,0,0,0.8)] pointer-events-auto"
      >
        <AvatarPointer>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/25 text-indigo-300 text-[11px] sm:text-xs font-mono font-semibold mb-3">
            <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
            FULL-STACK & SPATIAL ENGINEER
          </div>

          <motion.h1 
            variants={nameContainer}
            initial="hidden"
            animate="show"
            className="text-white text-3xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight flex flex-wrap leading-none"
          >
            {name.split("").map((char, i) => (
              <motion.span key={i} variants={nameLetter}>
                {char === " " ? "\u00A0" : char}
              </motion.span>
            ))}
          </motion.h1>

          <div className="min-h-[3rem] sm:min-h-[3.5rem] mt-3 sm:mt-4 flex items-center">
            <p className="text-gray-200 text-base sm:text-xl md:text-2xl font-medium tracking-wide leading-snug">
              The Architect of Intelligence, refined in <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-400 to-fuchsia-400 font-bold">{displayText}</span>
              <span className="animate-pulse border-r-2 border-indigo-400 ml-1 inline-block h-5 sm:h-6 align-middle"></span>
            </p>
          </div>

          <div className="mt-5 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-gray-400">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-emerald-300 font-semibold">Available for Projects</span>
            </div>
            <span className="text-gray-500 hidden sm:inline">MSU Baroda • 2026</span>
          </div>
        </AvatarPointer>
      </motion.div>
    </div>
  );
};

export default Content;