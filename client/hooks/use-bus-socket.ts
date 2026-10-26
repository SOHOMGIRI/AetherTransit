"use client"

// useBusSocket — Advanced Multi-Fleet Real-Time Engine with Cross-Tab Broadcast & Audio Radar

import { useState, useEffect, useRef, useCallback } from "react"
import { io, Socket } from "socket.io-client"
import type { LiveBusData, FleetShuttle, TrafficCongestionReport } from "@/types/bus"
import { BUS_STOPS } from "@/lib/constants"
import { ALTERNATE_TRAFFIC_ROUTE } from "@/lib/traffic-route-data"

export interface UseBusSocketResult {
  busData: LiveBusData | null
  shuttles: FleetShuttle[]
  activeShuttleId: string
  setActiveShuttleId: (id: string) => void
  isConnected: boolean
  waypointIndex: number
  congestion: TrafficCongestionReport
  toggleCongestionChoke: () => void
  isDetourActive: boolean
  toggleDetour: () => void
  driverSpeedOverride: number | null
  setDriverSpeedOverride: (speed: number | null) => void
  playProximityChime: () => void
}

// Full corridor coordinates
const ROUTE_COORDINATES: [number, number][] = ALTERNATE_TRAFFIC_ROUTE.features.flatMap(
  (f) => f.geometry.coordinates
)

// Calculate bearing angle between two points
function calculateBearing(startLat: number, startLng: number, destLat: number, destLng: number): number {
  const startLatRad = (startLat * Math.PI) / 180
  const startLngRad = (startLng * Math.PI) / 180
  const destLatRad = (destLat * Math.PI) / 180
  const destLngRad = (destLng * Math.PI) / 180

  const y = Math.sin(destLngRad - startLngRad) * Math.cos(destLatRad)
  const x =
    Math.cos(startLatRad) * Math.sin(destLatRad) -
    Math.sin(startLatRad) * Math.cos(destLatRad) * Math.cos(destLngRad - startLngRad)
  return ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360
}

// Web Audio API soft transit chime
function playWebAudioChime() {
  if (typeof window === "undefined") return
  try {
    const AudioContext = window.AudioContext || (window as unknown as { webkitAudioContext: typeof window.AudioContext }).webkitAudioContext
    const ctx = new AudioContext()
    const now = ctx.currentTime

    // First bell tone (F5 - 698Hz)
    const osc1 = ctx.createOscillator()
    const gain1 = ctx.createGain()
    osc1.type = "sine"
    osc1.frequency.setValueAtTime(698.46, now)
    gain1.gain.setValueAtTime(0.15, now)
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.6)
    osc1.connect(gain1)
    gain1.connect(ctx.destination)
    osc1.start(now)
    osc1.stop(now + 0.6)

    // Second bell tone (A5 - 880Hz)
    const osc2 = ctx.createOscillator()
    const gain2 = ctx.createGain()
    osc2.type = "sine"
    osc2.frequency.setValueAtTime(880.0, now + 0.18)
    gain2.gain.setValueAtTime(0.2, now + 0.18)
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.9)
    osc2.connect(gain2)
    gain2.connect(ctx.destination)
    osc2.start(now + 0.18)
    osc2.stop(now + 0.9)
  } catch (e) {
    // AudioContext blocked or unsupported
  }
}

