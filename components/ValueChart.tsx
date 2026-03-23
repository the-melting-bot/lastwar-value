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

  const lineColor = isUpTrend ? '#22c55e' : '#ef4444';

  if (evaluations.length === 0) return null;

  if (evaluations.length === 1) {
    return (
      <div className="card-static p-6">
        <h3 className="text-lg font-bold text-[#1A1A2E] mb-4">
          Value Over Time
        </h3>
        <div className="flex items-center justify-center h-48 text-[#4A4A68]">
          <div className="text-center">
            <div
              className="w-4 h-4 rounded-full mx-auto mb-3"
              style={{
                background: 'linear-gradient(135deg, #FF6B00, #FFB800)',
              }}
            />
            <p>First evaluation recorded</p>
            <p className="text-sm text-[#9CA3AF] mt-1">
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
        <h3 className="text-lg font-bold text-[#1A1A2E]">Value Over Time</h3>
        <div className="flex gap-1">
          {(['1M', '3M', '6M', 'All'] as FilterKey[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 text-xs rounded-lg font-medium transition-all ${
                filter === f
                  ? 'text-white'
                  : 'text-[#4A4A68] hover:text-[#FF6B00] bg-[#F3F4F6]'
              }`}
              style={
                filter === f
                  ? {
                      background:
                        'linear-gradient(135deg, #FF6B00, #FF8A33)',
                    }
                  : undefined
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
              <stop offset="0%" stopColor={lineColor} stopOpacity={0.2} />
              <stop offset="100%" stopColor={lineColor} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis
            dataKey="date"
            stroke="#D1D5DB"
            tick={{ fill: '#4A4A68', fontSize: 12 }}
          />
          <YAxis
            stroke="#D1D5DB"
            tick={{ fill: '#4A4A68', fontSize: 12 }}
            tickFormatter={(v) => `$${v}`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #E5E7EB',
              borderRadius: '12px',
              color: '#1A1A2E',
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
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
            activeDot={{ r: 6, strokeWidth: 2, stroke: '#FFFFFF' }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
