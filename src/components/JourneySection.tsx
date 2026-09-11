"use client";

import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useSpring, useTransform, useMotionValueEvent, MotionValue } from 'framer-motion';
import { 
  Smartphone, 
  Box, 
  Server, 
  Sparkles, 
  Zap, 
  CheckCircle2, 
  Cpu, 
  Layers, 
  ArrowUpRight,
  ShieldCheck,
  Activity
} from 'lucide-react';
import { sound } from '@/utils/soundEngine';

interface JourneyItem {
  id: string;
  year: string;
  period: string;
  title: string;
  role: string;
  desc: string;
  metric: string;
  metricLabel: string;
  tags: string[];
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
  accentGlow: string;
  borderGlow: string;
  threshold: number;
}

const JOURNEY_MILESTONES: JourneyItem[] = [
  {
    id: "era-2023",
    year: "2023",
    period: "Foundational Era",
    title: "Mobile Architecture & Computer Vision",
    role: "Full-Stack & Mobile Developer",
    desc: "Engineered cross-platform mobile apps featuring real-time MediaPipe AI face-mesh tracking (Virtual Hat AR App), algorithmic Python backends, and responsive touch-first interfaces.",
    metric: "< 15ms",
    metricLabel: "AR Frame Latency",
    tags: ["React Native", "Expo", "MediaPipe AI", "Python", "FastAPI"],
    icon: Smartphone,
    accentColor: "#38bdf8", // Sky Cyan
    accentGlow: "rgba(56, 189, 248, 0.4)",
    borderGlow: "hover:border-cyan-400/50 hover:shadow-cyan-500/10",
    threshold: 0.15,
  },
  {
    id: "era-2024",
    year: "2024",
    period: "Spatial Innovation Era",
    title: "3D Spatial Web & Interactive Graphics",
    role: "Creative Technologist & 3D Engineer",
    desc: "Specialized in WebGL shaders, Three.js spatial scenes, real-time audio visualizers, and interactive GPU-accelerated web experiences with fluid spring micro-interactions.",
    metric: "60 FPS",
    metricLabel: "GPU Shader Flow",
    tags: ["Three.js", "React Three Fiber", "GLSL Shaders", "Web Audio API", "Framer Motion"],
    icon: Box,
    accentColor: "#c084fc", // Purple / Violet
    accentGlow: "rgba(192, 132, 252, 0.4)",
    borderGlow: "hover:border-purple-400/50 hover:shadow-purple-500/10",
    threshold: 0.52,
  },
  {
    id: "era-2025-2026",
    year: "2025–2026",
    period: "Enterprise Production Era",
    title: "Production SaaS & Distributed Systems",
    role: "Lead Systems Architect // OBIX 360",
    desc: "Architecting and deploying OBIX 360: enterprise multi-tenant POS, automated WhatsApp billing with Evolution API, offline-first mobile synchronization, and Kubernetes/VPS deployments.",
    metric: "99.9%",
    metricLabel: "Production Uptime",
    tags: ["Next.js 15", "NestJS", "PostgreSQL", "Docker / VPS", "Capacitor", "Redis"],
    icon: Server,
    accentColor: "#34d399", // Emerald Green
    accentGlow: "rgba(52, 211, 153, 0.4)",
    borderGlow: "hover:border-emerald-400/50 hover:shadow-emerald-500/10",
    threshold: 0.88,
  },
];

