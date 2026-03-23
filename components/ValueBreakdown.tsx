'use client';

import { useState } from 'react';
import { CategoryResult, EvaluationInput } from '@/lib/types';

interface ValueBreakdownProps {
  categories: CategoryResult[];
  input?: EvaluationInput;
}

function getLabelStyle(label: string): { text: string; bg: string; border: string } {
  switch (label) {
    case 'LOW':
      return { text: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' };
    case 'AVERAGE':
      return { text: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-200' };
    case 'ABOVE AVG':
      return { text: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200' };
    case 'HIGH':
      return { text: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' };
    case 'EXCEPTIONAL':
      return { text: 'text-[#FF6B00]', bg: 'bg-orange-50', border: 'border-orange-200' };
    default:
      return { text: 'text-gray-500', bg: 'bg-gray-50', border: 'border-gray-200' };
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
      return 'linear-gradient(90deg, #FF6B00, #FFB800)';
    default:
      return 'linear-gradient(90deg, #9ca3af, #d1d5db)';
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
      <h3 className="text-lg font-bold text-[#1A1A2E] mb-4">Value Breakdown</h3>
      <div className="space-y-3">
        {active.map((cat, idx) => {
          const isExpanded = expandedKey === cat.key;
          const hasExpandableDetail =
            cat.key === 'mainSquadPower' && squadHeroEntries.length > 0;
          const labelStyle = getLabelStyle(cat.label);
          const isEven = idx % 2 === 0;

          return (
            <div
              key={cat.key}
              className={`p-3.5 rounded-xl border border-gray-100 ${
                isEven ? 'bg-white' : 'bg-[#FAFAFA]'
              }`}
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
                  <span className="text-sm font-medium text-[#1A1A2E]">
                    {cat.name}
                  </span>
                  {hasExpandableDetail && (
                    <span className="text-xs text-[#9CA3AF]">
                      {isExpanded ? '▾' : '▸'}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded-full border ${labelStyle.text} ${labelStyle.bg} ${labelStyle.border}`}
                  >
                    {cat.label}
                  </span>
                  <span className="text-sm font-bold value-gradient">
                    ${cat.dollarValue.toFixed(0)}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-xs text-[#4A4A68]">
                  You: {formatValue(cat.playerValue)}
                </span>
                <span className="text-xs text-[#D1D5DB]">|</span>
                <span className="text-xs text-[#9CA3AF]">
                  Avg: {formatValue(cat.baseline)}
                </span>
              </div>
              <div className="w-full rounded-full h-1.5 bg-[#F3F4F6]">
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
                <div className="mt-3 pt-3 space-y-1 border-t border-gray-100">
                  {input?.squadType && (
                    <p className="text-xs text-[#FF6B00] font-medium mb-1">
                      {input.squadType} Squad
                    </p>
                  )}
                  {squadHeroEntries.map(([name, power]) => (
                    <div
                      key={name}
                      className="flex items-center justify-between text-xs"
                    >
                      <span className="text-[#4A4A68]">{name}</span>
                      <span className="text-[#1A1A2E] font-medium">
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
