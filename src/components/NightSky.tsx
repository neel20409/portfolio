'use client';

import React, { useEffect, useRef } from 'react';

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

export default function NightSky() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Mouse coordinates with smooth damping
    let mouseX = width / 2;
    let mouseY = height / 2;
    let targetMouseX = mouseX;
    let targetMouseY = mouseY;
    let mouseSpeed = 0;
    let lastMouseX = mouseX;
    let lastMouseY = mouseY;
    let isMouseOnScreen = false;

    // Palette of vibrant cosmic starlight
    const starPalette = [
      '#ffffff', // Pure Diamond White
      '#e0e7ff', // Soft Nebula Indigo
      '#a5b4fc', // Vibrant Hyper Indigo
      '#67e8f9', // Electric Cyan
      '#c084fc', // Celestial Purple
      '#f472b6', // Quantum Pink
      '#38bdf8', // Plasma Blue
    ];

    // Shockwaves on click/interaction
    const shockwaves: Shockwave[] = [];

    // Create 3D deep space starfield
    const starCount = Math.min(Math.floor((width * height) / 3800), 420);
    const stars: Star[] = Array.from({ length: starCount }, () => {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const z = Math.random() * 0.9 + 0.1; // 0.1 (deep distance) to 1.0 (foreground)
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

    // Meteors
    const meteors: Meteor[] = [];
    const spawnMeteor = () => {
      if (meteors.length >= 2 || Math.random() > 0.35) return;
      const angle = Math.PI / 4 + (Math.random() * 0.3 - 0.15); // ~45 deg
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
          color: Math.random() > 0.5 ? '#818cf8' : '#06b6d4',
        });
      }
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('click', handleClick);

    let meteorTimer = 0;
    let time = 0;

    // Render loop
    const render = () => {
      time += 0.008;

      // Damped mouse movement & velocity calculation
      const dxMouse = targetMouseX - mouseX;
      const dyMouse = targetMouseY - mouseY;
      mouseX += dxMouse * 0.06;
      mouseY += dyMouse * 0.06;

      mouseSpeed = Math.sqrt((mouseX - lastMouseX) ** 2 + (mouseY - lastMouseY) ** 2);
      lastMouseX = mouseX;
      lastMouseY = mouseY;

      // 1. Deep Celestial Space Void
      ctx.fillStyle = '#02040a';
      ctx.fillRect(0, 0, width, height);

      // 2. Liquid Chromatic Nebula Gas Clouds (Dynamic trigonometric harmonics)
      const neb1X = width * 0.28 + Math.sin(time * 0.7) * (width * 0.12);
      const neb1Y = height * 0.32 + Math.cos(time * 0.5) * (height * 0.1);
      const g1 = ctx.createRadialGradient(neb1X, neb1Y, 0, neb1X, neb1Y, width * 0.6);
      g1.addColorStop(0, 'rgba(67, 56, 202, 0.22)'); // Hyper Indigo
      g1.addColorStop(0.4, 'rgba(88, 28, 135, 0.12)'); // Deep Violet
      g1.addColorStop(0.8, 'rgba(15, 23, 42, 0.04)');
      g1.addColorStop(1, 'rgba(2, 4, 10, 0)');
      ctx.fillStyle = g1;
      ctx.fillRect(0, 0, width, height);

      const neb2X = width * 0.78 + Math.cos(time * 0.6) * (width * 0.1);
      const neb2Y = height * 0.68 + Math.sin(time * 0.8) * (height * 0.12);
      const g2 = ctx.createRadialGradient(neb2X, neb2Y, 0, neb2X, neb2Y, width * 0.55);
      g2.addColorStop(0, 'rgba(6, 182, 212, 0.16)'); // Quantum Cyan
      g2.addColorStop(0.45, 'rgba(59, 130, 246, 0.08)'); // Electric Blue
      g2.addColorStop(1, 'rgba(2, 4, 10, 0)');
      ctx.fillStyle = g2;
      ctx.fillRect(0, 0, width, height);

      const neb3X = width * 0.5 + Math.sin(time * 0.4) * (width * 0.15);
      const neb3Y = height * 0.85 + Math.cos(time * 0.6) * (height * 0.08);
      const g3 = ctx.createRadialGradient(neb3X, neb3Y, 0, neb3X, neb3Y, width * 0.45);
      g3.addColorStop(0, 'rgba(192, 38, 211, 0.12)'); // Solar Fuchsia
      g3.addColorStop(0.5, 'rgba(99, 102, 241, 0.05)');
      g3.addColorStop(1, 'rgba(2, 4, 10, 0)');
      ctx.fillStyle = g3;
      ctx.fillRect(0, 0, width, height);

      // 3. Interactive Gravitational Lens Aura around Cursor
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

      // 4. Interactive Shockwaves
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

      // 5. Starfield & Cosmic Filaments
      ctx.lineWidth = 0.5;
      const connectDist = 120;

      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];

        // Twinkling pulse
        star.twinklePhase += star.twinkleSpeed;
        const twinkle = Math.sin(star.twinklePhase) * 0.35 + 0.65;
        star.alpha = star.baseAlpha * twinkle;

        // Gravitational displacement from cursor
        if (isMouseOnScreen) {
          const dx = mouseX - star.x;
          const dy = mouseY - star.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const maxDist = 200;

          if (dist < maxDist && dist > 1) {
            // Subtle orbital swirl & gravitational attraction
            const force = (1 - dist / maxDist) * 1.5 * star.z;
            const angle = Math.atan2(dy, dx);
            star.vx += Math.cos(angle + Math.PI / 2) * force * 0.3 + Math.cos(angle) * force * 0.4;
            star.vy += Math.sin(angle + Math.PI / 2) * force * 0.3 + Math.sin(angle) * force * 0.4;
          }
        }

        // Return to origin spring physics
        const returnDx = star.originX - star.x;
        const returnDy = star.originY - star.y;
        star.vx += returnDx * 0.02;
        star.vy += returnDy * 0.02;

        // Friction damping
        star.vx *= 0.92;
        star.vy *= 0.92;

        star.x += star.vx;
        star.y += star.vy;

        // 3D Parallax offset based on mouse position
        const parallaxX = (mouseX - width / 2) * 0.025 * star.z;
        const parallaxY = (mouseY - height / 2) * 0.025 * star.z;
        const drawX = star.x + parallaxX;
        const drawY = star.y + parallaxY;

        // Render Star Core
        ctx.fillStyle = star.color;
        ctx.globalAlpha = star.alpha;
        ctx.beginPath();
        ctx.arc(drawX, drawY, star.size, 0, Math.PI * 2);
        ctx.fill();

        // 4-Point Celestial Diffraction Spikes for bright stars
        if (star.isBright && star.alpha > 0.5) {
          ctx.strokeStyle = star.color;
          ctx.globalAlpha = star.alpha * 0.45;
          const spike = star.size * 3.5;
          ctx.beginPath();
          ctx.moveTo(drawX - spike, drawY);
          ctx.lineTo(drawX + spike, drawY);
          ctx.moveTo(drawX, drawY - spike);
          ctx.lineTo(drawX, drawY + spike);
          ctx.stroke();

          // Soft stellar halo
          const halo = ctx.createRadialGradient(drawX, drawY, 0, drawX, drawY, star.size * 4);
          halo.addColorStop(0, star.color);
          halo.addColorStop(1, 'rgba(255,255,255,0)');
          ctx.fillStyle = halo;
          ctx.globalAlpha = star.alpha * 0.3;
          ctx.beginPath();
          ctx.arc(drawX, drawY, star.size * 4, 0, Math.PI * 2);
          ctx.fill();
        }

        // Connect star to mouse with cosmic filament
        if (isMouseOnScreen) {
          const dx = mouseX - drawX;
          const dy = mouseY - drawY;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < connectDist) {
            const lineAlpha = (1 - dist / connectDist) * 0.3 * star.z;
            ctx.strokeStyle = star.color;
            ctx.globalAlpha = lineAlpha;
            ctx.beginPath();
            ctx.moveTo(drawX, drawY);
            ctx.lineTo(mouseX, mouseY);
            ctx.stroke();
          }
        }
      }

      // 6. Meteors / Comets
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
        mGrad.addColorStop(0.6, 'rgba(129, 140, 248, 0.2)');
        mGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');

        ctx.strokeStyle = mGrad;
        ctx.lineWidth = m.width;
        ctx.globalAlpha = m.alpha;
        ctx.beginPath();
        ctx.moveTo(m.x, m.y);
        ctx.lineTo(tailX, tailY);
        ctx.stroke();

        // Meteor Head Core & Particle Burst
        ctx.fillStyle = '#ffffff';
        ctx.globalAlpha = m.alpha * 0.9;
        ctx.beginPath();
        ctx.arc(m.x, m.y, m.width * 1.5, 0, Math.PI * 2);
        ctx.fill();

        if (m.life >= m.maxLife || m.x > width + 250 || m.y > height + 250) {
          meteors.splice(i, 1);
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
    <div className="fixed inset-0 z-[-1] pointer-events-none overflow-hidden bg-[#02040a]">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />
      {/* Ambient Celestial Vignette Depth Gradient */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 50% 50%, transparent 40%, rgba(2, 4, 10, 0.6) 100%)',
        }}
      />
    </div>
  );
}