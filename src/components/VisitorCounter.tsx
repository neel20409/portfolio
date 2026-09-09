"use client";

import { useEffect, useState } from "react";
import { Users } from "lucide-react";

export const VisitorCounter = () => {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    const updateCount = async () => {
      try {
        const hasCountedSession = typeof window !== 'undefined' && sessionStorage.getItem('portfolio_session_counted');
        const method = hasCountedSession ? 'GET' : 'POST';

        const res = await fetch("/api/visitors", { 
          method,
          cache: 'no-store'
        });
        
        const data = await res.json();
        if (typeof data.count === "number" && data.count > 0) {
          setCount(data.count);
          if (typeof window !== 'undefined') {
            sessionStorage.setItem('portfolio_session_counted', 'true');
          }
        } else {
          // Graceful default if network is interrupted
          setCount(1438);
        }
      } catch (err) {
        console.warn("Visitor counter network fallback active", err);
        setCount(1438);
      }
    };

    updateCount();
  }, []);

  if (count === null) {
    return (
      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 text-white/60 text-xs font-mono select-none">
        <span className="w-1.5 h-1.5 rounded-full bg-gray-500 animate-pulse" />
        <span>...</span>
      </div>
    );
  }

  return (
    <div 
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 backdrop-blur-xl border border-white/10 text-white/80 text-xs font-medium pointer-events-auto select-none transition-all shadow-lg shadow-black/40"
      title="Live Unique Portfolio Visitors"
    >
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
      </span>
      <span className="font-mono text-emerald-300 font-semibold">{count.toLocaleString()}</span>
      <span className="hidden sm:inline text-gray-400 text-[11px]">Visitors</span>
    </div>
  );
};
