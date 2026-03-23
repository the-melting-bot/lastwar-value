'use client';

import Link from 'next/link';
import EvaluationWizard from '@/components/EvaluationWizard';

export default function EvaluatePage() {
  return (
    <div className="min-h-screen py-8 px-4 bg-[#F8F9FA]">
      <div className="max-w-2xl mx-auto mb-8">
        <Link
          href="/"
          className="text-[#9CA3AF] hover:text-[#FF6B00] text-sm transition-colors"
        >
          ← Back to Home
        </Link>
        <h1 className="text-3xl font-bold text-[#1A1A2E] mt-4 mb-1">
          Evaluate Your Account
        </h1>
        <p className="text-[#4A4A68] text-sm">
          Answer 5 quick steps to get your valuation.
        </p>
      </div>
      <EvaluationWizard />
    </div>
  );
}
