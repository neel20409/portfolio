"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ExternalLink, 
  RotateCw, 
  Smartphone, 
  Monitor, 
  Tablet, 
  X, 
  Play, 
  Eye, 
  Sparkles,
  Lock,
  Globe
} from 'lucide-react';

interface Project {
  title: string;
  tech: string;
  desc: string;
  link: string;
  image?: string | null;
  badge: string;
  badgeColor: string;
  canEmbed: boolean;
  domain: string;
}

const ProjectSection = () => {
  const [activePreviewProject, setActivePreviewProject] = useState<Project | null>(null);
  const [deviceMode, setDeviceMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [iframeKey, setIframeKey] = useState(0);
  const [isLoadingIframe, setIsLoadingIframe] = useState(true);

  const projects: Project[] = [
    {
      title: "OBIX 360",
      tech: "Next.js 15 • NestJS • Postgres • Docker",
      desc: "Multi-tenant enterprise SaaS & mobile POS platform with real-time order tracking, automated WhatsApp invoicing, and OTA updates.",
      link: "https://obix360.com",
      image: "/proof/obix.jpeg",
      badge: "🟢 Live Production",
      badgeColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
      canEmbed: true,
      domain: "obix360.com"
    },
    {
      title: "Sync Watch",
      tech: "Next.js • Socket.io • Node.js",
      desc: "Full-stack synchronized video streaming and watch-party platform with real-time room chat and WebSocket synchronization.",
      link: "https://syncwatch-psi.vercel.app/",
      image: "/proof/Pic3.png",
      badge: "🟢 Live Platform",
      badgeColor: "bg-cyan-500/10 text-cyan-400 border-cyan-500/30",
      canEmbed: true,
      domain: "syncwatch-psi.vercel.app"
    },
    {
      title: "Virtual Hat App",
      tech: "React • Three.js • MediaPipe AI",
      desc: "Real-time virtual hat try-on application featuring camera face mesh tracking, dynamic 3D overlay alignment, and interactive headwear filters.",
      link: "https://virtual-hat-app.vercel.app/",
      image: "/proof/virtualhat.png",
      badge: "🟢 Live AR Experience",
      badgeColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
      canEmbed: true,
      domain: "virtual-hat-app.vercel.app"
    },
    {
      title: "AI Chatbot",
      tech: "Gemini AI • React • Web Audio",
      desc: "Intelligent conversational assistant UI with contextual streaming token responses and natural language processing.",
      link: "https://neels-bot.vercel.app/",
      image: "/proof/Pic1.png",
      badge: "🤖 AI Assistant",
      badgeColor: "bg-blue-500/10 text-blue-400 border-blue-500/30",
      canEmbed: true,
      domain: "neels-bot.vercel.app"
    },
    {
      title: "Portfolio 3D",
      tech: "Three.js • R3F • Next.js",
      desc: "Interactive 3D avatar and spatial web experience with custom shaders, physics, and smooth camera transitions.",
      link: "https://github.com/neel20409/portfolio",
      image: null,
      badge: "⚡ 3D Experience",
      badgeColor: "bg-indigo-500/10 text-indigo-400 border-indigo-500/30",
      canEmbed: false,
      domain: "github.com/neel20409/portfolio"
    },
  ];

  const handleOpenPreview = (project: Project, e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLoadingIframe(true);
    setIframeKey((prev) => prev + 1);
    setActivePreviewProject(project);
    // Set default mobile mode for mobile AR apps if desired
    if (project.title === 'Virtual Hat App') {
      setDeviceMode('desktop');
    } else {
      setDeviceMode('desktop');
    }
  };

  const getContainerWidth = () => {
    switch (deviceMode) {
      case 'mobile':
        return 'max-w-[400px] h-[780px]';
      case 'tablet':
        return 'max-w-[768px] h-[820px]';
      case 'desktop':
      default:
        return 'max-w-6xl h-[85vh]';
    }
  };

  return (
    <div className="relative min-h-screen py-20 bg-transparent">
      {/* INTERACTIVE LIVE PREVIEW / DEVICE SIMULATOR MODAL */}
      <AnimatePresence>
        {activePreviewProject && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/85 backdrop-blur-xl p-3 md:p-6 overflow-hidden">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActivePreviewProject(null)}
              className="absolute inset-0 cursor-pointer"
            />

            {/* Modal Dialog (Simulated Browser Chrome) */}
            <motion.div
              initial={{ scale: 0.92, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 26, stiffness: 320 }}
              className={`relative w-full ${getContainerWidth()} flex flex-col rounded-3xl bg-zinc-950/95 border border-white/15 shadow-[0_0_80px_rgba(99,102,241,0.25)] backdrop-blur-2xl overflow-hidden pointer-events-auto transition-all duration-300 z-10`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Browser Header Bar */}
              <div className="flex items-center justify-between px-4 py-3 bg-zinc-900/90 border-b border-white/10 gap-3">
                {/* Window Traffic Lights */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActivePreviewProject(null)}
                    className="w-3.5 h-3.5 rounded-full bg-red-500/80 hover:bg-red-500 transition-colors cursor-pointer"
                    title="Close Preview"
                  />
                  <span className="w-3.5 h-3.5 rounded-full bg-yellow-500/80" />
                  <span className="w-3.5 h-3.5 rounded-full bg-green-500/80" />
                </div>

                {/* Device Viewport Switcher */}
                <div className="hidden sm:flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/10">
                  <button
                    onClick={() => setDeviceMode('desktop')}
                    className={`p-1.5 rounded-lg text-xs flex items-center gap-1.5 transition-all ${
                      deviceMode === 'desktop'
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'text-gray-400 hover:text-white'
                    }`}
                    title="Desktop View"
                  >
                    <Monitor className="w-3.5 h-3.5" />
                    <span className="hidden md:inline font-mono text-[11px]">Desktop</span>
                  </button>
                  <button
                    onClick={() => setDeviceMode('tablet')}
                    className={`p-1.5 rounded-lg text-xs flex items-center gap-1.5 transition-all ${
                      deviceMode === 'tablet'
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'text-gray-400 hover:text-white'
                    }`}
                    title="Tablet View"
                  >
                    <Tablet className="w-3.5 h-3.5" />
                    <span className="hidden md:inline font-mono text-[11px]">Tablet</span>
                  </button>
                  <button
                    onClick={() => setDeviceMode('mobile')}
                    className={`p-1.5 rounded-lg text-xs flex items-center gap-1.5 transition-all ${
                      deviceMode === 'mobile'
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'text-gray-400 hover:text-white'
                    }`}
                    title="Mobile View"
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                    <span className="hidden md:inline font-mono text-[11px]">Mobile</span>
                  </button>
                </div>

                {/* Interactive Address Bar */}
                <div className="flex-1 max-w-md hidden md:flex items-center justify-between px-3 py-1.5 bg-black/50 rounded-xl border border-white/10 text-xs font-mono text-gray-300">
                  <div className="flex items-center gap-2 truncate">
                    <Lock className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                    <span className="truncate text-gray-300">{activePreviewProject.link}</span>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1 flex-shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Live
                  </span>
                </div>

                {/* Action Controls */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setIsLoadingIframe(true);
                      setIframeKey((prev) => prev + 1);
                    }}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                    title="Reload Live Frame"
                  >
                    <RotateCw className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => window.open(activePreviewProject.link, '_blank')}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-500/40 text-indigo-300 hover:text-white text-xs font-semibold transition-all shadow-md active:scale-95"
                    title="Open in New Tab"
                  >
                    <span>Open Tab</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setActivePreviewProject(null)}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                    title="Close"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* IFrame Viewport Body */}
              <div className="relative flex-1 w-full bg-black overflow-hidden flex items-center justify-center">
                {/* Loading Spinner */}
                {isLoadingIframe && (
                  <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-zinc-950 gap-3">
                    <div className="w-8 h-8 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
                    <p className="text-xs font-mono text-gray-400 flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
                      Connecting to {activePreviewProject.domain}...
                    </p>
                  </div>
                )}

                {activePreviewProject.canEmbed ? (
                  <iframe
                    key={iframeKey}
                    src={activePreviewProject.link}
                    title={activePreviewProject.title}
                    onLoad={() => setIsLoadingIframe(false)}
                    allow="camera; microphone; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    className="w-full h-full border-0 bg-white"
                  />
                ) : (
                  <div className="p-8 text-center flex flex-col items-center justify-center gap-4">
                    <Globe className="w-12 h-12 text-indigo-400 animate-bounce" />
                    <h3 className="text-xl font-bold text-white">{activePreviewProject.title}</h3>
                    <p className="text-sm text-gray-400 max-w-md">{activePreviewProject.desc}</p>
                    <button
                      onClick={() => window.open(activePreviewProject.link, '_blank')}
                      className="mt-2 px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-all shadow-lg flex items-center gap-2"
                    >
                      <span>Visit External Repository</span>
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* PROJECT HEADING in the LEFT corner */}
      <div className="max-w-7xl mx-auto px-6 md:px-10 mb-8">
        <div className="flex items-center gap-3 mb-2">
          <span className="w-8 h-[2px] bg-indigo-500" />
          <span className="text-indigo-400 font-mono text-xs uppercase tracking-widest font-bold">Interactive Sandbox</span>
        </div>
        <h2 className="text-white text-5xl md:text-7xl font-black uppercase tracking-tighter italic opacity-20">
          Projects
        </h2>
      </div>

      {/* GRID VIEW: Constrained strictly to the LEFT half to guarantee the 3D Avatar has full right-half clearance */}
      <div className="relative z-10 w-full lg:w-[54%] xl:w-[50%] px-6 md:px-10 lg:pl-16 pb-40">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -8 }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              className="group relative overflow-hidden rounded-3xl bg-zinc-950/60 backdrop-blur-xl border border-white/10 hover:border-indigo-500/50 transition-all duration-500 shadow-2xl flex flex-col h-full"
            >
              {/* Card Browser Chrome Mockup Top Bar */}
              <div className="px-4 py-2.5 bg-white/[0.03] border-b border-white/10 flex items-center justify-between text-xs text-gray-400 font-mono">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-gray-400 truncate max-w-[150px]">
                  <Lock className="w-2.5 h-2.5 text-emerald-400 flex-shrink-0" />
                  <span className="truncate">{project.domain}</span>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border ${project.badgeColor}`}>
                  {project.badge}
                </span>
              </div>

              {/* Interactive Preview Container with Hover Actions */}
              <div className="relative h-52 w-full overflow-hidden bg-zinc-900">
                {project.image ? (
                  <motion.img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-90 group-hover:opacity-100"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-indigo-950/40 via-zinc-950 to-purple-950/40 p-6 text-center">
                    <Globe className="w-10 h-10 text-indigo-400 mb-2 opacity-80" />
                    <span className="text-xs font-mono text-gray-400">Interactive 3D Engine</span>
                  </div>
                )}

                {/* Dark Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent opacity-80 group-hover:opacity-40 transition-opacity duration-300" />

                {/* Live Preview Button Hover Overlay */}
                <div className="absolute inset-0 flex items-center justify-center gap-3 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-xs bg-black/40">
                  <button
                    onClick={(e) => handleOpenPreview(project, e)}
                    className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-all shadow-xl shadow-indigo-600/40 active:scale-95 cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Live Interactive Demo</span>
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(project.link, '_blank');
                    }}
                    className="p-2 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs transition-all active:scale-95 cursor-pointer"
                    title="Open External URL"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Content Description */}
              <div className="p-6 relative z-10 flex flex-col flex-grow">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-indigo-400 font-bold text-xs uppercase tracking-wider">{project.tech}</span>
                </div>
                <h3 className="text-white text-2xl font-bold group-hover:text-indigo-300 transition-colors duration-300">{project.title}</h3>
                <p className="text-gray-400 mt-2.5 text-xs md:text-sm leading-relaxed line-clamp-3 flex-grow">{project.desc}</p>

                {/* Bottom Action Row */}
                <div className="mt-5 pt-4 border-t border-white/5 flex items-center justify-between">
                  <button
                    onClick={(e) => handleOpenPreview(project, e)}
                    className="flex items-center gap-1.5 text-indigo-400 hover:text-indigo-300 font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Launch Live Preview</span>
                  </button>
                  <button
                    onClick={() => window.open(project.link, '_blank')}
                    className="text-gray-500 hover:text-white transition-colors"
                    title="Open in new tab"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Subtle Ambient Glow on Hover */}
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/20 via-cyan-500/15 to-purple-500/20 rounded-3xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectSection;
