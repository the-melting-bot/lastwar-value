'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ResultsDashboard from '@/components/ResultsDashboard';
import { clearAllData } from '@/lib/storage';

export default function ResultsPage() {
  const router = useRouter();

  function handleClear() {
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
      <div className="max-w-3xl mx-auto mb-8">
        <Link
          href="/"
          className="text-white/30 hover:text-[#FFD700] text-sm transition-colors"
        >
          ← Back to Home
        </Link>
        <h1 className="text-3xl font-bold text-white mt-4 mb-1">
          Your Results
        </h1>
      </div>
      <ResultsDashboard />
      <div className="max-w-3xl mx-auto mt-6 text-center">
        <button
          onClick={handleClear}
          className="text-xs text-red-400/50 hover:text-red-400 transition-colors"
        >
          Clear data &amp; start over
        </button>
      </div>
    </div>
  );
}
