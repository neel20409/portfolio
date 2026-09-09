'use client';

import React, { useEffect, useRef } from 'react';

interface Point {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
}

export default function MagneticCursor() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    // Only enable on pointer-capable devices
    if (typeof window === 'undefined' || window.matchMedia('(pointer: coarse)').matches) {
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    let animId: number;

    let mouseX = width / 2;
    let mouseY = height / 2;
    let isMoving = false;
    let lastMoveTime = Date.now();

    // Trail nodes with spring chain physics
    const numPoints = 18;
    const colors = [
      '#6366f1', // Indigo
      '#818cf8',
      '#06b6d4', // Cyan
      '#38bdf8',
      '#a855f7', // Purple
      '#ec4899', // Pink
    ];

    const points: Point[] = Array.from({ length: numPoints }, (_, i) => ({
      x: mouseX,
      y: mouseY,
      vx: 0,
      vy: 0,
      radius: Math.max(1.5, 7 - i * 0.32),
      color: colors[i % colors.length],
    }));

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      isMoving = true;
      lastMoveTime = Date.now();
    };

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Fade trail when mouse is static
      const isIdle = Date.now() - lastMoveTime > 1500;
      const globalAlpha = isIdle ? Math.max(0, 1 - (Date.now() - lastMoveTime - 1500) / 1000) : 1;

      if (globalAlpha > 0.02) {
        // Head follows mouse
        points[0].x += (mouseX - points[0].x) * 0.35;
        points[0].y += (mouseY - points[0].y) * 0.35;

        // Remaining points follow previous points with spring elasticity
        for (let i = 1; i < numPoints; i++) {
          const prev = points[i - 1];
          const curr = points[i];

          const dx = prev.x - curr.x;
          const dy = prev.y - curr.y;

          curr.vx = (curr.vx + dx * 0.28) * 0.65;
          curr.vy = (curr.vy + dy * 0.28) * 0.65;

          curr.x += curr.vx;
          curr.y += curr.vy;
        }

        // Draw fluid glowing bezier ribbon
        ctx.save();
        ctx.globalCompositeOperation = 'screen';

        for (let i = 0; i < numPoints - 1; i++) {
          const p1 = points[i];
          const p2 = points[i + 1];

          const grad = ctx.createLinearGradient(p1.x, p1.y, p2.x, p2.y);
          grad.addColorStop(0, p1.color);
          grad.addColorStop(1, p2.color);

          ctx.strokeStyle = grad;
          ctx.lineWidth = p1.radius * (1 - i / numPoints) * 2;
          ctx.lineCap = 'round';
          ctx.globalAlpha = (1 - i / numPoints) * 0.6 * globalAlpha;

          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }

        // Leading glowing micro-orb
        ctx.fillStyle = '#ffffff';
        ctx.globalAlpha = 0.8 * globalAlpha;
        ctx.beginPath();
        ctx.arc(points[0].x, points[0].y, 2.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-[80] pointer-events-none"
    />
  );
}
