import { useState, useEffect, useCallback, useRef } from "react";
import NetworkTopology from "@/components/NetworkTopology";
import ControlPanel from "@/components/ControlPanel";
import StatsPanel from "@/components/StatsPanel";
import ProtocolComparison from "@/components/ProtocolComparison";
import ThroughputChart from "@/components/ThroughputChart";
import { Rocket } from "lucide-react";

interface Packet {
  id: number;
  fromNode: number;
  toNode: number;
  progress: number;
  color: string;
  type: "rts" | "data" | "ack";
}

const Index = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [nodeCount, setNodeCount] = useState(10);
  const [speed, setSpeed] = useState(1.0);
  const [packets, setPackets] = useState<Packet[]>([]);
  const [activeNodes, setActiveNodes] = useState<Set<number>>(new Set());
  const [phase, setPhase] = useState("IDLE");
  const [throughputData, setThroughputData] = useState<{ time: number; throughput: number }[]>(
    Array.from({ length: 20 }, (_, i) => ({ time: i, throughput: 0 }))
  );

  const frameRef = useRef(0);
  const statsRef = useRef({
    frame: 0,
    currentTime: 0,
    totalSent: 0,
    totalReceived: 0,
    activePackets: 0,
    rtsAttempts: 0,
    rtsSuccess: 0,
    sicIterations: [0, 0, 0] as [number, number, number],
    pdr: 0,
    rtsSuccessRate: 0,
  });
  const [stats, setStats] = useState(statsRef.current);
  const packetIdRef = useRef(0);

  const reset = useCallback(() => {
    setIsRunning(false);
    setPackets([]);
    setActiveNodes(new Set());
    setPhase("IDLE");
    frameRef.current = 0;
    packetIdRef.current = 0;
    statsRef.current = {
      frame: 0, currentTime: 0, totalSent: 0, totalReceived: 0,
      activePackets: 0, rtsAttempts: 0, rtsSuccess: 0,
      sicIterations: [0, 0, 0], pdr: 0, rtsSuccessRate: 0,
    };
    setStats(statsRef.current);
    setThroughputData(Array.from({ length: 20 }, (_, i) => ({ time: i, throughput: 0 })));
  }, []);

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      frameRef.current += 1;
      const frame = frameRef.current;

      // Determine phase
      const phases = ["RTS PHASE", "CTS PHASE", "DATA PHASE", "ACK PHASE"];
      const currentPhase = phases[Math.floor(frame / 30) % phases.length];
      setPhase(currentPhase);

      // Generate packets
      const newPackets: Packet[] = [];
      if (frame % 5 === 0) {
        const types: Array<"rts" | "data" | "ack"> = ["rts", "data", "ack"];
        const count = Math.floor(Math.random() * 3) + 1;
        for (let i = 0; i < count; i++) {
          const fromNode = Math.floor(Math.random() * nodeCount) + 1;
          packetIdRef.current += 1;
          newPackets.push({
            id: packetIdRef.current,
            fromNode,
            toNode: 0, // center
            progress: 0,
            color: "",
            type: types[Math.floor(Math.random() * types.length)],
          });
        }
      }

      setPackets((prev) => {
        const updated = [...prev, ...newPackets]
          .map((p) => ({ ...p, progress: p.progress + 0.03 * speed }))
          .filter((p) => p.progress < 1);
        return updated;
      });

      // Update active nodes
      const active = new Set<number>();
      packets.forEach((p) => {
        if (p.progress < 0.8) active.add(p.fromNode);
      });
      if (frame % 3 === 0) {
        active.add(Math.floor(Math.random() * nodeCount) + 1);
      }
      setActiveNodes(active);

      // Update stats
      const s = statsRef.current;
      s.frame = frame;
      s.currentTime = frame * 0.5;
      s.totalSent += newPackets.length;
      s.totalReceived += newPackets.filter(() => Math.random() > 0.3).length;
      s.activePackets = packets.length;
      if (currentPhase === "RTS PHASE" && frame % 3 === 0) {
        s.rtsAttempts += 1;
        if (Math.random() > 0.4) s.rtsSuccess += 1;
      }
      s.sicIterations[0] = Math.floor(s.totalReceived * 0.5);
      s.sicIterations[1] = Math.floor(s.totalReceived * 0.05);
      s.sicIterations[2] = Math.floor(s.totalReceived * 0.01);
      s.pdr = s.totalSent > 0 ? (s.totalReceived / s.totalSent) * 100 : 0;
      s.rtsSuccessRate = s.rtsAttempts > 0 ? (s.rtsSuccess / s.rtsAttempts) * 100 : 0;
      setStats({ ...s });

      // Update throughput
      if (frame % 10 === 0) {
        setThroughputData((prev) => {
          const next = [...prev.slice(1), { time: prev[prev.length - 1].time + 1, throughput: Math.random() * 80 + 10 }];
          return next;
        });
      }
    }, 50 / speed);

    return () => clearInterval(interval);
  }, [isRunning, speed, nodeCount, packets.length]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/40 backdrop-blur-lg sticky top-0 z-50">
        <div className="max-w-[1800px] mx-auto px-6 py-4 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2 justify-center">
              <Rocket className="w-6 h-6 text-primary" />
              WRC-MAC Protocol Network Animator
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Real-time visualization of packet flows with comprehensive statistics
            </p>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-[1800px] mx-auto p-4 lg:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">
          {/* Left sidebar - Controls */}
          <div className="lg:col-span-3 space-y-4">
            <ControlPanel
              isRunning={isRunning}
              onToggle={() => setIsRunning(!isRunning)}
              onReset={reset}
              nodeCount={nodeCount}
              onNodeCountChange={setNodeCount}
              speed={speed}
              onSpeedChange={setSpeed}
            />
            <StatsPanel stats={stats} phase={phase} />
          </div>

          {/* Center - Network Topology */}
          <div className="lg:col-span-6">
            <NetworkTopology
              nodeCount={nodeCount}
              isRunning={isRunning}
              packets={packets}
              activeNodes={activeNodes}
            />
          </div>

          {/* Right sidebar - Charts & Comparison */}
          <div className="lg:col-span-3 space-y-4">
            <ThroughputChart data={throughputData} />
            <ProtocolComparison />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
