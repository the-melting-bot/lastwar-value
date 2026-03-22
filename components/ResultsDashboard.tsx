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
        <h2 className="text-2xl font-bold text-white mb-4">
          No evaluations yet
        </h2>
        <p className="text-gray-400 mb-6">
          Complete an evaluation to see your results.
        </p>
        <button
          onClick={() => router.push('/evaluate')}
          className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium"
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
      <div className="text-center p-8 bg-gray-800/50 border border-gray-700 rounded-xl backdrop-blur">
        <p className="text-gray-400 text-sm mb-2">Your Base Value</p>
        <p className="text-5xl font-bold text-orange-500 mb-2">
          ${result.totalValue}
        </p>
        <p className="text-gray-400 mb-3">
          ${result.lowRange} — ${result.highRange}
        </p>
        {change !== null && (
          <p
            className={`text-lg font-medium ${
              change >= 0 ? 'text-green-400' : 'text-red-400'
            }`}
          >
            {change >= 0 ? '+' : ''}${change.toFixed(0)} ({changePct}%){' '}
            {change >= 0 ? '↑' : '↓'}
          </p>
        )}
        <p className="text-gray-500 text-sm mt-2">
          Server #{serverInfo.id} — Day {serverInfo.day} — Season{' '}
          {serverInfo.season}
        </p>
      </div>

      {/* Section 2: Value Chart */}
      <ValueChart evaluations={allEvals} />

      {/* Section 3: Value Breakdown */}
      <ValueBreakdown categories={result.categories} />

      {/* Section 4: What Changed */}
      {changedCategories.length > 0 && (
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
          <h3 className="text-lg font-bold text-white mb-4">What Changed</h3>
          <div className="space-y-2">
            {changedCategories.map((c, i) => (
              <div key={i} className="flex items-center justify-between text-sm">
                <span className="text-gray-300">
                  {c.emoji} {c.name}
                </span>
                <span
                  className={
                    c.diff > 0 ? 'text-green-400' : 'text-red-400'
                  }
                >
                  {c.diff > 0 ? '✅ +' : '🔻 '}${Math.abs(c.diff).toFixed(0)}
                </span>
              </div>
            ))}
            <div className="border-t border-gray-700 pt-2 mt-2 flex justify-between font-bold text-sm">
              <span className="text-white">Net Change</span>
              <span
                className={
                  change! >= 0 ? 'text-green-400' : 'text-red-400'
                }
              >
                {change! >= 0 ? '+' : ''}${change!.toFixed(0)}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Section 5: Recommendations */}
      <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
        <h3 className="text-lg font-bold text-white mb-4">
          💡 Invest Next
        </h3>
        <div className="space-y-3">
          {recommendations.map((rec, i) => (
            <div
              key={i}
              className="p-3 bg-gray-900/50 rounded-lg border border-gray-700/50"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-white">
                  {rec.category}
                </span>
                <span className="text-xs text-green-400 font-medium">
                  +${rec.estimatedBoost} potential
                </span>
              </div>
              <p className="text-xs text-gray-400">{rec.action}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Section 6: Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={() => router.push('/evaluate')}
          className="flex-1 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors text-center"
        >
          🔄 Re-Evaluate Now
        </button>
        <button
          onClick={handleShare}
          className="flex-1 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors text-center"
        >
          {copied ? '✅ Copied!' : '📤 Share Results'}
        </button>
      </div>
      <p className="text-center text-gray-500 text-sm">
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
