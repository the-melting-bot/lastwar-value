import Link from 'next/link';

const CATEGORIES = [
  { emoji: '🏗️', name: 'Decoration Power' },
  { emoji: '⚔️', name: 'Hero Power' },
  { emoji: '🏆', name: 'Server Rank' },
  { emoji: '🎖️', name: 'Main Squad' },
  { emoji: '🔫', name: 'Exclusive Weapons' },
  { emoji: '🤖', name: 'Drone Level' },
  { emoji: '🔧', name: 'Drone Components' },
  { emoji: '🎨', name: 'Skins Collection' },
  { emoji: '👑', name: 'Overlord Level' },
  { emoji: '🏠', name: 'HQ Level' },
  { emoji: '🛢️', name: 'Oil Tech' },
  { emoji: '⭐', name: 'VIP Level' },
  { emoji: '💎', name: 'Resources' },
];

export default function Home() {
  return (
    <div>
      {/* ── Hero Section ── */}
      <section className="hero-gradient relative min-h-[92vh] flex items-center justify-center">
        <div className="hero-pattern" />
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <p className="text-sm font-semibold tracking-[0.2em] uppercase mb-5 text-white/90">
            THE #1 LAST WAR ACCOUNT TOOL
          </p>
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold mb-6 tracking-tight text-white leading-tight">
            What&apos;s Your Base{' '}
            <span className="text-[#FFD700] drop-shadow-[0_2px_12px_rgba(255,215,0,0.4)]">
              Worth?
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-white/80 mb-10 max-w-2xl mx-auto leading-relaxed">
            Get a data-driven dollar estimate of your Last War account in 60
            seconds. Track your growth over time. Know before you trade.
          </p>
          <Link
            href="/evaluate"
            className="btn-primary btn-pulse inline-flex items-center gap-2 px-10 py-4 text-lg"
          >
            Value My Account →
          </Link>
          <div className="flex items-center justify-center gap-6 mt-8">
            <span className="trust-badge">✅ Free to use</span>
            <span className="trust-badge">🔒 No login required</span>
            <span className="trust-badge">⚡ 60-second valuation</span>
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-[#1A1A2E] mb-4">
            How It Works
          </h2>
          <p className="text-center text-[#4A4A68] mb-14 max-w-xl mx-auto">
            Three steps to find out what your account is really worth
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="card p-7 text-center fade-in-up fade-in-up-delay-1">
              <div className="step-number mx-auto mb-4">1</div>
              <h3 className="text-lg font-bold text-[#1A1A2E] mb-2">
                Enter Your Stats
              </h3>
              <p className="text-sm text-[#4A4A68] leading-relaxed">
                Quick 5-step wizard covering heroes, weapons, drones, and
                resources
              </p>
            </div>
            <div className="card p-7 text-center fade-in-up fade-in-up-delay-2">
              <div className="step-number mx-auto mb-4">2</div>
              <h3 className="text-lg font-bold text-[#1A1A2E] mb-2">
                Get Your Dollar Value
              </h3>
              <p className="text-sm text-[#4A4A68] leading-relaxed">
                Algorithm scores 13 categories against server-age baselines
              </p>
            </div>
            <div className="card p-7 text-center fade-in-up fade-in-up-delay-3">
              <div className="step-number mx-auto mb-4">3</div>
              <h3 className="text-lg font-bold text-[#1A1A2E] mb-2">
                Track Your Growth
              </h3>
              <p className="text-sm text-[#4A4A68] leading-relaxed">
                Re-evaluate over time and watch your account value climb
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 13 Categories ── */}
      <section className="py-20 px-4 bg-warm">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-[#1A1A2E] mb-4">
            13 Value Categories
          </h2>
          <p className="text-center text-[#4A4A68] mb-12 max-w-xl mx-auto">
            Every corner of your account contributes to the final number
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {CATEGORIES.map((cat) => (
              <div key={cat.name} className="category-pill">
                <span className="text-lg">{cat.emoji}</span>
                <span>{cat.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
            <div>
              <p className="text-4xl font-extrabold value-gradient">2,212+</p>
              <p className="text-sm text-[#4A4A68] mt-2">Servers Covered</p>
            </div>
            <div>
              <p className="text-4xl font-extrabold value-gradient">13</p>
              <p className="text-sm text-[#4A4A68] mt-2">Value Categories</p>
            </div>
            <div>
              <p className="text-4xl font-extrabold value-gradient">Daily</p>
              <p className="text-sm text-[#4A4A68] mt-2">
                Server Data Updates
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Second CTA ── */}
      <section className="cta-gradient py-20 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to Find Out?
          </h2>
          <p className="text-white/80 mb-8 text-lg">
            It takes less than 60 seconds and costs nothing.
          </p>
          <Link
            href="/evaluate"
            className="inline-flex items-center gap-2 px-10 py-4 text-lg font-bold rounded-full bg-white text-[#FF6B00] shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
          >
            Start My Valuation →
          </Link>
        </div>
      </section>
    </div>
  );
}
