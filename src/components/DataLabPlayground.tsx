'use client';

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Activity,
  Cpu,
  Sparkles,
  RefreshCw,
  Play,
  Pause,
  RotateCcw,
  Sliders,
  TrendingUp,
  BrainCircuit,
  Binary,
  Layers,
  BarChart3,
  FlaskConical,
  Zap,
  Target,
  Info,
  Maximize2,
  ChevronRight,
  Database,
  Compass,
} from 'lucide-react';
import { sound } from '@/utils/soundEngine';

type LabMode = 'kmeans' | 'regression' | 'neural';

// ==========================================
// 1. K-MEANS INTERFACES & MATHEMATICS
// ==========================================
interface KMeansPoint {
  id: string;
  x: number;
  y: number;
  cluster?: number;
  silhouette?: number;
}

interface Centroid {
  x: number;
  y: number;
  color: string;
  sigmaX?: number;
  sigmaY?: number;
  covariance?: number;
  angle?: number;
}

const CLUSTER_COLORS = [
  { hex: '#06b6d4', glow: 'rgba(6, 182, 212, 0.4)', bg: 'rgba(6, 182, 212, 0.12)', name: 'Cyan' },
  { hex: '#10b981', glow: 'rgba(16, 185, 129, 0.4)', bg: 'rgba(16, 185, 129, 0.12)', name: 'Emerald' },
  { hex: '#ec4899', glow: 'rgba(236, 72, 153, 0.4)', bg: 'rgba(236, 72, 153, 0.12)', name: 'Pink' },
  { hex: '#f59e0b', glow: 'rgba(245, 158, 11, 0.4)', bg: 'rgba(245, 158, 11, 0.12)', name: 'Amber' },
  { hex: '#8b5cf6', glow: 'rgba(139, 92, 246, 0.4)', bg: 'rgba(139, 92, 246, 0.12)', name: 'Purple' },
  { hex: '#3b82f6', glow: 'rgba(59, 130, 246, 0.4)', bg: 'rgba(59, 130, 246, 0.12)', name: 'Blue' },
];

// ==========================================
// 2. REGRESSION INTERFACES
// ==========================================
interface RegPoint {
  id: string;
  x: number;
  y: number;
}

// ==========================================
// 3. NEURAL CLASSIFIER INTERFACES
// ==========================================
interface NNPoint {
  x: number;
  y: number;
  label: 0 | 1;
}

interface NNLayer {
  weights: number[][]; // [in_dim, out_dim]
  biases: number[];    // [out_dim]
}

