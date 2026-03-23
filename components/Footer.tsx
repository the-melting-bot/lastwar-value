import Link from "next/link";
import Image from "next/image";
import MeltingBotBadge from "@/components/MeltingBotBadge";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-white/5 bg-[#060D18]">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
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
                className="text-lg font-bold text-white transition-colors hover:text-[#FFD700]"
              >
                Last War Value
              </Link>
              <p className="text-xs text-white/35">Unofficial fan tool</p>
            </div>
          </div>

          {/* Links */}
          <div className="flex items-center gap-5 text-sm text-white/55">
            <Link href="/" className="transition-colors hover:text-[#FFD700]">
              Home
            </Link>
            <Link href="/evaluate" className="transition-colors hover:text-[#FFD700]">
              Evaluate
            </Link>
            <a
              href="https://discord.gg/lastwarsurvival"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-[#FFD700]"
            >
              Discord
            </a>
            <a
              href="https://www.reddit.com/r/LastWarMobileGame/"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-[#FFD700]"
            >
              Reddit
            </a>
          </div>
        </div>

        {/* Download links */}
        <div className="mt-6 flex flex-col items-center justify-between gap-4 border-t border-white/5 pt-4 sm:flex-row">
          <p className="text-xs text-white/30">Download Last War: Survival</p>
          <div className="flex items-center gap-4 text-xs text-white/40">
            <a
              href="https://apps.apple.com/sg/app/last-war-survival/id6448786147"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-[#FFD700]"
            >
              App Store
            </a>
            <a
              href="https://play.google.com/store/apps/details?id=com.fun.lastwar.gp"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-[#FFD700]"
            >
              Google Play
            </a>
          </div>
        </div>

        {/* Disclaimer + centered badge + copyright */}
        <div className="mt-4 border-t border-white/5 pt-4 text-center">
          <p className="mx-auto max-w-2xl text-xs leading-relaxed text-white/30">
            Last War Value is an independent fan-made tool and is not affiliated
            with, endorsed by, or associated with Last War: Survival, First Fun
            Inc., or any of their subsidiaries. Last War: Survival is a
            trademark of First Fun Inc. All game-related content and imagery
            belong to their respective owners. Not affiliated with First Fun
            Inc.
          </p>

          <div className="my-8 flex justify-center">
            <MeltingBotBadge />
          </div>

          <p className="text-xs text-white/25">&copy; 2026 Last War Value</p>
        </div>
      </div>
    </footer>
  );
}
