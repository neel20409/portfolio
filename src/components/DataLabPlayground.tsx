'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Activity,
  Cpu,
  Sparkles,
  RefreshCw,
  Play,
  RotateCcw,
  Sliders,
  TrendingUp,
  BrainCircuit,
  Binary,
  Layers,
  BarChart3,
  FlaskConical,
  Zap,
} from 'lucide-react';
import { sound } from '@/utils/soundEngine';

type LabMode = 'kmeans' | 'regression' | 'neural';

interface DataPoint {
  x: number;
  y: number;
  cluster?: number;
}

interface Centroid {
  x: number;
  y: number;
  color: string;
}

const CLUSTER_COLORS = [
  '#06b6d4', // Cyan
  '#10b981', // Emerald
  '#ec4899', // Pink
  '#f59e0b', // Amber
  '#8b5cf6', // Purple
  '#3b82f6', // Blue
];

export default function DataLabPlayground() {
  const [activeMode, setActiveMode] = useState<LabMode>('kmeans');

  // --- K-MEANS STATE ---
  const [kCount, setKCount] = useState<number>(3);
  const [points, setPoints] = useState<DataPoint[]>([]);
  const [centroids, setCentroids] = useState<Centroid[]>([]);
  const [iteration, setIteration] = useState<number>(0);
  const [inertia, setInertia] = useState<number>(0);
  const [isAutoRunning, setIsAutoRunning] = useState<boolean>(false);
  const kmeansCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // --- REGRESSION STATE ---
  const [regPoints, setRegPoints] = useState<{ x: number; y: number }[]>([]);
  const [regDegree, setRegDegree] = useState<number>(1);
  const [mseLoss, setMseLoss] = useState<number>(0);
  const [r2Score, setR2Score] = useState<number>(0);
  const regCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // --- NEURAL NET STATE ---
  const [inputX1, setInputX1] = useState<number>(0.65);
  const [inputX2, setInputX2] = useState<number>(-0.4);
  const [activationFn, setActivationFn] = useState<'relu' | 'sigmoid' | 'tanh' | 'gelu'>('relu');
  const [weightSeed, setWeightSeed] = useState<number>(1);
  const [nnTime, setNnTime] = useState<number>(0);

  // ==========================================
  // K-MEANS INITIALIZATION & ALGORITHM
  // ==========================================
  const generateGaussianData = (type: 'blobs' | 'spiral' | 'random' = 'blobs') => {
    sound.playClick();
    const newPoints: DataPoint[] = [];
    if (type === 'blobs') {
      const centers = [
        { cx: 0.25, cy: 0.3 },
        { cx: 0.75, cy: 0.35 },
        { cx: 0.5, cy: 0.75 },
        { cx: 0.2, cy: 0.8 },
      ];
      for (let i = 0; i < 90; i++) {
        const c = centers[i % Math.min(centers.length, kCount + 1)];
        const u = Math.random() + Math.random() - 1;
        const v = Math.random() + Math.random() - 1;
        newPoints.push({
          x: Math.max(0.05, Math.min(0.95, c.cx + u * 0.1)),
          y: Math.max(0.05, Math.min(0.95, c.cy + v * 0.1)),
        });
      }
    } else {
      for (let i = 0; i < 80; i++) {
        newPoints.push({
          x: Math.random() * 0.9 + 0.05,
          y: Math.random() * 0.9 + 0.05,
        });
      }
    }

    // Init centroids
    const newCentroids: Centroid[] = [];
    for (let k = 0; k < kCount; k++) {
      const pt = newPoints[Math.floor(Math.random() * newPoints.length)] || { x: Math.random(), y: Math.random() };
      newCentroids.push({
        x: pt.x + (Math.random() - 0.5) * 0.05,
        y: pt.y + (Math.random() - 0.5) * 0.05,
        color: CLUSTER_COLORS[k % CLUSTER_COLORS.length],
      });
    }

    setPoints(newPoints);
    setCentroids(newCentroids);
    setIteration(0);
    setIsAutoRunning(false);
  };

  useEffect(() => {
    generateGaussianData('blobs');
  }, [kCount]);

  const stepKMeans = () => {
    if (points.length === 0 || centroids.length === 0) return;
    sound.playBlip ? sound.playBlip() : sound.playChime();

    // 1. Assignment step
    let currentInertia = 0;
    const assignedPoints = points.map((p) => {
      let minDist = Infinity;
      let closestK = 0;
      centroids.forEach((c, idx) => {
        const d = Math.pow(p.x - c.x, 2) + Math.pow(p.y - c.y, 2);
        if (d < minDist) {
          minDist = d;
          closestK = idx;
        }
      });
      currentInertia += minDist;
      return { ...p, cluster: closestK };
    });

    // 2. Update centroids step
    const newCentroids = centroids.map((c, k) => {
      const clusterPts = assignedPoints.filter((p) => p.cluster === k);
      if (clusterPts.length === 0) return c;
      const sumX = clusterPts.reduce((acc, p) => acc + p.x, 0);
      const sumY = clusterPts.reduce((acc, p) => acc + p.y, 0);
      return {
        ...c,
        x: sumX / clusterPts.length,
        y: sumY / clusterPts.length,
      };
    });

    setPoints(assignedPoints);
    setCentroids(newCentroids);
    setInertia(parseFloat((currentInertia * 100).toFixed(2)));
    setIteration((prev) => prev + 1);
  };

  // Auto-run convergence
  useEffect(() => {
    if (!isAutoRunning) return;
    const interval = setInterval(() => {
      stepKMeans();
    }, 450);
    return () => clearInterval(interval);
  }, [isAutoRunning, points, centroids]);

  // Render K-Means Canvas
  useEffect(() => {
    const canvas = kmeansCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = (canvas.width = canvas.clientWidth);
    const h = (canvas.height = canvas.clientHeight);

    ctx.fillStyle = '#05070f';
    ctx.fillRect(0, 0, w, h);

    // Subtle Coordinate Grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
    ctx.lineWidth = 1;
    for (let x = 0; x < w; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let y = 0; y < h; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    // Connect points to centroids with faint lines
    points.forEach((p) => {
      if (p.cluster !== undefined && centroids[p.cluster]) {
        const c = centroids[p.cluster];
        ctx.strokeStyle = c.color;
        ctx.globalAlpha = 0.15;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(p.x * w, p.y * h);
        ctx.lineTo(c.x * w, c.y * h);
        ctx.stroke();
      }
    });

    // Draw Data Points
    points.forEach((p) => {
      const color = p.cluster !== undefined && centroids[p.cluster] ? centroids[p.cluster].color : '#94a3b8';
      ctx.globalAlpha = 0.85;
      ctx.fillStyle = color;
      ctx.shadowColor = color;
      ctx.shadowBlur = 6;
      ctx.beginPath();
      ctx.arc(p.x * w, p.y * h, 4.5, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.shadowBlur = 0;

    // Draw Centroids with Crosshairs & Pulsing Halo
    centroids.forEach((c) => {
      const cx = c.x * w;
      const cy = c.y * h;

      // Halo
      ctx.globalAlpha = 0.25;
      ctx.fillStyle = c.color;
      ctx.beginPath();
      ctx.arc(cx, cy, 18, 0, Math.PI * 2);
      ctx.fill();

      // Crosshair
      ctx.globalAlpha = 1;
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.shadowColor = c.color;
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.arc(cx, cy, 8, 0, Math.PI * 2);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(cx - 12, cy);
      ctx.lineTo(cx + 12, cy);
      ctx.moveTo(cx, cy - 12);
      ctx.lineTo(cx, cy + 12);
      ctx.stroke();
    });
    ctx.shadowBlur = 0;
    ctx.globalAlpha = 1;
  }, [points, centroids]);

  // Handle manual click to add data point
  const handleKMeansCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = kmeansCanvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    sound.playClick();

    setPoints((prev) => [...prev, { x, y }]);
  };

  // ==========================================
  // POLYNOMIAL REGRESSION ALGORITHM
  // ==========================================
  const generateRegressionData = (type: 'linear' | 'poly' | 'noisy' = 'poly') => {
    sound.playClick();
    const pts: { x: number; y: number }[] = [];
    for (let i = 0; i < 45; i++) {
      const x = i / 44;
      let y = 0.5;
      if (type === 'linear') {
        y = 0.2 + 0.6 * x + (Math.random() - 0.5) * 0.15;
      } else if (type === 'poly') {
        y = 0.25 + 1.2 * x - 1.1 * x * x + (Math.random() - 0.5) * 0.12;
      } else {
        y = 0.5 + 0.35 * Math.sin(x * Math.PI * 2) + (Math.random() - 0.5) * 0.15;
      }
      pts.push({ x, y: Math.max(0.05, Math.min(0.95, y)) });
    }
    setRegPoints(pts);
  };

  useEffect(() => {
    generateRegressionData('poly');
  }, []);

  // Compute Polynomial Fit (Least Squares via Matrix Normal Equations)
  const fittedCurve = useMemo(() => {
    if (regPoints.length < regDegree + 1) return { coeffs: [], points: [] };

    const n = regPoints.length;
    const m = regDegree + 1;

    // Build Vandermonde Matrix X and Vector Y
    const A: number[][] = Array.from({ length: m }, () => Array(m).fill(0));
    const B: number[] = Array(m).fill(0);

    for (let i = 0; i < m; i++) {
      for (let j = 0; j < m; j++) {
        let sum = 0;
        for (let k = 0; k < n; k++) {
          sum += Math.pow(regPoints[k].x, i + j);
        }
        A[i][j] = sum;
      }
      let sumY = 0;
      for (let k = 0; k < n; k++) {
        sumY += regPoints[k].y * Math.pow(regPoints[k].x, i);
      }
      B[i] = sumY;
    }

    // Gaussian Elimination with Partial Pivoting
    for (let i = 0; i < m; i++) {
      let maxEl = Math.abs(A[i][i]);
      let maxRow = i;
      for (let k = i + 1; k < m; k++) {
        if (Math.abs(A[k][i]) > maxEl) {
          maxEl = Math.abs(A[k][i]);
          maxRow = k;
        }
      }
      for (let k = i; k < m; k++) {
        const tmp = A[maxRow][k];
        A[maxRow][k] = A[i][k];
        A[i][k] = tmp;
      }
      const tmpB = B[maxRow];
      B[maxRow] = B[i];
      B[i] = tmpB;

      for (let k = i + 1; k < m; k++) {
        const c = -A[k][i] / (A[i][i] || 1e-7);
        for (let j = i; j < m; j++) {
          if (i === j) A[k][j] = 0;
          else A[k][j] += c * A[i][j];
        }
        B[k] += c * B[i];
      }
    }

    const coeffs: number[] = Array(m).fill(0);
    for (let i = m - 1; i >= 0; i--) {
      coeffs[i] = B[i] / (A[i][i] || 1e-7);
      for (let k = i - 1; k >= 0; k--) {
        B[k] -= A[k][i] * coeffs[i];
      }
    }

    const evalPoly = (x: number) => {
      let val = 0;
      for (let i = 0; i < coeffs.length; i++) {
        val += coeffs[i] * Math.pow(x, i);
      }
      return val;
    };

    // Calculate MSE & R2
    let sse = 0;
    let sumY = regPoints.reduce((acc, p) => acc + p.y, 0);
    let meanY = sumY / n;
    let sst = 0;

    regPoints.forEach((p) => {
      const pred = evalPoly(p.x);
      sse += Math.pow(p.y - pred, 2);
      sst += Math.pow(p.y - meanY, 2);
    });

    const mse = sse / n;
    const r2 = Math.max(0, Math.min(1, sst > 0 ? 1 - sse / sst : 0));

    setMseLoss(parseFloat(mse.toFixed(4)));
    setR2Score(parseFloat(r2.toFixed(3)));

    const curvePoints = [];
    for (let x = 0; x <= 1; x += 0.01) {
      curvePoints.push({ x, y: evalPoly(x) });
    }

    return { coeffs, points: curvePoints };
  }, [regPoints, regDegree]);

  // Render Regression Canvas
  useEffect(() => {
    const canvas = regCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = (canvas.width = canvas.clientWidth);
    const h = (canvas.height = canvas.clientHeight);

    ctx.fillStyle = '#05070f';
    ctx.fillRect(0, 0, w, h);

    // Grid lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
    ctx.lineWidth = 1;
    for (let x = 0; x < w; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let y = 0; y < h; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    // Residual Error Bars
    if (fittedCurve.points.length > 0) {
      regPoints.forEach((p) => {
        let predY = 0;
        for (let i = 0; i < fittedCurve.coeffs.length; i++) {
          predY += fittedCurve.coeffs[i] * Math.pow(p.x, i);
        }
        ctx.strokeStyle = 'rgba(239, 68, 68, 0.4)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(p.x * w, (1 - p.y) * h);
        ctx.lineTo(p.x * w, (1 - predY) * h);
        ctx.stroke();
      });
    }

    // Fitted Curve
    if (fittedCurve.points.length > 1) {
      ctx.strokeStyle = '#06b6d4';
      ctx.lineWidth = 3;
      ctx.shadowColor = '#06b6d4';
      ctx.shadowBlur = 12;
      ctx.beginPath();
      fittedCurve.points.forEach((pt, i) => {
        const px = pt.x * w;
        const py = (1 - pt.y) * h;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      });
      ctx.stroke();
      ctx.shadowBlur = 0;
    }

    // Data Points
    regPoints.forEach((p) => {
      ctx.fillStyle = '#38bdf8';
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.arc(p.x * w, (1 - p.y) * h, 5, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.shadowBlur = 0;
  }, [regPoints, fittedCurve]);

  const handleRegCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = regCanvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = 1 - (e.clientY - rect.top) / rect.height;
    sound.playClick();
    setRegPoints((prev) => [...prev, { x, y }]);
  };

  // ==========================================
  // NEURAL NETWORK FORWARD PASS
  // ==========================================
  useEffect(() => {
    let animId: number;
    const loop = () => {
      setNnTime((t) => t + 0.03);
      animId = requestAnimationFrame(loop);
    };
    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, []);

  const activate = (z: number) => {
    switch (activationFn) {
      case 'sigmoid':
        return 1 / (1 + Math.exp(-z));
      case 'tanh':
        return Math.tanh(z);
      case 'gelu':
        return 0.5 * z * (1 + Math.tanh(Math.sqrt(2 / Math.PI) * (z + 0.044715 * Math.pow(z, 3))));
      case 'relu':
      default:
        return Math.max(0, z);
    }
  };

  const neuralOutput = useMemo(() => {
    // Simulated weights seeded with weightSeed
    const w1 = [
      [0.8 * weightSeed, -0.5],
      [-0.6, 0.9 * weightSeed],
      [0.4, 0.7],
      [-0.9, -0.3],
    ];
    const h1 = w1.map((w) => activate(w[0] * inputX1 + w[1] * inputX2));

    const w2 = [
      [0.6, -0.7, 0.4, 0.2],
      [-0.4, 0.8, -0.5, 0.6],
      [0.5, 0.3, 0.8, -0.4],
    ];
    const h2 = w2.map((w) => activate(w.reduce((acc, val, i) => acc + val * h1[i], 0)));

    const wOut = [
      [0.8, -0.6, 0.5],
      [-0.7, 0.9, -0.4],
    ];
    const logits = wOut.map((w) => w.reduce((acc, val, i) => acc + val * h2[i], 0));

    // Softmax
    const exp0 = Math.exp(logits[0]);
    const exp1 = Math.exp(logits[1]);
    const sumExp = exp0 + exp1;
    const p0 = exp0 / sumExp;
    const p1 = exp1 / sumExp;

    return {
      h1,
      h2,
      p0: parseFloat((p0 * 100).toFixed(1)),
      p1: parseFloat((p1 * 100).toFixed(1)),
    };
  }, [inputX1, inputX2, activationFn, weightSeed]);

  return (
    <section className="relative py-24 px-6 md:px-10 max-w-7xl mx-auto z-20 overflow-hidden">
      {/* Background Decorative Aura */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-indigo-600/10 rounded-full blur-[160px] pointer-events-none" />

      {/* Header Bar */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-10 gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/25 text-cyan-300 text-xs font-mono font-semibold mb-3">
            <BrainCircuit className="w-4 h-4 text-cyan-400 animate-pulse" />
            INTERACTIVE DATA SCIENCE LAB // ML RUNTIME
          </div>
          <h2 className="text-white text-3xl sm:text-5xl font-black uppercase tracking-tight">
            Machine Learning{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-400 to-fuchsia-400">
              Playground
            </span>
          </h2>
        </div>

        {/* Mode Selector Tabs */}
        <div className="flex items-center p-1.5 rounded-2xl bg-zinc-950/80 border border-white/10 backdrop-blur-xl shadow-xl">
          <button
            onClick={() => {
              setActiveMode('kmeans');
              sound.playClick();
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeMode === 'kmeans'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>K-Means Clustering</span>
          </button>

          <button
            onClick={() => {
              setActiveMode('regression');
              sound.playClick();
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeMode === 'regression'
                ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 shadow-sm'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Polynomial Fit</span>
          </button>

          <button
            onClick={() => {
              setActiveMode('neural');
              sound.playClick();
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeMode === 'neural'
                ? 'bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/40 shadow-sm'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>Neural Network Flow</span>
          </button>
        </div>
      </div>

      {/* PLAYGROUND CANVAS & CONTROLS CONTAINER */}
      <div className="rounded-3xl bg-zinc-950/80 border border-white/10 p-6 sm:p-8 backdrop-blur-2xl shadow-2xl shadow-black/80">
        
        {/* ========================================== */}
        {/* TAB 1: K-MEANS CLUSTERING */}
        {/* ========================================== */}
        {activeMode === 'kmeans' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Canvas Area (2 cols) */}
            <div className="lg:col-span-2 flex flex-col">
              <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden border border-white/10 cursor-crosshair group shadow-inner">
                <canvas
                  ref={kmeansCanvasRef}
                  onClick={handleKMeansCanvasClick}
                  className="w-full h-full block"
                />
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-mono text-gray-300">
                  Click canvas to add data points
                </div>
                <div className="absolute bottom-3 right-3 px-3 py-1 rounded-lg bg-black/70 backdrop-blur-md border border-white/10 text-xs font-mono text-cyan-400 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                  <span>Points: {points.length}</span>
                  <span className="text-gray-500">|</span>
                  <span>Iteration: {iteration}</span>
                </div>
              </div>
            </div>

            {/* Sidebar Controls */}
            <div className="flex flex-col justify-between space-y-6">
              <div>
                <h3 className="text-white font-bold text-lg mb-1 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-cyan-400" />
                  K-Means Optimizer
                </h3>
                <p className="text-gray-400 text-xs font-light leading-relaxed mb-6">
                  Iterative centroid partitioning based on Euclidean distance minimization.
                </p>

                {/* K Slider */}
                <div className="mb-6">
                  <div className="flex justify-between text-xs font-semibold text-gray-300 mb-2">
                    <span>Clusters (K)</span>
                    <span className="text-cyan-400 font-mono">{kCount}</span>
                  </div>
                  <input
                    type="range"
                    min="2"
                    max="6"
                    value={kCount}
                    onChange={(e) => setKCount(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                  />
                </div>

                {/* Telemetry Readout */}
                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3 mb-6 font-mono text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Total Inertia (SSE):</span>
                    <span className="text-emerald-400 font-semibold">{inertia}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Convergence State:</span>
                    <span className={iteration > 5 ? 'text-emerald-400' : 'text-amber-400'}>
                      {iteration > 5 ? 'CONVERGED' : 'ITERATING'}
                    </span>
                  </div>
                </div>

                {/* Presets */}
                <div className="space-y-2 mb-6">
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider font-mono">Dataset Presets</span>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => generateGaussianData('blobs')}
                      className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-gray-200 transition-all text-center"
                    >
                      Gaussian Blobs
                    </button>
                    <button
                      onClick={() => generateGaussianData('random')}
                      className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-gray-200 transition-all text-center"
                    >
                      Uniform Noise
                    </button>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-white/10">
                <button
                  onClick={stepKMeans}
                  className="py-2.5 px-4 rounded-xl bg-cyan-600/20 hover:bg-cyan-600/30 border border-cyan-500/40 text-cyan-300 text-xs font-semibold flex items-center justify-center gap-2 transition-all active:scale-95"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Step (1 Iter)</span>
                </button>
                <button
                  onClick={() => setIsAutoRunning((prev) => !prev)}
                  className={`py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all active:scale-95 ${
                    isAutoRunning
                      ? 'bg-amber-600/20 text-amber-300 border border-amber-500/40'
                      : 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/40'
                  }`}
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>{isAutoRunning ? 'Pause' : 'Auto Run'}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================== */}
        {/* TAB 2: POLYNOMIAL REGRESSION */}
        {/* ========================================== */}
        {activeMode === 'regression' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 flex flex-col">
              <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden border border-white/10 cursor-crosshair group shadow-inner">
                <canvas
                  ref={regCanvasRef}
                  onClick={handleRegCanvasClick}
                  className="w-full h-full block"
                />
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-mono text-gray-300">
                  Click canvas to plot coordinate points
                </div>
                <div className="absolute bottom-3 right-3 px-3 py-1 rounded-lg bg-black/70 backdrop-blur-md border border-white/10 text-xs font-mono text-indigo-400 flex items-center gap-2">
                  <span>MSE Loss: {mseLoss}</span>
                  <span className="text-gray-500">|</span>
                  <span className="text-emerald-400 font-bold">R²: {r2Score}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-between space-y-6">
              <div>
                <h3 className="text-white font-bold text-lg mb-1 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-indigo-400" />
                  Least Squares Polynomial Fit
                </h3>
                <p className="text-gray-400 text-xs font-light leading-relaxed mb-6">
                  Analytical curve fitting minimizing residual sum of squares via Normal Equations.
                </p>

                {/* Degree Slider */}
                <div className="mb-6">
                  <div className="flex justify-between text-xs font-semibold text-gray-300 mb-2">
                    <span>Polynomial Degree (d)</span>
                    <span className="text-indigo-400 font-mono">
                      {regDegree === 1 ? 'Degree 1 (Linear)' : regDegree === 2 ? 'Degree 2 (Quadratic)' : 'Degree 3 (Cubic)'}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="3"
                    value={regDegree}
                    onChange={(e) => setRegDegree(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-indigo-400"
                  />
                </div>

                {/* Equation Readout */}
                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2 mb-6 font-mono text-xs">
                  <span className="text-gray-400 text-[10px] uppercase">Fitted Function ŷ(x):</span>
                  <div className="text-cyan-300 font-semibold truncate">
                    {fittedCurve.coeffs.length > 0
                      ? `ŷ = ${fittedCurve.coeffs
                          .map((c, i) => `${c.toFixed(2)}${i > 0 ? `x${i > 1 ? `^${i}` : ''}` : ''}`)
                          .reverse()
                          .join(' + ')}`
                      : 'Computing...'}
                  </div>
                </div>

                {/* Presets */}
                <div className="space-y-2 mb-6">
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider font-mono">Presets</span>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => generateRegressionData('linear')}
                      className="px-2 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-gray-200 transition-all text-center"
                    >
                      Linear
                    </button>
                    <button
                      onClick={() => generateRegressionData('poly')}
                      className="px-2 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-gray-200 transition-all text-center"
                    >
                      Parabolic
                    </button>
                    <button
                      onClick={() => generateRegressionData('noisy')}
                      className="px-2 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-gray-200 transition-all text-center"
                    >
                      Sine Wave
                    </button>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setRegPoints([])}
                className="w-full py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 text-xs font-semibold flex items-center justify-center gap-2 transition-all"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Clear Data Points</span>
              </button>
            </div>
          </div>
        )}

        {/* ========================================== */}
        {/* TAB 3: NEURAL NETWORK ACTIVATION FLOW */}
        {/* ========================================== */}
        {activeMode === 'neural' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Architecture Node Visualizer */}
            <div className="lg:col-span-2 p-6 rounded-2xl bg-black/60 border border-white/10 relative overflow-hidden flex flex-col justify-between">
              <div className="flex justify-between items-center mb-6">
                <span className="text-xs font-mono text-gray-400">LAYER_0 (INPUT) → LAYER_1 (4) → LAYER_2 (3) → OUTPUT (2)</span>
                <span className="text-xs font-mono text-fuchsia-400 font-semibold uppercase">{activationFn}() Activation</span>
              </div>

              {/* Neural Node Graph */}
              <div className="flex justify-between items-center py-8 px-4 sm:px-12 relative">
                {/* Layer 0: Inputs */}
                <div className="flex flex-col gap-12 items-center z-10">
                  <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-400 flex flex-col items-center justify-center shadow-lg shadow-cyan-500/20">
                    <span className="text-[10px] font-mono text-cyan-300 font-bold">x₁</span>
                    <span className="text-[11px] font-mono text-white font-bold">{inputX1.toFixed(2)}</span>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-400 flex flex-col items-center justify-center shadow-lg shadow-cyan-500/20">
                    <span className="text-[10px] font-mono text-cyan-300 font-bold">x₂</span>
                    <span className="text-[11px] font-mono text-white font-bold">{inputX2.toFixed(2)}</span>
                  </div>
                </div>

                {/* Layer 1: Hidden 4 */}
                <div className="flex flex-col gap-5 items-center z-10">
                  {neuralOutput.h1.map((val, idx) => (
                    <div
                      key={idx}
                      className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-400/80 flex items-center justify-center shadow-md shadow-indigo-500/20 transition-all"
                      style={{ transform: `scale(${0.9 + val * 0.25})` }}
                    >
                      <span className="text-[10px] font-mono text-indigo-200 font-bold">{val.toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                {/* Layer 2: Hidden 3 */}
                <div className="flex flex-col gap-8 items-center z-10">
                  {neuralOutput.h2.map((val, idx) => (
                    <div
                      key={idx}
                      className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-400/80 flex items-center justify-center shadow-md shadow-purple-500/20 transition-all"
                      style={{ transform: `scale(${0.9 + val * 0.25})` }}
                    >
                      <span className="text-[10px] font-mono text-purple-200 font-bold">{val.toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                {/* Layer 3: Output Classes */}
                <div className="flex flex-col gap-10 items-center z-10">
                  <div className="p-3 rounded-2xl bg-emerald-500/20 border border-emerald-400 flex flex-col items-center justify-center shadow-lg shadow-emerald-500/20 min-w-[70px]">
                    <span className="text-[10px] font-mono text-emerald-300 font-bold">Class A</span>
                    <span className="text-sm font-mono text-white font-black">{neuralOutput.p0}%</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-fuchsia-500/20 border border-fuchsia-400 flex flex-col items-center justify-center shadow-lg shadow-fuchsia-500/20 min-w-[70px]">
                    <span className="text-[10px] font-mono text-fuchsia-300 font-bold">Class B</span>
                    <span className="text-sm font-mono text-white font-black">{neuralOutput.p1}%</span>
                  </div>
                </div>
              </div>

              {/* Bottom Prediction Confidence Bar */}
              <div className="mt-6 pt-4 border-t border-white/10 flex items-center gap-4">
                <span className="text-xs font-mono text-gray-400">Probability Distribution:</span>
                <div className="flex-1 h-3 rounded-full bg-white/10 overflow-hidden flex">
                  <div style={{ width: `${neuralOutput.p0}%` }} className="bg-emerald-500 transition-all duration-300" />
                  <div style={{ width: `${neuralOutput.p1}%` }} className="bg-fuchsia-500 transition-all duration-300" />
                </div>
              </div>
            </div>

            {/* Neural Controls */}
            <div className="flex flex-col justify-between space-y-6">
              <div>
                <h3 className="text-white font-bold text-lg mb-1 flex items-center gap-2">
                  <BrainCircuit className="w-5 h-5 text-fuchsia-400" />
                  Perceptron Ingestion
                </h3>
                <p className="text-gray-400 text-xs font-light leading-relaxed mb-6">
                  Inject feature inputs and observe multi-layer activation propagation.
                </p>

                {/* Input X1 Slider */}
                <div className="mb-4">
                  <div className="flex justify-between text-xs font-semibold text-gray-300 mb-2">
                    <span>Feature x₁</span>
                    <span className="text-cyan-400 font-mono">{inputX1.toFixed(2)}</span>
                  </div>
                  <input
                    type="range"
                    min="-1"
                    max="1"
                    step="0.05"
                    value={inputX1}
                    onChange={(e) => setInputX1(parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                  />
                </div>

                {/* Input X2 Slider */}
                <div className="mb-6">
                  <div className="flex justify-between text-xs font-semibold text-gray-300 mb-2">
                    <span>Feature x₂</span>
                    <span className="text-cyan-400 font-mono">{inputX2.toFixed(2)}</span>
                  </div>
                  <input
                    type="range"
                    min="-1"
                    max="1"
                    step="0.05"
                    value={inputX2}
                    onChange={(e) => setInputX2(parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                  />
                </div>

                {/* Activation Function Switcher */}
                <div className="space-y-2 mb-6">
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider font-mono">Activation Function</span>
                  <div className="grid grid-cols-2 gap-2">
                    {(['relu', 'sigmoid', 'tanh', 'gelu'] as const).map((fn) => (
                      <button
                        key={fn}
                        onClick={() => {
                          setActivationFn(fn);
                          sound.playClick();
                        }}
                        className={`px-3 py-2 rounded-xl text-xs font-mono uppercase transition-all ${
                          activationFn === fn
                            ? 'bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/40 shadow-sm font-bold'
                            : 'bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300'
                        }`}
                      >
                        {fn}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  setWeightSeed((s) => s * -1 + 0.3);
                  sound.playChime();
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-fuchsia-600/20 hover:bg-fuchsia-600/30 border border-fuchsia-500/40 text-fuchsia-300 text-xs font-semibold flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Randomize Synapse Weights</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
