"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Zap, Radio } from "lucide-react";

interface OverdriveOverlayProps {
  isActive: boolean;
}

export default function OverdriveOverlay({ isActive }: OverdriveOverlayProps) {
  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="pointer-events-none fixed inset-0 z-40 overflow-hidden"
        >
          {/* Neon Border Pulse */}
          <div className="absolute inset-0 border-2 border-cyan-400/40 shadow-[inset_0_0_80px_rgba(6,182,212,0.25)] animate-pulse" />

          {/* Top Status Banner */}
          <motion.div
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -30, opacity: 0 }}
            className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-3 px-4 py-1.5 rounded-full border border-cyan-400/50 bg-slate-950/80 backdrop-blur-xl shadow-[0_0_25px_rgba(6,182,212,0.4)]"
          >
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500" />
            </span>
            <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-cyan-200 flex items-center gap-1.5">
              <Zap size={13} className="text-rose-400 animate-bounce" />
              OVERDRIVE PROTOCOL ENGAGED
            </span>
            <span className="text-[9px] font-mono text-cyan-400/80 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800">
              WARP 9.8c
            </span>
          </motion.div>

          {/* Warp Streaks / Hyperspace Ray Grid */}
          <div className="absolute inset-0 opacity-40 mix-blend-screen">
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute h-0.5 rounded-full bg-gradient-to-r from-transparent via-cyan-300 to-transparent"
                style={{
                  top: `${8 + i * 8}%`,
                  left: `${(i * 17) % 70}%`,
                  width: `${120 + (i % 5) * 60}px`,
                }}
                animate={{
                  x: ["-100vw", "100vw"],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 0.8 + (i % 3) * 0.4,
                  ease: "easeInOut",
                  delay: (i * 0.1) % 0.8,
                }}
              />
            ))}
          </div>

          {/* Bottom Telemetry Chip */}
          <div className="absolute bottom-4 left-6 text-[10px] font-mono text-cyan-300/70 tracking-widest flex items-center gap-2">
            <Radio size={12} className="animate-spin text-cyan-400" />
            <span>GRAVITY MATRIX: ZERO-G // AMBIENT RESONANCE: 144Hz</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
