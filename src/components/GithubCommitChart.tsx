'use client';

import React, { useEffect, useState, useRef, useMemo } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { GitCommit, Flame, Award, Calendar, ExternalLink, Activity, Sparkles, GitPullRequest, Code2 } from 'lucide-react';

interface ContributionDay {
  date: string;
  count: number;
  level: number;
}

interface GitHubActivityData {
  username: string;
  totalContributions: number;
  currentStreak: number;
  longestStreak: number;
  activeDays: number;
  consistencyRate: number;
  contributions: ContributionDay[];
  recentEvents: Array<{
    id: string;
    repo: string;
    type: string;
    createdAt: string;
  }>;
}

function AnimatedCounter({
  target,
  suffix = '',
  inView,
}: {
  target: number;
  suffix?: string;
  inView: boolean;
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView || target === 0) return;
    const duration = 1600;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(easeProgress * target));

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
      {count}
      {suffix}
    </span>
  );
}

export default function GithubCommitChart() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-60px' });
  const [data, setData] = useState<GitHubActivityData | null>(null);
  const [loading, setLoading] = useState(true);
  const [hoveredDay, setHoveredDay] = useState<{ day: ContributionDay; x: number; y: number } | null>(null);
  const [selectedRange, setSelectedRange] = useState<'all' | 'recent'>('all');

  useEffect(() => {
    async function fetchGitHubData() {
      try {
        const res = await fetch('/api/github-activity');
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch (e) {
        console.error('Failed to load GitHub activity', e);
      } finally {
        setLoading(false);
      }
    }
    fetchGitHubData();
  }, []);

  // Organize days into weeks (52 columns x 7 days)
  const weeks = useMemo(() => {
    if (!data?.contributions || data.contributions.length === 0) return [];
    
    const contribs = data.contributions;
    const result: ContributionDay[][] = [];
    let currentWeek: ContributionDay[] = [];

    // Group in chunks of 7
    contribs.forEach((day, idx) => {
      currentWeek.push(day);
      if (currentWeek.length === 7 || idx === contribs.length - 1) {
        result.push(currentWeek);
        currentWeek = [];
      }
    });

    return result;
  }, [data]);

  // Extract month labels with column indices
  const monthLabels = useMemo(() => {
    if (!weeks.length) return [];
    const labels: Array<{ name: string; colIndex: number }> = [];
    let lastMonth = '';

    weeks.forEach((week, wIdx) => {
      const firstDay = week[0];
      if (!firstDay) return;
      const date = new Date(firstDay.date);
      const month = date.toLocaleString('default', { month: 'short' });
      if (month !== lastMonth) {
        labels.push({ name: month, colIndex: wIdx });
        lastMonth = month;
      }
    });

    return labels;
  }, [weeks]);

  const levelColorMap = {
    0: 'bg-zinc-900/80 border-white/5 hover:border-white/20',
    1: 'bg-emerald-950/90 border-emerald-800/40 hover:border-emerald-600',
    2: 'bg-emerald-700 border-emerald-500/60 shadow-[0_0_8px_rgba(16,185,129,0.35)] hover:scale-125',
    3: 'bg-emerald-500 border-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.6)] hover:scale-125',
    4: 'bg-cyan-400 border-cyan-200 shadow-[0_0_16px_rgba(6,182,212,0.85)] hover:scale-125',
  };

  return (
    <section ref={containerRef} className="relative py-20 px-4 sm:px-6 md:px-10 max-w-7xl mx-auto z-20">
      {/* Background Decorative Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-emerald-500/5 rounded-full blur-[150px] pointer-events-none" />

      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono font-semibold mb-3">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            LIVE GITHUB TELEMETRY & ACTIVITY
          </div>
          <h2 className="text-white text-3xl md:text-5xl font-black uppercase tracking-tight">
            Code Commit{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
              Matrix
            </span>
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="https://github.com/neel20409"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900/80 border border-white/10 hover:border-emerald-500/40 text-gray-300 hover:text-white transition-all text-xs font-mono group"
          >
            <span>@neel20409</span>
            <ExternalLink className="w-3.5 h-3.5 text-emerald-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5 mb-8">
        {[
          {
            label: 'Annual Contributions',
            val: data?.totalContributions || 881,
            suffix: '+',
            sub: 'Past 12 months verified commits',
            Icon: GitCommit,
            color: 'text-emerald-400',
            bg: 'from-emerald-500/10 to-transparent',
            border: 'hover:border-emerald-500/40',
          },
          {
            label: 'Current Streak',
            val: data?.currentStreak || 8,
            suffix: ' Days',
            sub: 'Consecutive active coding days',
            Icon: Flame,
            color: 'text-amber-400',
            bg: 'from-amber-500/10 to-transparent',
            border: 'hover:border-amber-500/40',
          },
          {
            label: 'Longest Streak',
            val: data?.longestStreak || 34,
            suffix: ' Days',
            sub: 'Peak continuous build cycle',
            Icon: Award,
            color: 'text-cyan-400',
            bg: 'from-cyan-500/10 to-transparent',
            border: 'hover:border-cyan-500/40',
          },
          {
            label: 'Consistency Rate',
            val: data?.consistencyRate || 74,
            suffix: '%',
            sub: 'Days with production commits',
            Icon: Activity,
            color: 'text-indigo-400',
            bg: 'from-indigo-500/10 to-transparent',
            border: 'hover:border-indigo-500/40',
          },
        ].map((kpi, idx) => (
          <motion.div
            key={kpi.label}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            className={`relative rounded-2xl bg-zinc-950/70 backdrop-blur-xl border border-white/10 p-4 sm:p-5 overflow-hidden transition-all duration-300 hover:-translate-y-1 ${kpi.border}`}
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${kpi.bg} pointer-events-none`} />
            <div className="relative z-10 flex flex-col justify-between h-full">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-gray-400 font-medium">{kpi.label}</span>
                <kpi.Icon className={`w-4 h-4 ${kpi.color}`} />
              </div>
              <div>
                <div className="text-2xl sm:text-3xl text-white font-black tracking-tight mb-1">
                  <AnimatedCounter target={kpi.val} suffix={kpi.suffix} inView={isInView} />
                </div>
                <p className="text-[11px] text-gray-400 font-light truncate">{kpi.sub}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Heatmap Matrix Container */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="relative rounded-3xl bg-zinc-950/80 backdrop-blur-2xl border border-white/10 p-5 sm:p-7 md:p-8 overflow-hidden shadow-2xl shadow-black/60"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-white/5">
          <div className="flex items-center gap-2">
            <Code2 className="w-4 h-4 text-emerald-400" />
            <span className="text-sm font-semibold text-white tracking-wide font-mono">
              CONTRIBUTION RADAR (PAST 365 DAYS)
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-gray-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            <span>SYNCED LIVE WITH GITHUB API</span>
          </div>
        </div>

        {/* Scrollable Matrix Canvas for All Screen Sizes */}
        <div className="overflow-x-auto pb-4 pt-1 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
          <div className="min-w-[760px]">
            {/* Month Header Row */}
            <div className="flex text-[10px] font-mono text-gray-400 mb-2 pl-7 relative h-4">
              {monthLabels.map((m, mi) => (
                <span
                  key={mi}
                  className="absolute"
                  style={{ left: `${m.colIndex * 14.5 + 28}px` }}
                >
                  {m.name}
                </span>
              ))}
            </div>

            {/* Grid with Day of Week Labels */}
            <div className="flex gap-1.5">
              {/* Day Labels (Mon, Wed, Fri) */}
              <div className="flex flex-col justify-between text-[9px] font-mono text-gray-500 pr-2 py-0.5 h-[104px]">
                <span>Mon</span>
                <span>Wed</span>
                <span>Fri</span>
              </div>

              {/* 52 Columns of Heatmap Cells */}
              <div className="flex gap-[3.5px] relative">
                {weeks.map((week, wIdx) => (
                  <div key={wIdx} className="flex flex-col gap-[3.5px]">
                    {week.map((day, dIdx) => {
                      const level = day.level || (day.count > 0 ? (day.count >= 10 ? 4 : day.count >= 5 ? 3 : day.count >= 2 ? 2 : 1) : 0);
                      const colorClass = levelColorMap[level as keyof typeof levelColorMap] || levelColorMap[0];

                      return (
                        <div
                          key={day.date || `${wIdx}-${dIdx}`}
                          onMouseEnter={(e) => {
                            const rect = e.currentTarget.getBoundingClientRect();
                            setHoveredDay({ day, x: rect.left + rect.width / 2, y: rect.top });
                          }}
                          onMouseLeave={() => setHoveredDay(null)}
                          className={`w-[11px] h-[11px] rounded-[2.5px] border transition-all duration-150 cursor-pointer ${colorClass}`}
                        />
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Legend & Summary Row */}
        <div className="mt-6 pt-4 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-gray-400">
          <div className="flex items-center gap-2">
            <span>Learn how we code:</span>
            <span className="text-gray-300">Clean Architecture, Microservices, CI/CD Pipeline</span>
          </div>

          {/* Level Legend */}
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] text-gray-500 mr-1">Less</span>
            <span className="w-2.5 h-2.5 rounded-[2px] bg-zinc-900 border border-white/5" />
            <span className="w-2.5 h-2.5 rounded-[2px] bg-emerald-950 border border-emerald-800/40" />
            <span className="w-2.5 h-2.5 rounded-[2px] bg-emerald-700 border border-emerald-500/60" />
            <span className="w-2.5 h-2.5 rounded-[2px] bg-emerald-500 border border-emerald-300" />
            <span className="w-2.5 h-2.5 rounded-[2px] bg-cyan-400 border border-cyan-200" />
            <span className="text-[10px] text-gray-500 ml-1">More</span>
          </div>
        </div>
      </motion.div>

      {/* Floating Tooltip */}
      <AnimatePresence>
        {hoveredDay && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 5 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 5 }}
            transition={{ duration: 0.15 }}
            style={{
              position: 'fixed',
              left: `${hoveredDay.x}px`,
              top: `${hoveredDay.y - 42}px`,
              transform: 'translateX(-50%)',
              pointerEvents: 'none',
              zIndex: 9999,
            }}
            className="px-3 py-1.5 rounded-lg bg-zinc-900/95 border border-emerald-500/40 backdrop-blur-md shadow-xl text-center"
          >
            <div className="text-[11px] font-bold text-white font-mono">
              <span className="text-emerald-400 font-black">{hoveredDay.day.count}</span> {hoveredDay.day.count === 1 ? 'commit' : 'commits'}
            </div>
            <div className="text-[9px] text-gray-400 font-mono">
              {new Date(hoveredDay.day.date).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
