'use client';

import { useState } from 'react';
import { CategoryResult, EvaluationInput } from '@/lib/types';

interface ValueBreakdownProps {
  categories: CategoryResult[];
  input?: EvaluationInput;
}

function getLabelStyle(label: string): { text: string; bg: string } {
  switch (label) {
    case 'LOW':
      return { text: 'text-[#EF4444]', bg: 'bg-[rgba(239,68,68,0.1)]' };
    case 'AVERAGE':
      return { text: 'text-[#EAB308]', bg: 'bg-[rgba(234,179,8,0.1)]' };
    case 'ABOVE AVG':
      return { text: 'text-[#22C55E]', bg: 'bg-[rgba(34,197,94,0.1)]' };
    case 'HIGH':
      return { text: 'text-[#10B981]', bg: 'bg-[rgba(16,185,129,0.1)]' };
    case 'EXCEPTIONAL':
      return { text: 'text-[#FFD700]', bg: 'bg-[rgba(255,215,0,0.1)]' };
    default:
      return { text: 'text-white/40', bg: 'bg-white/5' };
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
      return 'linear-gradient(90deg, #F59E0B, #FFD700)';
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
          const labelStyle = getLabelStyle(cat.label);

          return (
            <div
              key={cat.key}
              className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06]"
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
                    <span className="text-xs text-white/30">
                      {isExpanded ? '▾' : '▸'}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded-full ${labelStyle.text} ${labelStyle.bg}`}
                  >
                    {cat.label}
                  </span>
                  <span className="text-sm font-bold value-gradient">
                    ${cat.dollarValue.toFixed(0)}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-xs text-white/50">
                  You: {formatValue(cat.playerValue)}
                </span>
                <span className="text-xs text-white/15">|</span>
                <span className="text-xs text-white/30">
                  Avg: {formatValue(cat.baseline)}
                </span>
              </div>
              <div className="w-full rounded-full h-1.5" style={{ background: 'rgba(255, 255, 255, 0.06)' }}>
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
                <div className="mt-3 pt-3 space-y-1 border-t border-white/8">
                  {input?.squadType && (
                    <p className="text-xs text-[#FFD700] font-medium mb-1">
                      {input.squadType} Squad
                    </p>
                  )}
                  {squadHeroEntries.map(([name, power]) => (
                    <div
                      key={name}
                      className="flex items-center justify-between text-xs"
                    >
                      <span className="text-white/50">{name}</span>
                      <span className="text-white/80 font-medium">
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
