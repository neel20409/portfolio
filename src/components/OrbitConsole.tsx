"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowUpRight, Cpu, Sparkles, Zap } from "lucide-react";
import dynamic from "next/dynamic";
import { sfx } from "@/utils/sfx";

// Dynamically import the 3D Mini Wireframe Canvas for fast SSR
const HoloMiniCanvas = dynamic(() => import("./canvas/HoloMiniCanvas"), { ssr: false });

export const DISCIPLINE_SIGNALS = [
  {
    label: "Web",
    index: "01",
    title: "Fast, immersive web surfaces.",
    detail: "High-performance full-stack architectures crafted with micro-interactions & fluid animations.",
    stack: "Next.js / NestJS / Postgres",
    metric: "03.2s",
    metricLabel: "time to value",
    themeColor: "#38bdf8", // Sky Cyan
    badgeGlow: "rgba(56, 189, 248, 0.4)",
  },
  {
    label: "Mobile",
    index: "02",
    title: "Small screens. Big impact.",
    detail: "Native cross-platform mobile apps built with seamless offline-first synchronization.",
    stack: "React Native / Capacitor",
    metric: "01 tap",
    metricLabel: "to action",
    themeColor: "#34d399", // Emerald Green
    badgeGlow: "rgba(52, 211, 153, 0.4)",
  },
  {
    label: "3D / AI",
    index: "03",
    title: "Spatial & intelligent systems.",
    detail: "Real-time 3D web graphics, generative AI agents, and interactive visual workflows.",
    stack: "Three.js / Gemini / R3F",
    metric: "60 FPS",
    metricLabel: "spatial flow",
    themeColor: "#c084fc", // Purple / Violet
    badgeGlow: "rgba(192, 132, 252, 0.4)",
  },
];

interface OrbitConsoleProps {
  activeIndex?: number;
  onActiveIndexChange?: (index: number) => void;
  isOverdrive?: boolean;
  onToggleOverdrive?: () => void;
  isMobileInline?: boolean;
}

