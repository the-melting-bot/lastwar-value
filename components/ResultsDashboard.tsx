'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Evaluation } from '@/lib/types';
import { getEvaluations, getLatestEvaluation } from '@/lib/storage';
import { getRecommendations } from '@/lib/valuation';
import ValueChart from './ValueChart';
import ValueBreakdown from './ValueBreakdown';

export default function ResultsDashboard() {
  const router = useRouter();
  const [latest, setLatest] = useState<Evaluation | null>(null);
  const [allEvals, setAllEvals] = useState<Evaluation[]>([]);
  const [previous, setPrevious] = useState<Evaluation | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const evals = getEvaluations();
    const last = getLatestEvaluation();
    setAllEvals(evals);
    setLatest(last);
    if (evals.length >= 2) {
      setPrevious(evals[evals.length - 2]);
    }
  }, []);

  if (!latest) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-[#1A1A2E] mb-4">
          No evaluations yet
        </h2>
        <p className="text-[#4A4A68] mb-6">
          Complete an evaluation to see your results.
        </p>
        <button
          onClick={() => router.push('/evaluate')}
          className="btn-primary px-8 py-3"
        >
          Start Evaluation →
        </button>
      </div>
    );
  }

  const { result, serverInfo } = latest;
  const change = previous
    ? result.totalValue - previous.result.totalValue
    : null;
  const changePct = previous
    ? ((change! / previous.result.totalValue) * 100).toFixed(1)
    : null;

  const recommendations = getRecommendations(result.categories);

  const nextEvalDate = new Date();
  nextEvalDate.setDate(nextEvalDate.getDate() + 14);

  function handleShare() {
    const text = `My Last War Account Value: $${result.totalValue} ($${result.lowRange} - $${result.highRange})\nServer #${serverInfo.id} — Day ${serverInfo.day} — Season ${serverInfo.season}\n\nValued at lastwar-value.vercel.app`;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  // What Changed section
  const changedCategories =
    previous && allEvals.length >= 2
      ? result.categories
          .map((cat) => {
            const prevCat = previous.result.categories.find(
              (c) => c.key === cat.key
            );
            if (!prevCat) return null;
            const diff = cat.dollarValue - prevCat.dollarValue;
            if (Math.abs(diff) < 0.5) return null;
            return {
              name: cat.name,
              emoji: cat.emoji,
              diff,
            };
          })
          .filter(Boolean) as { name: string; emoji: string; diff: number }[]
      : [];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Section 1: Value Header */}
      <div className="card-static p-8 text-center">
        <p className="text-[#4A4A68] text-sm mb-3 tracking-wide uppercase font-medium">
          Your Base Value
        </p>
        <p className="text-5xl sm:text-6xl font-bold value-gradient mb-3">
          ${result.totalValue}
        </p>
        <p className="text-[#4A4A68] mb-3 text-lg">
          ${result.lowRange} — ${result.highRange}
        </p>
        {change !== null && (
          <span
            className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-semibold ${
              change >= 0
                ? 'bg-green-50 text-green-600 border border-green-200'
                : 'bg-red-50 text-red-600 border border-red-200'
            }`}
          >
            {change >= 0 ? '+' : ''}${change.toFixed(0)} ({changePct}%){' '}
            {change >= 0 ? '↑' : '↓'}
          </span>
        )}
        <p className="text-[#9CA3AF] text-sm mt-3">
          Server #{serverInfo.id} — Day {serverInfo.day} — Season{' '}
          {serverInfo.season}
        </p>
      </div>

      {/* Section 2: Value Chart */}
      <ValueChart evaluations={allEvals} />

      {/* Section 3: Value Breakdown */}
      <ValueBreakdown categories={result.categories} input={latest.input} />

      {/* Section 4: What Changed */}
      {changedCategories.length > 0 && (
        <div className="card-static p-6">
          <h3 className="text-lg font-bold text-[#1A1A2E] mb-4">
            What Changed
          </h3>
          <div className="space-y-2">
            {changedCategories.map((c, i) => (
              <div
                key={i}
                className="flex items-center justify-between text-sm py-1"
              >
                <span className="text-[#4A4A68]">
                  {c.emoji} {c.name}
                </span>
                <span
                  className={`font-medium px-2.5 py-0.5 rounded-full text-xs ${
                    c.diff > 0
                      ? 'bg-green-50 text-green-600'
                      : 'bg-red-50 text-red-600'
                  }`}
                >
                  {c.diff > 0 ? '+' : ''}${Math.abs(c.diff).toFixed(0)}
                </span>
              </div>
            ))}
            <div className="pt-2 mt-2 flex justify-between font-bold text-sm border-t border-gray-100">
              <span className="text-[#1A1A2E]">Net Change</span>
              <span
                className={
                  change! >= 0 ? 'text-green-600' : 'text-red-600'
                }
              >
                {change! >= 0 ? '+' : ''}${change!.toFixed(0)}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Section 5: Recommendations */}
      <div className="card-static p-6">
        <h3 className="text-lg font-bold text-[#1A1A2E] mb-4">
          💡 Invest Next
        </h3>
        <div className="space-y-3">
          {recommendations.map((rec, i) => (
            <div
              key={i}
              className="p-4 rounded-xl bg-[#FFF7ED] border border-[#FDBA74]/40"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-[#1A1A2E]">
                  {rec.category}
                </span>
                <span className="text-xs text-green-600 font-semibold">
                  +${rec.estimatedBoost} potential
                </span>
              </div>
              <p className="text-xs text-[#4A4A68]">{rec.action}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Section 6: Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={() => router.push('/evaluate')}
          className="btn-primary flex-1 px-6 py-3.5 text-center"
        >
          🔄 Re-Evaluate Now
        </button>
        <button
          onClick={handleShare}
          className="btn-secondary flex-1 px-6 py-3.5 text-center"
        >
          {copied ? '✅ Copied!' : '📤 Share Results'}
        </button>
      </div>
      <p className="text-center text-[#9CA3AF] text-sm">
        Next suggested eval:{' '}
        {nextEvalDate.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        })}
      </p>
    </div>
  );
}
