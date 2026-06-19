"use client";

import { useEffect, useRef } from "react";

interface Node {
  x: number;
  y: number;
  label: string;
  color: string;
  radius: number;
  pulsePhase: number;
  type: "input" | "process" | "output" | "agent";
}

interface DataPacket {
  startNode: number;
  endNode: number;
  progress: number;
  speed: number;
  color: string;
}

const NODE_CONFIGS: Omit<Node, "pulsePhase">[] = [
  // Input nodes (left)
  { x: 0.08, y: 0.2, label: "Claims", color: "#3b82f6", radius: 6, type: "input" },
  { x: 0.08, y: 0.45, label: "Images", color: "#06b6d4", radius: 6, type: "input" },
  { x: 0.08, y: 0.7, label: "History", color: "#8b5cf6", radius: 6, type: "input" },
  // Processing nodes (center)
  { x: 0.3, y: 0.25, label: "Extract", color: "#3b82f6", radius: 8, type: "agent" },
  { x: 0.3, y: 0.55, label: "Vision", color: "#06b6d4", radius: 8, type: "agent" },
  { x: 0.3, y: 0.8, label: "Risk", color: "#f59e0b", radius: 8, type: "agent" },
  // Core engine (center-right)
  { x: 0.55, y: 0.3, label: "Validate", color: "#10b981", radius: 8, type: "agent" },
  { x: 0.55, y: 0.6, label: "Detect", color: "#8b5cf6", radius: 8, type: "agent" },
  // Decision engine (right)
  { x: 0.78, y: 0.4, label: "Decision", color: "#ef4444", radius: 10, type: "process" },
  // Output nodes (far right)
  { x: 0.92, y: 0.25, label: "Supported", color: "#10b981", radius: 5, type: "output" },
  { x: 0.92, y: 0.45, label: "96%", color: "#10b981", radius: 5, type: "output" },
  { x: 0.92, y: 0.65, label: "Explain", color: "#ec4899", radius: 5, type: "output" },
];

const CONNECTIONS: [number, number][] = [
  [0, 3], [1, 4], [2, 5], // inputs → agents
  [3, 6], [4, 6], [4, 7], [5, 7], // agents → validators
  [6, 8], [7, 8], // validators → decision
  [8, 9], [8, 10], [8, 11], // decision → outputs
];

