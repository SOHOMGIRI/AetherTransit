// Types for the AetherTransit Fleet Intelligence system

export type BusStatus = "IN_SERVICE" | "OUT_OF_SERVICE" | "DELAYED" | "APPROACHING" | "AT_STOP"

export type UserRole = "student" | "driver" | "admin"

export interface BusEvent {
  bus_id: string
  route_id: string
  trip_id: string
  timestamp: string
  latitude: number
  longitude: number
  bearing: number
  speed_kmh: number
  accuracy_m: number
  status: BusStatus
  next_stop_id: string
}

export interface BusFeatures {
  is_morning_rush: boolean
  distance_from_last_ping_meters: number
  calculated_velocity_mps: number
  predicted_delay_minutes?: number
  ml_confidence?: number
}

export interface LiveBusData extends BusEvent {
  features?: BusFeatures
  delay_minutes: number
  next_stop_delay_minutes?: number
  eta_minutes: number
  current_stop?: BusStopSummary
  next_stop?: BusStopSummary
  upcoming_stops?: BusStopSummary[]
}

export interface BusStopSummary {
  stopId: string
  name: string
  latitude: number
  longitude: number
  sequenceOrder: number
  arrivalOffsetMinutes: number | null
  liveEtaMinutes?: number | null
}

export interface BusStop {
  stop_id: string
  name: string
  latitude: number
  longitude: number
  scheduled_arrival: string
}

export interface BusRoute {
  route_id: string
  route_name: string
  bus_id: string
  stops: BusStop[]
}

export interface StudentProfile {
  student_id: string
  name: string
  assigned_route_id: string
  stop_id: string
}

export interface DriverProfile {
  driver_id: string
  name: string
  assigned_bus_id: string
  shift_status: "ACTIVE" | "IDLE" | "COMPLETED"
}

// Multi-Shuttle Fleet Type
export interface FleetShuttle {
  id: string
  name: string
  category: "Express" | "Rapid" | "Shuttle"
  routeId: string
  routeName: string
  driverName: string
  latitude: number
  longitude: number
  bearing: number
  speedKmh: number
  status: BusStatus
  color: string
  accentHex: string
  etaMinutes: number
  delayMinutes: number
  occupancyPct: number
  nextStopName: string
}

// Traffic & AI Detour Intelligence
export interface TrafficCongestionReport {
  isChoked: boolean
  chokedLocation: string
  severity: "LOW" | "MODERATE" | "SEVERE"
  normalSpeedKmh: number
  currentSpeedKmh: number
  delayAddedMinutes: number
  alternateRouteName: string
  divergencePoint: string
  detourVia: string
  detourDistanceKm: number
  timeSavedMinutes: number
}
