'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  User,
  GraduationCap,
  Code2,
  Heart,
  ShieldCheck,
  Zap,
  Cpu,
  Download,
  ExternalLink,
  MapPin,
  Sparkles,
  Terminal,
  Compass,
  Layers,
  Database,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import { FloatingNav } from '@/components/ui/floating-navbar';
import { IconHome, IconMessage, IconUser } from '@tabler/icons-react';
import ContactSection from '@/components/ContactSection';
import NightSky from '@/components/NightSky';
import { sound } from '@/utils/soundEngine';

const SKILL_CATEGORIES = [
  {
    category: 'Frontend & 3D WebGL',
    icon: <Cpu className="w-4 h-4 text-cyan-400" />,
    skills: [
      { name: 'Next.js 15 / React 19', level: 95 },
      { name: 'Three.js & WebGL / AR', level: 90 },
      { name: 'TypeScript', level: 92 },
      { name: 'Tailwind CSS & Framer Motion', level: 94 },
    ],
  },
  {
    category: 'Backend & Distributed Systems',
    icon: <Layers className="w-4 h-4 text-indigo-400" />,
    skills: [
      { name: 'NestJS & Node.js', level: 92 },
      { name: 'PostgreSQL & Prisma ORM', level: 88 },
      { name: 'Redis & WebSocket Streams', level: 85 },
      { name: 'Docker & VPS Linux Infrastructure', level: 86 },
    ],
  },
];

const PHILOSOPHY_PILLARS = [
  {
    title: 'Zero-Lag Responsiveness',
    desc: 'Every millisecond matters. Optimizing SQL indexes, connection pooling, and sub-50ms distributed API endpoints.',
    icon: <Zap className="w-5 h-5 text-amber-400" />,
    border: 'hover:border-amber-500/40',
  },
  {
    title: 'Fault-Tolerant Resilience',
    desc: 'Designing multi-tenant SaaS architectures with automated backups, stateless microservices, and graceful error boundaries.',
    icon: <ShieldCheck className="w-5 h-5 text-emerald-400" />,
    border: 'hover:border-emerald-500/40',
  },
  {
    title: 'Spatial 3D & Computer Vision',
    desc: 'Pushing the boundaries of the browser with 60 FPS Three.js GPU shaders, FaceMesh landmark tracking, and AR clothes try-on.',
    icon: <Sparkles className="w-5 h-5 text-fuchsia-400" />,
    border: 'hover:border-fuchsia-500/40',
  },
];

