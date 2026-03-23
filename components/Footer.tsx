import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="mt-auto bg-[#060D18] border-t border-white/5">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* Brand + logo */}
          <div className="flex items-center gap-3">
            <Image
              src="/lastwar-logo.png"
              alt="Last War"
              width={48}
              height={28}
              className="object-contain"
            />
            <div>
              <Link
                href="/"
                className="text-lg font-bold text-white hover:text-[#FFD700] transition-colors"
              >
                Last War Value
              </Link>
              <p className="text-xs text-white/35">
                Unofficial fan tool
              </p>
            </div>
          </div>

          {/* Links */}
          <div className="flex items-center gap-5 text-sm text-white/55">
            <Link href="/" className="hover:text-[#FFD700] transition-colors">
              Home
            </Link>
            <Link href="/evaluate" className="hover:text-[#FFD700] transition-colors">
              Evaluate
            </Link>
            <a
              href="https://discord.gg/lastwarsurvival"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#FFD700] transition-colors"
            >
              Discord
            </a>
            <a
              href="https://www.reddit.com/r/LastWarMobileGame/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#FFD700] transition-colors"
            >
              Reddit
            </a>
          </div>
        </div>

        {/* Download links */}
        <div className="mt-6 pt-4 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/30">Download Last War: Survival</p>
          <div className="flex items-center gap-4 text-xs text-white/40">
            <a
              href="https://apps.apple.com/sg/app/last-war-survival/id6448786147"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#FFD700] transition-colors"
            >
              App Store
            </a>
            <a
              href="https://play.google.com/store/apps/details?id=com.fun.lastwar.gp"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#FFD700] transition-colors"
            >
              Google Play
            </a>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-4 pt-4 border-t border-white/5 text-center">
          <p className="text-xs text-white/30 leading-relaxed max-w-2xl mx-auto">
            Last War Value is an independent fan-made tool and is not affiliated
            with, endorsed by, or associated with Last War: Survival, First Fun
            Inc., or any of their subsidiaries. Last War: Survival is a
            trademark of First Fun Inc. All game-related content and imagery
            belong to their respective owners. Not affiliated with First Fun Inc.
          </p>
          <p className="text-xs text-white/25 mt-3">
            &copy; 2026 Last War Value
          </p>
        </div>
      </div>
    </footer>
  );
}