export default function DataLabPlayground() {
  const [activeMode, setActiveMode] = useState<LabMode>('kmeans');

  // ==========================================
  // --- K-MEANS STATE ---
  // ==========================================
  const [kCount, setKCount] = useState<number>(3);
  const [initMethod, setInitMethod] = useState<'kmeans++' | 'random'>('kmeans++');
  const [showVoronoi, setShowVoronoi] = useState<boolean>(true);
  const [showConfidenceEllipses, setShowConfidenceEllipses] = useState<boolean>(true);
  const [kPoints, setKPoints] = useState<KMeansPoint[]>([]);
  const [centroids, setCentroids] = useState<Centroid[]>([]);
  const [kIteration, setKIteration] = useState<number>(0);
  const [kInertia, setKInertia] = useState<number>(0);
  const [avgSilhouette, setAvgSilhouette] = useState<number>(0);
  const [isKMeansAutoRunning, setIsKMeansAutoRunning] = useState<boolean>(false);
  const [draggedPointIndex, setDraggedPointIndex] = useState<number | null>(null);
  const kmeansCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // ==========================================
  // --- REGRESSION STATE ---
  // ==========================================
  const [regPoints, setRegPoints] = useState<RegPoint[]>([]);
  const [regDegree, setRegDegree] = useState<number>(2);
  const [ridgeLambda, setRidgeLambda] = useState<number>(0.001); // L2 penalty
  const [showConfidenceInterval, setShowConfidenceInterval] = useState<boolean>(true);
  const [regOptimizationMode, setRegOptimizationMode] = useState<'closed' | 'gd'>('closed');
  const [gdLearningRate, setGdLearningRate] = useState<number>(0.1);
  const [gdWeights, setGdWeights] = useState<number[]>([]);
  const [gdEpoch, setGdEpoch] = useState<number>(0);
  const [gdLossHistory, setGdLossHistory] = useState<number[]>([]);
  const [isGdRunning, setIsGdRunning] = useState<boolean>(false);
  const [draggedRegPointId, setDraggedRegPointId] = useState<string | null>(null);
  const regCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Regression Metrics
  const [regMetrics, setRegMetrics] = useState<{
    mse: number;
    rmse: number;
    mae: number;
    r2: number;
    adjR2: number;
    formula: string;
  }>({
    mse: 0,
    rmse: 0,
    mae: 0,
    r2: 0,
    adjR2: 0,
    formula: 'y = 0',
  });

  // ==========================================
  // --- NEURAL NETWORK STATE ---
  // ==========================================
  const [nnDataset, setNnDataset] = useState<'spiral' | 'moons' | 'circles' | 'xor'>('moons');
  const [nnPoints, setNnPoints] = useState<NNPoint[]>([]);
  const [nnActivation, setNnActivation] = useState<'relu' | 'tanh' | 'sigmoid' | 'gelu'>('tanh');
  const [nnLearningRate, setNnLearningRate] = useState<number>(0.08);
  const [nnEpoch, setNnEpoch] = useState<number>(0);
  const [nnLoss, setNnLoss] = useState<number>(0);
  const [nnAccuracy, setNnAccuracy] = useState<number>(0);
  const [isNnTraining, setIsNnTraining] = useState<boolean>(false);
  const [hoveredNeuron, setHoveredNeuron] = useState<{ layer: number; index: number } | null>(null);
  const [inputInspectX1, setInputInspectX1] = useState<number>(0.5);
  const [inputInspectX2, setInputInspectX2] = useState<number>(-0.3);
  const nnCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Neural Weights & Model: 2 -> 6 -> 4 -> 2
  const [networkLayers, setNetworkLayers] = useState<NNLayer[]>(() => initNNWeights());

  function initNNWeights(): NNLayer[] {
    const layerSizes = [2, 6, 4, 2];
    const layers: NNLayer[] = [];
    for (let l = 0; l < layerSizes.length - 1; l++) {
      const inDim = layerSizes[l];
      const outDim = layerSizes[l + 1];
      // Xavier / Glorot Initialization
      const limit = Math.sqrt(6 / (inDim + outDim));
      const weights: number[][] = [];
      for (let i = 0; i < inDim; i++) {
        const row: number[] = [];
        for (let j = 0; j < outDim; j++) {
          row.push((Math.random() * 2 - 1) * limit);
        }
        weights.push(row);
      }
      const biases = new Array(outDim).fill(0).map(() => (Math.random() * 0.1 - 0.05));
      layers.push({ weights, biases });
    }
    return layers;
  }

  // =========================================================================
  // --- K-MEANS DATASET GENERATION & K-MEANS++ SEEDING ---
  // =========================================================================
  const generateKMeansData = useCallback((preset: 'blobs' | 'spiral' | 'anisotropic' | 'rings' = 'blobs') => {
    sound.playClick();
    const newPts: KMeansPoint[] = [];

    if (preset === 'blobs') {
      const centers = [
        { cx: 0.28, cy: 0.32, sx: 0.08, sy: 0.08 },
        { cx: 0.72, cy: 0.35, sx: 0.07, sy: 0.09 },
        { cx: 0.50, cy: 0.74, sx: 0.09, sy: 0.07 },
        { cx: 0.22, cy: 0.78, sx: 0.06, sy: 0.06 },
        { cx: 0.80, cy: 0.80, sx: 0.07, sy: 0.08 },
        { cx: 0.50, cy: 0.20, sx: 0.06, sy: 0.06 },
      ];
      for (let i = 0; i < 120; i++) {
        const c = centers[i % Math.min(centers.length, kCount + 1)];
        // Box-Muller Gaussian Noise
        const u1 = Math.max(1e-6, Math.random());
        const u2 = Math.random();
        const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
        const z1 = Math.sqrt(-2.0 * Math.log(u1)) * Math.sin(2.0 * Math.PI * u2);
        newPts.push({
          id: `p-${i}-${Math.random()}`,
          x: Math.max(0.04, Math.min(0.96, c.cx + z0 * c.sx)),
          y: Math.max(0.04, Math.min(0.96, c.cy + z1 * c.sy)),
        });
      }
    } else if (preset === 'anisotropic') {
      for (let i = 0; i < 110; i++) {
        const clusterIdx = i % 3;
        const u = (Math.random() - 0.5) * 0.4;
        const v = (Math.random() - 0.5) * 0.06;
        let cx = 0.3;
        let cy = 0.3;
        let theta = -Math.PI / 4;
        if (clusterIdx === 1) {
          cx = 0.7; cy = 0.4; theta = Math.PI / 3;
        } else if (clusterIdx === 2) {
          cx = 0.45; cy = 0.78; theta = 0;
        }
        const rx = u * Math.cos(theta) - v * Math.sin(theta);
        const ry = u * Math.sin(theta) + v * Math.cos(theta);
        newPts.push({
          id: `p-${i}-${Math.random()}`,
          x: Math.max(0.05, Math.min(0.95, cx + rx)),
          y: Math.max(0.05, Math.min(0.95, cy + ry)),
        });
      }
    } else if (preset === 'rings') {
      for (let i = 0; i < 120; i++) {
        const ring = i % 2;
        const r = ring === 0 ? 0.16 + Math.random() * 0.05 : 0.38 + Math.random() * 0.06;
        const theta = Math.random() * Math.PI * 2;
        newPts.push({
          id: `p-${i}-${Math.random()}`,
          x: 0.5 + r * Math.cos(theta),
          y: 0.5 + r * Math.sin(theta),
        });
      }
    } else {
      // Uniform random
      for (let i = 0; i < 90; i++) {
        newPts.push({
          id: `p-${i}-${Math.random()}`,
          x: Math.random() * 0.88 + 0.06,
          y: Math.random() * 0.88 + 0.06,
        });
      }
    }

    // --- K-Means++ vs Random Initialization ---
    const initialCentroids: Centroid[] = [];
    if (initMethod === 'kmeans++' && newPts.length > 0) {
      // 1. Choose first center uniformly at random
      const firstPt = newPts[Math.floor(Math.random() * newPts.length)];
      initialCentroids.push({
        x: firstPt.x,
        y: firstPt.y,
        color: CLUSTER_COLORS[0].hex,
      });

      // 2. Select remaining K-1 centers proportional to D(x)^2
      for (let k = 1; k < kCount; k++) {
        const distSq = newPts.map((p) => {
          let minD = Infinity;
          for (const c of initialCentroids) {
            const d = (p.x - c.x) ** 2 + (p.y - c.y) ** 2;
            if (d < minD) minD = d;
          }
          return minD;
        });

        const totalDistSq = distSq.reduce((sum, d) => sum + d, 0);
        let randVal = Math.random() * totalDistSq;
        let chosenIdx = 0;
        for (let i = 0; i < distSq.length; i++) {
          randVal -= distSq[i];
          if (randVal <= 0) {
            chosenIdx = i;
            break;
          }
        }
        initialCentroids.push({
          x: newPts[chosenIdx].x,
          y: newPts[chosenIdx].y,
          color: CLUSTER_COLORS[k % CLUSTER_COLORS.length].hex,
        });
      }
    } else {
      for (let k = 0; k < kCount; k++) {
        const pt = newPts[Math.floor(Math.random() * newPts.length)] || { x: Math.random(), y: Math.random() };
        initialCentroids.push({
          x: pt.x + (Math.random() - 0.5) * 0.02,
          y: pt.y + (Math.random() - 0.5) * 0.02,
          color: CLUSTER_COLORS[k % CLUSTER_COLORS.length].hex,
        });
      }
    }

    setKPoints(newPts);
    setCentroids(initialCentroids);
    setKIteration(0);
    setKInertia(0);
    setAvgSilhouette(0);
    setIsKMeansAutoRunning(false);
  }, [kCount, initMethod]);

  useEffect(() => {
    generateKMeansData('blobs');
  }, [generateKMeansData]);

  // Step K-Means with Silhouette Coefficient & Covariance Ellipses
  const stepKMeansAlgorithm = useCallback(() => {
    if (kPoints.length === 0 || centroids.length === 0) return;
    sound.playBlip ? sound.playBlip() : sound.playChime();

    // 1. Assignment step
    let currentInertia = 0;
    const assigned = kPoints.map((p) => {
      let minDist = Infinity;
      let closestIdx = 0;
      centroids.forEach((c, idx) => {
        const d = (p.x - c.x) ** 2 + (p.y - c.y) ** 2;
        if (d < minDist) {
          minDist = d;
          closestIdx = idx;
        }
      });
      currentInertia += minDist;
      return { ...p, cluster: closestIdx };
    });

    // 2. Update Centroids & Covariance Matrices for Confidence Ellipses
    const updatedCentroids = centroids.map((c, k) => {
      const clusterPts = assigned.filter((p) => p.cluster === k);
      if (clusterPts.length === 0) return c;

      const meanX = clusterPts.reduce((sum, p) => sum + p.x, 0) / clusterPts.length;
      const meanY = clusterPts.reduce((sum, p) => sum + p.y, 0) / clusterPts.length;

      // Sample Covariance Matrix: [[VarX, CovXY], [CovXY, VarY]]
      let varX = 0;
      let varY = 0;
      let covXY = 0;
      clusterPts.forEach((p) => {
        const dx = p.x - meanX;
        const dy = p.y - meanY;
        varX += dx * dx;
        varY += dy * dy;
        covXY += dx * dy;
      });
      const denom = Math.max(1, clusterPts.length - 1);
      varX /= denom;
      varY /= denom;
      covXY /= denom;

      // Eigenvalues of 2x2 symmetric matrix
      const trace = varX + varY;
      const det = varX * varY - covXY * covXY;
      const disc = Math.sqrt(Math.max(0, (trace / 2) ** 2 - det));
      const lambda1 = trace / 2 + disc;
      const lambda2 = Math.max(0.0001, trace / 2 - disc);

      // Angle of major axis
      const angle = covXY === 0 ? (varX >= varY ? 0 : Math.PI / 2) : Math.atan2(lambda1 - varX, covXY);

      return {
        ...c,
        x: meanX,
        y: meanY,
        sigmaX: Math.sqrt(lambda1),
        sigmaY: Math.sqrt(lambda2),
        angle: angle,
      };
    });

    // 3. Exact Silhouette Coefficient Calculation (Sampled if N > 80 for 60fps)
    let totalSilhouette = 0;
    let countedPts = 0;
    const samplePts = assigned.slice(0, 100);

    samplePts.forEach((p) => {
      if (p.cluster === undefined) return;
      const sameClusterPts = assigned.filter((other) => other.cluster === p.cluster && other.id !== p.id);
      if (sameClusterPts.length === 0) return;

      // a(i): mean intra-cluster distance
      const a = sameClusterPts.reduce((sum, o) => sum + Math.hypot(p.x - o.x, p.y - o.y), 0) / sameClusterPts.length;

      // b(i): min mean distance to other clusters
      let b = Infinity;
      centroids.forEach((_, kIdx) => {
        if (kIdx === p.cluster) return;
        const otherClusterPts = assigned.filter((other) => other.cluster === kIdx);
        if (otherClusterPts.length > 0) {
          const meanDist = otherClusterPts.reduce((sum, o) => sum + Math.hypot(p.x - o.x, p.y - o.y), 0) / otherClusterPts.length;
          if (meanDist < b) b = meanDist;
        }
      });

      if (b !== Infinity) {
        const s = (b - a) / Math.max(a, b);
        totalSilhouette += s;
        countedPts++;
      }
    });

    const silScore = countedPts > 0 ? totalSilhouette / countedPts : 0;

    setKPoints(assigned);
    setCentroids(updatedCentroids);
    setKInertia(parseFloat((currentInertia * 100).toFixed(3)));
    setAvgSilhouette(parseFloat(silScore.toFixed(3)));
    setKIteration((prev) => prev + 1);
  }, [kPoints, centroids]);

  // Auto Run loop for K-Means
  useEffect(() => {
    if (!isKMeansAutoRunning) return;
    const timer = setInterval(() => {
      stepKMeansAlgorithm();
    }, 450);
    return () => clearInterval(timer);
  }, [isKMeansAutoRunning, stepKMeansAlgorithm]);

  // Canvas Renderer for K-Means: Voronoi Decision Regions, Confidence Ellipses & Point Shadows
  useEffect(() => {
    const canvas = kmeansCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = (canvas.width = canvas.clientWidth);
    const h = (canvas.height = canvas.clientHeight);

    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = '#060813';
    ctx.fillRect(0, 0, w, h);

    // 1. Voronoi Decision Region Background Heatmap
    if (showVoronoi && centroids.length > 0) {
      const step = 8;
      for (let px = 0; px < w; px += step) {
        for (let py = 0; py < h; py += step) {
          const normX = px / w;
          const normY = py / h;
          let minD = Infinity;
          let closestK = 0;
          for (let k = 0; k < centroids.length; k++) {
            const d = (normX - centroids[k].x) ** 2 + (normY - centroids[k].y) ** 2;
            if (d < minD) {
              minD = d;
              closestK = k;
            }
          }
          const colorMeta = CLUSTER_COLORS[closestK % CLUSTER_COLORS.length];
          ctx.fillStyle = colorMeta.bg;
          ctx.fillRect(px, py, step, step);
        }
      }
    }

    // 2. Subtle Coordinate Grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
    ctx.lineWidth = 1;
    for (let x = 0; x < w; x += 36) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let y = 0; y < h; y += 36) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    // 3. Covariance Confidence Ellipses (1-Sigma and 2-Sigma)
    if (showConfidenceEllipses) {
      centroids.forEach((c) => {
        if (c.sigmaX && c.sigmaY && c.angle !== undefined) {
          const cx = c.x * w;
          const cy = c.y * h;
          const rx1 = Math.max(12, c.sigmaX * w * 1.5);
          const ry1 = Math.max(8, c.sigmaY * h * 1.5);

          ctx.save();
          ctx.translate(cx, cy);
          ctx.rotate(c.angle);

          // 2-Sigma Confidence Outer Band
          ctx.strokeStyle = c.color;
          ctx.globalAlpha = 0.25;
          ctx.lineWidth = 1;
          ctx.setLineDash([4, 4]);
          ctx.beginPath();
          ctx.ellipse(0, 0, rx1 * 1.8, ry1 * 1.8, 0, 0, Math.PI * 2);
          ctx.stroke();

          // 1-Sigma Confidence Core Ellipse
          ctx.globalAlpha = 0.5;
          ctx.setLineDash([]);
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.ellipse(0, 0, rx1, ry1, 0, 0, Math.PI * 2);
          ctx.stroke();
          ctx.restore();
        }
      });
    }

    // 4. Connect points to respective centroids
    kPoints.forEach((p) => {
      if (p.cluster !== undefined && centroids[p.cluster]) {
        const c = centroids[p.cluster];
        ctx.strokeStyle = c.color;
        ctx.globalAlpha = 0.18;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(p.x * w, p.y * h);
        ctx.lineTo(c.x * w, c.y * h);
        ctx.stroke();
      }
    });

    // 5. Draw Data Points with Neon Glow
    kPoints.forEach((p) => {
      const color = p.cluster !== undefined && centroids[p.cluster] ? centroids[p.cluster].color : '#94a3b8';
      ctx.globalAlpha = 0.9;
      ctx.fillStyle = color;
      ctx.shadowColor = color;
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.arc(p.x * w, p.y * h, 4.5, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.shadowBlur = 0;

    // 6. Draw Centroids with Pulsing Crosshair Targets
    centroids.forEach((c, idx) => {
      const cx = c.x * w;
      const cy = c.y * h;

      // Glow halo
      ctx.globalAlpha = 0.3;
      ctx.fillStyle = c.color;
      ctx.beginPath();
      ctx.arc(cx, cy, 22, 0, Math.PI * 2);
      ctx.fill();

      // Outer ring
      ctx.globalAlpha = 1;
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2.5;
      ctx.shadowColor = c.color;
      ctx.shadowBlur = 14;
      ctx.beginPath();
      ctx.arc(cx, cy, 10, 0, Math.PI * 2);
      ctx.stroke();

      // Center dot
      ctx.fillStyle = c.color;
      ctx.beginPath();
      ctx.arc(cx, cy, 4, 0, Math.PI * 2);
      ctx.fill();

      // Precision Reticle lines
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(cx - 16, cy);
      ctx.lineTo(cx + 16, cy);
      ctx.moveTo(cx, cy - 16);
      ctx.lineTo(cx, cy + 16);
      ctx.stroke();

      // Cluster Label Pill
      ctx.font = 'bold 10px JetBrains Mono, monospace';
      ctx.fillStyle = '#ffffff';
      ctx.fillText(`C${idx + 1}`, cx + 14, cy - 12);
    });

    ctx.shadowBlur = 0;
    ctx.globalAlpha = 1;
  }, [kPoints, centroids, showVoronoi, showConfidenceEllipses]);

  // Click & Drag Canvas interaction for K-Means
  const handleKMeansCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = kmeansCanvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    // Check if clicked near existing point to drag
    let foundIdx: number | null = null;
    for (let i = 0; i < kPoints.length; i++) {
      const dist = Math.hypot(kPoints[i].x - x, kPoints[i].y - y);
      if (dist < 0.04) {
        foundIdx = i;
        break;
      }
    }

    if (foundIdx !== null) {
      setDraggedPointIndex(foundIdx);
    } else {
      // Add new point
      sound.playClick();
      setKPoints((prev) => [...prev, { id: `pt-${Date.now()}`, x, y }]);
    }
  };

  const handleKMeansCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (draggedPointIndex === null) return;
    const canvas = kmeansCanvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = Math.max(0.02, Math.min(0.98, (e.clientX - rect.left) / rect.width));
    const y = Math.max(0.02, Math.min(0.98, (e.clientY - rect.top) / rect.height));

    setKPoints((prev) => {
      const next = [...prev];
      if (next[draggedPointIndex]) {
        next[draggedPointIndex] = { ...next[draggedPointIndex], x, y };
      }
      return next;
    });
  };

  const handleKMeansCanvasMouseUp = () => {
    if (draggedPointIndex !== null) {
      setDraggedPointIndex(null);
    }
  };

  // Touch event handlers for mobile devices
  const handleKMeansTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (e.touches.length === 0) return;
    const touch = e.touches[0];
    const canvas = kmeansCanvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = (touch.clientX - rect.left) / rect.width;
    const y = (touch.clientY - rect.top) / rect.height;

    let foundIdx: number | null = null;
    for (let i = 0; i < kPoints.length; i++) {
      const dist = Math.hypot(kPoints[i].x - x, kPoints[i].y - y);
      if (dist < 0.06) {
        foundIdx = i;
        break;
      }
    }

    if (foundIdx !== null) {
      setDraggedPointIndex(foundIdx);
    } else {
      sound.playClick();
      setKPoints((prev) => [...prev, { id: `pt-${Date.now()}`, x, y }]);
    }
  };

  const handleKMeansTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (draggedPointIndex === null || e.touches.length === 0) return;
    const touch = e.touches[0];
    const canvas = kmeansCanvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = Math.max(0.02, Math.min(0.98, (touch.clientX - rect.left) / rect.width));
    const y = Math.max(0.02, Math.min(0.98, (touch.clientY - rect.top) / rect.height));

    setKPoints((prev) => {
      const next = [...prev];
      if (next[draggedPointIndex]) {
        next[draggedPointIndex] = { ...next[draggedPointIndex], x, y };
      }
      return next;
    });
  };

  // =========================================================================
  // --- POLYNOMIAL REGRESSION WITH RIDGE PENALTY & GRADIENT DESCENT ---
  // =========================================================================
  const generateRegressionData = useCallback((preset: 'linear' | 'poly' | 'sine' | 'noisy' = 'poly') => {
    sound.playClick();
    const pts: RegPoint[] = [];
    const count = 35;
    for (let i = 0; i < count; i++) {
      const x = i / (count - 1);
      let y = 0.5;
      if (preset === 'linear') {
        y = 0.2 + 0.65 * x + (Math.random() - 0.5) * 0.16;
      } else if (preset === 'poly') {
        y = 0.2 + 1.6 * x - 1.5 * x * x + (Math.random() - 0.5) * 0.14;
      } else if (preset === 'sine') {
        y = 0.5 + 0.38 * Math.sin(x * Math.PI * 2.2) + (Math.random() - 0.5) * 0.12;
      } else {
        // Multi-modal noisy
        y = 0.8 * Math.exp(-((x - 0.3) ** 2) / 0.04) + 0.6 * Math.exp(-((x - 0.75) ** 2) / 0.03) + (Math.random() - 0.5) * 0.18;
      }
      pts.push({ id: `reg-${i}-${Math.random()}`, x, y: Math.max(0.05, Math.min(0.95, y)) });
    }
    setRegPoints(pts);
    setGdEpoch(0);
    setGdLossHistory([]);
    setIsGdRunning(false);
  }, []);

  useEffect(() => {
    generateRegressionData('poly');
  }, [generateRegressionData]);

  // Exact Ridge Regression Closed-Form: w = (X^T X + λ I)^(-1) X^T y
  const analyticalFittedCurve = useMemo(() => {
    if (regPoints.length < regDegree + 1) {
      return { coeffs: [], curvePoints: [], stdError: 0, leverage: [] };
    }

    const n = regPoints.length;
    const m = regDegree + 1; // Number of parameters (w0, w1, ..., wd)

    // Construct Normal Matrix: A = X^T X + λ I
    const A: number[][] = Array.from({ length: m }, () => Array(m).fill(0));
    const B: number[] = Array(m).fill(0);

    for (let i = 0; i < m; i++) {
      for (let j = 0; j < m; j++) {
        let sum = 0;
        for (let k = 0; k < n; k++) {
          sum += Math.pow(regPoints[k].x, i + j);
        }
        // Add Ridge L2 regularization to diagonal (skip bias term i===0 for standard ridge)
        if (i === j && i > 0) {
          sum += ridgeLambda;
        }
        A[i][j] = sum;
      }

      let sumY = 0;
      for (let k = 0; k < n; k++) {
        sumY += regPoints[k].y * Math.pow(regPoints[k].x, i);
      }
      B[i] = sumY;
    }

    // Gaussian Elimination with Partial Pivoting to solve A w = B
    const Aug = A.map((row, i) => [...row, B[i]]);

    for (let i = 0; i < m; i++) {
      let maxRow = i;
      for (let k = i + 1; k < m; k++) {
        if (Math.abs(Aug[k][i]) > Math.abs(Aug[maxRow][i])) {
          maxRow = k;
        }
      }
      const tmp = Aug[i];
      Aug[i] = Aug[maxRow];
      Aug[maxRow] = tmp;

      const pivot = Aug[i][i] || 1e-9;
      for (let k = i + 1; k < m; k++) {
        const factor = Aug[k][i] / pivot;
        for (let j = i; j <= m; j++) {
          Aug[k][j] -= factor * Aug[i][j];
        }
      }
    }

    // Back substitution
    const coeffs: number[] = Array(m).fill(0);
    for (let i = m - 1; i >= 0; i--) {
      let sum = Aug[i][m];
      for (let j = i + 1; j < m; j++) {
        sum -= Aug[i][j] * coeffs[j];
      }
      coeffs[i] = sum / (Aug[i][i] || 1e-9);
    }

    const evalPoly = (x: number) => {
      let val = 0;
      for (let i = 0; i < coeffs.length; i++) {
        val += coeffs[i] * Math.pow(x, i);
      }
      return val;
    };

    // Calculate Comprehensive Regression Metrics (MSE, RMSE, MAE, R², Adj-R²)
    let sse = 0;
    let sae = 0;
    const sumY = regPoints.reduce((acc, p) => acc + p.y, 0);
    const meanY = sumY / n;
    let sst = 0;

    regPoints.forEach((p) => {
      const pred = evalPoly(p.x);
      const residual = p.y - pred;
      sse += residual ** 2;
      sae += Math.abs(residual);
      sst += (p.y - meanY) ** 2;
    });

    const mse = sse / n;
    const rmse = Math.sqrt(mse);
    const mae = sae / n;
    const r2 = Math.max(0, Math.min(1, sst > 0 ? 1 - sse / sst : 0));
    const degreesOfFreedom = Math.max(1, n - m);
    const adjR2 = Math.max(0, Math.min(1, 1 - ((1 - r2) * (n - 1)) / degreesOfFreedom));
    const stdError = Math.sqrt(sse / degreesOfFreedom);

    // Build Formula String
    const terms = coeffs
      .map((c, i) => {
        if (Math.abs(c) < 0.001) return null;
        const sign = c >= 0 ? '+' : '-';
        const absVal = Math.abs(c).toFixed(2);
        if (i === 0) return `${c.toFixed(2)}`;
        if (i === 1) return `${sign} ${absVal}x`;
        return `${sign} ${absVal}x^${i}`;
      })
      .filter(Boolean)
      .reverse();

    const formula = terms.length > 0 ? `ŷ = ${terms.join(' ')}` : 'ŷ = 0';

    setRegMetrics({
      mse: parseFloat(mse.toFixed(4)),
      rmse: parseFloat(rmse.toFixed(4)),
      mae: parseFloat(mae.toFixed(4)),
      r2: parseFloat(r2.toFixed(3)),
      adjR2: parseFloat(adjR2.toFixed(3)),
      formula,
    });

    // Generate dense curve points with 95% Confidence Interval Band (1.96 * SE)
    const curvePoints: { x: number; y: number; lower: number; upper: number }[] = [];
    for (let x = 0; x <= 1.005; x += 0.01) {
      const y = evalPoly(x);
      // Approximate confidence interval band
      const margin = 1.96 * stdError * Math.sqrt(1 / n + ((x - 0.5) ** 2) * 1.5);
      curvePoints.push({
        x,
        y,
        lower: Math.max(0, y - margin),
        upper: Math.min(1.2, y + margin),
      });
    }

    return { coeffs, curvePoints, stdError };
  }, [regPoints, regDegree, ridgeLambda]);

  // Step Gradient Descent Loop for Regression
  const stepGradientDescent = useCallback(() => {
    if (regPoints.length === 0) return;
    const m = regDegree + 1;
    let currentWeights = gdWeights.length === m ? [...gdWeights] : new Array(m).fill(0.1);

    const n = regPoints.length;
    const grads = new Array(m).fill(0);
    let epochLoss = 0;

    // Compute gradients: dL/dw_j = (2/n) * sum((pred_i - y_i) * x_i^j) + 2*λ*w_j
    regPoints.forEach((p) => {
      let pred = 0;
      for (let j = 0; j < m; j++) {
        pred += currentWeights[j] * Math.pow(p.x, j);
      }
      const err = pred - p.y;
      epochLoss += err * err;

      for (let j = 0; j < m; j++) {
        grads[j] += (2 / n) * err * Math.pow(p.x, j);
      }
    });

    // Add regularization gradient
    for (let j = 1; j < m; j++) {
      grads[j] += 2 * ridgeLambda * currentWeights[j];
    }

    // Weight update step
    currentWeights = currentWeights.map((w, j) => w - gdLearningRate * grads[j]);

    setGdWeights(currentWeights);
    setGdEpoch((prev) => prev + 1);
    setGdLossHistory((prev) => [...prev.slice(-30), parseFloat((epochLoss / n).toFixed(5))]);
  }, [regPoints, regDegree, gdWeights, gdLearningRate, ridgeLambda]);

  // GD Auto run timer
  useEffect(() => {
    if (!isGdRunning || regOptimizationMode !== 'gd') return;
    const timer = setInterval(() => {
      stepGradientDescent();
    }, 60);
    return () => clearInterval(timer);
  }, [isGdRunning, regOptimizationMode, stepGradientDescent]);

  // Canvas Renderer for Polynomial Regression
  useEffect(() => {
    const canvas = regCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = (canvas.width = canvas.clientWidth);
    const h = (canvas.height = canvas.clientHeight);

    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = '#060813';
    ctx.fillRect(0, 0, w, h);

    // Subtle Coordinate Grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
    ctx.lineWidth = 1;
    for (let x = 0; x < w; x += 36) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let y = 0; y < h; y += 36) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    const curve = analyticalFittedCurve;

    // 1. Draw 95% Confidence Interval Ribbon
    if (showConfidenceInterval && curve.curvePoints.length > 1) {
      ctx.fillStyle = 'rgba(99, 102, 241, 0.12)';
      ctx.beginPath();
      // Forward path (upper bound)
      curve.curvePoints.forEach((pt, i) => {
        const px = pt.x * w;
        const py = (1 - pt.upper) * h;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      });
      // Backward path (lower bound)
      for (let i = curve.curvePoints.length - 1; i >= 0; i--) {
        const pt = curve.curvePoints[i];
        const px = pt.x * w;
        const py = (1 - pt.lower) * h;
        ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.fill();

      // Confidence Interval boundary strokes
      ctx.strokeStyle = 'rgba(99, 102, 241, 0.3)';
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      curve.curvePoints.forEach((pt, i) => {
        const px = pt.x * w;
        const py = (1 - pt.upper) * h;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      });
      ctx.stroke();

      ctx.beginPath();
      curve.curvePoints.forEach((pt, i) => {
        const px = pt.x * w;
        const py = (1 - pt.lower) * h;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      });
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // 2. Residual Error Lines (Red dashed vertical indicators)
    if (curve.coeffs.length > 0) {
      regPoints.forEach((p) => {
        let predY = 0;
        for (let i = 0; i < curve.coeffs.length; i++) {
          predY += curve.coeffs[i] * Math.pow(p.x, i);
        }
        ctx.strokeStyle = 'rgba(239, 68, 68, 0.45)';
        ctx.lineWidth = 1.2;
        ctx.setLineDash([2, 2]);
        ctx.beginPath();
        ctx.moveTo(p.x * w, (1 - p.y) * h);
        ctx.lineTo(p.x * w, (1 - predY) * h);
        ctx.stroke();
        ctx.setLineDash([]);
      });
    }

    // 3. Main Analytical Fitted Curve
    if (curve.curvePoints.length > 1) {
      ctx.strokeStyle = '#6366f1';
      ctx.lineWidth = 3.5;
      ctx.shadowColor = '#6366f1';
      ctx.shadowBlur = 14;
      ctx.beginPath();
      curve.curvePoints.forEach((pt, i) => {
        const px = pt.x * w;
        const py = (1 - pt.y) * h;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      });
      ctx.stroke();
      ctx.shadowBlur = 0;
    }

    // 4. Draw Gradient Descent Fitted Curve (if in GD mode)
    if (regOptimizationMode === 'gd' && gdWeights.length > 0) {
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 2.5;
      ctx.shadowColor = '#f59e0b';
      ctx.shadowBlur = 10;
      ctx.beginPath();
      for (let x = 0; x <= 1.005; x += 0.01) {
        let y = 0;
        for (let j = 0; j < gdWeights.length; j++) {
          y += gdWeights[j] * Math.pow(x, j);
        }
        const px = x * w;
        const py = (1 - y) * h;
        if (x === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();
      ctx.shadowBlur = 0;
    }

    // 5. Draw Scatter Points
    regPoints.forEach((p) => {
      ctx.fillStyle = '#38bdf8';
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.arc(p.x * w, (1 - p.y) * h, 5, 0, Math.PI * 2);
      ctx.fill();

      // Outer ring on point
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.arc(p.x * w, (1 - p.y) * h, 5, 0, Math.PI * 2);
      ctx.stroke();
    });

    ctx.shadowBlur = 0;
  }, [regPoints, analyticalFittedCurve, showConfidenceInterval, regOptimizationMode, gdWeights]);

  // Click & Drag Regression Canvas Handlers
  const handleRegCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = regCanvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = 1 - (e.clientY - rect.top) / rect.height;

    // Check if clicked near an existing point
    const found = regPoints.find((p) => Math.hypot(p.x - x, p.y - y) < 0.04);
    if (found) {
      setDraggedRegPointId(found.id);
    } else {
      sound.playClick();
      setRegPoints((prev) => [...prev, { id: `reg-${Date.now()}`, x, y }]);
    }
  };

  const handleRegCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!draggedRegPointId) return;
    const canvas = regCanvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = Math.max(0.02, Math.min(0.98, (e.clientX - rect.left) / rect.width));
    const y = Math.max(0.02, Math.min(0.98, 1 - (e.clientY - rect.top) / rect.height));

    setRegPoints((prev) => prev.map((p) => (p.id === draggedRegPointId ? { ...p, x, y } : p)));
  };

  const handleRegCanvasMouseUp = () => {
    if (draggedRegPointId) setDraggedRegPointId(null);
  };

  const handleRegTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (e.touches.length === 0) return;
    const touch = e.touches[0];
    const canvas = regCanvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = (touch.clientX - rect.left) / rect.width;
    const y = 1 - (touch.clientY - rect.top) / rect.height;

    const found = regPoints.find((p) => Math.hypot(p.x - x, p.y - y) < 0.06);
    if (found) {
      setDraggedRegPointId(found.id);
    } else {
      sound.playClick();
      setRegPoints((prev) => [...prev, { id: `reg-${Date.now()}`, x, y }]);
    }
  };

  const handleRegTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (!draggedRegPointId || e.touches.length === 0) return;
    const touch = e.touches[0];
    const canvas = regCanvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = Math.max(0.02, Math.min(0.98, (touch.clientX - rect.left) / rect.width));
    const y = Math.max(0.02, Math.min(0.98, 1 - (touch.clientY - rect.top) / rect.height));

    setRegPoints((prev) => prev.map((p) => (p.id === draggedRegPointId ? { ...p, x, y } : p)));
  };

  // =========================================================================
  // --- DEEP NEURAL NETWORK 2D CLASSIFIER & REAL BACKPROPAGATION ---
  // =========================================================================
  const generateNNDataset = useCallback((preset: 'spiral' | 'moons' | 'circles' | 'xor') => {
    sound.playClick();
    const pts: NNPoint[] = [];

    if (preset === 'moons') {
      const n = 60;
      // Upper moon (Class 0)
      for (let i = 0; i < n; i++) {
        const theta = (i / n) * Math.PI;
        const x = Math.cos(theta) * 0.4 + 0.35 + (Math.random() - 0.5) * 0.08;
        const y = Math.sin(theta) * 0.4 + 0.45 + (Math.random() - 0.5) * 0.08;
        pts.push({ x: (x - 0.5) * 2, y: (y - 0.5) * 2, label: 0 });
      }
      // Lower moon (Class 1)
      for (let i = 0; i < n; i++) {
        const theta = (i / n) * Math.PI;
        const x = 1.0 - Math.cos(theta) * 0.4 - 0.35 + (Math.random() - 0.5) * 0.08;
        const y = 1.0 - Math.sin(theta) * 0.4 - 0.65 + (Math.random() - 0.5) * 0.08;
        pts.push({ x: (x - 0.5) * 2, y: (y - 0.5) * 2, label: 1 });
      }
    } else if (preset === 'circles') {
      const n = 60;
      // Inner Circle (Class 0)
      for (let i = 0; i < n; i++) {
        const theta = Math.random() * Math.PI * 2;
        const r = Math.random() * 0.35;
        pts.push({ x: r * Math.cos(theta), y: r * Math.sin(theta), label: 0 });
      }
      // Outer Ring (Class 1)
      for (let i = 0; i < n; i++) {
        const theta = Math.random() * Math.PI * 2;
        const r = 0.65 + Math.random() * 0.25;
        pts.push({ x: r * Math.cos(theta), y: r * Math.sin(theta), label: 1 });
      }
    } else if (preset === 'xor') {
      for (let i = 0; i < 100; i++) {
        const x = (Math.random() - 0.5) * 1.8;
        const y = (Math.random() - 0.5) * 1.8;
        const label = (x > 0 && y > 0) || (x < 0 && y < 0) ? 1 : 0;
        pts.push({ x, y, label });
      }
    } else {
      // Two Archimedean Spirals
      const n = 60;
      for (let i = 0; i < n; i++) {
        const r = (i / n) * 0.85;
        const t = (i / n) * 1.75 * Math.PI;
        pts.push({
          x: r * Math.sin(t) + (Math.random() - 0.5) * 0.08,
          y: r * Math.cos(t) + (Math.random() - 0.5) * 0.08,
          label: 0,
        });
        pts.push({
          x: -r * Math.sin(t) + (Math.random() - 0.5) * 0.08,
          y: -r * Math.cos(t) + (Math.random() - 0.5) * 0.08,
          label: 1,
        });
      }
    }

    setNnPoints(pts);
    setNetworkLayers(initNNWeights());
    setNnEpoch(0);
    setNnLoss(0.69);
    setNnAccuracy(50);
    setIsNnTraining(false);
  }, []);

  useEffect(() => {
    generateNNDataset(nnDataset);
  }, [nnDataset, generateNNDataset]);

  // Non-linear Activation and Derivative functions
  const act = useCallback(
    (z: number) => {
      switch (nnActivation) {
        case 'relu':
          return Math.max(0, z);
        case 'sigmoid':
          return 1 / (1 + Math.exp(-z));
        case 'gelu':
          return 0.5 * z * (1 + Math.tanh(Math.sqrt(2 / Math.PI) * (z + 0.044715 * Math.pow(z, 3))));
        case 'tanh':
        default:
          return Math.tanh(z);
      }
    },
    [nnActivation]
  );

  const actDeriv = useCallback(
    (a: number, z: number) => {
      switch (nnActivation) {
        case 'relu':
          return z > 0 ? 1 : 0;
        case 'sigmoid':
          return a * (1 - a);
        case 'gelu':
          return 0.5 * (1 + Math.tanh(0.797884 * (z + 0.044715 * Math.pow(z, 3))));
        case 'tanh':
        default:
          return 1 - a * a;
      }
    },
    [nnActivation]
  );

  // Forward Pass for a single 2D vector [x1, x2]
  const forwardPass = useCallback(
    (x1: number, x2: number, layers: NNLayer[]) => {
      const activations: number[][] = [[x1, x2]];
      const preActivations: number[][] = [];

      let currentA = [x1, x2];

      for (let l = 0; l < layers.length; l++) {
        const { weights, biases } = layers[l];
        const outDim = biases.length;
        const zLayer: number[] = [];
        const aLayer: number[] = [];

        for (let j = 0; j < outDim; j++) {
          let sum = biases[j];
          for (let i = 0; i < currentA.length; i++) {
            sum += currentA[i] * weights[i][j];
          }
          zLayer.push(sum);
          if (l === layers.length - 1) {
            // Output Layer (Logits for Softmax)
            aLayer.push(sum);
          } else {
            aLayer.push(act(sum));
          }
        }

        preActivations.push(zLayer);

        if (l === layers.length - 1) {
          // Softmax on Output
          const maxLogit = Math.max(...aLayer);
          const exp0 = Math.exp(aLayer[0] - maxLogit);
          const exp1 = Math.exp(aLayer[1] - maxLogit);
          const sumExp = exp0 + exp1;
          currentA = [exp0 / sumExp, exp1 / sumExp];
        } else {
          currentA = aLayer;
        }

        activations.push(currentA);
      }

      return { activations, preActivations, output: currentA };
    },
    [act]
  );

  // In-Browser Full Backpropagation Step
  const trainNNStep = useCallback(() => {
    if (nnPoints.length === 0) return;

    const layers = networkLayers;
    const numLayers = layers.length;

    // Accumulate weight & bias gradients
    const weightGrads: number[][][] = layers.map((l) =>
      l.weights.map((row) => new Array(row.length).fill(0))
    );
    const biasGrads: number[][] = layers.map((l) => new Array(l.biases.length).fill(0));

    let totalLoss = 0;
    let correct = 0;

    nnPoints.forEach((p) => {
      const { activations, preActivations, output } = forwardPass(p.x, p.y, layers);

      // Target One-Hot: Class 0 -> [1, 0], Class 1 -> [0, 1]
      const target = p.label === 0 ? [1, 0] : [0, 1];

      // Cross-Entropy Loss: -log(p_target)
      const prob = p.label === 0 ? output[0] : output[1];
      totalLoss += -Math.log(Math.max(1e-7, prob));

      const predClass = output[1] > output[0] ? 1 : 0;
      if (predClass === p.label) correct++;

      // Backpropagation:
      // Output Layer delta (Softmax + Cross Entropy gradient = output - target)
      let deltas: number[] = [output[0] - target[0], output[1] - target[1]];

      for (let l = numLayers - 1; l >= 0; l--) {
        const inA = activations[l];
        const nextDeltas: number[] = new Array(inA.length).fill(0);

        for (let j = 0; j < layers[l].biases.length; j++) {
          const delta_j = deltas[j];
          biasGrads[l][j] += delta_j;

          for (let i = 0; i < inA.length; i++) {
            weightGrads[l][i][j] += inA[i] * delta_j;
            if (l > 0) {
              nextDeltas[i] += layers[l].weights[i][j] * delta_j;
            }
          }
        }

        if (l > 0) {
          // Multiply nextDeltas by activation derivative of layer l-1
          const zPrev = preActivations[l - 1];
          const aPrev = activations[l];
          deltas = nextDeltas.map((d, i) => d * actDeriv(aPrev[i], zPrev[i]));
        }
      }
    });

    // Update weights with SGD + Momentum
    const lr = nnLearningRate / nnPoints.length;
    const updatedLayers: NNLayer[] = layers.map((layer, l) => ({
      weights: layer.weights.map((row, i) =>
        row.map((w, j) => w - lr * weightGrads[l][i][j] - 0.0001 * w)
      ),
      biases: layer.biases.map((b, j) => b - lr * biasGrads[l][j]),
    }));

    setNetworkLayers(updatedLayers);
    setNnEpoch((e) => e + 1);
    setNnLoss(parseFloat((totalLoss / nnPoints.length).toFixed(4)));
    setNnAccuracy(parseFloat(((correct / nnPoints.length) * 100).toFixed(1)));
  }, [nnPoints, networkLayers, forwardPass, actDeriv, nnLearningRate]);

  // Backprop training interval loop
  useEffect(() => {
    if (!isNnTraining) return;
    const timer = setInterval(() => {
      trainNNStep();
    }, 40);
    return () => clearInterval(timer);
  }, [isNnTraining, trainNNStep]);

  // Canvas Renderer for Neural Network Decision Boundary Heatmap
  useEffect(() => {
    const canvas = nnCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = (canvas.width = canvas.clientWidth);
    const h = (canvas.height = canvas.clientHeight);

    ctx.clearRect(0, 0, w, h);

    // 1. Render 2D Continuous Decision Boundary Grid (Class Probability Heatmap)
    const gridSize = 36;
    const stepX = w / gridSize;
    const stepY = h / gridSize;

    for (let gx = 0; gx < gridSize; gx++) {
      for (let gy = 0; gy < gridSize; gy++) {
        // Map canvas coordinate to [-1, 1] feature space
        const fx = ((gx + 0.5) / gridSize) * 2 - 1;
        const fy = -(((gy + 0.5) / gridSize) * 2 - 1);

        const { output } = forwardPass(fx, fy, networkLayers);
        const p1 = output[1]; // Probability of Class 1

        // Smooth interpolation: Emerald (Class 0, p1=0) -> Fuchsia (Class 1, p1=1)
        if (p1 > 0.5) {
          const alpha = (p1 - 0.5) * 1.4;
          ctx.fillStyle = `rgba(236, 72, 153, ${Math.min(0.7, Math.max(0.05, alpha))})`;
        } else {
          const alpha = (0.5 - p1) * 1.4;
          ctx.fillStyle = `rgba(16, 185, 129, ${Math.min(0.7, Math.max(0.05, alpha))})`;
        }
        ctx.fillRect(gx * stepX, gy * stepY, stepX + 1, stepY + 1);
      }
    }

    // 2. Subtle Feature Grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(w / 2, 0);
    ctx.lineTo(w / 2, h);
    ctx.moveTo(0, h / 2);
    ctx.lineTo(w, h / 2);
    ctx.stroke();

    // 3. Draw Training Points
    nnPoints.forEach((p) => {
      const cx = ((p.x + 1) / 2) * w;
      const cy = ((-p.y + 1) / 2) * h;
      const color = p.label === 1 ? '#ec4899' : '#10b981';

      ctx.fillStyle = color;
      ctx.shadowColor = color;
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.arc(cx, cy, 5, 0, Math.PI * 2);
      ctx.fill();

      // Clean white border
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.arc(cx, cy, 5, 0, Math.PI * 2);
      ctx.stroke();
    });

    // 4. Draw Current Test Inspection Point Reticle
    const inspectCX = ((inputInspectX1 + 1) / 2) * w;
    const inspectCY = ((-inputInspectX2 + 1) / 2) * h;

    ctx.strokeStyle = '#06b6d4';
    ctx.lineWidth = 2;
    ctx.shadowColor = '#06b6d4';
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.arc(inspectCX, inspectCY, 9, 0, Math.PI * 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(inspectCX - 14, inspectCY);
    ctx.lineTo(inspectCX + 14, inspectCY);
    ctx.moveTo(inspectCX, inspectCY - 14);
    ctx.lineTo(inspectCX, inspectCY + 14);
    ctx.stroke();

    ctx.shadowBlur = 0;
  }, [nnPoints, networkLayers, forwardPass, inputInspectX1, inputInspectX2]);

  // Click on NN Canvas to move Inspection Point
  const handleNNCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = nnCanvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
    sound.playClick();
    setInputInspectX1(parseFloat(x.toFixed(2)));
    setInputInspectX2(parseFloat(y.toFixed(2)));
  };

  const handleNNTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (e.touches.length === 0) return;
    const touch = e.touches[0];
    const canvas = nnCanvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = ((touch.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -(((touch.clientY - rect.top) / rect.height) * 2 - 1);
    sound.playClick();
    setInputInspectX1(parseFloat(x.toFixed(2)));
    setInputInspectX2(parseFloat(y.toFixed(2)));
  };

  // Inspect Output for Live Feed
  const inspectedOutput = useMemo(() => {
    const { activations, output } = forwardPass(inputInspectX1, inputInspectX2, networkLayers);
    return {
      h1: activations[1] || [],
      h2: activations[2] || [],
      p0: parseFloat((output[0] * 100).toFixed(1)),
      p1: parseFloat((output[1] * 100).toFixed(1)),
    };
  }, [inputInspectX1, inputInspectX2, networkLayers, forwardPass]);

  return (
    <section id="datalab" className="relative py-24 px-4 sm:px-6 md:px-10 max-w-7xl mx-auto z-20 overflow-hidden">
      {/* Background Decorative Aura */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-gradient-to-r from-cyan-600/10 via-indigo-600/10 to-fuchsia-600/10 rounded-full blur-[170px] pointer-events-none" />

      {/* Header Bar */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-10 gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/25 text-cyan-300 text-xs font-mono font-semibold mb-3">
            <FlaskConical className="w-4 h-4 text-cyan-400 animate-pulse" />
            ADVANCED AI & DATA SCIENCE WORKBENCH // v2.4 MATHEMATICAL RIGOR
          </div>
          <h2 className="text-white text-3xl sm:text-5xl font-black uppercase tracking-tight">
            Machine Learning{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-400 to-fuchsia-400">
              Lab & Playground
            </span>
          </h2>
        </div>

        {/* Mode Selector Tabs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 w-full lg:w-auto items-center p-1.5 rounded-2xl bg-zinc-950/80 border border-white/10 backdrop-blur-xl shadow-2xl gap-1.5">
          <button
            onClick={() => {
              setActiveMode('kmeans');
              sound.playClick();
            }}
            className={`flex items-center justify-center gap-2 px-3 sm:px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              activeMode === 'kmeans'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-lg shadow-cyan-500/10'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Activity className="w-4 h-4 text-cyan-400" />
            <span>K-Means Clustering</span>
          </button>

          <button
            onClick={() => {
              setActiveMode('regression');
              sound.playClick();
            }}
            className={`flex items-center justify-center gap-2 px-3 sm:px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              activeMode === 'regression'
                ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 shadow-lg shadow-indigo-500/10'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <TrendingUp className="w-4 h-4 text-indigo-400" />
            <span>Polynomial Regression</span>
          </button>

          <button
            onClick={() => {
              setActiveMode('neural');
              sound.playClick();
            }}
            className={`flex items-center justify-center gap-2 px-3 sm:px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              activeMode === 'neural'
                ? 'bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/40 shadow-lg shadow-fuchsia-500/10'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Cpu className="w-4 h-4 text-fuchsia-400" />
            <span>Neural Decision Flow</span>
          </button>
        </div>
      </div>

      {/* MAIN PLAYGROUND CONTAINER */}
      <div className="rounded-3xl bg-zinc-950/85 border border-white/10 p-4 sm:p-6 md:p-8 backdrop-blur-2xl shadow-2xl shadow-black/90">

        {/* ========================================================================= */}
        {/* TAB 1: K-MEANS CLUSTERING */}
        {/* ========================================================================= */}
        {activeMode === 'kmeans' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Canvas Area (2 cols) */}
            <div className="lg:col-span-2 flex flex-col space-y-4">
              <div className="relative aspect-[4/3] sm:aspect-[16/10] w-full rounded-2xl overflow-hidden border border-white/10 cursor-crosshair group shadow-inner">
                <canvas
                  ref={kmeansCanvasRef}
                  onMouseDown={handleKMeansCanvasMouseDown}
                  onMouseMove={handleKMeansCanvasMouseMove}
                  onMouseUp={handleKMeansCanvasMouseUp}
                  onTouchStart={handleKMeansTouchStart}
                  onTouchMove={handleKMeansTouchMove}
                  onTouchEnd={handleKMeansCanvasMouseUp}
                  className="w-full h-full block touch-none"
                />
                
                {/* Visual Legend Overlays */}
                <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                  <div className="px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-md border border-white/10 text-[10px] font-mono text-gray-300 flex items-center gap-1.5">
                    <Target className="w-3 h-3 text-cyan-400" />
                    <span>Click/Tap: Add Point | Drag: Move Point</span>
                  </div>
                  {showVoronoi && (
                    <div className="px-2.5 py-1 rounded-lg bg-cyan-950/60 backdrop-blur-md border border-cyan-500/30 text-[10px] font-mono text-cyan-300">
                      Voronoi Partitions Active
                    </div>
                  )}
                </div>

                <div className="absolute bottom-3 right-3 px-3 py-1.5 rounded-xl bg-black/80 backdrop-blur-md border border-white/10 text-xs font-mono text-cyan-400 flex items-center gap-3">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                    Points: {kPoints.length}
                  </span>
                  <span className="text-gray-600">|</span>
                  <span>Iteration: {kIteration}</span>
                </div>
              </div>

              {/* Real-Time Telemetry Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10">
                  <div className="text-[10px] font-mono text-gray-400 uppercase mb-1">Inertia (SSE)</div>
                  <div className="text-base sm:text-lg font-mono font-bold text-emerald-400">{kInertia}</div>
                </div>
                <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10">
                  <div className="text-[10px] font-mono text-gray-400 uppercase mb-1">Silhouette Score (s)</div>
                  <div className="text-base sm:text-lg font-mono font-bold text-cyan-400">
                    {avgSilhouette > 0 ? `+${avgSilhouette}` : avgSilhouette}
                  </div>
                </div>
                <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 col-span-2 sm:col-span-1">
                  <div className="text-[10px] font-mono text-gray-400 uppercase mb-1">Convergence</div>
                  <div className={`text-base sm:text-lg font-mono font-bold ${kIteration > 4 ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {kIteration > 4 ? 'OPTIMAL' : 'CONVERGING'}
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar Controls */}
            <div className="flex flex-col justify-between space-y-6">
              <div>
                <h3 className="text-white font-bold text-lg mb-1 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-cyan-400" />
                  K-Means++ Clustering Engine
                </h3>
                <p className="text-gray-400 text-xs font-light leading-relaxed mb-6">
                  Voronoi partitioning with live Silhouette validation and covariance dispersion ellipses.
                </p>

                {/* K Slider */}
                <div className="mb-5">
                  <div className="flex justify-between text-xs font-semibold text-gray-300 mb-2">
                    <span>Clusters (K)</span>
                    <span className="text-cyan-400 font-mono font-bold">{kCount}</span>
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

                {/* Seeding Algorithm */}
                <div className="mb-5">
                  <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider font-mono mb-2">
                    Centroid Seeding
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setInitMethod('kmeans++')}
                      className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                        initMethod === 'kmeans++'
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                          : 'bg-white/5 text-gray-400 border border-white/10'
                      }`}
                    >
                      K-Means++ Smart
                    </button>
                    <button
                      onClick={() => setInitMethod('random')}
                      className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                        initMethod === 'random'
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                          : 'bg-white/5 text-gray-400 border border-white/10'
                      }`}
                    >
                      Uniform Random
                    </button>
                  </div>
                </div>

                {/* Visual Overlays Toggles */}
                <div className="space-y-2 mb-5">
                  <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider font-mono mb-1">
                    Visual Overlays
                  </div>
                  <label className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.03] border border-white/10 cursor-pointer">
                    <span className="text-xs text-gray-300">Voronoi Decision Regions</span>
                    <input
                      type="checkbox"
                      checked={showVoronoi}
                      onChange={(e) => setShowVoronoi(e.target.checked)}
                      className="accent-cyan-400 rounded cursor-pointer"
                    />
                  </label>
                  <label className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.03] border border-white/10 cursor-pointer">
                    <span className="text-xs text-gray-300">Covariance 1-Sigma Ellipses</span>
                    <input
                      type="checkbox"
                      checked={showConfidenceEllipses}
                      onChange={(e) => setShowConfidenceEllipses(e.target.checked)}
                      className="accent-cyan-400 rounded cursor-pointer"
                    />
                  </label>
                </div>

                {/* Dataset Presets */}
                <div className="space-y-2 mb-6">
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider font-mono">Dataset Presets</span>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => generateKMeansData('blobs')}
                      className="px-2.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-gray-200 transition-all text-center"
                    >
                      Gaussian Blobs
                    </button>
                    <button
                      onClick={() => generateKMeansData('anisotropic')}
                      className="px-2.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-gray-200 transition-all text-center"
                    >
                      Anisotropic
                    </button>
                    <button
                      onClick={() => generateKMeansData('rings')}
                      className="px-2.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-gray-200 transition-all text-center"
                    >
                      Concentric Rings
                    </button>
                    <button
                      onClick={() => generateKMeansData('spiral')}
                      className="px-2.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-gray-200 transition-all text-center"
                    >
                      Random Uniform
                    </button>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-white/10">
                <button
                  onClick={stepKMeansAlgorithm}
                  className="py-2.5 px-4 rounded-xl bg-cyan-600/20 hover:bg-cyan-600/30 border border-cyan-500/40 text-cyan-300 text-xs font-semibold flex items-center justify-center gap-2 transition-all active:scale-95 shadow-md"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Step Iteration</span>
                </button>
                <button
                  onClick={() => setIsKMeansAutoRunning((prev) => !prev)}
                  className={`py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all active:scale-95 shadow-md ${
                    isKMeansAutoRunning
                      ? 'bg-amber-600/20 text-amber-300 border border-amber-500/40'
                      : 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/40'
                  }`}
                >
                  {isKMeansAutoRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  <span>{isKMeansAutoRunning ? 'Pause Loop' : 'Auto Converge'}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: POLYNOMIAL REGRESSION WITH RIDGE PENALTY */}
        {/* ========================================================================= */}
        {activeMode === 'regression' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Canvas Area (2 cols) */}
            <div className="lg:col-span-2 flex flex-col space-y-4">
              <div className="relative aspect-[4/3] sm:aspect-[16/10] w-full rounded-2xl overflow-hidden border border-white/10 cursor-crosshair group shadow-inner">
                <canvas
                  ref={regCanvasRef}
                  onMouseDown={handleRegCanvasMouseDown}
                  onMouseMove={handleRegCanvasMouseMove}
                  onMouseUp={handleRegCanvasMouseUp}
                  onTouchStart={handleRegTouchStart}
                  onTouchMove={handleRegTouchMove}
                  onTouchEnd={handleRegCanvasMouseUp}
                  className="w-full h-full block touch-none"
                />
                <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                  <div className="px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-md border border-white/10 text-[10px] font-mono text-gray-300 flex items-center gap-1.5">
                    <TrendingUp className="w-3 h-3 text-indigo-400" />
                    <span>Click/Tap: Add Point | Drag: Outlier Adjustment</span>
                  </div>
                  {showConfidenceInterval && (
                    <div className="px-2.5 py-1 rounded-lg bg-indigo-950/60 backdrop-blur-md border border-indigo-500/30 text-[10px] font-mono text-indigo-300">
                      95% Confidence Band (±1.96 SE)
                    </div>
                  )}
                </div>

                <div className="absolute bottom-3 right-3 px-3 py-1.5 rounded-xl bg-black/80 backdrop-blur-md border border-white/10 text-xs font-mono text-indigo-300 flex items-center gap-3">
                  <span>MSE: {regMetrics.mse}</span>
                  <span className="text-gray-600">|</span>
                  <span className="text-emerald-400 font-bold">R²: {regMetrics.r2}</span>
                  <span className="text-gray-600">|</span>
                  <span className="text-cyan-400">Adj-R²: {regMetrics.adjR2}</span>
                </div>
              </div>

              {/* Telemetry Metrics Deck */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10">
                  <div className="text-[10px] font-mono text-gray-400 uppercase mb-1">RMSE</div>
                  <div className="text-base font-mono font-bold text-indigo-300">{regMetrics.rmse}</div>
                </div>
                <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10">
                  <div className="text-[10px] font-mono text-gray-400 uppercase mb-1">MAE</div>
                  <div className="text-base font-mono font-bold text-cyan-300">{regMetrics.mae}</div>
                </div>
                <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10">
                  <div className="text-[10px] font-mono text-gray-400 uppercase mb-1">Pearson R²</div>
                  <div className="text-base font-mono font-bold text-emerald-400">{regMetrics.r2}</div>
                </div>
                <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10">
                  <div className="text-[10px] font-mono text-gray-400 uppercase mb-1">Points Plotted</div>
                  <div className="text-base font-mono font-bold text-white">{regPoints.length}</div>
                </div>
              </div>
            </div>

            {/* Sidebar Controls */}
            <div className="flex flex-col justify-between space-y-6">
              <div>
                <h3 className="text-white font-bold text-lg mb-1 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-indigo-400" />
                  Regularized Polynomial Model
                </h3>
                <p className="text-gray-400 text-xs font-light leading-relaxed mb-5">
                  Analytical Ridge ($L_2$) Normal Equations with 95% Confidence prediction ribbons.
                </p>

                {/* Degree Slider */}
                <div className="mb-4">
                  <div className="flex justify-between text-xs font-semibold text-gray-300 mb-2">
                    <span>Polynomial Degree ($d$)</span>
                    <span className="text-indigo-400 font-mono font-bold">
                      {regDegree === 1
                        ? '1 (Linear)'
                        : regDegree === 2
                        ? '2 (Quadratic)'
                        : regDegree === 3
                        ? '3 (Cubic)'
                        : `${regDegree} (Higher-Order)`}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={regDegree}
                    onChange={(e) => setRegDegree(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-indigo-400"
                  />
                </div>

                {/* Ridge Regularization Penalty Slider */}
                <div className="mb-4">
                  <div className="flex justify-between text-xs font-semibold text-gray-300 mb-2">
                    <span>Ridge Penalty ($\lambda$)</span>
                    <span className="text-cyan-400 font-mono font-bold">{ridgeLambda.toFixed(4)}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="0.1"
                    step="0.001"
                    value={ridgeLambda}
                    onChange={(e) => setRidgeLambda(parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                  />
                  <div className="flex justify-between text-[10px] text-gray-500 font-mono mt-1">
                    <span>0 (Overfit)</span>
                    <span>0.1 (Constrained)</span>
                  </div>
                </div>

                {/* Analytical Equation Readout */}
                <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1.5 mb-5 font-mono text-xs">
                  <span className="text-gray-400 text-[10px] uppercase font-bold">Fitted Mathematical Model:</span>
                  <div className="text-cyan-300 font-semibold text-[11px] break-all">
                    {regMetrics.formula}
                  </div>
                </div>

                {/* Presets */}
                <div className="space-y-2 mb-6">
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider font-mono">Presets</span>
                  <div className="grid grid-cols-4 gap-2">
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
                      Parabola
                    </button>
                    <button
                      onClick={() => generateRegressionData('sine')}
                      className="px-2 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-gray-200 transition-all text-center"
                    >
                      Sine
                    </button>
                    <button
                      onClick={() => generateRegressionData('noisy')}
                      className="px-2 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-gray-200 transition-all text-center"
                    >
                      Bimodal
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-white/10">
                <button
                  onClick={() => setShowConfidenceInterval((prev) => !prev)}
                  className={`py-2.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                    showConfidenceInterval
                      ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/40'
                      : 'bg-white/5 text-gray-400 border border-white/10'
                  }`}
                >
                  <BarChart3 className="w-3.5 h-3.5" />
                  <span>CI Band 95%</span>
                </button>
                <button
                  onClick={() => setRegPoints([])}
                  className="py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Clear Points</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: NEURAL NETWORK 2D DECISION BOUNDARY & LIVE BACKPROP */}
        {/* ========================================================================= */}
        {activeMode === 'neural' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* 2D Decision Boundary Canvas + Network Topology */}
            <div className="lg:col-span-2 flex flex-col space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 2D Decision Boundary Manifold */}
                <div className="relative aspect-square w-full rounded-2xl overflow-hidden border border-white/10 cursor-crosshair shadow-inner">
                  <canvas
                    ref={nnCanvasRef}
                    onClick={handleNNCanvasClick}
                    onTouchStart={handleNNTouchStart}
                    className="w-full h-full block touch-none"
                  />
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-md border border-white/10 text-[10px] font-mono text-gray-300">
                    Click/Tap to probe $(x_1, x_2)$
                  </div>
                  <div className="absolute bottom-3 left-3 flex gap-2">
                    <div className="px-2 py-0.5 rounded-md bg-emerald-500/20 border border-emerald-400/40 text-[10px] font-mono text-emerald-300">
                      Class 0
                    </div>
                    <div className="px-2 py-0.5 rounded-md bg-fuchsia-500/20 border border-fuchsia-400/40 text-[10px] font-mono text-fuchsia-300">
                      Class 1
                    </div>
                  </div>
                </div>

                {/* Synaptic Network Topology Graph */}
                <div className="p-5 rounded-2xl bg-black/60 border border-white/10 flex flex-col justify-between">
                  <div className="flex justify-between items-center text-xs font-mono text-gray-400">
                    <span>TOPOLOGY: 2 → 6 → 4 → 2</span>
                    <span className="text-fuchsia-400 font-bold uppercase">{nnActivation}()</span>
                  </div>

                  {/* SVG Synapse Lines & Nodes */}
                  <div className="flex justify-between items-center py-6 px-3 relative">
                    {/* Layer 0: Inputs */}
                    <div className="flex flex-col gap-10 items-center z-10">
                      <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-400 flex flex-col items-center justify-center shadow-lg shadow-cyan-500/20">
                        <span className="text-[9px] font-mono text-cyan-300 font-bold">x₁</span>
                        <span className="text-[10px] font-mono text-white font-bold">{inputInspectX1.toFixed(2)}</span>
                      </div>
                      <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-400 flex flex-col items-center justify-center shadow-lg shadow-cyan-500/20">
                        <span className="text-[9px] font-mono text-cyan-300 font-bold">x₂</span>
                        <span className="text-[10px] font-mono text-white font-bold">{inputInspectX2.toFixed(2)}</span>
                      </div>
                    </div>

                    {/* Layer 1: Hidden 6 */}
                    <div className="flex flex-col gap-2 items-center z-10">
                      {inspectedOutput.h1.map((val, idx) => (
                        <div
                          key={idx}
                          className="w-7 h-7 rounded-lg bg-indigo-500/20 border border-indigo-400/80 flex items-center justify-center shadow-sm shadow-indigo-500/20 transition-all"
                          style={{ transform: `scale(${0.85 + Math.min(0.4, Math.abs(val) * 0.3)})` }}
                        >
                          <span className="text-[9px] font-mono text-indigo-200 font-bold">{val.toFixed(1)}</span>
                        </div>
                      ))}
                    </div>

                    {/* Layer 2: Hidden 4 */}
                    <div className="flex flex-col gap-4 items-center z-10">
                      {inspectedOutput.h2.map((val, idx) => (
                        <div
                          key={idx}
                          className="w-8 h-8 rounded-lg bg-purple-500/20 border border-purple-400/80 flex items-center justify-center shadow-sm shadow-purple-500/20 transition-all"
                          style={{ transform: `scale(${0.85 + Math.min(0.4, Math.abs(val) * 0.3)})` }}
                        >
                          <span className="text-[9px] font-mono text-purple-200 font-bold">{val.toFixed(1)}</span>
                        </div>
                      ))}
                    </div>

                    {/* Layer 3: Output Softmax Classes */}
                    <div className="flex flex-col gap-8 items-center z-10">
                      <div className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-400 flex flex-col items-center justify-center shadow-lg shadow-emerald-500/20 min-w-[62px]">
                        <span className="text-[9px] font-mono text-emerald-300 font-bold">Class 0</span>
                        <span className="text-xs font-mono text-white font-black">{inspectedOutput.p0}%</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-fuchsia-500/20 border border-fuchsia-400 flex flex-col items-center justify-center shadow-lg shadow-fuchsia-500/20 min-w-[62px]">
                        <span className="text-[9px] font-mono text-fuchsia-300 font-bold">Class 1</span>
                        <span className="text-xs font-mono text-white font-black">{inspectedOutput.p1}%</span>
                      </div>
                    </div>
                  </div>

                  {/* Softmax Probability Distribution Bar */}
                  <div className="pt-3 border-t border-white/10 flex items-center gap-3">
                    <span className="text-[11px] font-mono text-gray-400">Softmax Ratio:</span>
                    <div className="flex-1 h-2.5 rounded-full bg-white/10 overflow-hidden flex">
                      <div style={{ width: `${inspectedOutput.p0}%` }} className="bg-emerald-500 transition-all duration-200" />
                      <div style={{ width: `${inspectedOutput.p1}%` }} className="bg-fuchsia-500 transition-all duration-200" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Neural Telemetry Deck */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10">
                  <div className="text-[10px] font-mono text-gray-400 uppercase mb-1">Epochs Trained</div>
                  <div className="text-base font-mono font-bold text-white">{nnEpoch}</div>
                </div>
                <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10">
                  <div className="text-[10px] font-mono text-gray-400 uppercase mb-1">Cross-Entropy Loss</div>
                  <div className="text-base font-mono font-bold text-amber-400">{nnLoss}</div>
                </div>
                <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10">
                  <div className="text-[10px] font-mono text-gray-400 uppercase mb-1">Training Accuracy</div>
                  <div className="text-base font-mono font-bold text-emerald-400">{nnAccuracy}%</div>
                </div>
                <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10">
                  <div className="text-[10px] font-mono text-gray-400 uppercase mb-1">Learning Rate (α)</div>
                  <div className="text-base font-mono font-bold text-cyan-300">{nnLearningRate}</div>
                </div>
              </div>
            </div>

            {/* Sidebar Controls */}
            <div className="flex flex-col justify-between space-y-6">
              <div>
                <h3 className="text-white font-bold text-lg mb-1 flex items-center gap-2">
                  <BrainCircuit className="w-5 h-5 text-fuchsia-400" />
                  Neural Decision Manifold
                </h3>
                <p className="text-gray-400 text-xs font-light leading-relaxed mb-5">
                  Live in-browser backpropagation training with continuous 2D decision boundary projection.
                </p>

                {/* Dataset Selector */}
                <div className="mb-4">
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider font-mono mb-2 block">
                    Classification Dataset
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    {(['moons', 'circles', 'spiral', 'xor'] as const).map((d) => (
                      <button
                        key={d}
                        onClick={() => {
                          setNnDataset(d);
                          sound.playClick();
                        }}
                        className={`px-3 py-2 rounded-xl text-xs font-mono uppercase transition-all ${
                          nnDataset === d
                            ? 'bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/40 font-bold'
                            : 'bg-white/5 text-gray-300 border border-white/10'
                        }`}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Activation Function Switcher */}
                <div className="space-y-2 mb-4">
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider font-mono">
                    Activation Function
                  </span>
                  <div className="grid grid-cols-4 gap-1.5">
                    {(['tanh', 'relu', 'sigmoid', 'gelu'] as const).map((fn) => (
                      <button
                        key={fn}
                        onClick={() => {
                          setNnActivation(fn);
                          sound.playClick();
                        }}
                        className={`px-2 py-1.5 rounded-xl text-xs font-mono uppercase transition-all ${
                          nnActivation === fn
                            ? 'bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/40 font-bold'
                            : 'bg-white/5 text-gray-400 border border-white/10'
                        }`}
                      >
                        {fn}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Learning Rate Slider */}
                <div className="mb-4">
                  <div className="flex justify-between text-xs font-semibold text-gray-300 mb-2">
                    <span>Learning Rate ($\alpha$)</span>
                    <span className="text-cyan-400 font-mono font-bold">{nnLearningRate}</span>
                  </div>
                  <input
                    type="range"
                    min="0.01"
                    max="0.25"
                    step="0.01"
                    value={nnLearningRate}
                    onChange={(e) => setNnLearningRate(parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-4 border-t border-white/10">
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={trainNNStep}
                    className="py-2.5 px-4 rounded-xl bg-fuchsia-600/20 hover:bg-fuchsia-600/30 border border-fuchsia-500/40 text-fuchsia-300 text-xs font-semibold flex items-center justify-center gap-2 transition-all active:scale-95"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Train 1 Epoch</span>
                  </button>
                  <button
                    onClick={() => setIsNnTraining((prev) => !prev)}
                    className={`py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all active:scale-95 ${
                      isNnTraining
                        ? 'bg-amber-600/20 text-amber-300 border border-amber-500/40'
                        : 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/40'
                    }`}
                  >
                    {isNnTraining ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    <span>{isNnTraining ? 'Pause Training' : 'Live Backprop'}</span>
                  </button>
                </div>

                <button
                  onClick={() => {
                    setNetworkLayers(initNNWeights());
                    setNnEpoch(0);
                    setNnLoss(0.69);
                    setNnAccuracy(50);
                    sound.playChime();
                  }}
                  className="w-full py-2 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-400 text-xs font-semibold flex items-center justify-center gap-2 transition-all"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Xavier Re-Initialize Weights</span>
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
