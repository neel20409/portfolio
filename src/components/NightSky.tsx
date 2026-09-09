'use client';
import { useEffect, useRef } from 'react';

interface Star {
  x: number;
  y: number;
  z: number;
  size: number;
  alpha: number;
  baseAlpha: number;
  twinkleSpeed: number;
  twinklePhase: number;
  color: string;
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

    // Mouse coordinates & smoothing
    let mouseX = width / 2;
    let mouseY = height / 2;
    let targetMouseX = mouseX;
    let targetMouseY = mouseY;
    let isMouseOnScreen = false;

    // Palette for celestial particles
    const starColors = ['#ffffff', '#c7d2fe', '#a5b4fc', '#818cf8', '#67e8f9', '#f472b6'];

    // Generate Stars across 3D depth
    const starCount = Math.min(Math.floor((width * height) / 4500), 450);
    const stars: Star[] = Array.from({ length: starCount }, () => {
      const z = Math.random() * 0.9 + 0.1; // Depth factor (0.1 to 1.0)
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        z,
        size: (Math.random() * 1.8 + 0.5) * z,
        alpha: Math.random() * 0.7 + 0.3,
        baseAlpha: Math.random() * 0.7 + 0.3,
        twinkleSpeed: Math.random() * 0.03 + 0.008,
        twinklePhase: Math.random() * Math.PI * 2,
        color: starColors[Math.floor(Math.random() * starColors.length)],
      };
    });

    // Meteors
    const meteors: Meteor[] = [];
    const createMeteor = () => {
      if (meteors.length >= 3 || Math.random() > 0.3) return;
      const angle = (Math.PI / 4) + (Math.random() * 0.2 - 0.1); // ~45 degrees
      meteors.push({
        x: Math.random() * width * 1.2 - width * 0.1,
        y: Math.random() * height * 0.3,
        len: Math.random() * 120 + 80,
        speed: Math.random() * 12 + 10,
        angle,
        alpha: 1,
        life: 0,
        maxLife: Math.random() * 50 + 35,
        color: Math.random() > 0.4 ? '#818cf8' : '#38bdf8',
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

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    let meteorSpawnTimer = 0;

    // Animation Loop
    const render = () => {
      // Smooth mouse interpolation
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      // 1. Deep Space Base Background
      ctx.fillStyle = '#030712';
      ctx.fillRect(0, 0, width, height);

      // 2. Volumetric Nebula Clouds with shifting plasma gradients
      const time = Date.now() * 0.0004;
      const neb1X = width * 0.25 + Math.sin(time) * 60;
      const neb1Y = height * 0.3 + Math.cos(time * 0.8) * 50;
      const g1 = ctx.createRadialGradient(neb1X, neb1Y, 10, neb1X, neb1Y, width * 0.55);
      g1.addColorStop(0, 'rgba(79, 70, 229, 0.16)'); // Electric Indigo
      g1.addColorStop(0.5, 'rgba(147, 51, 234, 0.07)'); // Deep Violet
      g1.addColorStop(1, 'rgba(3, 7, 18, 0)');
      ctx.fillStyle = g1;
      ctx.fillRect(0, 0, width, height);

      const neb2X = width * 0.8 + Math.cos(time * 0.7) * 70;
      const neb2Y = height * 0.75 + Math.sin(time * 0.9) * 60;
      const g2 = ctx.createRadialGradient(neb2X, neb2Y, 10, neb2X, neb2Y, width * 0.5);
      g2.addColorStop(0, 'rgba(6, 182, 212, 0.12)'); // Cyan Core
      g2.addColorStop(0.6, 'rgba(99, 102, 241, 0.05)');
      g2.addColorStop(1, 'rgba(3, 7, 18, 0)');
      ctx.fillStyle = g2;
      ctx.fillRect(0, 0, width, height);

      // 3. Mouse Illumination Aura
      if (isMouseOnScreen) {
        const mouseGlow = ctx.createRadialGradient(mouseX, mouseY, 0, mouseX, mouseY, 280);
        mouseGlow.addColorStop(0, 'rgba(99, 102, 241, 0.10)');
        mouseGlow.addColorStop(0.5, 'rgba(168, 85, 247, 0.04)');
        mouseGlow.addColorStop(1, 'rgba(3, 7, 18, 0)');
        ctx.fillStyle = mouseGlow;
        ctx.fillRect(0, 0, width, height);
      }

      // 4. Draw Constellation lines between nearby stars & mouse
      ctx.lineWidth = 0.5;
      const connectDist = 110;

      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];

        // Star twinkling phase
        star.twinklePhase += star.twinkleSpeed;
        const twinkle = Math.sin(star.twinklePhase) * 0.35 + 0.65;
        const currentAlpha = star.baseAlpha * twinkle;

        // Subtle 3D parallax offset based on depth
        const parallaxX = (mouseX - width / 2) * 0.02 * star.z;
        const parallaxY = (mouseY - height / 2) * 0.02 * star.z;
        const sx = star.x + parallaxX;
        const sy = star.y + parallaxY;

        // Draw Star Body
        ctx.fillStyle = star.color;
        ctx.globalAlpha = currentAlpha;
        ctx.beginPath();
        ctx.arc(sx, sy, star.size, 0, Math.PI * 2);
        ctx.fill();

        // Star Diamond Flare for larger stars
        if (star.size > 1.3 && currentAlpha > 0.6) {
          ctx.strokeStyle = star.color;
          ctx.globalAlpha = currentAlpha * 0.35;
          ctx.beginPath();
          ctx.moveTo(sx - star.size * 3, sy);
          ctx.lineTo(sx + star.size * 3, sy);
          ctx.moveTo(sx, sy - star.size * 3);
          ctx.lineTo(sx, sy + star.size * 3);
          ctx.stroke();
        }

        // Draw cursor connection web
        if (isMouseOnScreen) {
          const dx = mouseX - sx;
          const dy = mouseY - sy;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < connectDist) {
            const lineAlpha = (1 - dist / connectDist) * 0.25 * star.z;
            ctx.strokeStyle = '#a5b4fc';
            ctx.globalAlpha = lineAlpha;
            ctx.beginPath();
            ctx.moveTo(sx, sy);
            ctx.lineTo(mouseX, mouseY);
            ctx.stroke();
          }
        }
      }

      // 5. Meteors simulation
      meteorSpawnTimer++;
      if (meteorSpawnTimer > 180) {
        createMeteor();
        meteorSpawnTimer = 0;
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
        mGrad.addColorStop(0.2, m.color);
        mGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');

        ctx.strokeStyle = mGrad;
        ctx.lineWidth = 1.5;
        ctx.globalAlpha = m.alpha;
        ctx.beginPath();
        ctx.moveTo(m.x, m.y);
        ctx.lineTo(tailX, tailY);
        ctx.stroke();

        // Meteor Head Glow
        ctx.fillStyle = '#ffffff';
        ctx.globalAlpha = m.alpha * 0.8;
        ctx.beginPath();
        ctx.arc(m.x, m.y, 1.8, 0, Math.PI * 2);
        ctx.fill();

        if (m.life >= m.maxLife || m.x > width + 200 || m.y > height + 200) {
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
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[-1] pointer-events-none overflow-hidden bg-[#030712]">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />
      {/* Subtle fine cyber-mesh grid overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
          backgroundSize: '48px 48px',
        }}
      />
    </div>
  );
}