export default function OrbitConsole({
  activeIndex: externalIndex,
  onActiveIndexChange,
  isOverdrive = false,
  onToggleOverdrive,
  isMobileInline = false,
}: OrbitConsoleProps) {
  const [internalIndex, setInternalIndex] = useState(0);
  const activeIndex = externalIndex !== undefined ? externalIndex : internalIndex;
  const signal = DISCIPLINE_SIGNALS[activeIndex];

  const handleSelectTab = (index: number) => {
    if (externalIndex === undefined) setInternalIndex(index);
    onActiveIndexChange?.(index);
    sfx.playHoloChirp(index === 0 ? 1.0 : index === 1 ? 1.25 : 1.5);
  };

  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth 3D Spring Tilt physics (desktop only)
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [10, -10]), { damping: 18, stiffness: 140 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-12, 12]), { damping: 18, stiffness: 140 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || isMobileInline) return;
    const rect = cardRef.current.getBoundingClientRect();
    const xPct = (e.clientX - rect.left) / rect.width - 0.5;
    const yPct = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(xPct);
    mouseY.set(yPct);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const containerClasses = isMobileInline
    ? "w-full max-w-md mx-auto block lg:hidden mt-5 z-20"
    : "orbit-console pointer-events-auto absolute right-4 xl:right-10 top-1/2 hidden w-[310px] xl:w-[335px] -translate-y-1/2 lg:block z-30 perspective-[1000px]";

  return (
    <motion.aside
      initial={{ opacity: 0, y: isMobileInline ? 20 : 0, x: isMobileInline ? 0 : 30 }}
      animate={{ opacity: 1, y: 0, x: 0 }}
      transition={{ delay: 0.5, duration: 0.7 }}
      className={containerClasses}
    >
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={!isMobileInline ? { rotateX, rotateY, transformStyle: "preserve-3d" } : {}}
        className={`relative overflow-hidden rounded-3xl border bg-slate-950/75 p-4 sm:p-6 shadow-[0_12px_40px_rgba(0,0,0,0.6)] backdrop-blur-2xl transition-colors duration-500 ${
          isOverdrive
            ? "border-rose-500/60 shadow-[0_0_35px_rgba(244,63,94,0.35)] bg-slate-950/85"
            : "border-white/15 hover:border-cyan-400/40"
        }`}
      >
        {/* Dynamic Holographic Spotlight Glare */}
        <div
          className="pointer-events-none absolute -inset-px rounded-3xl opacity-40 transition-opacity duration-300"
          style={{
            background: `radial-gradient(400px circle at ${((mouseX.get() + 0.5) * 100).toFixed(1)}% ${((mouseY.get() + 0.5) * 100).toFixed(1)}%, ${signal.badgeGlow}, transparent 70%)`,
          }}
        />

        {/* Header with Live Signal & Mini 3D Hologram */}
        <div className="relative flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: isOverdrive ? "#fb7185" : signal.themeColor }}>
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75" style={{ backgroundColor: isOverdrive ? "#f43f5e" : signal.themeColor }} />
                <span className="relative inline-flex h-2 w-2 rounded-full" style={{ backgroundColor: isOverdrive ? "#f43f5e" : signal.themeColor }} />
              </span>
              <span>{isOverdrive ? "OVERDRIVE ENGAGED" : "Live Discipline Signal"}</span>
            </div>
            <div className="mt-0.5 text-[9px] font-mono text-white/40 tracking-wider">
              NB / 2026 // HOLO-LINK
            </div>
          </div>

          {/* 3D Morphing Shape Preview Canvas */}
          <div className="relative -my-3 -mr-2">
            <HoloMiniCanvas activeIndex={activeIndex} />
          </div>
        </div>

        {/* Dynamic Discipline Description */}
        <div className="relative mt-3 min-h-[90px] sm:min-h-[105px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={signal.index}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
            >
              <div className="mb-1 flex items-center gap-1.5 text-[11px] font-medium" style={{ color: signal.themeColor }}>
                <Sparkles size={12} />
                <span>Discipline / {signal.index}</span>
              </div>
              <h3 className="text-sm sm:text-[17px] font-bold leading-tight tracking-tight text-white">
                {signal.title}
              </h3>
              <p className="mt-1.5 text-xs leading-relaxed text-slate-300/80">
                {signal.detail}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Core Stack & Performance Metrics */}
        <div className="relative mt-2 grid grid-cols-2 gap-2 border-y border-white/10 py-2.5 text-[11px]">
          <div>
            <div className="mb-0.5 text-[9px] uppercase tracking-wider text-slate-400/70 font-mono">Core Stack</div>
            <div className="font-medium text-white/90 truncate text-xs">{signal.stack}</div>
          </div>
          <div className="border-l border-white/10 pl-3">
            <div className="mb-0.5 text-[9px] uppercase tracking-wider text-slate-400/70 font-mono">Target Velocity</div>
            <div className="font-semibold text-xs" style={{ color: signal.themeColor }}>
              {signal.metric} <span className="text-[10px] font-normal text-slate-400">{signal.metricLabel}</span>
            </div>
          </div>
        </div>

        {/* Discipline Tabs */}
        <div className="relative mt-3 flex items-center justify-between pt-1 gap-2">
          <div className="flex gap-1.5 flex-1" role="tablist" aria-label="Discipline Selector">
            {DISCIPLINE_SIGNALS.map((item, index) => {
              const isActive = activeIndex === index;
              return (
                <button
                  key={item.label}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onMouseEnter={() => sfx.playHoverBlip()}
                  onClick={() => handleSelectTab(index)}
                  className={`flex-1 text-center rounded-xl px-2 sm:px-3 py-1.5 text-[10px] font-semibold tracking-wider transition-all duration-200 cursor-pointer ${
                    isActive
                      ? "text-white border shadow-md"
                      : "text-slate-400 hover:text-white bg-white/5 border border-white/5 hover:border-white/20"
                  }`}
                  style={
                    isActive
                      ? {
                          backgroundColor: `${item.themeColor}22`,
                          borderColor: `${item.themeColor}88`,
                          color: item.themeColor,
                          boxShadow: `0 0 14px ${item.themeColor}33`,
                        }
                      : {}
                  }
                >
                  {item.label}
                </button>
              );
            })}
          </div>

          <Cpu size={16} style={{ color: signal.themeColor }} className="opacity-80 flex-shrink-0" />
        </div>

        {/* Overdrive Action Button */}
        {onToggleOverdrive && (
          <button
            type="button"
            onClick={() => {
              onToggleOverdrive();
              sfx.playOverdriveWarp(!isOverdrive);
            }}
            onMouseEnter={() => sfx.playHoverBlip()}
            className={`mt-3 w-full flex items-center justify-center gap-2 rounded-xl py-2.5 text-[10px] font-bold uppercase tracking-widest transition-all duration-300 active:scale-95 cursor-pointer ${
              isOverdrive
                ? "bg-rose-500/25 text-rose-300 border border-rose-400/50 shadow-[0_0_18px_rgba(244,63,94,0.35)]"
                : "bg-white/5 text-cyan-300 border border-cyan-400/30 hover:bg-cyan-500/15 hover:border-cyan-300 shadow-md"
            }`}
          >
            <Zap size={13} className={isOverdrive ? "animate-bounce text-rose-400" : "text-cyan-400"} />
            <span>{isOverdrive ? "DISENGAGE OVERDRIVE" : "⚡ ENGAGE ZERO-G OVERDRIVE"}</span>
          </button>
        )}
      </motion.div>

      {/* Quick Action Link */}
      <a
        href="#projects"
        onMouseEnter={() => sfx.playHoverBlip()}
        className="group mt-2.5 flex items-center justify-between rounded-xl border border-white/10 bg-zinc-950/60 backdrop-blur-md px-3.5 py-2 text-[10px] uppercase tracking-wider text-slate-400 transition-all duration-200 hover:border-cyan-400/40 hover:bg-cyan-500/10 hover:text-cyan-200"
      >
        <span>Explore Featured Projects</span>
        <ArrowUpRight size={13} className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-cyan-300" />
      </a>
    </motion.aside>
  );
}