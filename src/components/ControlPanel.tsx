import { Play, Pause, RotateCcw, Settings } from "lucide-react";
import { Slider } from "@/components/ui/slider";

interface ControlPanelProps {
  isRunning: boolean;
  onToggle: () => void;
  onReset: () => void;
  nodeCount: number;
  onNodeCountChange: (v: number) => void;
  speed: number;
  onSpeedChange: (v: number) => void;
}

const ControlPanel = ({
  isRunning,
  onToggle,
  onReset,
  nodeCount,
  onNodeCountChange,
  speed,
  onSpeedChange,
}: ControlPanelProps) => {
  return (
    <div className="glass-card p-5 space-y-4">
      <div>
        <div className="section-title">
          <Settings className="w-5 h-5" /> Controls
        </div>
        <div className="section-divider" />
      </div>

      <button
        onClick={onToggle}
        className={`w-full py-3 rounded-lg font-semibold text-sm tracking-wide transition-all duration-200 flex items-center justify-center gap-2 ${
          isRunning
            ? "bg-warning/20 text-warning border border-warning/30 hover:bg-warning/30"
            : "bg-primary/20 text-primary border border-primary/30 hover:bg-primary/30"
        }`}
      >
        {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        {isRunning ? "Pause Animation" : "Start Animation"}
      </button>

      <button
        onClick={onReset}
        className="w-full py-3 rounded-lg font-semibold text-sm tracking-wide bg-destructive/15 text-destructive border border-destructive/30 hover:bg-destructive/25 transition-all duration-200 flex items-center justify-center gap-2"
      >
        <RotateCcw className="w-4 h-4" /> Reset
      </button>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Number of Nodes:</span>
          <span className="font-mono text-foreground">{nodeCount}</span>
        </div>
        <Slider
          value={[nodeCount]}
          onValueChange={(v) => onNodeCountChange(v[0])}
          min={4}
          max={16}
          step={1}
          className="w-full"
        />
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Animation Speed:</span>
          <span className="font-mono text-foreground">{speed.toFixed(1)}x</span>
        </div>
        <Slider
          value={[speed * 10]}
          onValueChange={(v) => onSpeedChange(v[0] / 10)}
          min={1}
          max={30}
          step={1}
          className="w-full"
        />
      </div>
    </div>
  );
};

export default ControlPanel;
