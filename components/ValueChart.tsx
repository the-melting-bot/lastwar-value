'use client';

import { useState, useMemo } from 'react';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';
import { Evaluation } from '@/lib/types';

interface ValueChartProps {
  evaluations: Evaluation[];
}

type FilterKey = '1M' | '3M' | '6M' | 'All';

export default function ValueChart({ evaluations }: ValueChartProps) {
  const [filter, setFilter] = useState<FilterKey>('All');

  const filteredData = useMemo(() => {
    const now = new Date();
    let cutoff: Date | null = null;

    if (filter === '1M') {
      cutoff = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
    } else if (filter === '3M') {
      cutoff = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate());
    } else if (filter === '6M') {
      cutoff = new Date(now.getFullYear(), now.getMonth() - 6, now.getDate());
    }

    return evaluations
      .filter((e) => !cutoff || new Date(e.date) >= cutoff)
      .map((e) => ({
        date: new Date(e.date).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
        }),
        value: e.result.totalValue,
      }));
  }, [evaluations, filter]);

  const isUpTrend =
    filteredData.length >= 2 &&
    filteredData[filteredData.length - 1].value >= filteredData[0].value;

  const lineColor = isUpTrend ? '#22C55E' : '#EF4444';

  if (evaluations.length === 0) return null;

  if (evaluations.length === 1) {
    return (
      <div className="card-static p-6">
        <h3 className="text-lg font-bold text-white mb-4">
          Value Over Time
        </h3>
        <div className="flex items-center justify-center h-48 text-white/50">
          <div className="text-center">
            <div
              className="w-4 h-4 rounded-full mx-auto mb-3"
              style={{
                background: 'linear-gradient(135deg, #F59E0B, #FFD700)',
              }}
            />
            <p>First evaluation recorded</p>
            <p className="text-sm text-white/30 mt-1">
              Re-evaluate in 2 weeks to start tracking growth
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card-static p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-white">Value Over Time</h3>
        <div className="flex gap-1">
          {(['1M', '3M', '6M', 'All'] as FilterKey[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 text-xs rounded-lg font-medium transition-all ${
                filter === f
                  ? 'text-[#0B1426]'
                  : 'text-white/50 hover:text-[#FFD700]'
              }`}
              style={
                filter === f
                  ? {
                      background: 'linear-gradient(135deg, #F59E0B, #FFD700)',
                    }
                  : { background: 'rgba(255, 255, 255, 0.06)' }
              }
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={250}>
        <AreaChart data={filteredData}>
          <defs>
            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={lineColor} stopOpacity={0.25} />
              <stop offset="100%" stopColor={lineColor} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" />
          <XAxis
            dataKey="date"
            stroke="rgba(255, 255, 255, 0.1)"
            tick={{ fill: 'rgba(255, 255, 255, 0.5)', fontSize: 12 }}
          />
          <YAxis
            stroke="rgba(255, 255, 255, 0.1)"
            tick={{ fill: 'rgba(255, 255, 255, 0.5)', fontSize: 12 }}
            tickFormatter={(v) => `$${v}`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#0F1A2E',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              color: '#F8FAFC',
              boxShadow: '0 4px 24px rgba(0, 0, 0, 0.4)',
            }}
            formatter={(value) => [`$${value}`, 'Value']}
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke={lineColor}
            strokeWidth={2.5}
            fill="url(#chartGradient)"
            dot={{ fill: lineColor, strokeWidth: 0, r: 4 }}
            activeDot={{ r: 6, strokeWidth: 2, stroke: '#0B1426' }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
