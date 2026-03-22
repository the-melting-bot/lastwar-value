'use client';

import Link from 'next/link';
import EvaluationWizard from '@/components/EvaluationWizard';

export default function EvaluatePage() {
  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-2xl mx-auto mb-8">
        <Link
          href="/"
          className="text-gray-400 hover:text-white text-sm transition-colors"
        >
          ← Back to Home
        </Link>
        <h1 className="text-3xl font-bold text-white mt-4 mb-2">
          Evaluate Your Account
        </h1>
        <p className="text-gray-400">
          Answer 5 quick steps to get your valuation.
        </p>
      </div>
      <EvaluationWizard />
    </div>
  );
}
