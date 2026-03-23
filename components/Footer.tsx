import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-gray-200 bg-white">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* Brand */}
          <div className="text-center sm:text-left">
            <Link
              href="/"
              className="text-lg font-bold text-[#1A1A2E] hover:text-[#FF6B00] transition-colors"
            >
              Last War Value
            </Link>
            <p className="text-xs text-[#9CA3AF] mt-1">
              Built by a Last War player, for Last War players
            </p>
          </div>

          {/* Links */}
          <div className="flex items-center gap-6 text-sm text-[#4A4A68]">
            <Link
              href="/"
              className="hover:text-[#FF6B00] transition-colors"
            >
              Home
            </Link>
            <Link
              href="/evaluate"
              className="hover:text-[#FF6B00] transition-colors"
            >
              Evaluate
            </Link>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-gray-100 text-center">
          <p className="text-xs text-[#9CA3AF] leading-relaxed max-w-2xl mx-auto">
            Last War Value is an independent fan-made tool and is not affiliated
            with, endorsed by, or associated with Last War: Survival, First Fun
            Inc., or any of their subsidiaries. Last War: Survival is a
            trademark of First Fun Inc. All game-related content and imagery
            belong to their respective owners.
          </p>
          <p className="text-xs text-[#9CA3AF] mt-3">
            &copy; 2026 Last War Value
          </p>
        </div>
      </div>
    </footer>
  );
}
