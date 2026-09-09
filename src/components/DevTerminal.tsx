'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal as TerminalIcon, X, Maximize2, Minimize2, CornerDownLeft, Sparkles, Copy, Check } from 'lucide-react';
import { sound } from '@/utils/soundEngine';

interface LogEntry {
  type: 'input' | 'output' | 'error' | 'success' | 'system';
  content: string | React.ReactNode;
}

export default function DevTerminal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [inputVal, setInputVal] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [isMaximized, setIsMaximized] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>([
    {
      type: 'system',
      content: (
        <div className="space-y-1 font-mono text-xs">
          <p className="text-emerald-400 font-bold">NEEL_OS v3.2.0 (x86_64-antigravity-darwin)</p>
          <p className="text-gray-400">Type <span className="text-indigo-400 font-bold">help</span> to view available system commands.</p>
          <p className="text-gray-500 text-[11px]">Tip: Use Up/Down arrows to navigate command history.</p>
        </div>
      ),
    },
  ]);

  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      sound.playWarp();
      setTimeout(() => inputRef.current?.focus(), 80);
    }
  }, [isOpen]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  // Global key listener for ~ or `
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '`' && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
        e.preventDefault();
        if (isOpen) onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleCommand = (cmdStr: string) => {
    const raw = cmdStr.trim();
    if (!raw) return;

    sound.playClick();
    const [command, ...args] = raw.toLowerCase().split(' ');

    setHistory((prev) => [...prev, raw]);
    setHistoryIndex(-1);

    const newLogs: LogEntry[] = [
      ...logs,
      { type: 'input', content: `$ ${raw}` },
    ];

    switch (command) {
      case 'help':
        newLogs.push({
          type: 'output',
          content: (
            <div className="space-y-1.5 font-mono text-xs text-gray-300">
              <p className="text-indigo-300 font-bold">Available Commands:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1 pl-2">
                <div><span className="text-emerald-400 font-semibold">about</span> - Background & engineering summary</div>
                <div><span className="text-emerald-400 font-semibold">skills</span> - Core stack & performance bars</div>
                <div><span className="text-emerald-400 font-semibold">projects</span> - Live SaaS & mobile links</div>
                <div><span className="text-emerald-400 font-semibold">cat resume</span> - View parsed JSON resume</div>
                <div><span className="text-emerald-400 font-semibold">hire</span> - Open recruiter fast-track modal</div>
                <div><span className="text-emerald-400 font-semibold">contact</span> - Email & WhatsApp direct links</div>
                <div><span className="text-emerald-400 font-semibold">sound [on|off]</span> - Toggle sound synthesis</div>
                <div><span className="text-emerald-400 font-semibold">whoami</span> - Display current user identity</div>
                <div><span className="text-emerald-400 font-semibold">clear</span> - Clear terminal buffer</div>
                <div><span className="text-emerald-400 font-semibold">exit</span> - Close terminal</div>
              </div>
            </div>
          ),
        });
        break;

      case 'about':
        newLogs.push({
          type: 'output',
          content: (
            <div className="space-y-1.5 font-mono text-xs text-gray-300">
              <p className="text-white font-bold">👤 Neel Bhatt — Full-Stack & Machine Learning Engineer</p>
              <p className="text-gray-400 leading-relaxed">
                BCA Student at The Maharaja Sayajirao University of Baroda (MSU Baroda). 
                Specializes in Next.js 15, NestJS, PostgreSQL, React Native (Expo), and Scikit-Learn.
                Built production SaaS <span className="text-emerald-400 font-semibold">OBIX 360</span>, AR Computer Vision apps, and real-time Socket.io platforms.
              </p>
            </div>
          ),
        });
        break;

      case 'skills':
        newLogs.push({
          type: 'output',
          content: (
            <div className="space-y-2 font-mono text-xs">
              <div className="flex items-center justify-between text-indigo-300">
                <span>Next.js / React 19 / TypeScript</span>
                <span className="text-emerald-400">95% [███████████████████░]</span>
              </div>
              <div className="flex items-center justify-between text-indigo-300">
                <span>NestJS / PostgreSQL / Redis</span>
                <span className="text-emerald-400">90% [██████████████████░░]</span>
              </div>
              <div className="flex items-center justify-between text-indigo-300">
                <span>React Native (Expo) / AR & Vision</span>
                <span className="text-emerald-400">88% [█████████████████░░░]</span>
              </div>
              <div className="flex items-center justify-between text-indigo-300">
                <span>Python / Scikit-Learn / ML Pipelines</span>
                <span className="text-emerald-400">85% [█████████████████░░░]</span>
              </div>
            </div>
          ),
        });
        break;

      case 'projects':
        newLogs.push({
          type: 'output',
          content: (
            <div className="space-y-1.5 font-mono text-xs">
              <p className="text-white font-bold">🚀 Live Projects & Deployments:</p>
              <p>• <span className="text-emerald-400 font-semibold">OBIX 360:</span> <a href="https://obix360.com" target="_blank" className="text-indigo-400 underline">https://obix360.com</a> (Enterprise SaaS)</p>
              <p>• <span className="text-emerald-400 font-semibold">Virtual Hat App:</span> <a href="https://virtual-hat-app.vercel.app/" target="_blank" className="text-indigo-400 underline">https://virtual-hat-app.vercel.app/</a> (AR Vision Try-On)</p>
              <p>• <span className="text-emerald-400 font-semibold">SyncWatch:</span> <a href="https://syncwatch-psi.vercel.app/" target="_blank" className="text-indigo-400 underline">https://syncwatch-psi.vercel.app/</a> (WebSocket Streaming)</p>
              <p>• <span className="text-emerald-400 font-semibold">AI Assistant:</span> <a href="https://neels-bot.vercel.app/" target="_blank" className="text-indigo-400 underline">https://neels-bot.vercel.app/</a> (Gemini Bot)</p>
            </div>
          ),
        });
        break;

      case 'cat':
        if (args[0] === 'resume' || args[0] === 'resume.json') {
          newLogs.push({
            type: 'output',
            content: (
              <pre className="text-[11px] text-emerald-400/90 font-mono bg-black/50 p-2.5 rounded-xl border border-white/10 overflow-x-auto">
{`{
  "name": "Neel Bhatt",
  "title": "Full-Stack Software Engineer & AI/ML Developer",
  "location": "Vadodara, Gujarat, India",
  "contact": {
    "email": "bhattneel2004@gmail.com",
    "phone": "+91-9265982724",
    "github": "https://github.com/neel20409"
  },
  "education": "BCA, MSU Baroda (Grad 2027)",
  "experience": "Clever Minds Software Intern (Wholesale Admin App)",
  "top_projects": ["OBIX 360", "Virtual Hat App", "SyncWatch", "ML 22+ Pipeline"]
}`}
              </pre>
            ),
          });
        } else {
          newLogs.push({ type: 'error', content: `cat: ${args[0] || ''}: No such file. Try 'cat resume'` });
        }
        break;

      case 'hire':
        sound.playChime();
        newLogs.push({
          type: 'success',
          content: (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-mono text-xs space-y-1">
              <p className="font-bold">⚡ Recruiter Fast Track Activated!</p>
              <p>Email: <a href="mailto:bhattneel2004@gmail.com" className="underline font-bold text-white">bhattneel2004@gmail.com</a></p>
              <p>WhatsApp: <a href="https://wa.me/919265982724" target="_blank" className="underline font-bold text-white">+91 9265982724</a></p>
              <p>Resume: <a href="/NeelBhatt_Resume.pdf" target="_blank" className="underline text-indigo-300">Download Official PDF</a></p>
            </div>
          ),
        });
        break;

      case 'sound':
        if (args[0] === 'on' || args[0] === 'off') {
          const state = sound.toggleSound();
          newLogs.push({ type: 'success', content: `Sound effects are now ${state ? 'ENABLED 🔊' : 'MUTED 🔇'}` });
        } else {
          const current = sound.getSoundState();
          newLogs.push({ type: 'output', content: `Sound is currently ${current ? 'ON' : 'OFF'}. Use 'sound on' or 'sound off'.` });
        }
        break;

      case 'whoami':
        newLogs.push({ type: 'output', content: 'guest@antigravity-guest-session (read/write access)' });
        break;

      case 'clear':
        setLogs([]);
        return;

      case 'exit':
      case 'quit':
        onClose();
        return;

      default:
        newLogs.push({
          type: 'error',
          content: `command not found: "${raw}". Type "help" for a list of commands.`,
        });
        break;
    }

    setLogs(newLogs);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    sound.playKey();
    if (e.key === 'Enter') {
      handleCommand(inputVal);
      setInputVal('');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length > 0) {
        const nextIdx = historyIndex === -1 ? history.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(nextIdx);
        setInputVal(history[nextIdx]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex !== -1) {
        const nextIdx = historyIndex + 1;
        if (nextIdx < history.length) {
          setHistoryIndex(nextIdx);
          setInputVal(history[nextIdx]);
        } else {
          setHistoryIndex(-1);
          setInputVal('');
        }
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[160] flex items-center justify-center p-3 md:p-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md cursor-pointer"
          />

          {/* Terminal Window */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 30 }}
            transition={{ type: 'spring', damping: 28, stiffness: 350 }}
            className={`relative flex flex-col rounded-2xl bg-zinc-950/95 border border-white/20 shadow-[0_0_80px_rgba(16,185,129,0.2)] backdrop-blur-2xl overflow-hidden pointer-events-auto transition-all duration-200 ${
              isMaximized ? 'w-full h-[95vh]' : 'w-full max-w-2xl h-[520px]'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Terminal Chrome Bar */}
            <div className="flex items-center justify-between px-4 py-3 bg-zinc-900/90 border-b border-white/10 select-none">
              <div className="flex items-center gap-2">
                <button onClick={onClose} className="w-3.5 h-3.5 rounded-full bg-red-500/80 hover:bg-red-500 transition-colors" />
                <button onClick={() => setLogs([])} className="w-3.5 h-3.5 rounded-full bg-yellow-500/80 hover:bg-yellow-500 transition-colors" title="Clear Buffer" />
                <button onClick={() => setIsMaximized(!isMaximized)} className="w-3.5 h-3.5 rounded-full bg-green-500/80 hover:bg-green-500 transition-colors" />
              </div>

              <div className="flex items-center gap-2 font-mono text-xs text-gray-300">
                <TerminalIcon className="w-3.5 h-3.5 text-emerald-400" />
                <span>neel@portfolio:~ (zsh)</span>
              </div>

              <div className="flex items-center gap-2 text-gray-400">
                <button onClick={() => setIsMaximized(!isMaximized)} className="hover:text-white transition-colors">
                  {isMaximized ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                </button>
                <button onClick={onClose} className="hover:text-white transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Terminal Body */}
            <div 
              className="flex-1 p-4 overflow-y-auto font-mono text-xs space-y-2.5 scrollbar-thin scrollbar-thumb-white/10"
              onClick={() => inputRef.current?.focus()}
            >
              {logs.map((log, i) => (
                <div key={i} className="leading-relaxed">
                  {log.type === 'input' && <div className="text-emerald-400 font-bold">{log.content}</div>}
                  {log.type === 'output' && <div className="text-gray-200">{log.content}</div>}
                  {log.type === 'error' && <div className="text-red-400">{log.content}</div>}
                  {log.type === 'success' && <div className="text-emerald-300">{log.content}</div>}
                  {log.type === 'system' && <div className="text-gray-400">{log.content}</div>}
                </div>
              ))}
              <div ref={bottomRef} />
            </div>

            {/* Interactive Command Input Line */}
            <div className="px-4 py-3 bg-black/60 border-t border-white/10 flex items-center gap-2 font-mono text-xs">
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <span>neel@dev:~$</span>
              </span>
              <input
                ref={inputRef}
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type 'help' or 'cat resume'..."
                className="flex-1 bg-transparent text-white focus:outline-none placeholder:text-gray-600 font-mono"
                autoComplete="off"
                spellCheck="false"
              />
              <CornerDownLeft className="w-3.5 h-3.5 text-gray-500" />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
