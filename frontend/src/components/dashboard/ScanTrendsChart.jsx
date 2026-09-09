import React from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';

export const ScanTrendsChart = ({ data }) => {
  const chartData = data && data.length > 0 ? data : [
    { day: "Mon", scans: 4, healthy: 3, diseased: 1 },
    { day: "Tue", scans: 7, healthy: 5, diseased: 2 },
    { day: "Wed", scans: 12, healthy: 9, diseased: 3 },
    { day: "Thu", scans: 9, healthy: 6, diseased: 3 },
    { day: "Fri", scans: 15, healthy: 11, diseased: 4 },
    { day: "Sat", scans: 18, healthy: 14, diseased: 4 },
    { day: "Sun", scans: 8, healthy: 6, diseased: 2 },
  ];

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-soft-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-base font-bold text-slate-textDark">
            Foliar Health & Scan Velocity
          </h4>
          <p className="text-xs text-slate-textMuted">
            Weekly leaf diagnostic volume and pathology detection rates
          </p>
        </div>
        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-brand-sageLight/50 text-brand-dark">
          Last 7 Days
        </span>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="healthyGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="#10B981" stopOpacity={0.0}/>
              </linearGradient>
              <linearGradient id="diseasedGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
            <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 12 }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 12 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1E293B',
                borderRadius: '12px',
                border: 'none',
                color: '#fff',
                fontSize: '12px',
                boxShadow: '0 10px 25px -5px rgba(0,0,0,0.3)'
              }}
            />
            <Legend verticalAlign="top" align="right" height={36} iconType="circle" />
            <Area
              type="monotone"
              name="Healthy Foliage"
              dataKey="healthy"
              stroke="#10B981"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#healthyGrad)"
            />
            <Area
              type="monotone"
              name="Pathology Detected"
              dataKey="diseased"
              stroke="#F59E0B"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#diseasedGrad)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ScanTrendsChart;
