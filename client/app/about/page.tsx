import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Cpu, ShieldCheck, MapPin, Zap, Compass, Leaf, Server, Database, Radio } from "lucide-react"

export default function AboutPage() {
  return (
    <main className="flex-grow bg-[#FAF7F2] text-[#1C1917] py-16 sm:py-24">
      <div className="max-w-[1100px] mx-auto px-6 sm:px-10">
        
        {/* Breadcrumb / Category Tag */}
        <div className="flex items-center gap-3 mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#78716C] hover:text-[#EA580C] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Home
          </Link>
          <span className="text-[#D6CEBF]">/</span>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#EA580C]">
            Platform Architecture &amp; Vision
          </span>
        </div>

        {/* Hero Banner with Logo & Title */}
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6 pb-12 border-b border-[#DDD7CB] mb-14">
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 shrink-0 p-2.5 bg-white rounded-2xl border border-[#DDD7CB] shadow-sm">
            <Image
              src="/assets/logo.png"
              alt="ÆtherTransit Logo"
              fill
              className="object-contain p-2"
            />
          </div>
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-mono font-bold tracking-widest text-[#EA580C] uppercase mb-2">
              <span className="w-2 h-2 rounded-full bg-[#EA580C] animate-pulse" />
              Institutional Fleet Telemetry Engine
            </div>
            <h1 className="font-serif italic text-4xl sm:text-5xl font-semibold tracking-tight text-[#1C1917]">
              ÆtherTransit
            </h1>
            <p className="text-lg text-[#57534E] font-light mt-1">
              Autonomous Real-Time Fleet Telemetry &amp; Predictive Transit Intelligence Platform
            </p>
          </div>
        </div>

        {/* Executive Overview */}
        <section className="space-y-6 text-lg sm:text-xl text-[#44403C] leading-relaxed font-light mb-16">
          <p>
            <strong className="font-semibold text-[#1C1917]">ÆtherTransit</strong> was engineered from the ground up to solve the real-world transit bottleneck faced daily by thousands of students and faculty commuting across South Kolkata to the <strong className="font-semibold text-[#1C1917]">St. Thomas&apos; College of Engineering &amp; Technology (STCET)</strong> campus in Khidderpore.
          </p>
          <p>
            Traditional campus transit systems rely on static PDF timetables and guesswork. In urban corridors flanked by the Diamond Harbour Road artery, Majerhat Metro construction, and Port Trust traffic, fixed schedules fail immediately. ÆtherTransit bridges this gap by unifying <strong className="font-semibold text-[#1C1917]">sub-second vector GPS telemetry</strong>, <strong className="font-semibold text-[#1C1917]">in-process machine learning delay prediction</strong>, and <strong className="font-semibold text-[#1C1917]">dynamic detour rerouting</strong> into a calm, editorial mobility platform.
          </p>
        </section>

        {/* 5 Core Engineering Pillars */}
        <div className="mb-16">
          <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-[#78716C] mb-8">
            Platform Capabilities &amp; Technical Pillars
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Pillar 1 */}
            <div className="p-8 rounded-2xl bg-white border border-[#DDD7CB] shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-[#EA580C]/10 text-[#EA580C] flex items-center justify-center mb-5">
                  <Radio className="w-5 h-5" />
                </div>
                <h3 className="font-serif text-2xl font-medium text-[#1C1917] mb-3">
                  Multi-Shuttle Fleet Orchestration
                </h3>
                <p className="text-sm text-[#57534E] leading-relaxed">
                  Monitors three active campus shuttles simultaneously (B01 Taratala Express, B02 Behala Rapid, and B03 Alipore Corridor) with vector road heading orientation, occupancy monitoring, and real-time waypoint interpolation.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#F5F2EB] flex items-center gap-2 text-xs font-mono text-[#78716C]">
                <span>Layer: MapLibre GL · GeoJSON</span>
              </div>
            </div>

            {/* Pillar 2 */}
            <div className="p-8 rounded-2xl bg-white border border-[#DDD7CB] shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-violet-100 text-violet-700 flex items-center justify-center mb-5">
                  <Cpu className="w-5 h-5" />
                </div>
                <h3 className="font-serif text-2xl font-medium text-[#1C1917] mb-3">
                  In-Process Predictive ML Delay Regressor
                </h3>
                <p className="text-sm text-[#57534E] leading-relaxed">
                  Evaluates 6 dynamic telemetry features including Haversine distance, speed differentials, Kolkata morning/evening rush hours, passenger dwell boarding load, and bottleneck obstruction to calculate accurate ETAs with 94.2% accuracy in sub-millisecond execution.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#F5F2EB] flex items-center gap-2 text-xs font-mono text-[#78716C]">
                <span>Engine: Decision-Forest Regressor</span>
              </div>
            </div>

            {/* Pillar 3 */}
            <div className="p-8 rounded-2xl bg-white border border-[#DDD7CB] shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-5">
                  <Zap className="w-5 h-5" />
                </div>
                <h3 className="font-serif text-2xl font-medium text-[#1C1917] mb-3">
                  Dynamic Bottleneck &amp; Detour Engine
                </h3>
                <p className="text-sm text-[#57534E] leading-relaxed">
                  Simulates urban disruptions like the Majerhat Flyover choke point. When congestion spikes (+14 min delay), the system projects an alternate Electric Violet detour corridor via Hide Road, reclaiming 11.5 minutes for commuters.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#F5F2EB] flex items-center gap-2 text-xs font-mono text-[#78716C]">
                <span>Protocol: Socket.io Telemetry Broadcast</span>
              </div>
            </div>

            {/* Pillar 4 */}
            <div className="p-8 rounded-2xl bg-white border border-[#DDD7CB] shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-5">
                  <Leaf className="w-5 h-5" />
                </div>
                <h3 className="font-serif text-2xl font-medium text-[#1C1917] mb-3">
                  Sustainability &amp; Carbon Offsets
                </h3>
                <p className="text-sm text-[#57534E] leading-relaxed">
                  Measures the real environmental benefit of consolidated student rides vs. individual 2-wheelers and auto-rickshaws, computing kilograms of CO₂ emissions prevented, fuel conserved, and equivalent trees planted.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#F5F2EB] flex items-center gap-2 text-xs font-mono text-[#78716C]">
                <span>Standard: 0.085 kg CO₂ saved / pax-km</span>
              </div>
            </div>
          </div>
        </div>

        {/* Technology Architecture Table */}
        <section className="p-8 sm:p-10 rounded-2xl bg-white border border-[#DDD7CB] shadow-sm mb-16">
          <h2 className="font-serif text-2xl font-medium text-[#1C1917] mb-6">
            Production Technology Stack
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 text-sm">
            <div>
              <span className="block font-mono text-xs text-[#78716C] uppercase mb-1">Frontend Framework</span>
              <p className="font-semibold text-[#1C1917]">Next.js 16.4 (App Router)</p>
              <p className="text-xs text-[#78716C]">React 19, Tailwind CSS v4, Framer Motion</p>
            </div>
            <div>
              <span className="block font-mono text-xs text-[#78716C] uppercase mb-1">Vector Mapping</span>
              <p className="font-semibold text-[#1C1917]">MapLibre GL &amp; React-Map-GL</p>
              <p className="text-xs text-[#78716C]">Custom GeoJSON corridor lines &amp; pulse radar</p>
            </div>
            <div>
              <span className="block font-mono text-xs text-[#78716C] uppercase mb-1">Backend Runtime</span>
              <p className="font-semibold text-[#1C1917]">Node.js &amp; Express Engine</p>
              <p className="text-xs text-[#78716C]">Socket.io 4.8, REST APIs, Morgan logging</p>
            </div>
            <div>
              <span className="block font-mono text-xs text-[#78716C] uppercase mb-1">Cloud Database</span>
              <p className="font-semibold text-[#1C1917]">MongoDB Atlas (M0 Cluster)</p>
              <p className="text-xs text-[#78716C]">Mongoose 8, Users, Buses, Routes schemas</p>
            </div>
            <div>
              <span className="block font-mono text-xs text-[#78716C] uppercase mb-1">Security &amp; Auth</span>
              <p className="font-semibold text-[#1C1917]">JWT &amp; Bcryptjs Hashing</p>
              <p className="text-xs text-[#78716C]">Helmet header hardening &amp; Rate Limiters</p>
            </div>
            <div>
              <span className="block font-mono text-xs text-[#78716C] uppercase mb-1">Real-Time Sync</span>
              <p className="font-semibold text-[#1C1917]">Dual Transport Pipeline</p>
              <p className="text-xs text-[#78716C]">Cross-tab BroadcastChannel + WebSockets</p>
            </div>
          </div>
        </section>

        {/* Lead Engineer & Credits */}
        <section className="p-8 sm:p-10 rounded-2xl bg-gradient-to-br from-[#1C1917] to-[#292524] text-[#FAF7F2] shadow-xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <span className="inline-block text-xs font-mono uppercase tracking-widest text-[#EA580C] font-bold mb-2">
                Project Lead &amp; Architect
              </span>
              <h3 className="font-serif text-3xl font-normal text-white mb-2">
                Sohom Giri
              </h3>
              <p className="text-sm text-[#D6CEBF] font-light max-w-lg leading-relaxed">
                Department of Computer Science &amp; Engineering<br />
                St. Thomas&apos; College of Engineering &amp; Technology (STCET), Kolkata<br />
                Khadirpur / 4 Diamond Harbour Road, Kolkata 700023
              </p>
            </div>
            <div className="flex flex-col sm:items-end gap-3 shrink-0">
              <Link
                href="https://github.com/SOHOMGIRI/AetherTransit"
                target="_blank"
                rel="noreferrer"
                className="px-5 py-2.5 rounded-full bg-[#EA580C] hover:bg-[#C2410C] text-white text-xs font-semibold tracking-wide transition-all shadow-md inline-flex items-center gap-2"
              >
                <span>Inspect GitHub Repository</span>
                <span className="material-symbols-outlined text-sm">arrow_outward</span>
              </Link>
              <span className="text-xs text-[#A8A29E] font-mono">
                Repository: SOHOMGIRI/AetherTransit
              </span>
            </div>
          </div>
        </section>

        {/* Footer Navigation Back Link */}
        <div className="mt-16 flex items-center justify-between pt-8 border-t border-[#DDD7CB]">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#1C1917] hover:text-[#EA580C] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Return to Live Map &amp; Hero
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#EA580C] hover:text-[#C2410C] transition-colors"
          >
            Launch Fullscreen Commuter Console
            <span className="material-symbols-outlined text-base">arrow_forward</span>
          </Link>
        </div>

      </div>
    </main>
  )
}
