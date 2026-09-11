'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Terminal, 
  Search, 
  ExternalLink, 
  Download, 
  Copy, 
  Check, 
  Sparkles, 
  Code, 
  Compass, 
  X,
  Zap,
  Volume2,
  VolumeX,
  Briefcase,
  TerminalSquare,
  Activity,
  Calendar
} from 'lucide-react';
import { VisitorCounter } from './VisitorCounter';
import DevTerminal from './DevTerminal';
import RecruiterModal from './RecruiterModal';
import { sound } from '@/utils/soundEngine';

interface CommandItem {
  id: string;
  category: string;
  title: string;
  subtitle?: string;
  icon: React.ReactNode;
  action: () => void;
  shortcut?: string;
}

export default function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [copied, setCopied] = useState(false);
  const [matrixActive, setMatrixActive] = useState(false);
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [isRecruiterOpen, setIsRecruiterOpen] = useState(false);
  const [isSoundOn, setIsSoundOn] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setIsSoundOn(sound.getSoundState());
  }, []);

  // Keyboard shortcut listener (Cmd+K / Ctrl+K and `)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        sound.playWarp();
        setIsOpen((prev) => !prev);
      }
      if (e.key === '`' && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
        e.preventDefault();
        sound.playWarp();
        setIsTerminalOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (isOpen) {
      sound.playWarp();
      setTimeout(() => inputRef.current?.focus(), 50);
      setSelectedIndex(0);
    }
  }, [isOpen]);

  const toggleSound = () => {
    const next = sound.toggleSound();
    setIsSoundOn(next);
  };

  const scrollToSection = (id: string) => {
    sound.playClick();
    setIsOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else if (id === 'about') {
      window.location.href = '/about';
    }
  };

  const copyEmail = () => {
    sound.playChime();
    navigator.clipboard.writeText('bhattneel2004@gmail.com');
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
      setIsOpen(false);
    }, 1500);
  };

  const toggleMatrixMode = () => {
    sound.playChime();
    setMatrixActive((prev) => !prev);
    setIsOpen(false);
  };

  const commands: CommandItem[] = [
    // Recruiter & Fast Track
    {
      id: 'action-recruiter',
      category: 'Recruiter Fast Track',
      title: 'Open Recruiter & Hiring Fast-Track',
      subtitle: '1-Click WhatsApp, Email & Candidate Summary',
      icon: <Zap className="w-4 h-4 text-emerald-400 fill-current" />,
      action: () => {
        sound.playClick();
        setIsRecruiterOpen(true);
        setIsOpen(false);
      },
      shortcut: '⚡',
    },
    {
      id: 'action-terminal',
      category: 'Developer Tools',
      title: 'Launch Interactive AI Dev Terminal CLI',
      subtitle: 'Type commands, cat resume, inspect stack',
      icon: <TerminalSquare className="w-4 h-4 text-emerald-400" />,
      action: () => {
        sound.playClick();
        setIsTerminalOpen(true);
        setIsOpen(false);
      },
      shortcut: '~',
    },

    // Navigation
    {
      id: 'nav-home',
      category: 'Navigation',
      title: 'Go to Hero & Overview',
      subtitle: '#hero',
      icon: <Compass className="w-4 h-4 text-indigo-400" />,
      action: () => scrollToSection('hero'),
    },
    {
      id: 'nav-journey',
      category: 'Navigation',
      title: 'Go to Career Journey',
      subtitle: '#journey',
      icon: <Compass className="w-4 h-4 text-indigo-400" />,
      action: () => scrollToSection('journey'),
    },
    {
      id: 'nav-tech',
      category: 'Navigation',
      title: 'Go to Tech Stack',
      subtitle: '#tech',
      icon: <Code className="w-4 h-4 text-cyan-400" />,
      action: () => scrollToSection('tech'),
    },
    {
      id: 'nav-metrics',
      category: 'Navigation',
      title: 'Go to Engineering Telemetry & Metrics',
      subtitle: '#metrics',
      icon: <Activity className="w-4 h-4 text-emerald-400" />,
      action: () => scrollToSection('metrics'),
    },
    {
      id: 'nav-datalab',
      category: 'Navigation',
      title: 'Launch Interactive AI / ML Data Lab',
      subtitle: '#datalab (K-Means, Regression, Neural Net)',
      icon: <Sparkles className="w-4 h-4 text-fuchsia-400" />,
      action: () => scrollToSection('datalab'),
    },
    {
      id: 'nav-projects',
      category: 'Navigation',
      title: 'Go to Featured Projects',
      subtitle: '#projects',
      icon: <Zap className="w-4 h-4 text-amber-400" />,
      action: () => scrollToSection('projects'),
    },
    {
      id: 'nav-contact',
      category: 'Navigation',
      title: 'Go to Contact Section',
      subtitle: '#contact',
      icon: <Compass className="w-4 h-4 text-emerald-400" />,
      action: () => scrollToSection('contact'),
    },
    {
      id: 'nav-about-page',
      category: 'Navigation',
      title: 'Open About Page',
      subtitle: '/about',
      icon: <Compass className="w-4 h-4 text-blue-400" />,
      action: () => {
        sound.playClick();
        window.location.href = '/about';
      },
    },

    // Projects & Live Demos
    {
      id: 'proj-obix',
      category: 'Live SaaS & Projects',
      title: 'Launch OBIX 360 (Enterprise SaaS)',
      subtitle: 'https://obix360.com',
      icon: <ExternalLink className="w-4 h-4 text-emerald-400" />,
      action: () => {
        sound.playClick();
        window.open('https://obix360.com', '_blank');
        setIsOpen(false);
      },
    },
    {
      id: 'proj-virtualhat',
      category: 'Live SaaS & Projects',
      title: 'Launch Virtual Hat App (AR / Face Mesh)',
      subtitle: 'https://virtual-hat-app.vercel.app/',
      icon: <ExternalLink className="w-4 h-4 text-emerald-400" />,
      action: () => {
        sound.playClick();
        window.open('https://virtual-hat-app.vercel.app/', '_blank');
        setIsOpen(false);
      },
    },
    {
      id: 'proj-syncwatch',
      category: 'Live SaaS & Projects',
      title: 'Launch Sync Watch Platform',
      subtitle: 'https://syncwatch-psi.vercel.app/',
      icon: <ExternalLink className="w-4 h-4 text-cyan-400" />,
      action: () => {
        sound.playClick();
        window.open('https://syncwatch-psi.vercel.app/', '_blank');
        setIsOpen(false);
      },
    },
    {
      id: 'proj-bot',
      category: 'Live SaaS & Projects',
      title: 'Launch AI Assistant Bot',
      subtitle: 'Gemini AI Assistant',
      icon: <ExternalLink className="w-4 h-4 text-purple-400" />,
      action: () => {
        sound.playClick();
        window.open('https://neels-bot.vercel.app/', '_blank');
        setIsOpen(false);
      },
    },

    // Background Themes
    {
      id: 'theme-nebula',
      category: 'Visual Themes',
      title: 'Theme: Deep Nebula Starfield',
      subtitle: 'Liquid cosmic clouds & twinkling starlight',
      icon: <Sparkles className="w-4 h-4 text-indigo-400" />,
      action: () => {
        sound.playChime();
        window.dispatchEvent(new CustomEvent('set-bg-theme', { detail: 'nebula' }));
        setIsOpen(false);
      },
    },
    {
      id: 'theme-matrix',
      category: 'Visual Themes',
      title: 'Theme: Cyberpunk Matrix Rain',
      subtitle: 'Cascading digital glyphs & hacker aesthetics',
      icon: <Terminal className="w-4 h-4 text-emerald-400" />,
      action: () => {
        sound.playChime();
        window.dispatchEvent(new CustomEvent('set-bg-theme', { detail: 'matrix' }));
        setIsOpen(false);
      },
    },
    {
      id: 'theme-constellations',
      category: 'Visual Themes',
      title: 'Theme: Deep Space Constellations',
      subtitle: 'Interactive geometric node network',
      icon: <Zap className="w-4 h-4 text-cyan-400" />,
      action: () => {
        sound.playChime();
        window.dispatchEvent(new CustomEvent('set-bg-theme', { detail: 'constellations' }));
        setIsOpen(false);
      },
    },
    {
      id: 'theme-cybergrid',
      category: 'Visual Themes',
      title: 'Theme: 3D Cyber Neon Grid',
      subtitle: 'Synthwave perspective wireframe horizon',
      icon: <Code className="w-4 h-4 text-fuchsia-400" />,
      action: () => {
        sound.playChime();
        window.dispatchEvent(new CustomEvent('set-bg-theme', { detail: 'cybergrid' }));
        setIsOpen(false);
      },
    },

    // Quick Actions
    {
      id: 'action-copy-email',
      category: 'Quick Actions',
      title: copied ? 'Email Copied!' : 'Copy Email Address',
      subtitle: 'bhattneel2004@gmail.com',
      icon: copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-indigo-400" />,
      action: copyEmail,
      shortcut: '↵',
    },
    {
      id: 'action-download-cv',
      category: 'Quick Actions',
      title: 'Download Curriculum Vitae (CV)',
      subtitle: 'NeelBhatt_Resume.pdf',
      icon: <Download className="w-4 h-4 text-indigo-400" />,
      action: () => {
        sound.playClick();
        window.open('/NeelBhatt_Resume.pdf', '_blank');
        setIsOpen(false);
      },
    },
    {
      id: 'action-schedule-call',
      category: 'Quick Actions',
      title: 'Schedule Discovery Call (Cal.com)',
      subtitle: 'https://cal.com/bhatt-neel-7c2u0l',
      icon: <Calendar className="w-4 h-4 text-amber-400" />,
      action: () => {
        sound.playClick();
        window.open('https://cal.com/bhatt-neel-7c2u0l', '_blank');
        setIsOpen(false);
      },
    },
    {
      id: 'action-matrix',
      category: 'Easter Eggs',
      title: matrixActive ? 'Disable Matrix Rain Overlay' : 'Toggle Matrix Digital Rain Overlay',
      subtitle: 'Cyberpunk Mode',
      icon: <Sparkles className="w-4 h-4 text-emerald-400" />,
      action: toggleMatrixMode,
    },
  ];

  const filteredCommands = commands.filter(
    (c) =>
      c.title.toLowerCase().includes(query.toLowerCase()) ||
      c.category.toLowerCase().includes(query.toLowerCase()) ||
      (c.subtitle && c.subtitle.toLowerCase().includes(query.toLowerCase()))
  );

  return (
    <>
      {/* Floating Unified Top Right Glass Status Dock */}
      <div className="fixed top-5 right-4 md:right-8 z-50 flex items-center gap-2">
        {/* Recruiter Fast-Track Button */}
        <button
          onClick={() => {
            sound.playClick();
            setIsRecruiterOpen(true);
          }}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 text-xs font-semibold backdrop-blur-xl shadow-lg shadow-emerald-950/40 transition-all active:scale-95 cursor-pointer"
          title="Recruiter Fast-Track"
        >
          <Zap className="w-3.5 h-3.5 fill-current text-emerald-400 animate-pulse" />
          <span>Hire</span>
        </button>

        {/* Terminal Button */}
        <button
          onClick={() => {
            sound.playClick();
            setIsTerminalOpen(true);
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white text-xs font-mono backdrop-blur-xl shadow-lg transition-all active:scale-95 cursor-pointer"
          title="Open Terminal CLI (~)"
        >
          <TerminalSquare className="w-3.5 h-3.5 text-emerald-400" />
          <span className="hidden md:inline">CLI</span>
        </button>

        {/* HUD ⌘K Trigger Button */}
        <button
          onClick={() => {
            sound.playClick();
            setIsOpen(true);
          }}
          className="group flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-white/10 backdrop-blur-xl border border-white/10 hover:border-indigo-500/50 text-xs font-mono text-gray-300 hover:text-white transition-all shadow-lg shadow-black/40 active:scale-95 cursor-pointer"
          title="Open Command Palette (⌘K)"
        >
          <Terminal className="w-3.5 h-3.5 text-indigo-400 group-hover:animate-pulse" />
          <span className="font-semibold tracking-wide">HUD</span>
          <kbd className="px-1.5 py-0.5 text-[10px] font-sans font-bold bg-white/10 rounded border border-white/10 text-gray-400 group-hover:text-indigo-200">
            ⌘K
          </kbd>
        </button>

        {/* Sound Toggle */}
        <button
          onClick={toggleSound}
          className="p-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white text-xs backdrop-blur-xl shadow-lg transition-all active:scale-95 cursor-pointer"
          title={isSoundOn ? 'Mute Sound FX' : 'Enable Sound FX'}
        >
          {isSoundOn ? <Volume2 className="w-3.5 h-3.5 text-indigo-400" /> : <VolumeX className="w-3.5 h-3.5 text-gray-500" />}
        </button>

        {/* Live Visitor Counter */}
        <VisitorCounter />
      </div>

      {/* DEV TERMINAL CLI MODAL */}
      <DevTerminal isOpen={isTerminalOpen} onClose={() => setIsTerminalOpen(false)} />

      {/* RECRUITER FAST-TRACK MODAL */}
      <RecruiterModal isOpen={isRecruiterOpen} onClose={() => setIsRecruiterOpen(false)} />

      {/* MATRIX DIGITAL RAIN OVERLAY (EASTER EGG) */}
      {matrixActive && <MatrixCanvas onClose={() => setMatrixActive(false)} />}

      {/* COMMAND PALETTE MODAL */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[150] flex items-start justify-center pt-20 md:pt-32 p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md cursor-pointer"
            />

            {/* Modal Dialog */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ type: 'spring', damping: 28, stiffness: 350 }}
              className="relative w-full max-w-xl rounded-3xl bg-zinc-950/95 border border-white/15 shadow-[0_0_60px_rgba(99,102,241,0.25)] backdrop-blur-2xl overflow-hidden pointer-events-auto"
            >
              {/* Header Search Bar */}
              <div className="flex items-center gap-3 px-5 py-4 border-b border-white/10">
                <Search className="w-5 h-5 text-gray-400 flex-shrink-0" />
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Type a command or search (e.g. obix, hire, cli, cv)..."
                  value={query}
                  onChange={(e) => {
                    sound.playKey();
                    setQuery(e.target.value);
                    setSelectedIndex(0);
                  }}
                  className="w-full bg-transparent text-white placeholder:text-gray-500 text-sm md:text-base focus:outline-none font-sans"
                />
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-500 hover:text-white p-1 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Results List */}
              <div className="max-h-[380px] overflow-y-auto p-3 space-y-1 scrollbar-thin scrollbar-thumb-white/10">
                {filteredCommands.length === 0 ? (
                  <div className="py-12 text-center text-gray-500 text-sm">
                    <p>No commands matched &quot;{query}&quot;</p>
                  </div>
                ) : (
                  filteredCommands.map((cmd, i) => (
                    <button
                      key={cmd.id}
                      onClick={cmd.action}
                      onMouseEnter={() => {
                        sound.playHover();
                        setSelectedIndex(i);
                      }}
                      className={`w-full flex items-center justify-between p-3 rounded-2xl text-left transition-all duration-150 group ${
                        selectedIndex === i
                          ? 'bg-indigo-600/20 border border-indigo-500/40 text-white'
                          : 'hover:bg-white/5 border border-transparent text-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-3 truncate">
                        <div
                          className={`w-8 h-8 rounded-xl flex items-center justify-center border transition-colors ${
                            selectedIndex === i
                              ? 'bg-indigo-500/30 border-indigo-400/50'
                              : 'bg-white/5 border-white/10 group-hover:bg-white/10'
                          }`}
                        >
                          {cmd.icon}
                        </div>
                        <div className="flex flex-col truncate">
                          <span className="text-sm font-semibold truncate">{cmd.title}</span>
                          {cmd.subtitle && (
                            <span className="text-[11px] text-gray-400 font-mono truncate">{cmd.subtitle}</span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-[10px] uppercase font-bold text-gray-500 px-2 py-0.5 rounded bg-white/5 border border-white/5">
                          {cmd.category}
                        </span>
                        {cmd.shortcut && (
                          <kbd className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/10 text-gray-300">
                            {cmd.shortcut}
                          </kbd>
                        )}
                      </div>
                    </button>
                  ))
                )}
              </div>

              {/* Footer info bar */}
              <div className="px-5 py-3 bg-white/[0.02] border-t border-white/5 flex items-center justify-between text-[11px] text-gray-500 font-mono">
                <span>Navigate with mouse or shortcuts</span>
                <div className="flex items-center gap-3">
                  <span>ESC to close</span>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

// MATRIX DIGITAL RAIN CANVAS
function MatrixCanvas({ onClose }: { onClose: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const chars = '01NEELBHATTOBIX360REACTNEXTJSNESTJSTHREEJS010101XYZ';
    const fontSize = 15;
    const columns = Math.floor(width / fontSize);
    const drops = Array.from({ length: columns }, () => Math.random() * -100);

    let animId: number;

    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
      ctx.fillRect(0, 0, width, height);

      ctx.fillStyle = '#00ff66';
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        ctx.fillStyle = Math.random() > 0.9 ? '#ffffff' : '#00ff66';
        ctx.fillText(text, x, y);

        if (y > height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }

      animId = requestAnimationFrame(draw);
    };

    draw();

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[120] pointer-events-auto bg-black/90 flex items-center justify-center">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />
      <button
        onClick={onClose}
        className="absolute top-6 right-6 px-4 py-2 rounded-full bg-emerald-500/20 hover:bg-emerald-500/40 border border-emerald-500/50 text-emerald-300 font-mono text-xs z-30 backdrop-blur-md transition-all active:scale-95"
      >
        ✕ Exit Matrix Mode
      </button>
    </div>
  );
}
