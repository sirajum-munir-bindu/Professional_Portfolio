"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

interface HeroVisualProps {
  avatarUrl?: string | null;
  displayName?: string;
  accentColor?: string;
}

export function HeroVisual({ avatarUrl, displayName, accentColor = "#10b981" }: HeroVisualProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    // If an avatar is present, skip the canvas animation loop to preserve CPU/GPU
    if (avatarUrl) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Parse accent color for RGB canvas blending
    const cleanHex = (accentColor || "#10b981").replace("#", "");
    const r = parseInt(cleanHex.substring(0, 2), 16) || 16;
    const g = parseInt(cleanHex.substring(2, 4), 16) || 185;
    const b = parseInt(cleanHex.substring(4, 6), 16) || 129;
    const activeAccent = `#${cleanHex}`;

    let animationFrameId: number;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener("resize", handleResize);

    // Enhanced Topology Nodes
    const nodeCount = 42;
    const nodes: {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      accent: boolean;
      pulsePhase: number;
    }[] = [];

    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.55,
        vy: (Math.random() - 0.5) * 0.55,
        radius: Math.random() > 0.75 ? 2.8 : 1.6,
        accent: Math.random() > 0.65,
        pulsePhase: Math.random() * Math.PI * 2,
      });
    }

    const pulses: {
      sourceIdx: number;
      targetIdx: number;
      progress: number;
      speed: number;
    }[] = [];

    let mouseX = -1000;
    let mouseY = -1000;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouseX = -1000;
      mouseY = -1000;
    };

    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleMouseLeave);

    let time = 0;

    const render = () => {
      time += 0.02;
      ctx.clearRect(0, 0, width, height);

      const connections: [number, number, number][] = [];

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 125) {
            connections.push([i, j, dist]);
            const alpha = (1 - dist / 125) * 0.28;
            ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
            ctx.lineWidth = 0.85;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }

      if (Math.random() < 0.05 && connections.length > 0 && pulses.length < 8) {
        const randConn = connections[Math.floor(Math.random() * connections.length)];
        pulses.push({
          sourceIdx: randConn[0],
          targetIdx: randConn[1],
          progress: 0,
          speed: 0.02 + Math.random() * 0.025,
        });
      }

      for (let p = pulses.length - 1; p >= 0; p--) {
        const pulse = pulses[p];
        pulse.progress += pulse.speed;

        if (pulse.progress >= 1) {
          pulses.splice(p, 1);
          continue;
        }

        const src = nodes[pulse.sourceIdx];
        const tgt = nodes[pulse.targetIdx];
        if (!src || !tgt) continue;

        const px = src.x + (tgt.x - src.x) * pulse.progress;
        const py = src.y + (tgt.y - src.y) * pulse.progress;

        ctx.beginPath();
        ctx.arc(px, py, 2.4, 0, Math.PI * 2);
        ctx.fillStyle = activeAccent;
        ctx.shadowColor = activeAccent;
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      for (const node of nodes) {
        const mdx = mouseX - node.x;
        const mdy = mouseY - node.y;
        const mdist = Math.sqrt(mdx * mdx + mdy * mdy);

        if (mdist < 150) {
          node.x += (mdx / mdist) * 0.6;
          node.y += (mdy / mdist) * 0.6;
        }

        node.x += node.vx;
        node.y += node.vy;

        if (node.x < 0 || node.x > width) node.vx *= -1;
        if (node.y < 0 || node.y > height) node.vy *= -1;

        const pulseScale = 1 + Math.sin(time + node.pulsePhase) * 0.25;

        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius * pulseScale, 0, Math.PI * 2);

        if (node.accent) {
          ctx.fillStyle = activeAccent;
          ctx.shadowColor = `rgba(${r}, ${g}, ${b}, 0.7)`;
          ctx.shadowBlur = 6;
          ctx.fill();
          ctx.shadowBlur = 0;
        } else {
          ctx.fillStyle = "rgba(255, 255, 255, 0.55)";
          ctx.fill();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [avatarUrl, accentColor]);

  return (
    <div className="relative w-full h-[300px] sm:h-[420px] lg:h-[460px] rounded-3xl border border-white/10 bg-gradient-to-br from-[#12141f]/95 via-[#0c0e14]/90 to-[#08090d]/95 backdrop-blur-xl overflow-hidden shadow-2xl group">
      {/* Ambient glow behind container */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.12),transparent_70%)] pointer-events-none" />

      {/* Render Photo Mode */}
      {avatarUrl ? (
        <div className="relative w-full h-full">
          <Image
            src={avatarUrl}
            alt={displayName || "Developer Profile"}
            fill
            priority
            unoptimized
            sizes="(max-width: 1024px) 100vw, 480px"
            className="object-cover object-center group-hover:scale-[1.02] transition-transform duration-700"
          />
        </div>
      ) : (
        /* Render Fallback Topology Canvas Mode */
        <div className="relative w-full h-full">
          {/* Architectural dot matrix */}
          <div
            className="absolute inset-0 opacity-25 pointer-events-none"
            style={{
              backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.18) 1px, transparent 1px)`,
              backgroundSize: "28px 28px",
            }}
          />

          <canvas
            ref={canvasRef}
            className="relative z-10 w-full h-full block cursor-crosshair"
          />
        </div>
      )}
    </div>
  );
}
