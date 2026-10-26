"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  Bus, Route, Clock, AlertTriangle, LogOut,
  CheckCircle2, Users, Wifi, WifiOff, TrendingDown,
  Zap, Layers, Gauge, ShieldAlert, Sparkles, Navigation,
  ArrowRight, Radio, Compass, RefreshCw
} from "lucide-react"
import { toast } from "sonner"
import MapWrapper from "@/components/map/MapWrapper"
import TiltCard from "@/components/common/TiltCard"
import { useBusSocket } from "@/hooks/use-bus-socket"
import { BUS_STOPS } from "@/lib/constants"
import { toIST } from "@/lib/formatting"

const PICKUP_LIST = [
  { id: 1, name: "Rahul Das", stop: "Tollygunge Metro", time: "08:00 AM", status: "picked" },
  { id: 2, name: "Priya Sharma", stop: "Behala Chowrasta", time: "08:10 AM", status: "picked" },
  { id: 3, name: "Ananya Roy", stop: "New Alipore Gate", time: "08:20 AM", status: "next" },
  { id: 4, name: "Sudipta Ghosh", stop: "Majerhat Station", time: "08:28 AM", status: "pending" },
  { id: 5, name: "Rimi Chatterjee", stop: "Garden Reach Crossing", time: "08:35 AM", status: "pending" },
]

