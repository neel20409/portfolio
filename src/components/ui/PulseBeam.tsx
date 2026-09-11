"use client";
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import SocialModal from "@/components/SocialModel";
import { sound } from "@/utils/soundEngine";
import { 
  MessageCircle, 
  Mail, 
  Github, 
  Linkedin, 
  Zap 
} from "lucide-react";

interface Particle {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  vx: number;
  vy: number;
}

const SATELLITES = [
  {
    id: "whatsapp",
    name: "WhatsApp",
    icon: MessageCircle,
    href: "https://wa.me/919265982724?text=Hi%20Neel,%20I%20saw%20your%20portfolio!",
    color: "#22c55e",
    border: "border-emerald-500/40",
    text: "text-emerald-400",
    angle: -150,
  },
  {
    id: "github",
    name: "GitHub",
    icon: Github,
    href: "https://github.com/neel20409",
    color: "#ffffff",
    border: "border-white/40",
    text: "text-white",
    angle: -110,
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    icon: Linkedin,
    href: "https://www.linkedin.com/in/neel-bhatt-7116373a7/",
    color: "#0ea5e9",
    border: "border-sky-500/40",
    text: "text-sky-400",
    angle: -70,
  },
  {
    id: "email",
    name: "Email",
    icon: Mail,
    href: "mailto:bhattneel2004@gmail.com",
    color: "#818cf8",
    border: "border-indigo-500/40",
    text: "text-indigo-400",
    angle: -30,
  },
];