export default function AICommandCenter() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let packets: DataPacket[] = [];
    let time = 0;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      ctx.scale(dpr, dpr);
    };

    const getNodePos = (node: Omit<Node, "pulsePhase">, w: number, h: number) => ({
      x: node.x * w,
      y: node.y * h,
    });

    const spawnPacket = () => {
      const conn = CONNECTIONS[Math.floor(Math.random() * CONNECTIONS.length)];
      const colors = ["#3b82f6", "#8b5cf6", "#06b6d4", "#10b981", "#f59e0b"];
      packets.push({
        startNode: conn[0],
        endNode: conn[1],
        progress: 0,
        speed: 0.003 + Math.random() * 0.004,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    };

    const animate = () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      ctx.clearRect(0, 0, w, h);
      time += 0.016;

      // Spawn packets
      if (Math.random() < 0.08) spawnPacket();

      // Draw connections
      CONNECTIONS.forEach(([from, to]) => {
        const n1 = getNodePos(NODE_CONFIGS[from], w, h);
        const n2 = getNodePos(NODE_CONFIGS[to], w, h);

        ctx.beginPath();
        ctx.moveTo(n1.x, n1.y);

        // Curved connections
        const midX = (n1.x + n2.x) / 2;
        const midY = (n1.y + n2.y) / 2 + (Math.sin(time + from) * 5);
        ctx.quadraticCurveTo(midX, midY, n2.x, n2.y);

        ctx.strokeStyle = `rgba(255, 255, 255, 0.06)`;
        ctx.lineWidth = 1;
        ctx.stroke();
      });

      // Draw data packets
      packets = packets.filter((p) => {
        p.progress += p.speed;
        if (p.progress >= 1) return false;

        const n1 = getNodePos(NODE_CONFIGS[p.startNode], w, h);
        const n2 = getNodePos(NODE_CONFIGS[p.endNode], w, h);
        const t = p.progress;

        const midX = (n1.x + n2.x) / 2;
        const midY = (n1.y + n2.y) / 2;

        const x = (1 - t) * (1 - t) * n1.x + 2 * (1 - t) * t * midX + t * t * n2.x;
        const y = (1 - t) * (1 - t) * n1.y + 2 * (1 - t) * t * midY + t * t * n2.y;

        // Glow
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, 12);
        gradient.addColorStop(0, p.color + "60");
        gradient.addColorStop(1, p.color + "00");
        ctx.beginPath();
        ctx.arc(x, y, 12, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        // Core
        ctx.beginPath();
        ctx.arc(x, y, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();

        return true;
      });

      // Draw nodes
      NODE_CONFIGS.forEach((node, i) => {
        const pos = getNodePos(node, w, h);
        const pulse = Math.sin(time * 2 + i * 0.7) * 0.3 + 0.7;

        // Outer glow
        const glowRadius = node.radius * (node.type === "process" ? 4 : 3);
        const glow = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, glowRadius);
        glow.addColorStop(0, node.color + "30");
        glow.addColorStop(0.5, node.color + "10");
        glow.addColorStop(1, node.color + "00");
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, glowRadius, 0, Math.PI * 2);
        ctx.fillStyle = glow;
        ctx.fill();

        // Pulse ring
        if (node.type === "process" || node.type === "agent") {
          const ringRadius = node.radius * 2 * pulse;
          ctx.beginPath();
          ctx.arc(pos.x, pos.y, ringRadius, 0, Math.PI * 2);
          ctx.strokeStyle = node.color + "20";
          ctx.lineWidth = 1;
          ctx.stroke();
        }

        // Core circle
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, node.radius, 0, Math.PI * 2);
        const coreGradient = ctx.createRadialGradient(
          pos.x - node.radius * 0.3,
          pos.y - node.radius * 0.3,
          0,
          pos.x,
          pos.y,
          node.radius
        );
        coreGradient.addColorStop(0, node.color + "ff");
        coreGradient.addColorStop(1, node.color + "aa");
        ctx.fillStyle = coreGradient;
        ctx.fill();

        // Inner highlight
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, node.radius * 0.4, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
        ctx.fill();

        // Label
        ctx.font = `${Math.max(9, Math.min(11, w * 0.012))}px Inter, system-ui, sans-serif`;
        ctx.fillStyle = `rgba(255, 255, 255, ${node.type === "process" ? 0.9 : 0.6})`;
        ctx.textAlign = "center";
        ctx.fillText(node.label, pos.x, pos.y + node.radius + 14);
      });

      // Status indicators
      const statusY = h * 0.92;
      const statuses = [
        { label: "CLAIMS PIPELINE", status: "ACTIVE", color: "#10b981" },
        { label: "VISION ENGINE", status: "PROCESSING", color: "#3b82f6" },
        { label: "RISK MODULE", status: "MONITORING", color: "#f59e0b" },
      ];

      statuses.forEach((s, i) => {
        const sx = w * (0.2 + i * 0.3);
        ctx.font = "9px Inter, system-ui, sans-serif";
        ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
        ctx.textAlign = "center";
        ctx.fillText(s.label, sx, statusY);

        // Status dot
        ctx.beginPath();
        const dotPulse = Math.sin(time * 3 + i) > 0 ? 1 : 0.5;
        ctx.arc(sx - 30, statusY - 3, 3, 0, Math.PI * 2);
        ctx.fillStyle = s.color + (dotPulse === 1 ? "ff" : "80");
        ctx.fill();
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    resize();
    window.addEventListener("resize", resize);
    animationRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationRef.current);
    };
  }, []);

  return (
    <div className="relative w-full aspect-[16/9] max-w-4xl mx-auto">
      {/* Background glass container */}
      <div className="absolute inset-0 rounded-2xl glass-card overflow-hidden">
        {/* Subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        />
        {/* Corner accents */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
        </div>
        <div className="absolute top-3 right-4 text-[10px] font-mono text-white/20">
          NexusVerify v2.0
        </div>
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      </div>
      {/* Reflection gradient at bottom */}
      <div className="absolute -bottom-px left-[10%] right-[10%] h-px bg-gradient-to-r from-transparent via-purple-500/40 to-transparent" />
    </div>
  );
}
