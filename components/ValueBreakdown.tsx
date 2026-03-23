'use client';

import { useState } from 'react';
import { CategoryResult, EvaluationInput } from '@/lib/types';

interface ValueBreakdownProps {
  categories: CategoryResult[];
  input?: EvaluationInput;
}

function getLabelColor(label: string): string {
  switch (label) {
    case 'LOW':
      return 'text-red-400';
    case 'AVERAGE':
      return 'text-yellow-400';
    case 'ABOVE AVG':
      return 'text-green-400';
    case 'HIGH':
      return 'text-emerald-400';
    case 'EXCEPTIONAL':
      return 'text-orange-400';
    default:
      return 'text-slate-500';
  }
}

function getBarGradient(label: string): string {
  switch (label) {
    case 'LOW':
      return 'linear-gradient(90deg, #ef4444, #f87171)';
    case 'AVERAGE':
      return 'linear-gradient(90deg, #eab308, #facc15)';
    case 'ABOVE AVG':
      return 'linear-gradient(90deg, #22c55e, #4ade80)';
    case 'HIGH':
      return 'linear-gradient(90deg, #10b981, #34d399)';
    case 'EXCEPTIONAL':
      return 'linear-gradient(90deg, #FF6B00, #FFD700)';
    default:
      return 'linear-gradient(90deg, #475569, #64748b)';
  }
}

function formatValue(val: number | string): string {
  if (typeof val === 'string') return val;
  if (val >= 1000000) return `${(val / 1000000).toFixed(1)}M`;
  if (val >= 1000) return `${(val / 1000).toFixed(0)}K`;
  return val.toString();
}

export default function ValueBreakdown({ categories, input }: ValueBreakdownProps) {
  const active = categories.filter((c) => c.weight > 0);
  const [expandedKey, setExpandedKey] = useState<string | null>(null);

  // Build squad hero details if available
  const squadHeroEntries = input?.squadHeroes
    ? Object.entries(input.squadHeroes).filter(([, power]) => power > 0)
    : [];

  return (
    <div className="card-static p-6">
      <h3 className="text-lg font-bold text-white mb-4">Value Breakdown</h3>
      <div className="space-y-3">
        {active.map((cat) => {
          const isExpanded = expandedKey === cat.key;
          const hasExpandableDetail =
            cat.key === 'mainSquadPower' && squadHeroEntries.length > 0;

          return (
            <div
              key={cat.key}
              className="p-3.5 rounded-xl"
              style={{ background: 'rgba(15, 29, 50, 0.5)', border: '1px solid rgba(255, 107, 0, 0.08)' }}
            >
              <div
                className={`flex items-center justify-between mb-1.5 ${
                  hasExpandableDetail ? 'cursor-pointer' : ''
                }`}
                onClick={() => {
                  if (hasExpandableDetail) {
                    setExpandedKey(isExpanded ? null : cat.key);
                  }
                }}
              >
                <div className="flex items-center gap-2">
                  <span>{cat.emoji}</span>
                  <span className="text-sm font-medium text-white">
                    {cat.name}
                  </span>
                  {hasExpandableDetail && (
                    <span className="text-xs text-slate-500">
                      {isExpanded ? '▾' : '▸'}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-bold ${getLabelColor(cat.label)}`}>
                    {cat.label}
                  </span>
                  <span className="text-sm font-bold value-gradient">
                    ${cat.dollarValue.toFixed(0)}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-xs text-slate-400">
                  You: {formatValue(cat.playerValue)}
                </span>
                <span className="text-xs text-slate-600">|</span>
                <span className="text-xs text-slate-500">
                  Avg: {formatValue(cat.baseline)}
                </span>
              </div>
              <div className="w-full rounded-full h-1.5" style={{ background: 'rgba(15, 29, 50, 0.8)' }}>
                <div
                  className="h-1.5 rounded-full transition-all"
                  style={{
                    width: `${Math.min(Math.max(cat.score / 2.5, 0) * 100, 100)}%`,
                    background: getBarGradient(cat.label),
                  }}
                />
              </div>

              {/* Expandable hero detail for Main Squad */}
              {isExpanded && cat.key === 'mainSquadPower' && (
                <div className="mt-3 pt-3 space-y-1" style={{ borderTop: '1px solid rgba(255, 107, 0, 0.1)' }}>
                  {input?.squadType && (
                    <p className="text-xs text-orange-400 font-medium mb-1">
                      {input.squadType} Squad
                    </p>
                  )}
                  {squadHeroEntries.map(([name, power]) => (
                    <div
                      key={name}
                      className="flex items-center justify-between text-xs"
                    >
                      <span className="text-slate-400">{name}</span>
                      <span className="text-slate-300">
                        {power.toLocaleString('en-US')}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
