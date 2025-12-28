"use client";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface ChartProps {
  data: any[];
  dataKey: string;
}

export const StockChart = ({ data, dataKey }: ChartProps) => {
  // If data is an object (like a single price), we can't chart it.
  // This expects an array of historical points.
  if (!Array.isArray(data))
    return (
      <div className="text-[10px] text-slate-500 italic p-4">
        Chart requires historical array data.
      </div>
    );

  return (
    <div className="h-32 w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#1e293b"
            vertical={false}
          />
          <XAxis dataKey="name" hide={true} />
          <YAxis hide={true} domain={["auto", "auto"]} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#0d1117",
              border: "1px solid #334155",
            }}
            itemStyle={{ color: "#10b981", fontSize: "10px" }}
          />
          <Line
            type="monotone"
            dataKey={dataKey}
            stroke="#10b981"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