export default function JourneySection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [percentTraversed, setPercentTraversed] = useState(0);
  const [activeEraIndex, setActiveEraIndex] = useState(0);
  const lastSoundIndexRef = useRef<number>(-1);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 70%", "end 80%"] 
  });

  // Smooth Spring Dynamics on the progress beam
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 24,
    restDelta: 0.001
  });

  // Convert smooth progress to CSS percentage
  const beamHeightPercent = useTransform(smoothProgress, [0, 1], ["0%", "100%"]);

  useMotionValueEvent(smoothProgress, "change", (latest) => {
    const pct = Math.min(Math.max(Math.round(latest * 100), 0), 100);
    setPercentTraversed(pct);

    // Determine current active milestone
    let currentEra = 0;
    if (latest >= 0.75) currentEra = 2;
    else if (latest >= 0.35) currentEra = 1;
    else currentEra = 0;

    setActiveEraIndex(currentEra);

    // Play subtle chime when unlocking next era
    if (currentEra !== lastSoundIndexRef.current) {
      if (lastSoundIndexRef.current !== -1) {
        sound.playHover();
      }
      lastSoundIndexRef.current = currentEra;
    }
  });

  return (
    <div ref={containerRef} className="relative min-h-screen py-20 sm:py-28 bg-transparent">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[450px] bg-gradient-to-b from-indigo-500/5 via-cyan-500/5 to-transparent rounded-full blur-[140px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 md:px-10 flex flex-col md:flex-row justify-end">
        
        {/* ========================================================================= */}
        {/* LEFT HUD: CHRONO-TELEMETRY & STICKY WATERMARK (Desktop only) */}
        {/* ========================================================================= */}
        <div className="hidden lg:block absolute left-8 xl:left-14 top-12 z-20 pointer-events-none">
          {/* Chrono Stream Telemetry Card */}
          <div className="sticky top-32 p-5 rounded-3xl bg-zinc-950/80 backdrop-blur-2xl border border-white/10 shadow-2xl max-w-xs pointer-events-auto">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] font-bold text-cyan-300">
                CHRONO-TIMELINE // v2.6
              </span>
            </div>

            <h3 className="text-white text-2xl font-black uppercase tracking-tight font-mono">
              Engineering Evolution
            </h3>
            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
              Tracking key algorithmic milestones, 3D graphics specialization, and enterprise production deployments.
            </p>

            {/* Live Trajectory Meter */}
            <div className="mt-4 pt-4 border-t border-white/10">
              <div className="flex justify-between items-center text-xs font-mono text-gray-300 mb-1.5">
                <span className="text-[11px] text-gray-400 uppercase">Trajectory</span>
                <span className="text-cyan-400 font-bold">{percentTraversed}% TRAVERSED</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                <motion.div 
                  className="h-full bg-gradient-to-r from-cyan-400 via-indigo-500 to-emerald-400 rounded-full"
                  style={{ width: `${percentTraversed}%` }}
                />
              </div>
              <div className="mt-3 flex items-center justify-between text-[10px] font-mono text-slate-400">
                <span>START: 2023</span>
                <span className="text-emerald-400 font-semibold">NOW: 2026 // PROD</span>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* CENTER/SIDE: STATE-OF-THE-ART MULTI-LAYERED PROGRESSION BEAM CONDUIT */}
        {/* ========================================================================= */}
        <div className="absolute left-[24px] sm:left-[36px] md:left-[59%] top-0 bottom-0 z-20 flex justify-center">
          
          {/* Sticky Rotated "JOURNEY" Watermark Aligned With Progression Bar */}
          <div className="sticky top-1/3 -translate-y-1/2 -translate-x-full pr-8 sm:pr-12 md:pr-16 z-10 hidden md:block pointer-events-none select-none">
            <h2 className="text-white text-7xl lg:text-8xl xl:text-9xl font-black uppercase tracking-tighter italic -rotate-90 origin-center whitespace-nowrap opacity-10 lg:opacity-15 font-mono">
              Journey
            </h2>
          </div>

          {/* Outer Glass Conduit Tube Track */}
          <div className="relative w-1.5 sm:w-2 h-full rounded-full bg-zinc-900/90 border border-white/10 shadow-[inset_0_0_8px_rgba(0,0,0,0.8)]">
            
            {/* Active Neon Laser Beam Core */}
            <motion.div
              style={{ height: beamHeightPercent }}
              className="absolute top-0 left-0 w-full rounded-full bg-gradient-to-b from-cyan-400 via-indigo-500 via-purple-500 to-emerald-400 shadow-[0_0_16px_rgba(99,102,241,0.9),0_0_30px_rgba(56,189,248,0.6)]"
            />

            {/* Pulsing Light Filament Overlay */}
            <motion.div
              style={{ height: beamHeightPercent }}
              className="absolute top-0 left-0 w-full rounded-full bg-white/40 blur-[1px]"
            />

            {/* Gliding Photon Plasma Energy Comet (Head Beacon) */}
            <motion.div
              style={{ top: beamHeightPercent }}
              className="absolute -left-[9px] sm:-left-[11px] -translate-y-1/2 w-6 h-6 sm:w-7 sm:h-7 pointer-events-none z-40 flex items-center justify-center"
            >
              {/* Outer Energy Shockwave Ping */}
              <span className="absolute w-full h-full rounded-full bg-cyan-400/60 animate-ping" />
              
              {/* Diffuse Plasma Aura */}
              <span className="absolute w-5 h-5 rounded-full bg-gradient-to-tr from-cyan-400 via-indigo-400 to-fuchsia-400 blur-sm opacity-90 shadow-[0_0_18px_#38bdf8]" />
              
              {/* Intense White Photon Core */}
              <span className="relative w-2.5 h-2.5 rounded-full bg-white shadow-[0_0_10px_#ffffff]" />
            </motion.div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* RIGHT SIDE: INTERACTIVE MILESTONE CARDS & QUANTUM NODES */}
        {/* ========================================================================= */}
        <div className="relative z-10 w-full md:w-[40%] space-y-14 sm:space-y-24 md:space-y-36 py-8 md:py-16 pl-9 sm:pl-14">
          
          {/* Header Bar (Mobile & Tablet) */}
          <div className="block lg:hidden mb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/25 text-cyan-300 text-xs font-mono font-semibold mb-2">
              <Activity className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span>TRAJECTORY: {percentTraversed}% TRAVERSED</span>
            </div>
            <h2 className="text-white text-3xl sm:text-4xl font-black uppercase tracking-tight font-mono">
              Engineering Journey
            </h2>
          </div>

          {JOURNEY_MILESTONES.map((item, index) => (
            <MilestoneCard
              key={item.id}
              item={item}
              index={index}
              progress={smoothProgress}
              isActive={activeEraIndex === index}
            />
          ))}
        </div>

      </div>
    </div>
  );
}

