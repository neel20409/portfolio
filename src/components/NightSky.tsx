'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Sparkles, Terminal, Activity, Grid } from 'lucide-react';
import { sound } from '@/utils/soundEngine';

export type BackgroundTheme = 'nebula' | 'matrix' | 'constellations' | 'cybergrid';

interface Star {
  x: number;
  y: number;
  originX: number;
  originY: number;
  vx: number;
  vy: number;
  z: number;
  size: number;
  baseAlpha: number;
  alpha: number;
  twinkleSpeed: number;
  twinklePhase: number;
  color: string;
  isBright: boolean;
}

interface Meteor {
  x: number;
  y: number;
  len: number;
  speed: number;
  angle: number;
  alpha: number;
  life: number;
  maxLife: number;
  color: string;
  width: number;
}

interface Shockwave {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  alpha: number;
  color: string;
}

interface MatrixDrop {
  x: number;
  y: number;
  speed: number;
  chars: string[];
  length: number;
  fontSize: number;
}

interface NodePoint {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
}

const THEME_OPTIONS = [
  { id: 'nebula' as BackgroundTheme, label: 'Deep Nebula', Icon: Sparkles, iconColor: 'text-indigo-400' },
  { id: 'matrix' as BackgroundTheme, label: 'Matrix Rain', Icon: Terminal, iconColor: 'text-emerald-400' },
  { id: 'constellations' as BackgroundTheme, label: 'Constellations', Icon: Activity, iconColor: 'text-cyan-400' },
  { id: 'cybergrid' as BackgroundTheme, label: 'Cyber Grid', Icon: Grid, iconColor: 'text-fuchsia-400' },
];

