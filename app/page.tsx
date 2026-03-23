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
      {/* Hero Section */}
      <section className="relative overflow-hidden min-h-[90vh] flex items-center justify-center">
        <div className="animated-grid absolute inset-0" />
        <div className="glow-orb-orange" style={{ top: '10%', left: '15%' }} />
        <div className="glow-orb-blue" style={{ bottom: '10%', right: '10%' }} />

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <p className="text-sm font-semibold tracking-widest uppercase mb-4" style={{ color: '#FF8A33' }}>
            Last War: Survival Account Tool
          </p>
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold mb-6 tracking-tight text-white leading-tight">
            What&apos;s Your Base{' '}
            <span className="value-gradient">Worth?</span>
          </h1>
          <p className="text-lg sm:text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            Get a data-driven dollar estimate of your Last War account in 60 seconds.
            Track your growth over time. Know before you trade.
          </p>
          <Link
            href="/evaluate"
            className="btn-primary inline-flex items-center gap-2 px-10 py-4 text-lg"
          >
            Value My Account →
          </Link>
          <p className="text-xs text-slate-500 mt-4">
            Free to use — no login required
          </p>
        </div>
      </section>

      {/* Divider */}
      <div className="section-divider" />

      {/* How It Works */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-white mb-4">
            How It Works
          </h2>
          <p className="text-center text-slate-400 mb-14 max-w-xl mx-auto">
            Three steps to find out what your account is really worth
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="card p-7 text-center fade-in-up fade-in-up-delay-1">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4" style={{ background: 'linear-gradient(135deg, rgba(255, 107, 0, 0.15), rgba(255, 107, 0, 0.05))' }}>
                📋
              </div>
              <h3 className="text-lg font-bold text-white mb-2">
                Enter Your Stats
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Quick 5-step wizard covering heroes, weapons, drones, and resources
              </p>
            </div>
            <div className="card p-7 text-center fade-in-up fade-in-up-delay-2">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4" style={{ background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.15), rgba(255, 215, 0, 0.05))' }}>
                💰
              </div>
              <h3 className="text-lg font-bold text-white mb-2">
                Get Your Dollar Value
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Algorithm scores 13 categories against server-age baselines
              </p>
            </div>
            <div className="card p-7 text-center fade-in-up fade-in-up-delay-3">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4" style={{ background: 'linear-gradient(135deg, rgba(0, 163, 255, 0.15), rgba(0, 163, 255, 0.05))' }}>
                📈
              </div>
              <h3 className="text-lg font-bold text-white mb-2">
                Track Your Growth
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Re-evaluate over time and watch your account value climb
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* 13 Categories Grid */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-white mb-4">
            13 Value Categories
          </h2>
          <p className="text-center text-slate-400 mb-12 max-w-xl mx-auto">
            Every corner of your account contributes to the final number
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {CATEGORIES.map((cat) => (
              <div key={cat.name} className="category-item">
                <span className="text-lg mr-2">{cat.emoji}</span>
                <span className="text-sm font-medium text-slate-300">{cat.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* Social Proof Stats */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
            <div>
              <p className="text-3xl font-bold shimmer-text">2,212+</p>
              <p className="text-sm text-slate-400 mt-1">Servers Covered</p>
            </div>
            <div>
              <p className="text-3xl font-bold shimmer-text">13</p>
              <p className="text-sm text-slate-400 mt-1">Value Categories</p>
            </div>
            <div>
              <p className="text-3xl font-bold shimmer-text">Daily</p>
              <p className="text-sm text-slate-400 mt-1">Server Data Updates</p>
            </div>
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* Second CTA */}
      <section className="py-20 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to Find Out?
          </h2>
          <p className="text-slate-400 mb-8 text-lg">
            It takes less than 60 seconds and costs nothing.
          </p>
          <Link
            href="/evaluate"
            className="btn-primary inline-flex items-center gap-2 px-10 py-4 text-lg"
          >
            Start My Valuation →
          </Link>
        </div>
      </section>
    </div>
  );
}
