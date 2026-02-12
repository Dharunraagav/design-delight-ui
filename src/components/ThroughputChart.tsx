import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from "recharts";
import { TrendingUp } from "lucide-react";

interface ThroughputChartProps {
  data: { time: number; throughput: number }[];
}

const ThroughputChart = ({ data }: ThroughputChartProps) => {
  return (
    <div className="glass-card p-5">
      <div className="section-title"><TrendingUp className="w-5 h-5" /> Throughput Chart</div>
      <div className="section-divider" />
      <ResponsiveContainer width="100%" height={180}>
        <LineChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 20%)" />
          <XAxis
            dataKey="time"
            tick={{ fill: "hsl(220, 10%, 55%)", fontSize: 11 }}
            tickFormatter={(v) => `${v}s`}
          />
          <YAxis tick={{ fill: "hsl(220, 10%, 55%)", fontSize: 11 }} />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(220, 20%, 12%)",
              border: "1px solid hsl(220, 15%, 25%)",
              borderRadius: "8px",
              color: "hsl(180, 10%, 92%)",
            }}
          />
          <Line
            type="monotone"
            dataKey="throughput"
            stroke="hsl(168, 80%, 50%)"
            strokeWidth={2}
            dot={{ fill: "hsl(168, 80%, 50%)", r: 3 }}
            activeDot={{ r: 5, fill: "hsl(168, 80%, 60%)" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ThroughputChart;