export default function NightSky() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [activeTheme, setActiveTheme] = useState<BackgroundTheme>('nebula');
  const activeThemeRef = useRef<BackgroundTheme>('nebula');
  const themeResetRef = useRef<boolean>(false);

  const switchTheme = (theme: BackgroundTheme) => {
    setActiveTheme(theme);
    activeThemeRef.current = theme;
    themeResetRef.current = true;
    if (typeof window !== 'undefined') {
      localStorage.setItem('portfolio-bg-theme', theme);
      (window as any).__PORTFOLIO_THEME = theme;
    }
    sound.playChime();
  };

  useEffect(() => {
    const saved = (typeof window !== 'undefined' ? localStorage.getItem('portfolio-bg-theme') : null) as BackgroundTheme;
    if (saved && ['nebula', 'matrix', 'constellations', 'cybergrid'].includes(saved)) {
      setActiveTheme(saved);
      activeThemeRef.current = saved;
      (window as any).__PORTFOLIO_THEME = saved;
    }

    const handleThemeEvent = (e: CustomEvent<BackgroundTheme>) => {
      const theme = e.detail;
      if (theme && ['nebula', 'matrix', 'constellations', 'cybergrid'].includes(theme)) {
        setActiveTheme(theme);
        activeThemeRef.current = theme;
        themeResetRef.current = true;
        localStorage.setItem('portfolio-bg-theme', theme);
        (window as any).__PORTFOLIO_THEME = theme;
      }
    };

    window.addEventListener('set-bg-theme' as any, handleThemeEvent);
    return () => window.removeEventListener('set-bg-theme' as any, handleThemeEvent);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Mouse state
    let mouseX = width / 2;
    let mouseY = height / 2;
    let targetMouseX = mouseX;
    let targetMouseY = mouseY;
    let mouseSpeed = 0;
    let lastMouseX = mouseX;
    let lastMouseY = mouseY;
    let isMouseOnScreen = false;

    // --- 1. NEBULA & STAR SETUP ---
    const starPalette = ['#ffffff', '#e0e7ff', '#a5b4fc', '#67e8f9', '#c084fc', '#f472b6', '#38bdf8'];
    const shockwaves: Shockwave[] = [];
    const starCount = Math.min(Math.floor((width * height) / 3800), 380);
    const stars: Star[] = Array.from({ length: starCount }, () => {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const z = Math.random() * 0.9 + 0.1;
      const isBright = Math.random() > 0.88;
      return {
        x,
        y,
        originX: x,
        originY: y,
        vx: 0,
        vy: 0,
        z,
        size: isBright ? (Math.random() * 1.5 + 1.2) * z : (Math.random() * 1.2 + 0.4) * z,
        baseAlpha: Math.random() * 0.6 + 0.35,
        alpha: Math.random() * 0.6 + 0.35,
        twinkleSpeed: Math.random() * 0.025 + 0.008,
        twinklePhase: Math.random() * Math.PI * 2,
        color: starPalette[Math.floor(Math.random() * starPalette.length)],
        isBright,
      };
    });

    const meteors: Meteor[] = [];
    const spawnMeteor = () => {
      if (meteors.length >= 2 || Math.random() > 0.35) return;
      const angle = Math.PI / 4 + (Math.random() * 0.3 - 0.15);
      meteors.push({
        x: Math.random() * width * 1.3 - width * 0.15,
        y: Math.random() * height * 0.4,
        len: Math.random() * 160 + 90,
        speed: Math.random() * 16 + 12,
        angle,
        alpha: 1,
        life: 0,
        maxLife: Math.random() * 45 + 30,
        color: Math.random() > 0.5 ? '#818cf8' : '#38bdf8',
        width: Math.random() * 1.5 + 1.2,
      });
    };

    // --- 2. MATRIX RAIN SETUP ---
    const matrixChars = 'ｦｱｳｴｵｶｷｹｺｻｼｽｾｿﾀﾂﾃﾅﾆﾇﾈﾊﾋﾎﾏﾐﾑﾒﾓﾔﾕﾗﾘﾜ1029384756ZXYWVUTSRQPONMLKJIHGFEDCBA<>/{}[];:=+*~#@';
    const matrixColWidth = 16;
    const matrixCols = Math.floor(width / matrixColWidth) + 1;
    const matrixDrops: MatrixDrop[] = Array.from({ length: matrixCols }, (_, i) => ({
      x: i * matrixColWidth,
      y: Math.random() * height, // Pre-distributed so rain is immediately visible
      speed: Math.random() * 5 + 4,
      chars: Array.from({ length: Math.floor(Math.random() * 18 + 10) }, () =>
        matrixChars[Math.floor(Math.random() * matrixChars.length)]
      ),
      length: Math.floor(Math.random() * 18 + 10),
      fontSize: 14,
    }));

    // --- 3. CONSTELLATION NODES SETUP ---
    const nodeCount = Math.min(Math.floor((width * height) / 7500), 120);
    const nodePalette = ['#38bdf8', '#818cf8', '#67e8f9', '#c084fc', '#ffffff'];
    const nodes: NodePoint[] = Array.from({ length: nodeCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 1.2,
      vy: (Math.random() - 0.5) * 1.2,
      radius: Math.random() * 2.5 + 1.2,
      color: nodePalette[Math.floor(Math.random() * nodePalette.length)],
    }));

    // --- EVENT LISTENERS ---
    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      targetMouseX = e.clientX;
      targetMouseY = e.clientY;
      isMouseOnScreen = true;
    };

    const handleMouseLeave = () => {
      isMouseOnScreen = false;
    };

    const handleClick = (e: MouseEvent) => {
      if (shockwaves.length < 5) {
        shockwaves.push({
          x: e.clientX,
          y: e.clientY,
          radius: 10,
          maxRadius: Math.min(width, height) * 0.35,
          alpha: 0.8,
          color: activeThemeRef.current === 'matrix' ? '#10b981' : Math.random() > 0.5 ? '#818cf8' : '#06b6d4',
        });
      }
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('click', handleClick);

    let meteorTimer = 0;
    let time = 0;

    // --- RENDER LOOP ---
    const render = () => {
      time += 0.012;
      const currentTheme = activeThemeRef.current || 'nebula';

      // Reset canvas instantly if user switched theme
      if (themeResetRef.current) {
        ctx.fillStyle = currentTheme === 'matrix' ? '#02060c' : currentTheme === 'constellations' ? '#030712' : currentTheme === 'cybergrid' ? '#050510' : '#02040a';
        ctx.fillRect(0, 0, width, height);
        themeResetRef.current = false;
      }

      // Damped mouse movement
      const dxMouse = targetMouseX - mouseX;
      const dyMouse = targetMouseY - mouseY;
      mouseX += dxMouse * 0.06;
      mouseY += dyMouse * 0.06;

      mouseSpeed = Math.sqrt((mouseX - lastMouseX) ** 2 + (mouseY - lastMouseY) ** 2);
      lastMouseX = mouseX;
      lastMouseY = mouseY;

      // ==========================================
      // THEME 1: DEEP NEBULA (Liquid Cosmic Glow)
      // ==========================================
      if (currentTheme === 'nebula') {
        ctx.fillStyle = '#02040a';
        ctx.fillRect(0, 0, width, height);

        // Nebulae
        const neb1X = width * 0.28 + Math.sin(time * 0.7) * (width * 0.12);
        const neb1Y = height * 0.32 + Math.cos(time * 0.5) * (height * 0.1);
        const g1 = ctx.createRadialGradient(neb1X, neb1Y, 0, neb1X, neb1Y, width * 0.6);
        g1.addColorStop(0, 'rgba(67, 56, 202, 0.22)');
        g1.addColorStop(0.4, 'rgba(88, 28, 135, 0.12)');
        g1.addColorStop(0.8, 'rgba(15, 23, 42, 0.04)');
        g1.addColorStop(1, 'rgba(2, 4, 10, 0)');
        ctx.fillStyle = g1;
        ctx.fillRect(0, 0, width, height);

        const neb2X = width * 0.78 + Math.cos(time * 0.6) * (width * 0.1);
        const neb2Y = height * 0.68 + Math.sin(time * 0.8) * (height * 0.12);
        const g2 = ctx.createRadialGradient(neb2X, neb2Y, 0, neb2X, neb2Y, width * 0.55);
        g2.addColorStop(0, 'rgba(6, 182, 212, 0.16)');
        g2.addColorStop(0.45, 'rgba(59, 130, 246, 0.08)');
        g2.addColorStop(1, 'rgba(2, 4, 10, 0)');
        ctx.fillStyle = g2;
        ctx.fillRect(0, 0, width, height);

        const neb3X = width * 0.5 + Math.sin(time * 0.4) * (width * 0.15);
        const neb3Y = height * 0.85 + Math.cos(time * 0.6) * (height * 0.08);
        const g3 = ctx.createRadialGradient(neb3X, neb3Y, 0, neb3X, neb3Y, width * 0.45);
        g3.addColorStop(0, 'rgba(192, 38, 211, 0.12)');
        g3.addColorStop(0.5, 'rgba(99, 102, 241, 0.05)');
        g3.addColorStop(1, 'rgba(2, 4, 10, 0)');
        ctx.fillStyle = g3;
        ctx.fillRect(0, 0, width, height);

        // Cursor Aura
        if (isMouseOnScreen) {
          const mouseRadius = 260 + Math.min(mouseSpeed * 8, 120);
          const mouseGlow = ctx.createRadialGradient(mouseX, mouseY, 0, mouseX, mouseY, mouseRadius);
          mouseGlow.addColorStop(0, 'rgba(99, 102, 241, 0.18)');
          mouseGlow.addColorStop(0.35, 'rgba(6, 182, 212, 0.09)');
          mouseGlow.addColorStop(0.7, 'rgba(168, 85, 247, 0.03)');
          mouseGlow.addColorStop(1, 'rgba(2, 4, 10, 0)');
          ctx.fillStyle = mouseGlow;
          ctx.fillRect(0, 0, width, height);
        }

        // Stars & Filaments
        const connectDist = 120;
        for (let i = 0; i < stars.length; i++) {
          const star = stars[i];
          star.twinklePhase += star.twinkleSpeed;
          const twinkle = Math.sin(star.twinklePhase) * 0.35 + 0.65;
          star.alpha = star.baseAlpha * twinkle;

          if (isMouseOnScreen) {
            const dx = mouseX - star.x;
            const dy = mouseY - star.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 200 && dist > 1) {
              const force = (1 - dist / 200) * 1.5 * star.z;
              const angle = Math.atan2(dy, dx);
              star.vx += Math.cos(angle + Math.PI / 2) * force * 0.3 + Math.cos(angle) * force * 0.4;
              star.vy += Math.sin(angle + Math.PI / 2) * force * 0.3 + Math.sin(angle) * force * 0.4;
            }
          }

          star.vx += (star.originX - star.x) * 0.02;
          star.vy += (star.originY - star.y) * 0.02;
          star.vx *= 0.92;
          star.vy *= 0.92;
          star.x += star.vx;
          star.y += star.vy;

          const drawX = star.x + (mouseX - width / 2) * 0.025 * star.z;
          const drawY = star.y + (mouseY - height / 2) * 0.025 * star.z;

          ctx.fillStyle = star.color;
          ctx.globalAlpha = star.alpha;
          ctx.beginPath();
          ctx.arc(drawX, drawY, star.size, 0, Math.PI * 2);
          ctx.fill();

          if (star.isBright && star.alpha > 0.5) {
            ctx.strokeStyle = star.color;
            ctx.globalAlpha = star.alpha * 0.45;
            const spike = star.size * 3.5;
            ctx.beginPath();
            ctx.moveTo(drawX - spike, drawY);
            ctx.lineTo(drawX + spike, drawY);
            ctx.moveTo(drawX, drawY - spike);
            ctx.lineTo(drawX + spike, drawY);
            ctx.stroke();
          }

          if (isMouseOnScreen) {
            const dx = mouseX - drawX;
            const dy = mouseY - drawY;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < connectDist) {
              ctx.strokeStyle = star.color;
              ctx.globalAlpha = (1 - dist / connectDist) * 0.3 * star.z;
              ctx.beginPath();
              ctx.moveTo(drawX, drawY);
              ctx.lineTo(mouseX, mouseY);
              ctx.stroke();
            }
          }
        }

        // Meteors
        meteorTimer++;
        if (meteorTimer > 160) {
          spawnMeteor();
          meteorTimer = 0;
        }

        for (let i = meteors.length - 1; i >= 0; i--) {
          const m = meteors[i];
          m.life++;
          m.x += Math.cos(m.angle) * m.speed;
          m.y += Math.sin(m.angle) * m.speed;
          m.alpha = Math.max(0, 1 - m.life / m.maxLife);

          const tailX = m.x - Math.cos(m.angle) * m.len;
          const tailY = m.y - Math.sin(m.angle) * m.len;

          const mGrad = ctx.createLinearGradient(m.x, m.y, tailX, tailY);
          mGrad.addColorStop(0, '#ffffff');
          mGrad.addColorStop(0.15, m.color);
          mGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');

          ctx.strokeStyle = mGrad;
          ctx.lineWidth = m.width;
          ctx.globalAlpha = m.alpha;
          ctx.beginPath();
          ctx.moveTo(m.x, m.y);
          ctx.lineTo(tailX, tailY);
          ctx.stroke();

          if (m.life >= m.maxLife || m.x > width + 250 || m.y > height + 250) {
            meteors.splice(i, 1);
          }
        }
      }

      // ==========================================
      // THEME 2: MATRIX DIGITAL RAIN (Cyberpunk)
      // ==========================================
      else if (currentTheme === 'matrix') {
        ctx.fillStyle = 'rgba(2, 6, 12, 0.2)';
        ctx.fillRect(0, 0, width, height);

        ctx.font = '14px monospace';

        for (let i = 0; i < matrixDrops.length; i++) {
          const drop = matrixDrops[i];
          drop.y += drop.speed;

          // Mouse disruption wave
          if (isMouseOnScreen) {
            const mDist = Math.abs(mouseX - drop.x);
            if (mDist < 80) {
              drop.y += (1 - mDist / 80) * 3;
            }
          }

          if (drop.y > height + 50) {
            drop.y = -drop.length * drop.fontSize;
            drop.speed = Math.random() * 5 + 4;
          }

          for (let c = 0; c < drop.length; c++) {
            const charY = drop.y + c * drop.fontSize;
            if (charY < -20 || charY > height + 20) continue;

            const isHead = c === drop.length - 1;
            const alpha = Math.max(0.15, c / drop.length);

            if (isHead) {
              ctx.fillStyle = '#ffffff';
              ctx.shadowColor = '#10b981';
              ctx.shadowBlur = 8;
            } else {
              ctx.fillStyle = `rgba(16, 185, 129, ${alpha})`;
              ctx.shadowBlur = 0;
            }

            if (Math.random() > 0.95) {
              drop.chars[c] = matrixChars[Math.floor(Math.random() * matrixChars.length)];
            }

            ctx.fillText(drop.chars[c] || '0', drop.x, charY);
          }
        }
        ctx.shadowBlur = 0;
      }

      // ==========================================
      // THEME 3: DEEP SPACE CONSTELLATION NETWORK
      // ==========================================
      else if (currentTheme === 'constellations') {
        ctx.fillStyle = '#030712';
        ctx.fillRect(0, 0, width, height);

        // Deep grid background
        ctx.strokeStyle = 'rgba(30, 41, 59, 0.35)';
        ctx.lineWidth = 1;
        const gridSize = 60;
        for (let x = 0; x < width; x += gridSize) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, height);
          ctx.stroke();
        }
        for (let y = 0; y < height; y += gridSize) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(width, y);
          ctx.stroke();
        }

        // Update and draw node connections
        const linkDist = 140;
        for (let i = 0; i < nodes.length; i++) {
          const n = nodes[i];
          n.x += n.vx;
          n.y += n.vy;

          if (n.x < 0 || n.x > width) n.vx *= -1;
          if (n.y < 0 || n.y > height) n.vy *= -1;

          // Mouse gravity pull
          if (isMouseOnScreen) {
            const dx = mouseX - n.x;
            const dy = mouseY - n.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 180 && dist > 1) {
              n.x += (dx / dist) * 1.5;
              n.y += (dy / dist) * 1.5;
            }
          }

          // Draw links to nearest nodes
          for (let j = i + 1; j < nodes.length; j++) {
            const n2 = nodes[j];
            const dx = n.x - n2.x;
            const dy = n.y - n2.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < linkDist) {
              const alpha = (1 - dist / linkDist) * 0.45;
              ctx.strokeStyle = `rgba(56, 189, 248, ${alpha})`;
              ctx.lineWidth = 1.2;
              ctx.beginPath();
              ctx.moveTo(n.x, n.y);
              ctx.lineTo(n2.x, n2.y);
              ctx.stroke();
            }
          }

          // Draw Node Point
          ctx.fillStyle = n.color;
          ctx.shadowColor = n.color;
          ctx.shadowBlur = 6;
          ctx.beginPath();
          ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.shadowBlur = 0;
      }

      // ==========================================
      // THEME 4: 3D CYBER NEON GRID (Synthwave Horizon)
      // ==========================================
      else if (currentTheme === 'cybergrid') {
        ctx.fillStyle = '#050510';
        ctx.fillRect(0, 0, width, height);

        // Neon Horizon Glow
        const horizonY = height * 0.55;
        const sunGrad = ctx.createRadialGradient(width / 2, horizonY, 10, width / 2, horizonY, width * 0.45);
        sunGrad.addColorStop(0, 'rgba(236, 72, 153, 0.35)');
        sunGrad.addColorStop(0.3, 'rgba(168, 85, 247, 0.18)');
        sunGrad.addColorStop(0.7, 'rgba(59, 130, 246, 0.05)');
        sunGrad.addColorStop(1, 'rgba(5, 5, 16, 0)');
        ctx.fillStyle = sunGrad;
        ctx.fillRect(0, 0, width, height);

        // Horizon Line
        ctx.strokeStyle = '#ec4899';
        ctx.shadowColor = '#ec4899';
        ctx.shadowBlur = 12;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, horizonY);
        ctx.lineTo(width, horizonY);
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Perspective Ground Lines (Fan out to bottom)
        const fovVanishingX = width / 2 + (mouseX - width / 2) * 0.15;
        const lineCount = 28;
        ctx.strokeStyle = 'rgba(168, 85, 247, 0.4)';
        ctx.lineWidth = 1.2;

        for (let i = -lineCount; i <= lineCount; i++) {
          const bottomX = width / 2 + (i * width) / 16;
          ctx.beginPath();
          ctx.moveTo(fovVanishingX, horizonY);
          ctx.lineTo(bottomX, height);
          ctx.stroke();
        }

        // Horizontal Scrolling Grid Lines (Perspective spacing)
        const scrollSpeed = (time * 60) % 60;
        for (let i = 0; i < 18; i++) {
          const depth = (i * 35 + scrollSpeed) / (18 * 35);
          const py = horizonY + Math.pow(depth, 2.2) * (height - horizonY);
          const alpha = Math.min(1, depth * 1.4);
          ctx.strokeStyle = `rgba(6, 182, 212, ${alpha * 0.55})`;
          ctx.beginPath();
          ctx.moveTo(0, py);
          ctx.lineTo(width, py);
          ctx.stroke();
        }
      }

      // Shockwaves (Global across all themes)
      for (let sIdx = shockwaves.length - 1; sIdx >= 0; sIdx--) {
        const sw = shockwaves[sIdx];
        sw.radius += (sw.maxRadius - sw.radius) * 0.08 + 2;
        sw.alpha *= 0.94;

        ctx.strokeStyle = sw.color;
        ctx.lineWidth = 2;
        ctx.globalAlpha = sw.alpha;
        ctx.beginPath();
        ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
        ctx.stroke();

        if (sw.alpha < 0.01 || sw.radius >= sw.maxRadius * 0.95) {
          shockwaves.splice(sIdx, 1);
        }
      }

      ctx.globalAlpha = 1;
      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('click', handleClick);
    };
  }, []);

  return (
    <>
      <div className="fixed inset-0 z-[-1] overflow-hidden bg-[#02040a] pointer-events-none">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />

        {/* Ambient Celestial Vignette */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(circle at 50% 50%, transparent 40%, rgba(2, 4, 10, 0.6) 100%)',
          }}
        />
      </div>

      {/* Desktop Floating Theme Switcher Pill in Top Left Dock (>= md) */}
      <div className="hidden md:flex fixed top-5 left-6 z-40 items-center gap-1 p-1 rounded-full bg-zinc-950/85 backdrop-blur-2xl border border-white/10 shadow-xl shadow-black/70 pointer-events-auto">
        <span className="hidden xl:inline text-[10px] font-mono text-gray-400 pl-2.5 pr-1 uppercase tracking-wider font-semibold">Theme:</span>
        {THEME_OPTIONS.map((t) => {
          const isActive = activeTheme === t.id;
          return (
            <button
              key={t.id}
              onClick={() => switchTheme(t.id)}
              title={`Switch to ${t.label} background`}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${
                isActive
                  ? 'bg-indigo-600/35 text-white border border-indigo-500/50 shadow-inner'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-white/5 border border-transparent'
              }`}
            >
              <t.Icon className={`w-3.5 h-3.5 ${t.iconColor}`} />
              <span className="text-[11px]">{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* Mobile Compact Theme Cycle Button (< md) */}
      <button
        onClick={() => {
          const currentIndex = THEME_OPTIONS.findIndex((t) => t.id === activeTheme);
          const nextIndex = (currentIndex + 1) % THEME_OPTIONS.length;
          switchTheme(THEME_OPTIONS[nextIndex].id);
        }}
        className="flex md:hidden fixed top-3 left-3 z-50 w-9 h-9 items-center justify-center rounded-full bg-zinc-950/90 backdrop-blur-2xl border border-white/15 text-gray-200 shadow-xl shadow-black/80 pointer-events-auto active:scale-95 transition-all"
        title="Cycle Visual Theme"
        aria-label="Cycle Visual Theme"
      >
        {(() => {
          const current = THEME_OPTIONS.find((t) => t.id === activeTheme) || THEME_OPTIONS[0];
          const CurrentIcon = current.Icon;
          return <CurrentIcon className={`w-4 h-4 ${current.iconColor} animate-pulse`} />;
        })()}
      </button>
    </>
  );
}