"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import * as maplibregl from "maplibre-gl"
import Map, {
  Marker, Source, Layer,
  type MapRef, type LayerProps, type StyleSpecification
} from "react-map-gl/maplibre"
import { motion, AnimatePresence } from "framer-motion"
import { Navigation, Zap, Bus, Route as RouteIcon, AlertTriangle } from "lucide-react"
import type { LiveBusData, FleetShuttle } from "@/types/bus"
import { MAP_DEFAULT_CENTER, MAP_DEFAULT_ZOOM, BUS_STOPS } from "@/lib/constants"
import { ALTERNATE_TRAFFIC_ROUTE } from "@/lib/traffic-route-data"
import "maplibre-gl/dist/maplibre-gl.css"

import Image from "next/image"

const CYCLOSM_STYLE: StyleSpecification = {
  version: 8,
  sources: {
    cyclosm: {
      type: "raster",
      tiles: ["https://a.tile-cyclosm.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png"],
      tileSize: 256,
      attribution: "© OpenStreetMap contributors © CyclOSM",
    },
  },
  layers: [
    {
      id: "cyclosm-basemap",
      type: "raster",
      source: "cyclosm",
      minzoom: 0,
      maxzoom: 22,
    },
  ],
}

interface StopInfo {
  stopId: string;
  name: string;
  latitude: number;
  longitude: number;
  sequenceOrder: number;
  arrivalOffsetMinutes: number;
}

interface RouteResponse {
  routeId: string;
  name: string;
  description: string;
  color: string;
  stops: StopInfo[];
}

export interface LiveMapProps {
  busData: LiveBusData | null
  shuttles?: FleetShuttle[]
  activeShuttleId?: string
  isChoked?: boolean
  isDetourActive?: boolean
  onSelectShuttle?: (id: string) => void
  userRole?: "student" | "driver"
  onStopClick?: (stopId: string) => void
  onMapClick?: (longitude: number, latitude: number) => void
}

