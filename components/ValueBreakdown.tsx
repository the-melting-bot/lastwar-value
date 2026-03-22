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
      return 'text-gray-500';
  }
}

function getBarColor(label: string): string {
  switch (label) {
    case 'LOW':
      return 'bg-red-500';
    case 'AVERAGE':
      return 'bg-yellow-500';
    case 'ABOVE AVG':
      return 'bg-green-500';
    case 'HIGH':
      return 'bg-emerald-500';
    case 'EXCEPTIONAL':
      return 'bg-orange-500';
    default:
      return 'bg-gray-600';
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
    <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
      <h3 className="text-lg font-bold text-white mb-4">Value Breakdown</h3>
      <div className="space-y-3">
        {active.map((cat) => {
          const isExpanded = expandedKey === cat.key;
          const hasExpandableDetail =
            cat.key === 'mainSquadPower' && squadHeroEntries.length > 0;

          return (
            <div
              key={cat.key}
              className="p-3 bg-gray-900/50 rounded-lg border border-gray-700/50"
            >
              <div
                className={`flex items-center justify-between mb-1 ${
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
                    <span className="text-xs text-gray-500">
                      {isExpanded ? '▾' : '▸'}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-bold ${getLabelColor(cat.label)}`}>
                    {cat.label}
                  </span>
                  <span className="text-sm font-bold text-orange-400">
                    ${cat.dollarValue.toFixed(0)}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs text-gray-400">
                  You: {formatValue(cat.playerValue)}
                </span>
                <span className="text-xs text-gray-600">|</span>
                <span className="text-xs text-gray-500">
                  Avg: {formatValue(cat.baseline)}
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-1.5">
                <div
                  className={`h-1.5 rounded-full transition-all ${getBarColor(cat.label)}`}
                  style={{
                    width: `${Math.min(Math.max(cat.score / 2.5, 0) * 100, 100)}%`,
                  }}
                />
              </div>

              {/* Expandable hero detail for Main Squad */}
              {isExpanded && cat.key === 'mainSquadPower' && (
                <div className="mt-2 pt-2 border-t border-gray-700/50 space-y-1">
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
                      <span className="text-gray-400">{name}</span>
                      <span className="text-gray-300">
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
