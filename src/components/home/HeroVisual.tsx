"use client";

import { useEffect, useRef } from "react";

export function HeroVisual() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener("resize", handleResize);

    // Dynamic Nodes
    const nodeCount = 38;
    const nodes: {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      accent: boolean;
    }[] = [];

    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        radius: Math.random() > 0.8 ? 2.5 : 1.5,
        accent: Math.random() > 0.75,
      });
    }

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

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Connect nodes within threshold
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 110) {
            const alpha = (1 - dist / 110) * 0.22;
            ctx.strokeStyle = `rgba(16, 185, 129, ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw and update nodes
      for (const node of nodes) {
        // Subtle mouse attraction
        const mdx = mouseX - node.x;
        const mdy = mouseY - node.y;
        const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
        if (mdist < 140) {
          node.x += (mdx / mdist) * 0.4;
          node.y += (mdy / mdist) * 0.4;
        }

        node.x += node.vx;
        node.y += node.vy;

        if (node.x < 0 || node.x > width) node.vx *= -1;
        if (node.y < 0 || node.y > height) node.vy *= -1;

        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = node.accent ? "#10b981" : "rgba(255, 255, 255, 0.45)";
        ctx.fill();
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
  }, []);

  return (
    <div className="relative w-full h-[360px] sm:h-[420px] rounded-2xl border border-surface-border bg-gradient-to-b from-[#10121a]/90 to-[#090a0f]/90 overflow-hidden shadow-card group">
      {/* Background Architectural Grid Pattern (SVG fallback instant render) */}
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.15) 1px, transparent 1px)`,
          backgroundSize: "24px 24px",
        }}
      />

      {/* Interactive Topology Canvas */}
      <canvas
        ref={canvasRef}
        className="relative z-10 w-full h-full block cursor-crosshair"
      />

      {/* Subtle Overlay Metrics / Status Badge */}
      <div className="absolute bottom-4 left-4 z-20 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/60 backdrop-blur-md border border-white/[0.08] text-[11px] font-mono text-muted-foreground">
        <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
        <span>Raft Consensus &bull; Zero-Copy Buffers &bull; Sub-5ms p99</span>
      </div>

      <div className="absolute top-4 right-4 z-20 text-[10px] font-mono text-white/40 tracking-wider uppercase">
        Live Node Matrix
      </div>
    </div>
  );
}
