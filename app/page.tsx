import Link from 'next/link';
import Image from 'next/image';

const CATEGORIES = [
  { emoji: '🏗️', name: 'Decoration Power', tier: 'gold' },
  { emoji: '⚔️', name: 'Hero Power', tier: 'gold' },
  { emoji: '🏆', name: 'Server Rank', tier: 'gold' },
  { emoji: '🎖️', name: 'Main Squad', tier: 'blue' },
  { emoji: '🔫', name: 'Exclusive Weapons', tier: 'blue' },
  { emoji: '🤖', name: 'Drone Level', tier: 'blue' },
  { emoji: '🔧', name: 'Drone Components', tier: 'blue' },
  { emoji: '🎨', name: 'Skins Collection', tier: 'green' },
  { emoji: '👑', name: 'Overlord Level', tier: 'green' },
  { emoji: '🏠', name: 'HQ Level', tier: 'green' },
  { emoji: '🛢️', name: 'Oil Tech', tier: 'green' },
  { emoji: '⭐', name: 'VIP Level', tier: 'green' },
  { emoji: '💎', name: 'Resources', tier: 'green' },
];

const TESTIMONIALS = [
  {
    quote: 'Finally a tool that actually understands server age matters.',
    player: 'Player',
    server: 'Server 847',
  },
  {
    quote: 'Used this to price my account before selling. Got $200 more than I expected.',
    player: 'Player',
    server: 'Server 312',
  },
  {
    quote: 'The breakdown by category helped me figure out where to invest next.',
    player: 'Player',
    server: 'Server 1205',
  },
];

const EVAL_CHECKS = [
  'Decoration Power',
  'Hero Power & Rank',
  'Squad Composition',
  'Exclusive Weapons',
  'Drone Level & Components',
  'Skins & Overlord',
  'HQ, Oil Tech, VIP',
  'And more...',
];

