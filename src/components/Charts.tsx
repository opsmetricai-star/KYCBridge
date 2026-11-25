"use client";
import { Bar, BarChart, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const COLORS = ["#8a9a5b", "#ff5f6d", "#a31c65"];

export function DecisionChart({ data }: { data: { name: string; value: number }[] }) {
  return (
    <div className="h-64">
      <ResponsiveContainer>
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" innerRadius={55} outerRadius={90} paddingAngle={2}>
            {data.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
      <div className="-mt-2 flex justify-center gap-4 text-xs">{data.map((d, i) => <span key={d.name} className="flex items-center gap-1"><i className="h-2 w-2 rounded-full" style={{ background: COLORS[i] }} />{d.name} {d.value}</span>)}</div>
    </div>
  );
}

export function ScoreChart({ data }: { data: { range: string; count: number }[] }) {
  return (
    <div className="h-64">
      <ResponsiveContainer>
        <BarChart data={data}>
          <XAxis dataKey="range" tickLine={false} axisLine={false} fontSize={12} />
          <YAxis allowDecimals={false} tickLine={false} axisLine={false} fontSize={12} width={28} />
          <Tooltip cursor={{ fill: "rgba(0,0,0,.05)" }} />
          <Bar dataKey="count" fill="#ff5f6d" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
