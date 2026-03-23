'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 40);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between">
        {/* Left: Logo + brand */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <Image
            src="/lastwar-logo.png"
            alt="Last War"
            width={40}
            height={24}
            className="object-contain"
          />
          <span className="text-sm font-bold text-white/90 group-hover:text-[#FFD700] transition-colors hidden sm:inline">
            Last War Value
          </span>
        </Link>

        {/* Right: links */}
        <div className="flex items-center gap-5 text-sm">
          <Link
            href="/evaluate"
            className="text-white/70 hover:text-[#FFD700] transition-colors font-medium"
          >
            Evaluate
          </Link>
          <a
            href="https://discord.gg/lastwarsurvival"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/70 hover:text-[#FFD700] transition-colors hidden sm:inline"
          >
            Discord
          </a>
          <a
            href="https://www.reddit.com/r/LastWarMobileGame/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/70 hover:text-[#FFD700] transition-colors hidden sm:inline"
          >
            Reddit
          </a>
        </div>
      </div>
    </nav>
  );
}
