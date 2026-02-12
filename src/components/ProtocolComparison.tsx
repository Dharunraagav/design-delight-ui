import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { GitCompare, Info } from "lucide-react";

const data = [
  { name: "PDR (%)", ALOHA: 88, CSMA: 85, CSA: 95, "WRC-MAC": 92 },
  { name: "Energy (mJ)", ALOHA: 12, CSMA: 25, CSA: 45, "WRC-MAC": 38 },
];

const protocols = [
  { name: "ALOHA", desc: "Single TX, no SIC", color: "hsl(0, 72%, 55%)" },
  { name: "CSMA", desc: "Carrier sensing", color: "hsl(38, 92%, 55%)" },
  { name: "CSA", desc: "Multi-replica + SIC", color: "hsl(210, 80%, 60%)" },
  { name: "WRC-MAC", desc: "Hashed RTS + SIC + Wake Reserve", color: "hsl(168, 80%, 50%)" },
];

const COLORS = {
  ALOHA: "hsl(0, 72%, 55%)",
  CSMA: "hsl(38, 92%, 55%)",
  CSA: "hsl(210, 80%, 60%)",
  "WRC-MAC": "hsl(168, 80%, 50%)",
};

const ProtocolComparison = () => {
  return (
    <div className="space-y-4">
      <div className="glass-card p-5">
        <div className="section-title"><GitCompare className="w-5 h-5" /> Protocol Comparison</div>
        <div className="section-divider" />
        <p className="text-center text-sm font-semibold text-foreground mb-4">Protocol Performance</p>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 20%)" />
            <XAxis dataKey="name" tick={{ fill: "hsl(220, 10%, 55%)", fontSize: 12 }} />
            <YAxis tick={{ fill: "hsl(220, 10%, 55%)", fontSize: 12 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(220, 20%, 12%)",
                border: "1px solid hsl(220, 15%, 25%)",
                borderRadius: "8px",
                color: "hsl(180, 10%, 92%)",
              }}
            />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Bar dataKey="ALOHA" fill={COLORS.ALOHA} radius={[4, 4, 0, 0]} />
            <Bar dataKey="CSMA" fill={COLORS.CSMA} radius={[4, 4, 0, 0]} />
            <Bar dataKey="CSA" fill={COLORS.CSA} radius={[4, 4, 0, 0]} />
            <Bar dataKey="WRC-MAC" fill={COLORS["WRC-MAC"]} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
        <p className="text-center text-xs text-muted-foreground mt-2">Live comparison with baseline protocols</p>
      </div>

      <div className="glass-card p-5">
        <div className="section-title"><Info className="w-5 h-5" /> Protocol Details</div>
        <div className="section-divider" />
        <div className="space-y-3">
          {protocols.map((p) => (
            <div key={p.name} className="flex items-start gap-2 text-sm">
              <span className="font-mono font-bold" style={{ color: p.color }}>{p.name}:</span>
              <span className="text-muted-foreground">{p.desc}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProtocolComparison;