// =========================================================================
// MILESTONE CARD COMPONENT WITH QUANTUM NODE
// =========================================================================
function MilestoneCard({
  item,
  index,
  progress,
  isActive,
}: {
  item: JourneyItem;
  index: number;
  progress: MotionValue<number>;
  isActive: boolean;
}) {
  const nodeRef = useRef<HTMLDivElement>(null);

  // Dynamic Node Glow and Expansion based on Laser beam contact
  const nodeScale = useTransform(
    progress,
    [item.threshold - 0.08, item.threshold, item.threshold + 0.08],
    [0.85, 1.25, 1.05]
  );

  const nodeOpacity = useTransform(
    progress,
    [item.threshold - 0.1, item.threshold],
    [0.4, 1]
  );

  const cardBorderOpacity = useTransform(
    progress,
    [item.threshold - 0.08, item.threshold],
    ["rgba(255, 255, 255, 0.08)", `${item.accentColor}55`]
  );

  return (
    <motion.div 
      className="relative group"
      initial={{ opacity: 0, y: 35 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      {/* ------------------------------------------------------------- */}
      {/* QUANTUM MILESTONE NODE ON THE TIMELINE BEAM */}
      {/* ------------------------------------------------------------- */}
      <motion.div
        ref={nodeRef}
        style={{
          scale: nodeScale,
          opacity: nodeOpacity,
          borderColor: isActive ? item.accentColor : "rgba(255,255,255,0.2)",
          boxShadow: isActive ? `0 0 24px ${item.accentGlow}` : "none",
        }}
        className="absolute -left-[45px] sm:-left-[63px] md:-left-[67px] top-6 w-9 h-9 sm:w-11 sm:h-11 rounded-2xl bg-zinc-950 border-2 flex items-center justify-center z-30 transition-all duration-300 shadow-xl"
      >
        {/* Node Active Ping Wave */}
        {isActive && (
          <span 
            className="absolute inset-0 rounded-2xl animate-ping opacity-40"
            style={{ backgroundColor: item.accentColor }}
          />
        )}

        {/* Node Icon */}
        <item.icon 
          className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:scale-110 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`}
        />
      </motion.div>

      {/* ------------------------------------------------------------- */}
      {/* INTERACTIVE GLASS CARD */}
      {/* ------------------------------------------------------------- */}
      <motion.div
        onMouseEnter={() => sound.playHover()}
        className={`relative p-5 sm:p-7 md:p-8 rounded-3xl bg-zinc-950/75 backdrop-blur-2xl border transition-all duration-500 shadow-2xl overflow-hidden ${item.borderGlow}`}
        style={{
          borderColor: isActive ? `${item.accentColor}66` : "rgba(255, 255, 255, 0.12)",
          boxShadow: isActive ? `0 15px 45px rgba(0,0,0,0.8), 0 0 35px ${item.accentGlow}` : "0 15px 35px rgba(0,0,0,0.7)",
        }}
      >
        {/* Ambient Top Corner Aura */}
        <div 
          className="absolute -top-12 -right-12 w-36 h-36 rounded-full blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-500 pointer-events-none"
          style={{ backgroundColor: item.accentColor }}
        />

        {/* Card Header */}
        <div className="flex items-center justify-between mb-3 border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <span 
              className="text-lg sm:text-2xl font-black font-mono tracking-tight"
              style={{ color: item.accentColor }}
            >
              {item.year}
            </span>
            <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 bg-white/5 px-2 py-0.5 rounded-full border border-white/10">
              {item.period}
            </span>
          </div>

          {/* Metric Highlight Capsule */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white/5 border border-white/10 text-right">
            <span className="text-[11px] sm:text-xs font-bold font-mono text-white" style={{ color: item.accentColor }}>
              {item.metric}
            </span>
            <span className="text-[9px] font-mono text-slate-400 hidden sm:inline">
              {item.metricLabel}
            </span>
          </div>
        </div>

        {/* Role & Title */}
        <h3 className="text-white text-lg sm:text-2xl font-bold tracking-tight mb-1 group-hover:text-slate-100 transition-colors">
          {item.title}
        </h3>
        <p className="text-xs sm:text-sm font-medium text-slate-300 font-mono mb-3">
          {item.role}
        </p>

        {/* Description */}
        <p className="text-slate-400 text-xs sm:text-sm leading-relaxed mb-5 font-light">
          {item.desc}
        </p>

        {/* Skill Tags */}
        <div className="flex flex-wrap gap-1.5 pt-3 border-t border-white/5">
          {item.tags.map((tag) => (
            <span
              key={tag}
              className="px-2.5 py-1 rounded-xl bg-white/[0.04] border border-white/10 text-[10px] sm:text-[11px] font-mono text-slate-300 transition-all hover:bg-white/10 hover:border-white/20"
            >
              {tag}
            </span>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}