export const PulseBeam = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isDockOpen, setIsDockOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Magnetic Cursor Physics (Desktop only)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { damping: 15, stiffness: 150 };
  const magneticX = useSpring(mouseX, springConfig);
  const magneticY = useSpring(mouseY, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (isMobile || !buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const distanceX = (e.clientX - centerX) * 0.25;
    const distanceY = (e.clientY - centerY) * 0.25;
    mouseX.set(distanceX);
    mouseY.set(distanceY);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setIsHovered(false);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    sound.playHover();
  };

  const triggerParticleBurst = () => {
    sound.playWarp();
    const colors = ["#38bdf8", "#818cf8", "#c084fc", "#34d399", "#f472b6"];
    const count = isMobile ? 14 : 22;
    const newParticles: Particle[] = Array.from({ length: count }, (_, i) => ({
      id: Date.now() + i,
      x: 0,
      y: 0,
      color: colors[i % colors.length],
      size: Math.random() * 3 + 2,
      vx: (Math.random() - 0.5) * (isMobile ? 100 : 160),
      vy: (Math.random() - 0.8) * (isMobile ? 90 : 140),
    }));
    setParticles(newParticles);
    setTimeout(() => setParticles([]), 700);
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    triggerParticleBurst();
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="relative flex flex-col items-center pointer-events-auto">
        
        {/* ORBITAL SATELLITE SPREAD */}
        <AnimatePresence>
          {isDockOpen && (
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 pointer-events-auto z-50">
              {SATELLITES.map((sat, i) => {
                const radius = isMobile ? 74 : 95;
                const radian = (sat.angle * Math.PI) / 180;
                const targetX = Math.cos(radian) * radius;
                const targetY = Math.sin(radian) * radius;

                return (
                  <motion.a
                    key={sat.id}
                    href={sat.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ scale: 0, opacity: 0, x: 0, y: 0 }}
                    animate={{
                      scale: 1,
                      opacity: 1,
                      x: targetX,
                      y: targetY,
                      transition: {
                        type: "spring",
                        stiffness: 320,
                        damping: 18,
                        delay: i * 0.03,
                      },
                    }}
                    exit={{
                      scale: 0,
                      opacity: 0,
                      x: 0,
                      y: 0,
                      transition: { duration: 0.15 },
                    }}
                    onMouseEnter={() => sound.playHover()}
                    onClick={() => sound.playClick()}
                    className={`absolute -left-4 sm:-left-5 -top-4 sm:-top-5 w-9 h-9 sm:w-11 sm:h-11 rounded-full flex items-center justify-center bg-zinc-950/95 backdrop-blur-xl border ${sat.border} shadow-lg shadow-black/80 group hover:scale-115 active:scale-95 transition-transform`}
                    style={{
                      boxShadow: `0 0 16px ${sat.color}40`,
                    }}
                    title={sat.name}
                  >
                    <sat.icon className={`w-4 h-4 sm:w-5 sm:h-5 ${sat.text} transition-transform group-hover:scale-110`} />
                    <span className="absolute -top-7 px-2 py-0.5 rounded-md bg-zinc-900/95 border border-white/10 text-[9px] font-mono text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-md hidden sm:block">
                      {sat.name}
                    </span>
                  </motion.a>
                );
              })}
            </div>
          )}
        </AnimatePresence>

        {/* PARTICLE BURST CONTAINER */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          {particles.map((p) => (
            <motion.span
              key={p.id}
              initial={{ scale: 1, x: 0, y: 0, opacity: 1 }}
              animate={{
                x: p.vx,
                y: p.vy,
                opacity: 0,
                scale: 0,
              }}
              transition={{ duration: 0.65, ease: "easeOut" }}
              className="absolute rounded-full"
              style={{
                width: p.size,
                height: p.size,
                backgroundColor: p.color,
                boxShadow: `0 0 8px ${p.color}`,
              }}
            />
          ))}
        </div>

        {/* MAIN HOLOGRAPHIC CONNECT BUTTON */}
        <motion.div
          style={{ x: isMobile ? 0 : magneticX, y: isMobile ? 0 : magneticY }}
          className="relative pointer-events-auto"
        >
          {/* Ambient Breathing Neon Glow Layer */}
          <motion.div
            animate={{
              scale: isHovered ? [1, 1.15, 1.08] : [1, 1.06, 1],
              opacity: isHovered ? [0.6, 0.9, 0.7] : [0.35, 0.5, 0.35],
            }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -inset-1 rounded-full bg-gradient-to-r from-cyan-500 via-indigo-500 to-fuchsia-500 blur-md -z-10"
          />

          <motion.button
            ref={buttonRef}
            onClick={handleClick}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            className="relative group flex items-center gap-2 sm:gap-2.5 px-4 sm:px-6 py-2 sm:py-2.5 rounded-full bg-zinc-950/90 border border-white/20 backdrop-blur-2xl shadow-[0_10px_35px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.3)] cursor-pointer overflow-hidden transition-all duration-300"
          >
            {/* Rotating Rainbow Conic Border */}
            <span className="absolute -inset-[200%] animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#38bdf8_0%,#818cf8_25%,#c084fc_50%,#34d399_75%,#38bdf8_100%)] opacity-30 group-hover:opacity-100 transition-opacity duration-500 -z-10" />

            {/* Inner Dark Background */}
            <span className="absolute inset-[1px] rounded-full bg-zinc-950/95 -z-10" />

            {/* Live Status Indicator Pulse */}
            <div className="relative flex items-center justify-center">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping absolute opacity-75" />
              <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
            </div>

            {/* Text */}
            <span className="text-[11px] sm:text-xs md:text-sm font-bold tracking-widest uppercase bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-400 group-hover:from-cyan-300 group-hover:via-indigo-200 group-hover:to-fuchsia-300 transition-all font-mono">
              CONNECT
            </span>

            {/* Satellite Dock Quick Toggle Button */}
            <span
              onClick={(e) => {
                e.stopPropagation();
                setIsDockOpen(!isDockOpen);
                sound.playClick();
              }}
              title="Toggle Quick Satellite Dock"
              className="ml-0.5 p-1 rounded-full bg-white/10 hover:bg-white/25 text-slate-300 hover:text-white transition-colors"
            >
              <Zap className={`w-3 h-3 sm:w-3.5 sm:h-3.5 transition-transform duration-300 ${isDockOpen ? "rotate-45 text-cyan-400" : ""}`} />
            </span>
          </motion.button>
        </motion.div>
      </div>

      {/* COMPREHENSIVE INTERACTIVE SOCIAL MODAL */}
      <SocialModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};