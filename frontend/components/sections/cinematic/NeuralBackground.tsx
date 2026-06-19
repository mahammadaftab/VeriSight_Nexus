"use client";

import React, { useEffect, useRef } from "react";

export default function NeuralBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    // --- Data Structures ---
    
    // Layer 1: Stars
    const starCount = Math.floor((width * height) / 4000);
    const stars = Array.from({ length: starCount }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 1.5,
      opacity: Math.random(),
      speed: Math.random() * 0.05 + 0.01,
    }));

    // Layer 2: Neural Graph
    const nodeCount = Math.min(Math.floor((width * height) / 10000), 150);
    const nodes = Array.from({ length: nodeCount }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.2,
      vy: (Math.random() - 0.5) * 0.2,
      radius: Math.random() * 1.5 + 0.5,
      connections: [] as number[],
    }));

    // Layer 3: Data Streams (packets moving between nodes)
    const streams = Array.from({ length: 40 }).map(() => ({
      sourceIdx: Math.floor(Math.random() * nodeCount),
      targetIdx: Math.floor(Math.random() * nodeCount),
      progress: Math.random(),
      speed: Math.random() * 0.01 + 0.005,
      color: Math.random() > 0.5 ? "rgba(59, 130, 246, " : "rgba(168, 85, 247, ",
    }));

    // Layer 4 & 5: Aurora & Core handled in render loop

    let animationFrameId: number;
    let scrollY = 0;
    let mouse = { x: width / 2, y: height / 2 };

    const handleScroll = () => {
      scrollY = window.scrollY;
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("mousemove", handleMouseMove);

    let time = 0;

    const render = () => {
      time += 0.005;
      
      // Base dark background
      ctx.fillStyle = "#02000a"; // Extremely deep purple-black
      ctx.fillRect(0, 0, width, height);

      // --- Layer 4: Aurora Gradient ---
      // Creates slow-moving, massive, subtle color blobs
      const cx1 = width * 0.3 + Math.sin(time) * 300;
      const cy1 = height * 0.4 + Math.cos(time * 0.8) * 200;
      const aurora1 = ctx.createRadialGradient(cx1, cy1 - scrollY * 0.2, 0, cx1, cy1 - scrollY * 0.2, width * 0.6);
      aurora1.addColorStop(0, "rgba(59, 130, 246, 0.06)"); // Blue
      aurora1.addColorStop(1, "rgba(2, 0, 10, 0)");
      ctx.fillStyle = aurora1;
      ctx.fillRect(0, 0, width, height);

      const cx2 = width * 0.7 + Math.cos(time * 1.2) * 400;
      const cy2 = height * 0.6 + Math.sin(time * 0.9) * 300;
      const aurora2 = ctx.createRadialGradient(cx2, cy2 - scrollY * 0.15, 0, cx2, cy2 - scrollY * 0.15, width * 0.5);
      aurora2.addColorStop(0, "rgba(168, 85, 247, 0.05)"); // Purple
      aurora2.addColorStop(1, "rgba(2, 0, 10, 0)");
      ctx.fillStyle = aurora2;
      ctx.fillRect(0, 0, width, height);

      // --- Layer 5: AI Core Glow ---
      // A central, deep glow that reacts to the mouse slightly
      const coreX = width / 2 + (mouse.x - width / 2) * 0.05;
      const coreY = height / 2 + (mouse.y - height / 2) * 0.05 - scrollY * 0.4;
      const coreGlow = ctx.createRadialGradient(coreX, coreY, 0, coreX, coreY, height * 0.8);
      coreGlow.addColorStop(0, "rgba(147, 51, 234, 0.08)");
      coreGlow.addColorStop(0.5, "rgba(59, 130, 246, 0.03)");
      coreGlow.addColorStop(1, "rgba(2, 0, 10, 0)");
      ctx.fillStyle = coreGlow;
      ctx.fillRect(0, 0, width, height);

      // --- Layer 1: Stars (Parallax 0.1) ---
      ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
      for (let star of stars) {
        star.y -= star.speed;
        if (star.y < 0) star.y = height;
        
        const parallaxY = (star.y - scrollY * 0.1) % height;
        const finalY = parallaxY < 0 ? parallaxY + height : parallaxY;

        ctx.globalAlpha = star.opacity * (0.3 + 0.7 * Math.sin(time * 10 + star.x));
        ctx.beginPath();
        ctx.arc(star.x, finalY, star.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      // --- Layer 2: Neural Graph (Parallax 0.3) ---
      // Update nodes
      for (let i = 0; i < nodes.length; i++) {
        let n = nodes[i];
        n.x += n.vx;
        n.y += n.vy;

        if (n.x < 0 || n.x > width) n.vx *= -1;
        if (n.y < 0 || n.y > height * 2) n.vy *= -1; // Allow nodes to exist off-screen vertically for scroll

        // Mouse interaction
        let dxMouse = n.x - mouse.x;
        let dyMouse = (n.y - scrollY * 0.3) - mouse.y;
        let distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);
        if (distMouse < 200) {
          n.x += dxMouse / distMouse * 0.5;
          n.y += dyMouse / distMouse * 0.5;
        }

        n.connections = []; // Reset connections
      }

      // Draw connections
      ctx.lineWidth = 0.5;
      for (let i = 0; i < nodes.length; i++) {
        let n1 = nodes[i];
        const y1 = n1.y - scrollY * 0.3;
        
        // Skip rendering if far off screen
        if (y1 < -100 || y1 > height + 100) continue;

        for (let j = i + 1; j < nodes.length; j++) {
          let n2 = nodes[j];
          const y2 = n2.y - scrollY * 0.3;

          let dx = n1.x - n2.x;
          let dy = y1 - y2;
          let dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 150) {
            n1.connections.push(j);
            ctx.beginPath();
            ctx.strokeStyle = `rgba(100, 150, 255, ${0.25 - dist / 600})`;
            ctx.moveTo(n1.x, y1);
            ctx.lineTo(n2.x, y2);
            ctx.stroke();
          }
        }
      }

      // Draw nodes
      ctx.fillStyle = "rgba(200, 220, 255, 0.6)";
      for (let n of nodes) {
        const y = n.y - scrollY * 0.3;
        if (y < -10 || y > height + 10) continue;
        
        ctx.beginPath();
        ctx.arc(n.x, y, n.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      // --- Layer 3: Data Streams ---
      for (let stream of streams) {
        stream.progress += stream.speed;
        if (stream.progress >= 1) {
          stream.progress = 0;
          stream.sourceIdx = Math.floor(Math.random() * nodeCount);
          let sourceNode = nodes[stream.sourceIdx];
          if (sourceNode.connections.length > 0) {
            stream.targetIdx = sourceNode.connections[Math.floor(Math.random() * sourceNode.connections.length)];
          } else {
            stream.targetIdx = Math.floor(Math.random() * nodeCount);
          }
        }

        let n1 = nodes[stream.sourceIdx];
        let n2 = nodes[stream.targetIdx];
        
        const y1 = n1.y - scrollY * 0.3;
        const y2 = n2.y - scrollY * 0.3;

        // Skip if both nodes off screen
        if ((y1 < -50 || y1 > height + 50) && (y2 < -50 || y2 > height + 50)) continue;

        const currentX = n1.x + (n2.x - n1.x) * stream.progress;
        const currentY = y1 + (y2 - y1) * stream.progress;

        ctx.shadowBlur = 10;
        ctx.shadowColor = stream.color + "1)";
        ctx.fillStyle = stream.color + "1)";
        ctx.beginPath();
        ctx.arc(currentX, currentY, 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none w-full h-full"
    />
  );
}
