import Link from 'next/link';

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden min-h-[80vh] flex items-center justify-center">
        <div className="animated-grid absolute inset-0" />
        <div className="relative radar-sweep" />
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 tracking-tight">
            What&apos;s Your Account{' '}
            <span className="text-orange-500">Worth?</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            Find out in 60 seconds. Track your value. Invest smarter.
          </p>
          <Link
            href="/evaluate"
            className="inline-flex items-center gap-2 px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white text-lg font-bold rounded-lg transition-all shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 hover:scale-105"
          >
            Value My Account →
          </Link>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-12">
            How It Works
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-gray-800/30 border border-gray-700/50 rounded-xl backdrop-blur">
              <div className="text-4xl mb-4">📋</div>
              <h3 className="text-lg font-bold text-white mb-2">
                Enter Your Details
              </h3>
              <p className="text-gray-400 text-sm">
                Quick 5-step wizard covering your heroes, weapons, drones, and
                resources
              </p>
            </div>
            <div className="text-center p-6 bg-gray-800/30 border border-gray-700/50 rounded-xl backdrop-blur">
              <div className="text-4xl mb-4">💰</div>
              <h3 className="text-lg font-bold text-white mb-2">
                Get Your Valuation
              </h3>
              <p className="text-gray-400 text-sm">
                Our algorithm scores 13 categories against server-age baselines
              </p>
            </div>
            <div className="text-center p-6 bg-gray-800/30 border border-gray-700/50 rounded-xl backdrop-blur">
              <div className="text-4xl mb-4">📈</div>
              <h3 className="text-lg font-bold text-white mb-2">
                Track Your Growth
              </h3>
              <p className="text-gray-400 text-sm">
                Re-evaluate over time and see your account value trend upward
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-8 border-y border-gray-800">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            <div>
              <p className="text-2xl font-bold text-orange-500">2,212+</p>
              <p className="text-sm text-gray-400">Servers Covered</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-orange-500">13</p>
              <p className="text-sm text-gray-400">Value Categories</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-orange-500">Updated</p>
              <p className="text-sm text-gray-400">Daily</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
