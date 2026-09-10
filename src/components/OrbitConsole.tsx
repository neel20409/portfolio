"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Cpu, Sparkles } from "lucide-react";

const signals = [
  {
    label: "Web",
    index: "01",
    title: "Interfaces that feel inevitable.",
    detail: "Fast, expressive product surfaces with a little theatre in every interaction.",
    stack: "Next.js / TypeScript",
    metric: "03.2s",
    metricLabel: "time to clarity",
  },
  {
    label: "Mobile",
    index: "02",
    title: "Small screens. Big intent.",
    detail: "Focused mobile experiences that make the next action impossible to miss.",
    stack: "React Native / Expo",
    metric: "01 tap",
    metricLabel: "to momentum",
  },
  {
    label: "3D / AI",
    index: "03",
    title: "Useful magic, rendered.",
    detail: "Spatial interfaces and intelligent systems that turn complexity into curiosity.",
    stack: "Three.js / Gemini",
    metric: "∞",
    metricLabel: "room to explore",
  },
];

export default function OrbitConsole() {
  const [activeIndex, setActiveIndex] = useState(0);
  const signal = signals[activeIndex];

  return (
    <motion.aside
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.8, duration: 0.8 }}
      className="orbit-console pointer-events-auto absolute right-6 top-1/2 hidden w-[min(25rem,32vw)] -translate-y-1/2 lg:block"
    >
      <div className="relative overflow-hidden border border-white/15 bg-black/35 p-6 shadow-2xl shadow-cyan-950/30 backdrop-blur-xl">
        <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full border border-cyan-300/20" />
        <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full border border-cyan-300/20" />
        <motion.div
          className="absolute right-[4.4rem] top-[4.4rem] h-1.5 w-1.5 rounded-full bg-cyan-200 shadow-[0_0_14px_4px_rgba(103,232,249,0.7)]"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 7, ease: "linear" }}
          style={{ transformOrigin: "-3.2rem 3.2rem" }}
        />

        <div className="relative flex items-center justify-between text-[10px] uppercase tracking-[0.24em] text-cyan-200/70">
          <span className="flex items-center gap-2"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-300" /> Live signal</span>
          <span>NB / 2026</span>
        </div>

        <div className="relative mt-9 min-h-[10.5rem]">
          <motion.div
            key={signal.index}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
          >
            <div className="mb-3 flex items-center gap-2 text-xs text-white/45"><Sparkles size={13} /> Selected discipline / {signal.index}</div>
            <h2 className="max-w-xs text-3xl font-semibold leading-[1.05] tracking-[-0.04em] text-white">{signal.title}</h2>
            <p className="mt-4 max-w-sm text-sm leading-6 text-white/55">{signal.detail}</p>
          </motion.div>
        </div>

        <div className="relative grid grid-cols-2 border-y border-white/10 py-4 text-xs">
          <div>
            <div className="mb-1 uppercase tracking-[0.16em] text-white/35">Typical stack</div>
            <div className="text-white/80">{signal.stack}</div>
          </div>
          <div className="border-l border-white/10 pl-4">
            <div className="mb-1 uppercase tracking-[0.16em] text-white/35">Design metric</div>
            <div className="text-cyan-200">{signal.metric} <span className="text-white/40">{signal.metricLabel}</span></div>
          </div>
        </div>

        <div className="relative mt-5 flex items-end justify-between">
          <div className="flex gap-2" role="tablist" aria-label="Choose a discipline">
            {signals.map((item, index) => (
              <button
                key={item.label}
                type="button"
                role="tab"
                aria-selected={activeIndex === index}
                aria-label={`Show ${item.label} discipline`}
                onClick={() => setActiveIndex(index)}
                className={`border px-3 py-2 text-[10px] uppercase tracking-[0.16em] transition-colors ${activeIndex === index ? "border-cyan-200/70 bg-cyan-200/10 text-cyan-100" : "border-white/10 text-white/45 hover:border-white/30 hover:text-white/80"}`}
              >
                {item.label}
              </button>
            ))}
          </div>
          <Cpu size={18} className="text-white/35" />
        </div>
      </div>
      <a href="#projects" className="group mt-4 flex items-center justify-between border-b border-white/15 pb-2 text-xs uppercase tracking-[0.18em] text-white/50 transition-colors hover:border-cyan-200/60 hover:text-cyan-100">
        Inspect the work <ArrowUpRight size={15} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
      </a>
    </motion.aside>
  );
}