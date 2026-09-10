'use client';

import React, { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Activity, Cpu, ShieldCheck, Zap, Server, Globe2, Sparkles, TrendingUp } from 'lucide-react';

interface MetricItem {
  id: string;
  label: string;
  value: number;
  suffix: string;
  prefix?: string;
  decimals?: number;
  subtext: string;
  badge: string;
  Icon: React.ComponentType<{ className?: string }>;
  iconColor: string;
  gradient: string;
  borderGlow: string;
}

const METRICS_DATA: MetricItem[] = [
  {
    id: 'uptime',
    label: 'Production SaaS Availability',
    value: 99.9,
    decimals: 1,
    suffix: '%',
    subtext: 'High-availability Kubernetes & VPS multi-cluster',
    badge: 'Live SLA',
    Icon: ShieldCheck,
    iconColor: 'text-emerald-400',
    gradient: 'from-emerald-500/10 via-teal-500/5 to-transparent',
    borderGlow: 'group-hover:border-emerald-500/40',
  },
  {
    id: 'requests',
    label: 'Daily API Transactions',
    value: 15,
    suffix: 'k+',
    subtext: 'NestJS REST & Realtime WebSocket streams',
    badge: 'Throughput',
    Icon: Activity,
    iconColor: 'text-cyan-400',
    gradient: 'from-cyan-500/10 via-blue-500/5 to-transparent',
    borderGlow: 'group-hover:border-cyan-500/40',
  },
  {
    id: 'latency',
    label: 'P99 Microservice Latency',
    value: 45,
    prefix: '<',
    suffix: 'ms',
    subtext: 'Optimized PostgreSQL indexing & Redis caching',
    badge: 'Ultra Fast',
    Icon: Zap,
    iconColor: 'text-amber-400',
    gradient: 'from-amber-500/10 via-orange-500/5 to-transparent',
    borderGlow: 'group-hover:border-amber-500/40',
  },
  {
    id: 'fps',
    label: '3D & WebGL Engine Frame Rate',
    value: 60,
    suffix: ' FPS',
    subtext: 'Three.js & MediaPipe zero-lag GPU pipelines',
    badge: 'Buttery Smooth',
    Icon: Cpu,
    iconColor: 'text-indigo-400',
    gradient: 'from-indigo-500/10 via-purple-500/5 to-transparent',
    borderGlow: 'group-hover:border-indigo-500/40',
  },
];

function AnimatedCounter({
  target,
  decimals = 0,
  prefix = '',
  suffix = '',
  inView,
}: {
  target: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  inView: boolean;
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 1800;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const currentVal = easeProgress * target;
      setCount(currentVal);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(target);
      }
    };

    requestAnimationFrame(animate);
  }, [inView, target]);

  return (
    <span className="tabular-nums font-black">
      {prefix}
      {decimals > 0 ? count.toFixed(decimals) : Math.round(count)}
      {suffix}
    </span>
  );
}

export default function MetricsBentoGrid() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-80px' });

  return (
    <section ref={containerRef} className="relative py-20 px-4 sm:px-6 md:px-10 max-w-7xl mx-auto z-20">
      {/* Background Decorative Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-cyan-500/5 rounded-full blur-[140px] pointer-events-none" />

      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono font-semibold mb-3">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            LIVE TELEMETRY & METRICS
          </div>
          <h2 className="text-white text-3xl md:text-5xl font-black uppercase tracking-tight">
            Engineering{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-400 to-fuchsia-400">
              Benchmark
            </span>
          </h2>
        </div>
        <p className="text-gray-400 text-sm max-w-md font-light leading-relaxed">
          Real-time performance indicators measuring reliability, throughput, and sub-millisecond responsiveness across deployed platforms.
        </p>
      </div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {METRICS_DATA.map((item, idx) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: idx * 0.12 }}
            className={`group relative rounded-3xl bg-zinc-950/70 backdrop-blur-xl border border-white/10 p-6 md:p-7 overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-cyan-950/40 ${item.borderGlow}`}
          >
            {/* Ambient Card Background Gradient */}
            <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-50 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />

            {/* Corner Highlight */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-bl-[4rem] pointer-events-none" />

            <div className="relative z-10 flex flex-col h-full justify-between">
              {/* Top Row: Icon & Status Badge */}
              <div className="flex items-center justify-between mb-8">
                <div className="p-2.5 rounded-2xl bg-white/5 border border-white/10 group-hover:scale-110 transition-transform">
                  <item.Icon className={`w-5 h-5 ${item.iconColor}`} />
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider font-semibold bg-white/5 border border-white/10 text-gray-300">
                  {item.badge}
                </span>
              </div>

              {/* Middle Row: Animated Big Counter */}
              <div>
                <div className="text-4xl md:text-5xl text-white font-black tracking-tight mb-2">
                  <AnimatedCounter
                    target={item.value}
                    decimals={item.decimals}
                    prefix={item.prefix}
                    suffix={item.suffix}
                    inView={isInView}
                  />
                </div>
                <div className="text-sm font-semibold text-gray-200 tracking-wide mb-1">
                  {item.label}
                </div>
                <p className="text-xs text-gray-400 font-light leading-relaxed">
                  {item.subtext}
                </p>
              </div>

              {/* Bottom Decorative Line */}
              <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-[11px] text-gray-500 font-mono">
                <span className="flex items-center gap-1">
                  <TrendingUp className="w-3 h-3 text-emerald-400" />
                  Optimal
                </span>
                <span>NODE_OK</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
