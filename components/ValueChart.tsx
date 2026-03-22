'use client';

import { useState, useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
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
      <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
        <h3 className="text-lg font-bold text-white mb-4">Value Over Time</h3>
        <div className="flex items-center justify-center h-48 text-gray-400">
          <div className="text-center">
            <div className="w-4 h-4 bg-orange-500 rounded-full mx-auto mb-3" />
            <p>First evaluation recorded!</p>
            <p className="text-sm text-gray-500 mt-1">
              Re-evaluate in 2 weeks to start tracking your growth!
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-white">Value Over Time</h3>
        <div className="flex gap-1">
          {(['1M', '3M', '6M', 'All'] as FilterKey[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 text-xs rounded font-medium transition-colors ${
                filter === f
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-700 text-gray-400 hover:text-white'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={filteredData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis
            dataKey="date"
            stroke="#6b7280"
            tick={{ fill: '#9ca3af', fontSize: 12 }}
          />
          <YAxis
            stroke="#6b7280"
            tick={{ fill: '#9ca3af', fontSize: 12 }}
            tickFormatter={(v) => `$${v}`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1f2937',
              border: '1px solid #374151',
              borderRadius: '8px',
              color: '#fff',
            }}
            formatter={(value) => [`$${value}`, 'Value']}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke={lineColor}
            strokeWidth={2}
            dot={{ fill: lineColor, strokeWidth: 2 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
