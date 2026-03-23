'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import EvaluationWizard from '@/components/EvaluationWizard';
import { clearAllData } from '@/lib/storage';

export default function EvaluatePage() {
  const router = useRouter();

  function handleReset() {
    if (
      window.confirm(
        'Are you sure? This will delete all saved evaluations and form data.'
      )
    ) {
      clearAllData();
      router.push('/');
    }
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-2xl mx-auto mb-8">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="text-white/30 hover:text-[#FFD700] text-sm transition-colors"
          >
            ← Back to Home
          </Link>
          <button
            onClick={handleReset}
            className="text-xs text-red-400/60 hover:text-red-400 transition-colors"
          >
            Reset All Data
          </button>
        </div>
        <h1 className="text-3xl font-bold text-white mt-4 mb-1">
          Evaluate Your Account
        </h1>
        <p className="text-white/50 text-sm">
          Answer 5 quick steps to get your valuation.
        </p>
      </div>
      <EvaluationWizard />
    </div>
  );
}
