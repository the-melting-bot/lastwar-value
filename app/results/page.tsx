'use client';

import Link from 'next/link';
import ResultsDashboard from '@/components/ResultsDashboard';

export default function ResultsPage() {
  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-3xl mx-auto mb-8">
        <Link
          href="/"
          className="text-gray-400 hover:text-white text-sm transition-colors"
        >
          ← Back to Home
        </Link>
        <h1 className="text-3xl font-bold text-white mt-4 mb-2">
          Your Results
        </h1>
      </div>
      <ResultsDashboard />
    </div>
  );
}
