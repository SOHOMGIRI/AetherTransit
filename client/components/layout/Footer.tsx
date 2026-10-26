import Link from "next/link"

export default function Footer() {
  return (
    <footer className="bg-espresso text-stone-subtle mt-auto pt-16 pb-8">
      <div className="max-w-[1400px] mx-auto px-6 sm:px-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-16">
          <div className="lg:col-span-2">
            <Link className="flex items-center gap-3 mb-4" href="/">
              <div className="relative w-8 h-8">
                <img
                  src="/assets/logo.png"
                  alt="ÆtherTransit Logo"
                  className="w-8 h-8 object-contain"
                />
              </div>
              <span className="font-serif italic text-3xl font-semibold tracking-tight text-parchment">ÆtherTransit</span>
            </Link>
            <p className="text-sm text-stone-text max-w-sm leading-relaxed mb-6">
              Autonomous real-time fleet telemetry, predictive ML delay forecasts, and dynamic corridor intelligence for STCET campus transit.
            </p>
            <div className="flex items-center gap-2 text-xs font-semibold text-parchment bg-stone-dark/30 w-max px-3 py-1.5 rounded-full border border-stone-dark">
              <span className="w-2 h-2 rounded-full bg-sage shadow-[0_0_8px_rgba(21,128,61,0.5)]"></span>
              <span>Cloud Telemetry Engine Online</span>
            </div>
          </div>

          <div>
            <h4 className="text-parchment font-semibold mb-4 text-sm tracking-wide">Product &amp; Routes</h4>
            <div className="flex flex-col space-y-3 text-sm text-stone-text">
              <Link className="hover:text-terracotta transition-colors" href="/dashboard">Live Map</Link>
              <Link className="hover:text-terracotta transition-colors" href="/routes">Routes &amp; Stops</Link>
              <Link className="hover:text-terracotta transition-colors" href="/analytics">ML Analytics</Link>
              <Link className="hover:text-terracotta transition-colors" href="/#how-it-works">How It Works</Link>
              <Link className="hover:text-terracotta transition-colors" href="/login">Student Pass</Link>
            </div>
          </div>

          <div>
            <h4 className="text-parchment font-semibold mb-4 text-sm tracking-wide">Support</h4>
            <div className="flex flex-col space-y-3 text-sm text-stone-text">
              <Link className="hover:text-terracotta transition-colors" href="/about">About ÆtherTransit</Link>
              <a className="hover:text-terracotta transition-colors" href="mailto:transport@stcet.ac.in">Contact Dispatch</a>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-stone-dark flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-stone-text">
          <p>&copy; {new Date().getFullYear()} STCET Office of Transportation · Engineered by Sohom Giri.</p>
          <div className="flex items-center gap-4">
            <span>Powered by ÆtherTransit Real-Time Telemetry Core</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
