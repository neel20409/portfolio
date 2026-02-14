"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SocialModal from "@/components/SocialModel";

// --- Original Animation Variants ---
const grad1 = { initial: { x1: "0%", x2: "0%", y1: "80%", y2: "100%" }, animate: { x1: ["0%", "0%", "200%"], x2: ["0%", "0%", "180%"], y1: ["80%", "0%", "0%"], y2: ["100%", "20%", "20%"] } };
const grad2 = { initial: { x1: "0%", x2: "0%", y1: "80%", y2: "100%" }, animate: { x1: ["20%", "100%", "100%"], x2: ["0%", "90%", "90%"], y1: ["80%", "80%", "-20%"], y2: ["100%", "100%", "0%"] } };
const grad3 = { initial: { x1: "0%", x2: "0%", y1: "80%", y2: "100%" }, animate: { x1: ["20%", "100%", "100%"], x2: ["0%", "90%", "90%"], y1: ["80%", "80%", "-20%"], y2: ["100%", "100%", "0%"] } };
const grad4 = { initial: { x1: "40%", x2: "50%", y1: "160%", y2: "180%" }, animate: { x1: "0%", x2: "10%", y1: "-40%", y2: "-20%" } };
const grad5 = { initial: { x1: "-40%", x2: "-10%", y1: "0%", y2: "20%" }, animate: { x1: ["40%", "0%", "0%"], x2: ["10%", "0%", "0%"], y1: ["0%", "0%", "180%"], y2: ["20%", "20%", "200%"] } };

export const PulseBeam = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      {/* Reduced container height to 20rem for a lower profile */}
      <div className="fixed bottom-0 left-0 w-full h-[20rem] flex flex-col-reverse items-center justify-start antialiased pointer-events-none z-[60] pb-4">
        
        {/* BUTTON: Scaled down to 200px width and 70px height */}
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-slate-800 w-[200px] z-[70] h-[70px] no-underline group cursor-pointer relative shadow-2xl shadow-blue-500/10 rounded-full p-px text-xs font-semibold leading-6 text-white inline-block pointer-events-auto transition-all hover:scale-105 active:scale-95"
        >
          <span className="absolute inset-0 overflow-hidden rounded-full">
            <span className="absolute inset-0 rounded-full bg-[image:radial-gradient(75%_100%_at_50%_0%,rgba(56,189,248,0.3)_0%,rgba(56,189,248,0)_75%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          </span>
          <div className="relative flex justify-center w-full text-center space-x-2 h-full items-center z-10 rounded-full bg-zinc-950 py-0.5 px-4 ring-1 ring-white/10 ">
            <span className="md:text-xl text-lg font-bold uppercase tracking-widest bg-clip-text text-transparent bg-gradient-to-r from-neutral-200 via-neutral-400 to-neutral-200">
              Connect +
            </span>
          </div>
        </button>

        {/* BEAMS: Scaled to 60% for a much more subtle, focused effect */}
        <div className="absolute bottom-[-80px] left-1/2 -translate-x-1/2 flex items-center justify-center opacity-25 pointer-events-none">
          <SVGs />
        </div>
      </div>

      <SocialModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};

export const SVGs = () => {
  return (
    <svg
      width="858"
      height="434"
      viewBox="0 0 858 434"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      /* scale-60 keeps the pulses tight around the button */
      className="flex flex-shrink-0 scale-[0.6] md:scale-[0.75]"
    >
      {/* (Keep all your <path> and <defs> content exactly as you had it) */}
    </svg>
  );
};

const GradientColors = () => (
  <>
    <stop stopColor="#18CCFC" stopOpacity="0" />
    <stop stopColor="#18CCFC" />
    <stop offset="0.325" stopColor="#6344F5" />
    <stop offset="1" stopColor="#AE48FF" stopOpacity="0" />
  </>
);