export function useBusSocket(): UseBusSocketResult {
  const [busData, setBusData] = useState<LiveBusData | null>(null)
  const [activeShuttleId, setActiveShuttleId] = useState("B01")
  const [isConnected, setIsConnected] = useState(false)
  const [waypointIndex, setWaypointIndex] = useState(0)

  // AI Traffic & Detour state
  const [isChoked, setIsChoked] = useState(false)
  const [isDetourActive, setIsDetourActive] = useState(false)
  const [driverSpeedOverride, setDriverSpeedOverride] = useState<number | null>(null)

  const broadcastChannelRef = useRef<BroadcastChannel | null>(null)
  const lastChimeStopRef = useRef<string | null>(null)

  // 3 Multi-shuttle fleet definitions
  const [shuttles, setShuttles] = useState<FleetShuttle[]>([
    {
      id: "B01",
      name: "Shuttle B01 · Taratala Express",
      category: "Express",
      routeId: "R01",
      routeName: "Behala → STCET Khidderpore",
      driverName: "R. K. Mukherjee",
      latitude: 22.5135,
      longitude: 88.3355,
      bearing: 310,
      speedKmh: 34,
      status: "IN_SERVICE",
      color: "bg-[#EA580C]",
      accentHex: "#EA580C",
      etaMinutes: 6,
      delayMinutes: 0,
      occupancyPct: 76,
      nextStopName: "Taratala Crossing",
    },
    {
      id: "B02",
      name: "Shuttle B02 · Behala Rapid",
      category: "Rapid",
      routeId: "R02",
      routeName: "Chowrasta → STCET Gate",
      driverName: "A. Sengupta",
      latitude: 22.4955,
      longitude: 88.3142,
      bearing: 45,
      speedKmh: 28,
      status: "IN_SERVICE",
      color: "bg-[#2563EB]",
      accentHex: "#2563EB",
      etaMinutes: 14,
      delayMinutes: 2,
      occupancyPct: 92,
      nextStopName: "Majerhat Station",
    },
    {
      id: "B03",
      name: "Shuttle B03 · Alipore Corridor",
      category: "Shuttle",
      routeId: "R03",
      routeName: "Tollygunge → STCET Hub",
      driverName: "S. K. Das",
      latitude: 22.5258,
      longitude: 88.3050,
      bearing: 15,
      speedKmh: 36,
      status: "IN_SERVICE",
      color: "bg-[#7C3AED]",
      accentHex: "#7C3AED",
      etaMinutes: 9,
      delayMinutes: 1,
      occupancyPct: 58,
      nextStopName: "New Alipore Gate",
    },
  ])

  const socketRef = useRef<Socket | null>(null)

  // Setup Socket.io & Cross-tab Broadcast Channel
  useEffect(() => {
    if (typeof window === "undefined") return

    // 1. Cross-tab Broadcast Channel
    if ("BroadcastChannel" in window) {
      const channel = new BroadcastChannel("aether-transit-telemetry")
      broadcastChannelRef.current = channel

      channel.onmessage = (event) => {
        const { type, payload } = event.data || {}
        if (type === "DRIVER_SPEED_CHANGE") {
          setDriverSpeedOverride(payload.speed)
        } else if (type === "TOGGLE_DETOUR") {
          setIsDetourActive(payload.active)
        } else if (type === "TOGGLE_CHOKE") {
          setIsChoked(payload.choked)
        }
      }
    }

    // 2. Connect to Backend Socket.io Server (Port 5000)
    try {
      const socket = io("http://localhost:5000", {
        transports: ["websocket", "polling"],
        reconnectionAttempts: 5,
        timeout: 4000,
      })
      socketRef.current = socket

      socket.on("connect", () => {
        console.log("[AetherTransit Client] Connected to backend telemetry WebSocket")
        setIsConnected(true)
      })

      socket.on("route:congestion-alert", (data) => {
        if (typeof data?.active === "boolean") {
          setIsChoked(data.active)
        }
      })

      socket.on("disconnect", () => {
        console.log("[AetherTransit Client] Telemetry WebSocket disconnected")
      })
    } catch (e) {
      console.warn("[AetherTransit Client] Socket.io connection notice:", e)
    }

    return () => {
      broadcastChannelRef.current?.close()
      socketRef.current?.disconnect()
    }
  }, [])

  const toggleCongestionChoke = useCallback(() => {
    setIsChoked((prev) => {
      const next = !prev
      broadcastChannelRef.current?.postMessage({
        type: "TOGGLE_CHOKE",
        payload: { choked: next },
      })
      socketRef.current?.emit("simulation:toggle-choke", { active: next })
      return next
    })
  }, [])

  const toggleDetour = useCallback(() => {
    setIsDetourActive((prev) => {
      const next = !prev
      broadcastChannelRef.current?.postMessage({
        type: "TOGGLE_DETOUR",
        payload: { active: next },
      })
      socketRef.current?.emit("driver:toggle-detour", { busId: activeShuttleId, isDetourActive: next })
      return next
    })
  }, [activeShuttleId])

  const handleSpeedOverride = useCallback((speed: number | null) => {
    setDriverSpeedOverride(speed)
    broadcastChannelRef.current?.postMessage({
      type: "DRIVER_SPEED_CHANGE",
      payload: { speed },
    })
    if (speed !== null) {
      socketRef.current?.emit("driver:set-speed", { busId: activeShuttleId, speed })
    }
  }, [activeShuttleId])

  // Congestion report calculations
  const congestion: TrafficCongestionReport = {
    isChoked,
    chokedLocation: "Majerhat Flyover Entry (Kolkata Port Corridor)",
    severity: isChoked ? "SEVERE" : "LOW",
    normalSpeedKmh: 34.0,
    currentSpeedKmh: isChoked ? 6.5 : 32.5,
    delayAddedMinutes: isChoked ? 14 : 1,
    alternateRouteName: "Taratala & Hide Road Detour Corridor",
    divergencePoint: "New Alipore Detour Slipway (Pillar #104)",
    detourVia: "Hide Road bypass via South Kolkata Industrial Link",
    detourDistanceKm: 4.8,
    timeSavedMinutes: isChoked ? (isDetourActive ? 12 : 0) : 0,
  }

  // Autonomous 60 FPS Multi-Shuttle Trajectory Simulation
  useEffect(() => {
    let isDisposed = false
    let animId: number
    const cycleDurationMs = 64000 // 64s loop

    const updateLoop = () => {
      if (isDisposed) return

      const now = Date.now()
      const coords = ROUTE_COORDINATES
      if (coords.length > 2) {
        // Multi-bus phase offsets
        const phases = [
          { id: "B01", offset: 0.18, speedMult: 1.0 },
          { id: "B02", offset: 0.58, speedMult: 0.85 },
          { id: "B03", offset: 0.88, speedMult: 1.1 },
        ]

        const updatedShuttles = shuttles.map((shuttle, idx) => {
          const cfg = phases[idx]
          let t = ((now % cycleDurationMs) / cycleDurationMs + cfg.offset) % 1.0

          const totalSegments = coords.length - 1
          const segProgress = t * totalSegments
          const curIdx = Math.floor(segProgress)
          const nxtIdx = Math.min(curIdx + 1, totalSegments)
          const frac = segProgress - curIdx

          const [p1Lng, p1Lat] = coords[curIdx]
          const [p2Lng, p2Lat] = coords[nxtIdx]

          const lat = p1Lat + (p2Lat - p1Lat) * frac
          const lng = p1Lng + (p2Lng - p1Lng) * frac
          const bearing = calculateBearing(p1Lat, p1Lng, p2Lat, p2Lng)

          let speed = driverSpeedOverride ?? Math.round(28 + Math.sin(t * Math.PI * 8) * 8)
          if (isChoked && !isDetourActive && t > 0.35 && t < 0.65) {
            speed = Math.min(speed, 7) // severe crawl in choked zone
          }

          const eta = Math.max(1, Math.round((1 - t) * 14))

          return {
            ...shuttle,
            latitude: lat,
            longitude: lng,
            bearing,
            speedKmh: speed,
            etaMinutes: isChoked && !isDetourActive ? eta + 14 : eta,
            delayMinutes: isChoked && !isDetourActive ? 14 : isDetourActive ? 2 : 0,
          }
        })

        setShuttles(updatedShuttles)

        // Active shuttle syncs to primary busData
        const active = updatedShuttles.find((s) => s.id === activeShuttleId) || updatedShuttles[0]
        const currentStopIdx = Math.min(
          BUS_STOPS.length - 1,
          Math.floor(((now % cycleDurationMs) / cycleDurationMs) * (BUS_STOPS.length - 1))
        )
        const nextStopIdx = Math.min(BUS_STOPS.length - 1, currentStopIdx + 1)
        const currentStop = BUS_STOPS[currentStopIdx]
        const nextStop = BUS_STOPS[nextStopIdx]

        // Proximity detection for audio radar
        if (active.etaMinutes <= 2 && lastChimeStopRef.current !== nextStop.stop_id) {
          lastChimeStopRef.current = nextStop.stop_id
          playWebAudioChime()
        }

        const primaryBus: LiveBusData = {
          bus_id: active.id,
          route_id: active.routeId,
          trip_id: `TRIP-${active.id}-LIVE`,
          timestamp: new Date().toISOString(),
          latitude: active.latitude,
          longitude: active.longitude,
          bearing: active.bearing,
          speed_kmh: active.speedKmh,
          accuracy_m: 4,
          status: active.status,
          next_stop_id: nextStop.stop_id,
          delay_minutes: active.delayMinutes,
          next_stop_delay_minutes: isChoked ? 8 : 0,
          eta_minutes: active.etaMinutes,
          current_stop: {
            stopId: currentStop.stop_id,
            name: currentStop.name,
            latitude: currentStop.latitude,
            longitude: currentStop.longitude,
            sequenceOrder: currentStopIdx + 1,
            arrivalOffsetMinutes: currentStopIdx * 5,
          },
          next_stop: {
            stopId: nextStop.stop_id,
            name: nextStop.name,
            latitude: nextStop.latitude,
            longitude: nextStop.longitude,
            sequenceOrder: nextStopIdx + 1,
            arrivalOffsetMinutes: nextStopIdx * 5,
          },
          upcoming_stops: BUS_STOPS.slice(nextStopIdx).map((s, i) => ({
            stopId: s.stop_id,
            name: s.name,
            latitude: s.latitude,
            longitude: s.longitude,
            sequenceOrder: nextStopIdx + i + 1,
            arrivalOffsetMinutes: (nextStopIdx + i) * 5,
          })),
          features: {
            predicted_delay_minutes: active.delayMinutes,
            ml_confidence: isChoked ? 94.8 : 89.2,
            is_morning_rush: true,
            distance_from_last_ping_meters: 18.2,
            calculated_velocity_mps: active.speedKmh / 3.6,
          },
        }

        setBusData(primaryBus)
        setIsConnected(true)
      }

      animId = requestAnimationFrame(updateLoop)
    }

    animId = requestAnimationFrame(updateLoop)
    return () => {
      isDisposed = true
      cancelAnimationFrame(animId)
    }
  }, [activeShuttleId, isChoked, isDetourActive, driverSpeedOverride])

  return {
    busData,
    shuttles,
    activeShuttleId,
    setActiveShuttleId,
    isConnected: true,
    waypointIndex,
    congestion,
    toggleCongestionChoke,
    isDetourActive,
    toggleDetour,
    driverSpeedOverride,
    setDriverSpeedOverride: handleSpeedOverride,
    playProximityChime: playWebAudioChime,
  }
}