export default function LiveMap({
  busData,
  shuttles = [],
  activeShuttleId = "B01",
  isChoked = false,
  isDetourActive = false,
  onSelectShuttle,
  userRole = "student",
  onStopClick,
  onMapClick,
}: LiveMapProps) {
  const mapRef = useRef<MapRef>(null)
  const [selectedStop, setSelectedStop] = useState<string | null>(null)
  const [mapLoaded, setMapLoaded] = useState(false)

  const [routeGeoJSON, setRouteGeoJSON] = useState<GeoJSON.Feature<GeoJSON.LineString> | null>(null)
  const [detourGeoJSON, setDetourGeoJSON] = useState<GeoJSON.Feature<GeoJSON.LineString> | null>(null)
  const [stops, setStops] = useState<StopInfo[]>([])
  const [sourceAndDest, setSourceAndDest] = useState<{source: StopInfo | null, dest: StopInfo | null}>({source: null, dest: null})
  
  const [isLoading, setIsLoading] = useState(true)
  const [mapZoom, setMapZoom] = useState(MAP_DEFAULT_ZOOM)

  const handleMapClick = useCallback((e: maplibregl.MapMouseEvent) => {
    onMapClick?.(e.lngLat.lng, e.lngLat.lat)
  }, [onMapClick])

  // Setup initial route corridor and alternate detour geometry
  useEffect(() => {
    const defaultStops: StopInfo[] = BUS_STOPS.map((s, idx) => ({
      stopId: s.stop_id,
      name: s.name,
      latitude: s.latitude,
      longitude: s.longitude,
      sequenceOrder: idx + 1,
      arrivalOffsetMinutes: idx * 5,
    }))
    setStops(defaultStops)
    setSourceAndDest({
      source: defaultStops[0],
      dest: defaultStops[defaultStops.length - 1],
    })

    const allCoords = ALTERNATE_TRAFFIC_ROUTE.features.flatMap((f) => f.geometry.coordinates)
    
    // Primary route line
    setRouteGeoJSON({
      type: "Feature",
      properties: {},
      geometry: {
        type: "LineString",
        coordinates: allCoords,
      },
    })

    // Alternate Detour (Hide Road corridor)
    const detourCoords: [number, number][] = [
      [88.3390, 22.5120],
      [88.3355, 22.5135],
      [88.3320, 22.5145],
      [88.3290, 22.5152],
      [88.3265, 22.5160],
      [88.3240, 22.5170],
      [88.3215, 22.5185],
      [88.3190, 22.5210],
      [88.3170, 22.5240],
      [88.3190, 22.5280],
      [88.3220, 22.5320],
      [88.3266, 22.5388],
    ]
    setDetourGeoJSON({
      type: "Feature",
      properties: {},
      geometry: {
        type: "LineString",
        coordinates: detourCoords,
      },
    })

    setIsLoading(false)
  }, [])

  // Dynamic route styling based on traffic congestion state
  const routeCoreColor = isChoked && !isDetourActive ? "#EF4444" : "#2563EB"
  const routeHaloColor = isChoked && !isDetourActive ? "#FCA5A5" : "#60A5FA"

  const routeHaloLayer: LayerProps = {
    id: "route-halo",
    type: "line",
    layout: { "line-cap": "round", "line-join": "round" },
    paint: {
      "line-color": routeHaloColor,
      "line-width": 12,
      "line-opacity": 0.45,
    },
  }

  const routeCasingLayer: LayerProps = {
    id: "route-casing",
    type: "line",
    layout: { "line-cap": "round", "line-join": "round" },
    paint: {
      "line-color": "#FFFFFF",
      "line-width": 7,
      "line-opacity": 1.0,
    },
  }

  const routeCoreLayer: LayerProps = {
    id: "route-core",
    type: "line",
    layout: { "line-cap": "round", "line-join": "round" },
    paint: {
      "line-color": routeCoreColor,
      "line-width": 4.5,
      "line-opacity": 1.0,
    },
  }

  // Electric Violet Detour Layers
  const detourHaloLayer: LayerProps = {
    id: "detour-halo",
    type: "line",
    layout: { "line-cap": "round", "line-join": "round" },
    paint: {
      "line-color": "#C084FC",
      "line-width": 14,
      "line-opacity": 0.6,
    },
  }

  const detourCoreLayer: LayerProps = {
    id: "detour-core",
    type: "line",
    layout: { "line-cap": "round", "line-join": "round" },
    paint: {
      "line-color": "#7C3AED",
      "line-width": 5,
      "line-opacity": 1.0,
    },
  }

  const centerOnBus = useCallback(() => {
    if (!busData || !mapRef.current) return
    mapRef.current.easeTo({
      center: [busData.longitude, busData.latitude],
      duration: 1500,
      zoom: 15,
    })
  }, [busData?.latitude, busData?.longitude])

  const handleStopClick = (stopId: string) => {
    setSelectedStop(stopId === selectedStop ? null : stopId)
    onStopClick?.(stopId)
  }

  const busWidth = Math.max(22, Math.min(52, 14 + (mapZoom - 12) * 5))
  const busHeight = busWidth * (96 / 44)

  // Use shuttles array if provided, otherwise default to active busData
  const displayShuttles = shuttles.length > 0 ? shuttles : (busData ? [{
    id: busData.bus_id,
    name: "Bus B01",
    category: "Express" as const,
    routeId: busData.route_id,
    routeName: "Taratala Express",
    driverName: "Campus Fleet",
    latitude: busData.latitude,
    longitude: busData.longitude,
    bearing: busData.bearing,
    speedKmh: busData.speed_kmh,
    status: busData.status,
    color: "bg-[#EA580C]",
    accentHex: "#EA580C",
    etaMinutes: busData.eta_minutes,
    delayMinutes: busData.delay_minutes,
    occupancyPct: 80,
    nextStopName: busData.next_stop?.name || "Taratala",
  }] : [])

  return (
    <div className="relative w-full h-full bg-parchment overflow-hidden">
      <Map
        ref={mapRef}
        mapLib={maplibregl as any}
        initialViewState={{
          longitude: MAP_DEFAULT_CENTER[0],
          latitude: MAP_DEFAULT_CENTER[1],
          zoom: MAP_DEFAULT_ZOOM,
        }}
        minZoom={0}
        maxZoom={22}
        style={{ width: "100%", height: "100%" }}
        mapStyle={CYCLOSM_STYLE}
        attributionControl={{ compact: false }}
        onClick={handleMapClick}
        onLoad={() => setMapLoaded(true)}
        onMove={(evt) => setMapZoom(evt.viewState.zoom)}
        onZoom={(evt) => setMapZoom(evt.viewState.zoom)}
        onError={(e) => {
          console.warn("Map warn:", e)
          setMapLoaded(true)
        }}
      >
        {/* Standard Primary Route Line */}
        {routeGeoJSON && (
          <Source id="route-source" type="geojson" data={routeGeoJSON}>
            <Layer {...routeHaloLayer} />
            <Layer {...routeCasingLayer} />
            <Layer {...routeCoreLayer} />
          </Source>
        )}

        {/* Electric Violet AI Detour Corridor */}
        {isDetourActive && detourGeoJSON && (
          <Source id="detour-source" type="geojson" data={detourGeoJSON}>
            <Layer {...detourHaloLayer} />
            <Layer {...detourCoreLayer} />
          </Source>
        )}

        {/* Origin / Destination Badges */}
        {sourceAndDest.source && (
          <Marker longitude={sourceAndDest.source.longitude} latitude={sourceAndDest.source.latitude}>
            <div className="bg-emerald-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold shadow-md border-2 border-white ring-2 ring-emerald-500/30 text-xs">
              S
            </div>
          </Marker>
        )}
        
        {sourceAndDest.dest && (
          <Marker longitude={sourceAndDest.dest.longitude} latitude={sourceAndDest.dest.latitude}>
            <div className="bg-indigo-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold shadow-md border-2 border-white ring-2 ring-indigo-600/30 text-xs">
              D
            </div>
          </Marker>
        )}

        {/* Bus Stop Markers with Smart Radar Beacons */}
        {stops.map((stop) => {
          const isSelected = selectedStop === stop.stopId
          const isNextStop = busData?.next_stop_id === stop.stopId
          const isCampus = stop.name.toLowerCase().includes("campus")
          if (stop.stopId === sourceAndDest.source?.stopId || stop.stopId === sourceAndDest.dest?.stopId) {
            return null
          }

          return (
            <Marker
              key={stop.stopId}
              longitude={stop.longitude}
              latitude={stop.latitude}
              onClick={(e) => {
                e.originalEvent.stopPropagation()
                handleStopClick(stop.stopId)
              }}
            >
              <div className="relative cursor-pointer group">
                {isNextStop && (
                  <span
                    className="absolute rounded-full animate-ping pointer-events-none"
                    style={{
                      width: 32,
                      height: 32,
                      top: -6,
                      left: -6,
                      background: "rgba(234,88,12,0.35)",
                    }}
                  />
                )}

                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-transform duration-200 group-hover:scale-125 shadow-xs ${
                    isCampus
                      ? "bg-purple-600 border-purple-200"
                      : isNextStop
                      ? "bg-terracotta border-white ring-2 ring-terracotta/40"
                      : "bg-white border-stone-text"
                  }`}
                />

                <AnimatePresence>
                  {(isSelected || isNextStop) && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.15 }}
                      className="absolute bottom-7 left-1/2 -translate-x-1/2 z-50 min-w-max rounded-xl border border-stone-subtle px-3 py-2 shadow-xl bg-white/95 backdrop-blur-md"
                    >
                      <p className="text-xs font-semibold text-espresso">{stop.name}</p>
                      {isNextStop && (
                        <p className="text-[10px] text-terracotta font-bold flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-terracotta animate-pulse" />
                          <span>← Next Arrival Target</span>
                        </p>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </Marker>
          )
        })}

        {/* Multi-Shuttle Fleet Vehicles (B01, B02, B03) */}
        {displayShuttles.map((shuttle) => {
          const isActive = shuttle.id === (busData?.bus_id || activeShuttleId)
          return (
            <Marker
              key={shuttle.id}
              longitude={shuttle.longitude}
              latitude={shuttle.latitude}
              anchor="center"
            >
              <div
                onClick={() => onSelectShuttle?.(shuttle.id)}
                className={`relative flex flex-col items-center justify-center cursor-pointer transition-transform ${
                  isActive ? "scale-105 z-30" : "scale-90 opacity-90 z-20 hover:opacity-100"
                }`}
              >
                {/* Vehicle Telemetry HUD Tag */}
                <div
                  className={`absolute -top-8 whitespace-nowrap rounded-full px-2.5 py-0.5 border shadow-md flex items-center gap-1.5 z-30 backdrop-blur-md transition-all ${
                    isActive
                      ? "bg-white border-[#EA580C] ring-2 ring-[#EA580C]/25 text-[#1C1917]"
                      : "bg-white/90 border-stone-subtle text-stone-600"
                  }`}
                >
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: shuttle.accentHex }}
                  />
                  <span className="text-[10px] font-extrabold">{shuttle.id}</span>
                  <span className="text-[9px] font-mono font-bold text-stone-500">
                    {Math.round(shuttle.speedKmh)} km/h
                  </span>
                  {isActive && shuttle.delayMinutes > 0 && (
                    <span className="text-[9px] font-bold text-red-600">
                      +{shuttle.delayMinutes}m
                    </span>
                  )}
                </div>

                {/* Overhead Bus Asset with Heading Rotation */}
                <div
                  className="relative transition-transform duration-200 ease-out"
                  style={{
                    width: busWidth,
                    height: busHeight,
                    transform: `rotate(${shuttle.bearing}deg)`,
                    transformOrigin: "center center",
                  }}
                >
                  <Image
                    src="/assets/bus-topview.png"
                    alt={shuttle.name}
                    width={Math.round(busWidth)}
                    height={Math.round(busHeight)}
                    priority
                    unoptimized
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                      background: "transparent",
                    }}
                    className={isActive ? "drop-shadow-lg" : "drop-shadow-xs"}
                  />
                </div>
              </div>
            </Marker>
          )
        })}
      </Map>

      {/* Recenter & Quick Action Floating Widget */}
      <div className="absolute bottom-6 right-4 z-40 flex flex-col gap-2 pointer-events-auto">
        <button
          type="button"
          onClick={centerOnBus}
          title="Center on active shuttle"
          className="w-10 h-10 rounded-xl border border-stone-subtle flex items-center justify-center hover:bg-parchment-warm transition-all shadow-md bg-white/90 backdrop-blur-md text-espresso cursor-pointer"
        >
          <Navigation className="w-5 h-5 text-terracotta" />
        </button>
      </div>
    </div>
  )
}
