"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useState } from "react";

interface HoloBeamProps {
  isOverdrive: boolean;
  activeColor: string;
}

export default function HoloBeam({ isOverdrive, activeColor }: HoloBeamProps) {
  const [mounted, setMounted] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: 1440, height: 900 });
  const { scrollY } = useScroll();
  const beamOpacity = useTransform(scrollY, [0, 250, 450], [1, 0.8, 0]);

  useEffect(() => {
    setMounted(true);
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Only show on desktop screens where OrbitConsole is visible (>= 1024px)
  if (!mounted || windowSize.width < 1024) return null;

  // Origin point (Avatar center/chest area)
  const startX = windowSize.width * 0.5;
  const startY = windowSize.height * 0.45;

  // Target point (OrbitConsole left edge)
  const endX = windowSize.width > 1280 ? windowSize.width - 330 : windowSize.width - 300;
  const endY = windowSize.height * 0.48;

  // Control points for organic curved holographic beam
  const cpX1 = startX + (endX - startX) * 0.45;
  const cpY1 = startY - 40;
  const cpX2 = startX + (endX - startX) * 0.7;
  const cpY2 = endY + 20;

  const pathD = `M ${startX} ${startY} C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${endX} ${endY}`;

  const beamColor = isOverdrive ? "#f43f5e" : activeColor;

  return (
    <motion.div 
      style={{ opacity: beamOpacity }} 
      className="pointer-events-none fixed inset-0 z-10 overflow-hidden"
    >
      <svg className="h-full w-full">
        <defs>
          <linearGradient id="beamGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={beamColor} stopOpacity="0.8" />
            <stop offset="60%" stopColor={beamColor} stopOpacity="0.4" />
            <stop offset="100%" stopColor={beamColor} stopOpacity="0.9" />
          </linearGradient>

          <filter id="holoGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Ambient Wide Diffused Aura */}
        <path
          d={pathD}
          fill="none"
          stroke={beamColor}
          strokeWidth={isOverdrive ? "6" : "3"}
          strokeOpacity="0.25"
          filter="url(#holoGlow)"
        />

        {/* Core Laser Filament */}
        <path
          d={pathD}
          fill="none"
          stroke="url(#beamGradient)"
          strokeWidth={isOverdrive ? "2.5" : "1.2"}
          strokeDasharray="8 6"
          className="animate-[dash_12s_linear_infinite]"
        />

        {/* Fast Traveling Photon Particle Wave */}
        <motion.path
          d={pathD}
          fill="none"
          stroke="#ffffff"
          strokeWidth={isOverdrive ? "3" : "1.8"}
          strokeDasharray="60 300"
          strokeLinecap="round"
          initial={{ strokeDashoffset: 400 }}
          animate={{ strokeDashoffset: -400 }}
          transition={{ repeat: Infinity, duration: isOverdrive ? 1 : 2.2, ease: "linear" }}
        />

        {/* Avatar Origin Projection Node */}
        <circle cx={startX} cy={startY} r="4" fill={beamColor} filter="url(#holoGlow)" />
        <circle cx={startX} cy={startY} r="8" fill="none" stroke={beamColor} strokeWidth="1" opacity="0.6">
          <animate attributeName="r" values="4;14;4" dur="2.5s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.8;0;0.8" dur="2.5s" repeatCount="indefinite" />
        </circle>

        {/* Console Receiving Node */}
        <circle cx={endX} cy={endY} r="3.5" fill="#ffffff" filter="url(#holoGlow)" />
      </svg>
    </motion.div>
  );
}
