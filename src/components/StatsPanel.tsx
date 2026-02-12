import { Activity, Radio, BarChart3, Zap } from "lucide-react";

interface StatsPanelProps {
  stats: {
    frame: number;
    currentTime: number;
    totalSent: number;
    totalReceived: number;
    activePackets: number;
    rtsAttempts: number;
    rtsSuccess: number;
    sicIterations: [number, number, number];
    pdr: number;
    rtsSuccessRate: number;
  };
  phase: string;
}

const StatRow = ({ label, value, color = "text-warning" }: { label: string; value: string | number; color?: string }) => (
  <div className="stat-row">
    <span className="text-sm text-muted-foreground">{label}</span>
    <span className={`font-mono text-sm font-semibold ${color}`}>{value}</span>
  </div>
);

const StatsPanel = ({ stats, phase }: StatsPanelProps) => {
  return (
    <div className="space-y-4">
      {/* Phase indicator */}
      <div className="bg-primary/15 border border-primary/30 rounded-lg py-3 text-center">
        <span className="font-mono font-bold text-primary tracking-widest text-sm uppercase">{phase}</span>
      </div>

      {/* Key Metrics */}
      <div className="glass-card p-5">
        <div className="section-title"><BarChart3 className="w-5 h-5" /> Key Metrics</div>
        <div className="section-divider" />
        <div className="grid grid-cols-2 gap-3">
          <div className="metric-card">
            <div className="text-2xl font-bold text-primary glow-text">{stats.pdr.toFixed(1)}%</div>
            <div className="text-xs text-muted-foreground mt-1 tracking-wider uppercase">Packet Delivery</div>
          </div>
          <div className="metric-card-accent">
            <div className="text-2xl font-bold text-accent">{stats.rtsSuccessRate.toFixed(1)}%</div>
            <div className="text-xs text-muted-foreground mt-1 tracking-wider uppercase">RTS Success</div>
          </div>
        </div>
      </div>

      {/* SIC Decoding */}
      <div className="glass-card p-5">
        <div className="section-title"><Zap className="w-5 h-5" /> SIC Decoding</div>
        <div className="section-divider" />
        <div className="space-y-2">
          <StatRow label="Iteration 1:" value={stats.sicIterations[0]} color="text-destructive" />
          <StatRow label="Iteration 2:" value={stats.sicIterations[1]} color="text-destructive" />
          <StatRow label="Iteration 3+:" value={stats.sicIterations[2]} color="text-destructive" />
        </div>
      </div>

      {/* Overall Stats */}
      <div className="glass-card p-5">
        <div className="section-title"><Activity className="w-5 h-5" /> Overall Stats</div>
        <div className="section-divider" />
        <div className="space-y-2">
          <StatRow label="Frame:" value={stats.frame} />
          <StatRow label="Current Time:" value={`${stats.currentTime.toFixed(1)} ms`} />
          <StatRow label="Total Sent:" value={stats.totalSent} />
          <StatRow label="Total Received:" value={stats.totalReceived} />
          <StatRow label="Active Packets:" value={stats.activePackets} />
        </div>
      </div>

      {/* RTS Phase */}
      <div className="glass-card p-5">
        <div className="section-title"><Radio className="w-5 h-5" /> RTS Phase</div>
        <div className="section-divider" />
        <div className="space-y-2">
          <StatRow label="RTS Attempts:" value={stats.rtsAttempts} />
          <StatRow label="RTS Success:" value={stats.rtsSuccess} />
        </div>
      </div>
    </div>
  );
};

export default StatsPanel;