export default function DriverDashboard() {
  const router = useRouter()
  const {
    busData,
    shuttles,
    activeShuttleId,
    setActiveShuttleId,
    isConnected,
    congestion,
    toggleCongestionChoke,
    isDetourActive,
    toggleDetour,
    driverSpeedOverride,
    setDriverSpeedOverride,
  } = useBusSocket()

  const [driverName, setDriverName] = useState("R. K. Mukherjee")
  const [pickups, setPickups] = useState(PICKUP_LIST)
  const [sliderSpeed, setSliderSpeed] = useState<number>(34)

  useEffect(() => {
    const name = localStorage.getItem("user_name")
    if (name) setDriverName(name)
  }, [])

  const handleSpeedSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const speed = parseInt(e.target.value, 10)
    setSliderSpeed(speed)
    setDriverSpeedOverride(speed)
  }

  const toggleStudentStatus = (id: number) => {
    setPickups((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, status: s.status === "picked" ? "pending" : "picked" } : s
      )
    )
  }

  const pickedCount = pickups.filter((p) => p.status === "picked").length
  const currentSpeed = driverSpeedOverride ?? (busData?.speed_kmh ? Math.round(busData.speed_kmh) : 34)

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col bg-[#F6F4EE] text-[#1C1917] overflow-hidden select-none">
      {/* ── Driver Mission Status Bar ── */}
      <div className="bg-[#1C1917] text-white px-5 py-2.5 flex items-center justify-between border-b border-stone-800 text-xs">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-mono font-bold tracking-wider uppercase text-emerald-400">
              TELEMETRY BROADCAST ACTIVE
            </span>
          </div>
          <span className="text-stone-500">|</span>
          <span className="font-mono text-stone-300">
            Shuttle: <strong className="text-white">B01 (Taratala Express)</strong>
          </span>
          <span className="text-stone-500 hidden sm:inline">|</span>
          <span className="text-stone-400 hidden sm:inline">
            Operator: <strong className="text-white">{driverName}</strong>
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="px-2.5 py-0.5 rounded-full bg-stone-800 border border-stone-700 font-mono text-[11px] text-amber-300">
            Cross-Tab Sync: Enabled
          </span>
          <Link
            href="/dashboard"
            className="hidden md:inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 transition-colors"
          >
            <span>View Student Map &rarr;</span>
          </Link>
        </div>
      </div>

      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* ═══════════════ LEFT DRIVER CONTROL CONSOLE (Sidebar) ═══════════════ */}
        <aside className="w-full md:w-96 flex-shrink-0 flex flex-col gap-3 p-4 border-b md:border-b-0 md:border-r border-[#DDD7CB] bg-[#FAF8F5] max-h-[42vh] md:max-h-none overflow-y-auto custom-scrollbar">
          
          {/* 1. AI Traffic Congestion & Detour Intelligence HUD */}
          <div
            className={`rounded-2xl border p-4 shadow-sm transition-all duration-300 ${
              congestion.isChoked
                ? "bg-red-50/90 border-red-300 ring-2 ring-red-400/20"
                : "bg-white border-[#DDD7CB]"
            }`}
          >
            <div className="flex items-start justify-between gap-2 mb-2.5">
              <div className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold ${
                    congestion.isChoked ? "bg-red-600 text-white" : "bg-emerald-100 text-emerald-800"
                  }`}
                >
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#1C1917] uppercase tracking-wider">
                    Corridor Traffic Intelligence
                  </h4>
                  <p className="text-[10px] text-[#78716C]">
                    Continuous AI Spatio-Temporal Ingest
                  </p>
                </div>
              </div>

              {/* Simulation Trigger Switch */}
              <button
                type="button"
                onClick={toggleCongestionChoke}
                className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                  congestion.isChoked
                    ? "bg-red-600 text-white border-red-700 shadow-xs"
                    : "bg-white text-stone-700 border-stone-300 hover:bg-stone-100"
                }`}
              >
                {congestion.isChoked ? "Choke Active (Reset)" : "Simulate Jam"}
              </button>
            </div>

            {/* Jam & Bottleneck Breakdown */}
            <div className="space-y-2 text-xs pt-1">
              <div className="flex justify-between items-center py-1 border-b border-[#EADDCD]">
                <span className="text-[#78716C]">Choke Segment</span>
                <span className={`font-bold ${congestion.isChoked ? "text-red-700" : "text-emerald-700"}`}>
                  {congestion.isChoked ? "Majerhat Flyover (Port Squeeze)" : "All Corridors Clear"}
                </span>
              </div>

              <div className="flex justify-between items-center py-1 border-b border-[#EADDCD]">
                <span className="text-[#78716C]">Corridor Velocity</span>
                <span className="font-mono font-bold text-[#1C1917]">
                  {congestion.currentSpeedKmh.toFixed(1)} km/h{" "}
                  <span className="text-[10px] text-stone-500">(Avg: 34 km/h)</span>
                </span>
              </div>

              <div className="flex justify-between items-center py-1 border-b border-[#EADDCD]">
                <span className="text-[#78716C]">Traffic Delay Added</span>
                <span className={`font-bold font-mono ${congestion.isChoked ? "text-red-700" : "text-emerald-700"}`}>
                  {congestion.isChoked ? `+${congestion.delayAddedMinutes} min` : "0 min"}
                </span>
              </div>
            </div>

            {/* AI Alternate Detour Route Recommendation */}
            {congestion.isChoked && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mt-3 pt-3 border-t border-red-200 flex flex-col gap-2.5"
              >
                <div className="p-3 rounded-xl bg-purple-50 border border-purple-200">
                  <div className="flex items-center gap-1.5 text-purple-900 font-bold text-xs mb-1">
                    <Zap className="w-3.5 h-3.5 text-purple-600" />
                    <span>AI Recommended Detour Bypass</span>
                  </div>
                  <p className="text-[11px] text-purple-800 leading-snug">
                    Diverge at <strong>{congestion.divergencePoint}</strong> via Taratala &amp; Hide Road.
                  </p>
                  <div className="mt-2 grid grid-cols-2 gap-2 text-[11px] font-mono">
                    <div className="bg-white/80 p-1.5 rounded-lg border border-purple-200">
                      <span className="text-[9px] text-stone-500 uppercase block">Via Flyover</span>
                      <strong className="text-red-700">28 min (Jammed)</strong>
                    </div>
                    <div className="bg-white/80 p-1.5 rounded-lg border border-purple-200">
                      <span className="text-[9px] text-stone-500 uppercase block">Via Hide Rd</span>
                      <strong className="text-emerald-700">14 min (-14m!)</strong>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={toggleDetour}
                  className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer ${
                    isDetourActive
                      ? "bg-purple-700 text-white shadow-purple-600/30"
                      : "bg-purple-600 hover:bg-purple-700 text-white"
                  }`}
                >
                  <Zap className="w-4 h-4" />
                  <span>
                    {isDetourActive
                      ? "✓ Electric Violet Detour Active (Click to Revert)"
                      : "Engage AI Detour (Saves 14 mins)"}
                  </span>
                </button>
              </motion.div>
            )}
          </div>

          {/* 2. Interactive Driver Throttle HUD */}
          <div className="bg-white rounded-2xl border border-[#DDD7CB] p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Gauge className="w-4 h-4 text-[#EA580C]" />
                <span className="text-xs font-bold text-[#1C1917] uppercase tracking-wider">
                  Live Throttle Calibration
                </span>
              </div>
              <span className="font-mono text-xs font-extrabold text-[#EA580C] bg-[#FFEDD5] px-2 py-0.5 rounded-md">
                {currentSpeed} km/h
              </span>
            </div>

            <p className="text-[11px] text-[#78716C] mb-3">
              Slide throttle to adjust vehicle speed in real time across all student maps:
            </p>

            <input
              type="range"
              min="0"
              max="65"
              step="1"
              value={currentSpeed}
              onChange={handleSpeedSliderChange}
              className="w-full accent-[#EA580C] cursor-pointer h-2 bg-stone-200 rounded-lg"
            />

            <div className="flex justify-between text-[10px] font-mono text-stone-400 mt-1">
              <span>0 (Stationary)</span>
              <span>30 (Cruising)</span>
              <span>60 (Express)</span>
            </div>

            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-[#EADDCD]">
              <button
                type="button"
                onClick={() => setDriverSpeedOverride(0)}
                className="flex-1 py-1.5 text-xs font-bold rounded-lg border border-stone-300 hover:bg-stone-50 transition-colors"
              >
                Halt at Stop
              </button>
              <button
                type="button"
                onClick={() => setDriverSpeedOverride(36)}
                className="flex-1 py-1.5 text-xs font-bold rounded-lg bg-[#EA580C] text-white hover:bg-[#C2410C] transition-colors"
              >
                Cruise 36 km/h
              </button>
            </div>
          </div>

          {/* 3. Student Pickup Manifest */}
          <div className="bg-white rounded-2xl border border-[#DDD7CB] p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-[#B45309]" />
                <span className="text-xs font-bold text-[#1C1917] uppercase tracking-wider">
                  Student Manifest ({pickedCount}/{pickups.length})
                </span>
              </div>
              <span className="text-[10px] text-stone-500">Tap to check off</span>
            </div>

            <div className="space-y-2">
              {pickups.map((student) => (
                <div
                  key={student.id}
                  onClick={() => toggleStudentStatus(student.id)}
                  className={`flex items-center justify-between p-2 rounded-xl border text-xs cursor-pointer transition-all ${
                    student.status === "picked"
                      ? "bg-emerald-50/70 border-emerald-200 text-stone-400"
                      : "bg-[#FAF8F5] border-[#EADDCD] hover:border-stone-400"
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <div
                      className={`w-3.5 h-3.5 rounded-full flex items-center justify-center border ${
                        student.status === "picked"
                          ? "bg-emerald-600 border-emerald-600 text-white"
                          : "border-stone-400"
                      }`}
                    >
                      {student.status === "picked" && <CheckCircle2 className="w-3 h-3" />}
                    </div>
                    <div className="min-w-0">
                      <p className={`font-semibold truncate ${student.status === "picked" ? "line-through text-stone-400" : "text-[#1C1917]"}`}>
                        {student.name}
                      </p>
                      <p className="text-[10px] text-[#78716C] truncate">{student.stop}</p>
                    </div>
                  </div>
                  <span className="font-mono text-[10px] text-stone-500">{student.time}</span>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* ═══════════════ RIGHT: INTERACTIVE MAP ═══════════════ */}
        <main className="flex-1 p-4 relative bg-[#F6F4EE]">
          <div className="w-full h-full rounded-3xl overflow-hidden shadow-lg border border-[#DDD7CB] relative">
            <MapWrapper
              busData={busData}
              shuttles={shuttles}
              activeShuttleId={activeShuttleId}
              isChoked={congestion.isChoked}
              isDetourActive={isDetourActive}
              userRole="driver"
            />
          </div>
        </main>
      </div>
    </div>
  )
}
