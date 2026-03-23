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
      {/* ── Hero Section — Video Background ── */}
      <section className="hero-video-section">
        <video
          autoPlay
          loop
          muted
          playsInline
          poster="/hero-poster.jpg"
          className="pointer-events-none"
        >
          <source src="/hero-video.mp4" type="video/mp4" />
        </video>
        <div className="hero-video-overlay" />

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
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
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="py-20 px-4">
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

      {/* ── 13 Categories ── */}
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
            {CATEGORIES.map((cat) => (
              <div key={cat.name} className="category-card">
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

      {/* ── Stats ── */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
            <div>
              <p className="text-4xl font-extrabold value-gradient">2,212+</p>
              <p className="text-sm text-white/70 mt-2">Servers Covered</p>
            </div>
            <div>
              <p className="text-4xl font-extrabold value-gradient">13</p>
              <p className="text-sm text-white/70 mt-2">Value Categories</p>
            </div>
            <div>
              <p className="text-4xl font-extrabold value-gradient">Daily</p>
              <p className="text-sm text-white/70 mt-2">Server Data Updates</p>
            </div>
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* ── Bottom CTA ── */}
      <section className="py-20 px-4">
        <div className="max-w-xl mx-auto">
          <div className="gold-glow-card p-10 text-center relative overflow-hidden">
            {/* Radar pulse rings */}
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