export default function AboutPage() {
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(0);

  const navItems = [
    {
      name: 'Home',
      link: '/',
      icon: <IconHome className="h-4 w-4 text-neutral-400 dark:text-white" />,
    },
    {
      name: 'About',
      link: '/about',
      icon: <IconUser className="h-4 w-4 text-neutral-400 dark:text-white" />,
    },
    {
      name: 'Contact',
      link: '#contact',
      icon: <IconMessage className="h-4 w-4 text-neutral-400 dark:text-white" />,
    },
  ];

  return (
    <main className="relative min-h-screen bg-transparent overflow-x-hidden pt-24 sm:pt-28 pb-16 px-4 sm:px-6 md:px-10 lg:px-16">
      <NightSky />
      <FloatingNav navItems={navItems} />

      {/* Decorative Ambient Aura */}
      <div className="absolute top-24 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-indigo-600/10 rounded-full blur-[160px] pointer-events-none" />

      {/* Top Header */}
      <div className="max-w-7xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/25 text-indigo-300 text-xs font-mono font-semibold mb-4">
          <Terminal className="w-3.5 h-3.5 text-indigo-400" />
          SYSTEM_PROFILE // NEEL_BHATT_V2.5
        </div>

        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div>
            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white uppercase tracking-tight italic">
              Architect of{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-400 to-fuchsia-500">
                Intelligence
              </span>
            </h1>
            <p className="text-gray-300 text-sm sm:text-base md:text-lg max-w-2xl font-light mt-4 leading-relaxed">
              Full-Stack & Distributed Cloud Engineer crafting production-scale SaaS ecosystems, low-latency microservices, and interactive 3D WebGL experiences.
            </p>
          </div>

          {/* Status Badge */}
          <div className="flex items-center gap-3 px-4 sm:px-5 py-3 rounded-2xl bg-zinc-950/80 border border-emerald-500/30 backdrop-blur-xl shadow-lg shadow-emerald-950/20 w-fit">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <div className="flex flex-col">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400">Available For Projects</span>
              <span className="text-xs font-medium text-gray-200">Full-Stack & Cloud Architecture</span>
            </div>
          </div>
        </div>
      </div>

      {/* BENTO GRID */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        
        {/* BENTO CARD 1: Identity & Background (Span 2 cols on lg) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="md:col-span-2 lg:col-span-2 rounded-3xl bg-zinc-950/70 border border-white/10 p-5 sm:p-8 md:p-10 backdrop-blur-xl relative overflow-hidden group hover:border-indigo-500/40 transition-all duration-300 shadow-xl"
        >
          <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/10 rounded-bl-[6rem] pointer-events-none" />
          <div className="relative z-10 flex flex-col justify-between h-full">
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/70" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                  <div className="w-3 h-3 rounded-full bg-green-500/70" />
                </div>
                <span className="text-xs font-mono text-gray-500 uppercase tracking-widest">ABOUT.SYS</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                Hi, I'm <span className="text-indigo-400">Neel Bhatt</span>
              </h2>

              <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-6 font-light">
                I am a Full-Stack Engineer and BCA scholar at <span className="text-indigo-300 font-semibold">The Maharaja Sayajirao University of Baroda (MSU)</span>. 
                My focus lies at the intersection of robust backend infrastructure, distributed data modeling, and cutting-edge browser graphics.
              </p>

              <p className="text-gray-400 text-sm leading-relaxed mb-8 font-light">
                I architect and maintain production-scale software like <span className="text-white font-medium">OBIX 360</span> (Enterprise Multi-Tenant SaaS) and real-time computer vision applications utilizing <span className="text-cyan-300 font-medium">Three.js, MediaPipe FaceMesh, and NestJS</span>.
              </p>
            </div>

            {/* Quick Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-4 border-t border-white/10">
              <div className="flex items-center gap-2 text-xs text-gray-300">
                <GraduationCap className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                <span>BCA, MSU Baroda</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-300">
                <MapPin className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Vadodara, India</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-300 col-span-2 sm:col-span-1">
                <Code2 className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                <span>Full-Stack & AR</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* BENTO CARD 2: Interactive Tech Matrix (Span 2 cols) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="md:col-span-1 lg:col-span-2 rounded-3xl bg-zinc-950/70 border border-white/10 p-5 sm:p-8 backdrop-blur-xl relative overflow-hidden group hover:border-cyan-500/40 transition-all duration-300 shadow-xl"
        >
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Code2 className="w-5 h-5 text-cyan-400" />
              Technical Arsenal
            </h3>
            <div className="flex gap-1.5 bg-white/5 p-1 rounded-xl border border-white/10 w-fit">
              {SKILL_CATEGORIES.map((cat, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setActiveCategoryIndex(idx);
                    sound.playClick();
                  }}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                    activeCategoryIndex === idx
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {idx === 0 ? 'Frontend & 3D' : 'Backend & Cloud'}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {SKILL_CATEGORIES[activeCategoryIndex].skills.map((s, i) => (
              <div key={i} className="group/skill">
                <div className="flex justify-between text-xs font-medium mb-1.5">
                  <span className="text-gray-200">{s.name}</span>
                  <span className="text-cyan-400 font-mono">{s.level}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-white/5 border border-white/10 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${s.level}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className="h-full bg-gradient-to-r from-cyan-500 to-indigo-500 rounded-full"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-4 border-t border-white/10 flex flex-wrap gap-2">
            {['Next.js', 'NestJS', 'PostgreSQL', 'Three.js', 'Redis', 'Docker', 'Prisma', 'TypeScript'].map((tech, i) => (
              <span key={i} className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-[11px] font-mono text-gray-300">
                #{tech}
              </span>
            ))}
          </div>
        </motion.div>

        {/* BENTO CARD 3: Engineering Philosophy (Span 3 cols) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="md:col-span-3 lg:col-span-3 rounded-3xl bg-zinc-950/70 border border-white/10 p-5 sm:p-8 backdrop-blur-xl relative overflow-hidden shadow-xl"
        >
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Terminal className="w-5 h-5 text-indigo-400" />
            Core Engineering Principles
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {PHILOSOPHY_PILLARS.map((p, i) => (
              <div
                key={i}
                className={`p-4 sm:p-5 rounded-2xl bg-white/[0.03] border border-white/10 transition-all duration-300 hover:-translate-y-1 ${p.border}`}
              >
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 w-fit mb-3">
                  {p.icon}
                </div>
                <h4 className="text-white font-semibold text-sm mb-2">{p.title}</h4>
                <p className="text-gray-400 text-xs leading-relaxed font-light">{p.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* BENTO CARD 4: Quick Action & CV Download (Span 1 col) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="md:col-span-3 lg:col-span-1 rounded-3xl bg-gradient-to-br from-indigo-950/60 to-zinc-950/90 border border-indigo-500/30 p-5 sm:p-8 backdrop-blur-xl flex flex-col justify-between shadow-xl"
        >
          <div>
            <div className="p-3 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 w-fit mb-4 text-indigo-400">
              <Download className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Resume & Dossier</h3>
            <p className="text-gray-400 text-xs font-light leading-relaxed mb-6">
              Download complete PDF resume detailing career milestones, enterprise projects, and technical skills.
            </p>
          </div>

          <a
            href="/NeelBhatt_Resume.pdf"
            download="NeelBhatt_Resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => sound.playChime()}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 text-white text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 hover:brightness-110 active:scale-[0.98] transition-all shadow-lg shadow-indigo-600/30"
          >
            <span>Download CV</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </motion.div>

        {/* BENTO CARD 5: The Open Road & Heritage Exploration (Span 4 cols) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="col-span-1 md:col-span-3 lg:col-span-4 rounded-3xl bg-zinc-950/70 border border-white/10 p-5 sm:p-8 md:p-10 backdrop-blur-xl relative overflow-hidden group hover:border-fuchsia-500/40 transition-all duration-300 shadow-xl"
        >
          <div className="absolute top-0 right-0 w-96 h-96 bg-fuchsia-500/5 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-fuchsia-500/10 border border-fuchsia-500/30 text-fuchsia-400">
                <Heart className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">The Open Road & Heritage Geometry</h3>
                <span className="text-xs font-mono text-gray-400">PASSION // EQUILIBRIUM BEYOND SCREENS</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-mono bg-white/5 border border-white/10 text-gray-300">
                🏍️ Motorcycling
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-mono bg-white/5 border border-white/10 text-gray-300">
                🏛️ Heritage Architecture
              </span>
            </div>
          </div>

          <blockquote className="border-l-2 border-fuchsia-500/60 pl-6 my-4 italic text-gray-300 text-sm md:text-base font-light leading-relaxed">
            "When the screen fades to black, the pulse of the engine replaces the rhythm of the keyboard. I am a rider of the open road, seeking the silent wisdom carved into ancient stone. Between the hum of a moving bike and the weathered geometry of heritage monuments, I find the same structural beauty I seek in code: a balance of history, geometry, and the thrill of the unknown."
          </blockquote>
        </motion.div>

      </div>

      {/* Direct Contact Section */}
      <section id="contact" className="mt-28 relative z-10 w-full max-w-7xl mx-auto">
        <ContactSection />
      </section>
    </main>
  );
}