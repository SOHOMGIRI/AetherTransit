"use client"

import dynamic from "next/dynamic"
import type { LiveBusData, FleetShuttle } from "@/types/bus"

const LiveMap = dynamic(() => import("@/components/map/LiveMap"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 bg-parchment flex flex-col items-center justify-center z-30">
      <div className="w-10 h-10 rounded-full border-2 border-terracotta/20 border-t-terracotta animate-spin mb-3" />
      <p className="text-xs text-stone-text font-mono">Streaming High-Frequency Map Tiles...</p>
    </div>
  ),
})

interface MapWrapperProps {
  busData: LiveBusData | null
  shuttles?: FleetShuttle[]
  activeShuttleId?: string
  isChoked?: boolean
  isDetourActive?: boolean
  onSelectShuttle?: (id: string) => void
  userRole: "student" | "driver"
  onStopClick?: (stopId: string) => void
  onMapClick?: (longitude: number, latitude: number) => void
}

export default function MapWrapper({
  busData,
  shuttles,
  activeShuttleId,
  isChoked,
  isDetourActive,
  onSelectShuttle,
  userRole,
  onStopClick,
  onMapClick,
}: MapWrapperProps) {
  return (
    <LiveMap
      busData={busData}
      shuttles={shuttles}
      activeShuttleId={activeShuttleId}
      isChoked={isChoked}
      isDetourActive={isDetourActive}
      onSelectShuttle={onSelectShuttle}
      userRole={userRole}
      onStopClick={onStopClick}
      onMapClick={onMapClick}
    />
  )
}
