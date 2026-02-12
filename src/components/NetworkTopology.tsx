import { useEffect, useRef, useMemo } from "react";

interface Packet {
  id: number;
  fromNode: number;
  toNode: number;
  progress: number;
  color: string;
  type: "rts" | "data" | "ack";
}

interface NetworkTopologyProps {
  nodeCount: number;
  isRunning: boolean;
  packets: Packet[];
  activeNodes: Set<number>;
}

const NetworkTopology = ({ nodeCount, isRunning, packets, activeNodes }: NetworkTopologyProps) => {
  const canvasRef = useRef<SVGSVGElement>(null);

  const centerX = 300;
  const centerY = 300;
  const radius = 220;

  const nodes = useMemo(() => {
    const result = [];
    for (let i = 0; i < nodeCount; i++) {
      const angle = (2 * Math.PI * i) / nodeCount - Math.PI / 2;
      result.push({
        id: i + 1,
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle),
        label: `N${i + 1}`,
      });
    }
    return result;
  }, [nodeCount]);

  const getNodeColor = (id: number) => {
    if (activeNodes.has(id)) return "hsl(168, 80%, 50%)";
    return "hsl(220, 15%, 35%)";
  };

  const getPacketColor = (type: string) => {
    switch (type) {
      case "rts": return "hsl(38, 92%, 55%)";
      case "data": return "hsl(168, 80%, 50%)";
      case "ack": return "hsl(270, 60%, 65%)";
      default: return "hsl(168, 80%, 50%)";
    }
  };

  const getPacketPosition = (packet: Packet) => {
    const fromNode = packet.fromNode === 0
      ? { x: centerX, y: centerY }
      : nodes.find((n) => n.id === packet.fromNode) || { x: centerX, y: centerY };
    const toNode = packet.toNode === 0
      ? { x: centerX, y: centerY }
      : nodes.find((n) => n.id === packet.toNode) || { x: centerX, y: centerY };

    return {
      x: fromNode.x + (toNode.x - fromNode.x) * packet.progress,
      y: fromNode.y + (toNode.y - fromNode.y) * packet.progress,
    };
  };

  return (
    <div className="glass-card p-4 h-full flex items-center justify-center">
      <svg
        ref={canvasRef}
        viewBox="0 0 600 600"
        className="w-full h-full max-h-[600px]"
      >
        {/* Background grid */}
        <defs>
          <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
            <path d="M 30 0 L 0 0 0 30" fill="none" stroke="hsl(220, 15%, 15%)" strokeWidth="0.5" />
          </pattern>
          <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="hsl(168, 80%, 50%)" stopOpacity="0.15" />
            <stop offset="100%" stopColor="hsl(168, 80%, 50%)" stopOpacity="0" />
          </radialGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <rect width="600" height="600" fill="url(#grid)" opacity="0.5" />
        <circle cx={centerX} cy={centerY} r="120" fill="url(#centerGlow)" />

        {/* Connection lines */}
        {nodes.map((node) => (
          <line
            key={`line-${node.id}`}
            x1={centerX}
            y1={centerY}
            x2={node.x}
            y2={node.y}
            stroke="hsl(220, 15%, 20%)"
            strokeWidth="1"
            strokeDasharray="4 4"
            opacity="0.6"
          />
        ))}

        {/* Center node */}
        <circle
          cx={centerX}
          cy={centerY}
          r="32"
          fill="hsl(220, 20%, 14%)"
          stroke="hsl(168, 80%, 50%)"
          strokeWidth="2"
          filter={isRunning ? "url(#glow)" : undefined}
        />
        <text
          x={centerX}
          y={centerY + 5}
          textAnchor="middle"
          fill="hsl(168, 80%, 50%)"
          fontSize="16"
          fontWeight="bold"
          fontFamily="JetBrains Mono"
        >
          C
        </text>

        {/* Status bar under center */}
        <rect
          x={centerX - 16}
          y={centerY + 38}
          width="32"
          height="4"
          rx="2"
          fill={isRunning ? "hsl(168, 80%, 50%)" : "hsl(220, 15%, 30%)"}
        />

        {/* Outer nodes */}
        {nodes.map((node) => (
          <g key={`node-${node.id}`}>
            <circle
              cx={node.x}
              cy={node.y}
              r="26"
              fill="hsl(220, 20%, 14%)"
              stroke={getNodeColor(node.id)}
              strokeWidth="2"
              filter={activeNodes.has(node.id) ? "url(#glow)" : undefined}
            />
            <text
              x={node.x}
              y={node.y + 5}
              textAnchor="middle"
              fill={activeNodes.has(node.id) ? "hsl(168, 80%, 50%)" : "hsl(180, 10%, 70%)"}
              fontSize="12"
              fontWeight="600"
              fontFamily="JetBrains Mono"
            >
              {node.label}
            </text>
            {/* Status indicator */}
            <rect
              x={node.x - 12}
              y={node.y + 30}
              width="24"
              height="3"
              rx="1.5"
              fill={activeNodes.has(node.id) ? "hsl(168, 80%, 50%)" : "hsl(220, 15%, 25%)"}
            />
          </g>
        ))}

        {/* Packets */}
        {packets.map((packet) => {
          const pos = getPacketPosition(packet);
          return (
            <circle
              key={`packet-${packet.id}`}
              cx={pos.x}
              cy={pos.y}
              r="5"
              fill={getPacketColor(packet.type)}
              filter="url(#glow)"
            />
          );
        })}
      </svg>
    </div>
  );
};

export default NetworkTopology;
