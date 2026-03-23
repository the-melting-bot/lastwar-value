import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="mt-auto" style={{ borderTop: '1px solid rgba(255, 107, 0, 0.08)' }}>
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* Brand */}
          <div className="text-center sm:text-left">
            <Link href="/" className="text-lg font-bold text-white hover:text-orange-400 transition-colors">
              Last War Value
            </Link>
            <p className="text-xs text-slate-500 mt-1">
              Built by a Last War player, for Last War players
            </p>
          </div>

          {/* Links */}
          <div className="flex items-center gap-6 text-xs text-slate-500">
            <Link href="/evaluate" className="hover:text-slate-300 transition-colors">
              Evaluate
            </Link>
            <Link href="/results" className="hover:text-slate-300 transition-colors">
              Results
            </Link>
            <a
              href="https://www.perplexity.ai/computer"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-slate-300 transition-colors"
            >
              Created with Perplexity Computer
            </a>
          </div>
        </div>

        <div className="mt-6 pt-4 text-center" style={{ borderTop: '1px solid rgba(255, 107, 0, 0.05)' }}>
          <p className="text-xs text-slate-600">
            Not affiliated with Last War: Survival or FunFly Inc.
          </p>
        </div>
      </div>
    </footer>
  );
}