export default function Home() {
  return (
    <div>
      {/* ── Hero Section — Game Screenshot Background ── */}
      <section className="hero-section">
        {/* Layer 1: Game screenshot */}
        <Image
          src="/hero-bg.jpg"
          alt="Last War base"
          fill
          priority
          className="hero-bg-image"
          sizes="100vw"
        />
        {/* Layer 2: Dark overlay */}
        <div className="hero-dark-overlay" />
        {/* Layer 3: Smoke particles */}
        <video
          autoPlay
          loop
          muted
          playsInline
          poster="/hero-poster.jpg"
          className="hero-smoke-layer"
        >
          <source src="/hero-video.mp4" type="video/mp4" />
        </video>

        {/* Layer 4: Content */}
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto pt-16">
          {/* Last War Logo */}
          <div className="mb-4">
            <Image
              src="/lastwar-logo.png"
              alt="Last War"
              width={200}
              height={100}
              className="mx-auto drop-shadow-[0_4px_24px_rgba(255,215,0,0.2)]"
              priority
            />
            <p className="text-xs text-white/40 mt-2 tracking-widest uppercase">
              Unofficial Fan Tool
            </p>
          </div>

          {/* Trust badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[rgba(255,215,0,0.3)] bg-[rgba(255,215,0,0.06)] mb-6">
            <span className="text-xs font-semibold tracking-wide uppercase text-[#FFD700]">
              Trusted by 2,212+ Servers
            </span>
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold mb-6 tracking-tight text-white leading-tight">
            What&apos;s Your Base{' '}
            <span
              className="text-[#FFD700]"
              style={{ textShadow: '0 0 24px rgba(255, 215, 0, 0.3)' }}
            >
              Worth?
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-white/70 mb-10 max-w-2xl mx-auto leading-relaxed">
            Get a data-driven dollar estimate of your Last War account in 60
            seconds.
          </p>
          <Link
            href="/evaluate"
            className="btn-primary btn-pulse inline-flex items-center gap-2 px-10 py-4 text-lg"
          >
            Value My Account →
          </Link>
          <div className="flex items-center justify-center gap-5 sm:gap-8 mt-8">
            <span className="trust-badge">✅ Free to use</span>
            <span className="trust-badge hidden sm:inline-flex">|</span>
            <span className="trust-badge">🔒 No login</span>
            <span className="trust-badge hidden sm:inline-flex">|</span>
            <span className="trust-badge">⚡ 60 seconds</span>
          </div>

          {/* Game UI badges */}
          <div className="flex items-center justify-center gap-2 sm:gap-3 mt-8 flex-wrap">
            <div className="game-ui-badge">
              <span className="badge-icon bg-[#FFD700]/20 text-[#FFD700]">🪙</span>
              Resources
            </div>
            <div className="game-ui-badge">
              <span className="badge-icon bg-[#3B82F6]/20 text-[#60A5FA]">🛡️</span>
              Heroes
            </div>
            <div className="game-ui-badge">
              <span className="badge-icon bg-[#EF4444]/20 text-[#F87171]">⚔️</span>
              Combat
            </div>
            <div className="game-ui-badge">
              <span className="badge-icon bg-[#22C55E]/20 text-[#4ADE80]">🔧</span>
              Base
            </div>
          </div>
        </div>
      </section>

      {/* ── How It Works — Hex pattern ── */}
      <section className="py-20 px-4 hex-pattern">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-white mb-3">
            How It Works
          </h2>
          <p className="text-center text-white/60 mb-14 max-w-xl mx-auto">
            Three steps to find out what your account is really worth
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              {
                icon: '📋',
                title: 'Enter Your Stats',
                desc: 'Quick 5-step wizard covering heroes, weapons, drones & more',
              },
              {
                icon: '💰',
                title: 'Get Your Dollar Value',
                desc: 'Our algorithm scores 13 categories against server-age baselines',
              },
              {
                icon: '📈',
                title: 'Track Your Growth',
                desc: 'Re-evaluate over time and watch your account value climb',
              },
            ].map((step, i) => (
              <div
                key={i}
                className="card p-7 text-center fade-in-up"
                style={{ animationDelay: `${(i + 1) * 0.1}s`, opacity: 0 }}
              >
                <div className="step-number mx-auto mb-3">{i + 1}</div>
                <div className="text-2xl mb-2">{step.icon}</div>
                <h3 className="text-lg font-bold text-white mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-white/60 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* ── What We Evaluate ── */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-3">
            <span className="text-white">We Check </span>
            <span className="value-gradient">Everything</span>
          </h2>
          <p className="text-center text-white/60 mb-14 max-w-xl mx-auto">
            The same stats you obsess over in-game, quantified in dollars
          </p>

          <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16">
            {/* Phone mockup with game screenshot */}
            <div className="phone-frame mx-auto md:mx-0 shrink-0">
              <Image
                src="/game-stats.jpg"
                alt="Last War gameplay"
                width={256}
                height={440}
                className="rounded-2xl"
              />
            </div>

            {/* Checklist */}
            <div className="flex-1 space-y-4">
              <h3 className="text-xl font-bold text-white mb-4">
                13 categories, one dollar value
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {EVAL_CHECKS.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-3 rounded-lg bg-white/[0.03] border border-white/[0.06]"
                  >
                    <span className="text-[#22C55E] text-sm">✓</span>
                    <span className="text-sm text-white/80">{item}</span>
                  </div>
                ))}
              </div>
              <Link
                href="/evaluate"
                className="btn-primary inline-flex items-center gap-2 px-8 py-3 mt-4"
              >
                Try It Now →
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* ── 13 Categories — Upgrade card style ── */}
      <section className="py-20 px-4 grid-pattern">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-3">
            <span className="text-white">We Analyze </span>
            <span className="value-gradient">Everything</span>
          </h2>
          <p className="text-center text-white/60 mb-12 max-w-xl mx-auto">
            Every corner of your account contributes to the final number
          </p>
          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-3">
            {CATEGORIES.map((cat, i) => (
              <div
                key={cat.name}
                className={`upgrade-card tier-${cat.tier}`}
              >
                <span className="tier-badge">
                  {cat.tier === 'gold' ? 'S' : cat.tier === 'blue' ? 'A' : 'B'}
                </span>
                <span className="text-2xl">{cat.emoji}</span>
                <span className="text-xs font-medium text-white/80 text-center leading-tight">
                  {cat.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* ── Stats — Resource counter style ── */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="stat-counter">
              <div className="text-lg mb-1">🌐</div>
              <p className="stat-number">2,212+</p>
              <p className="text-sm text-white/60 mt-1">Servers Covered</p>
            </div>
            <div className="stat-counter">
              <div className="text-lg mb-1">📊</div>
              <p className="stat-number">13</p>
              <p className="text-sm text-white/60 mt-1">Value Categories</p>
            </div>
            <div className="stat-counter">
              <div className="text-lg mb-1">📅</div>
              <p className="stat-number">Daily</p>
              <p className="text-sm text-white/60 mt-1">Server Data Updates</p>
            </div>
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* ── Testimonials ── */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-white mb-3">
            What Players Are Saying
          </h2>
          <p className="text-center text-white/60 mb-12 max-w-xl mx-auto">
            Commanders across hundreds of servers trust Last War Value
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="testimonial-card">
                <p className="text-sm text-white/80 leading-relaxed mb-4 pt-6">
                  {t.quote}
                </p>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#F59E0B] to-[#FFD700] flex items-center justify-center text-xs font-bold text-[#0B1426]">
                    {t.player[0]}
                  </div>
                  <div>
                    <p className="text-xs font-medium text-white/70">
                      {t.player}
                    </p>
                    <p className="text-xs text-white/40">{t.server}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* ── Bottom CTA ── */}
      <section className="py-20 px-4">
        <div className="max-w-xl mx-auto">
          <div className="gold-glow-card p-10 text-center relative overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="radar-ring" />
              <div className="radar-ring" />
              <div className="radar-ring" />
            </div>

            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Ready to Find Out?
              </h2>
              <p className="text-white/60 mb-8 text-lg">
                It takes less than 60 seconds and costs nothing.
              </p>
              <Link
                href="/evaluate"
                className="btn-primary btn-pulse inline-flex items-center gap-2 px-10 py-4 text-lg"
              >
                Start My Valuation →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
