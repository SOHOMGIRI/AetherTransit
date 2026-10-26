const { Server } = require('socket.io');
const Bus = require('../models/Bus');
const Route = require('../models/Route');
const { predictTransitTelemetry, calculateHaversineDistance } = require('./mlService');

// Initial fleet telemetry in Kolkata coordinates (Taratala - New Alipore - STCET corridor)
const FLEET_STATE = {
  B01: {
    busId: 'B01',
    name: 'Shuttle B01 (Taratala Express)',
    routeId: 'R01',
    status: 'on_route',
    driverName: 'Rajesh Kumar',
    driverPhone: '+91 98301 22345',
    capacity: 45,
    occupancy: 28,
    speed: 34,
    heading: 62,
    batteryLevel: 88,
    fuelLevel: 92,
    coordinates: { lat: 22.5186, lng: 88.3195 },
    nextStopId: 'stop-taratala',
    nextStopName: 'Taratala Crossing',
    etaMinutes: 4,
    delayMinutes: 0,
    isDetourActive: false,
    stepIndex: 0,
    direction: 1,
  },
  B02: {
    busId: 'B02',
    name: 'Shuttle B02 (Behala Rapid)',
    routeId: 'R02',
    status: 'on_route',
    driverName: 'Amitava Roy',
    driverPhone: '+91 98312 33456',
    capacity: 40,
    occupancy: 34,
    speed: 28,
    heading: 45,
    batteryLevel: 74,
    fuelLevel: 81,
    coordinates: { lat: 22.5020, lng: 88.3130 },
    nextStopId: 'stop-behala',
    nextStopName: 'Behala Tram Depot',
    etaMinutes: 7,
    delayMinutes: 2,
    isDetourActive: false,
    stepIndex: 0,
    direction: 1,
  },
  B03: {
    busId: 'B03',
    name: 'Shuttle B03 (Alipore Corridor)',
    routeId: 'R03',
    status: 'on_route',
    driverName: 'Subhasish Sen',
    driverPhone: '+91 98305 77890',
    capacity: 35,
    occupancy: 19,
    speed: 38,
    heading: 110,
    batteryLevel: 94,
    fuelLevel: 89,
    coordinates: { lat: 22.5280, lng: 88.3320 },
    nextStopId: 'stop-alipore',
    nextStopName: 'Alipore Zoo Crossing',
    etaMinutes: 3,
    delayMinutes: 0,
    isDetourActive: false,
    stepIndex: 0,
    direction: 1,
  },
};

// Route waypoints
const WAYPOINTS = {
  B01_PRIMARY: [
    { lat: 22.5145, lng: 88.3120, name: 'Brace Bridge Terminal' },
    { lat: 22.5168, lng: 88.3160, name: 'Taratala Crossing' },
    { lat: 22.5186, lng: 88.3195, name: 'Majerhat Station' },
    { lat: 22.5220, lng: 88.3245, name: 'New Alipore Triangle' },
    { lat: 22.5285, lng: 88.3290, name: 'Chetla Central' },
    { lat: 22.5342, lng: 88.3265, name: 'STCET Campus Gate 1' },
  ],
  B01_DETOUR: [
    { lat: 22.5145, lng: 88.3120, name: 'Brace Bridge Terminal' },
    { lat: 22.5168, lng: 88.3160, name: 'Taratala Crossing' },
    { lat: 22.5225, lng: 88.3140, name: 'Hide Road North' },
    { lat: 22.5290, lng: 88.3180, name: 'Remount Road Flyover' },
    { lat: 22.5320, lng: 88.3230, name: 'Alipore Canal Bypass' },
    { lat: 22.5342, lng: 88.3265, name: 'STCET Campus Gate 1' },
  ],
  B02_PATH: [
    { lat: 22.4950, lng: 88.3100, name: 'Sakherbazar' },
    { lat: 22.5020, lng: 88.3130, name: 'Behala Tram Depot' },
    { lat: 22.5120, lng: 88.3150, name: 'Taratala South' },
    { lat: 22.5240, lng: 88.3220, name: 'New Alipore Block C' },
    { lat: 22.5342, lng: 88.3265, name: 'STCET Campus Gate 1' },
  ],
  B03_PATH: [
    { lat: 22.5390, lng: 88.3370, name: 'Exide Crossing' },
    { lat: 22.5280, lng: 88.3320, name: 'Alipore Zoo Crossing' },
    { lat: 22.5230, lng: 88.3270, name: 'Burdwan Road' },
    { lat: 22.5342, lng: 88.3265, name: 'STCET Campus Gate 1' },
  ],
};

let ioInstance = null;
let simulationInterval = null;
let isBottleneckSimulated = false;

function initSocket(server) {
  ioInstance = new Server(server, {
    cors: {
      origin: '*', // Allow all client origins in dev/staging
      methods: ['GET', 'POST'],
    },
    transports: ['websocket', 'polling'],
  });

  ioInstance.on('connection', (socket) => {
    console.log(`[Socket.io] Client connected: ${socket.id}`);

    // Send current fleet state immediately on connection
    socket.emit('fleet:initial-state', {
      fleet: Object.values(FLEET_STATE),
      bottleneck: {
        active: isBottleneckSimulated,
        name: 'Majerhat Flyover Bottleneck',
        lat: 22.5186,
        lng: 88.3195,
        delayAdditionMin: 14,
      },
    });

    // Handle driver throttle slider update
    socket.on('driver:set-speed', ({ busId, speed }) => {
      if (FLEET_STATE[busId]) {
        FLEET_STATE[busId].speed = Math.max(0, Math.min(80, Number(speed)));
        console.log(`[Socket.io] Bus ${busId} speed updated to ${speed} km/h by driver`);
        ioInstance.emit('bus:telemetry-update', FLEET_STATE[busId]);
      }
    });

    // Handle driver detour toggle
    socket.on('driver:toggle-detour', ({ busId, isDetourActive }) => {
      if (FLEET_STATE[busId]) {
        FLEET_STATE[busId].isDetourActive = !!isDetourActive;
        console.log(`[Socket.io] Bus ${busId} detour switched to: ${isDetourActive}`);
        ioInstance.emit('bus:telemetry-update', FLEET_STATE[busId]);
        ioInstance.emit('fleet:update', Object.values(FLEET_STATE));
      }
    });

    // Handle traffic bottleneck toggle (from dashboard or admin)
    socket.on('simulation:toggle-choke', ({ active }) => {
      isBottleneckSimulated = typeof active === 'boolean' ? active : !isBottleneckSimulated;
      console.log(`[Socket.io] Majerhat Bottleneck active: ${isBottleneckSimulated}`);
      
      // Update B01 delay via ML engine
      const bus = FLEET_STATE['B01'];
      const ml = predictTransitTelemetry({
        currentLat: bus.coordinates.lat,
        currentLng: bus.coordinates.lng,
        targetLat: 22.5342,
        targetLng: 88.3265,
        currentSpeed: bus.speed,
        occupancy: bus.occupancy,
        isBottleneckActive: isBottleneckSimulated,
        isDetourActive: bus.isDetourActive,
      });

      bus.delayMinutes = ml.predictedDelayMin;
      bus.etaMinutes = ml.dynamicEtaMin;
      bus.status = isBottleneckSimulated && !bus.isDetourActive ? 'choked' : 'on_route';

      ioInstance.emit('route:congestion-alert', {
        active: isBottleneckSimulated,
        bottleneck: {
          active: isBottleneckSimulated,
          name: 'Majerhat Flyover Bottleneck',
          lat: 22.5186,
          lng: 88.3195,
          delayAdditionMin: 14,
          reason: 'Metro construction lane blockage',
        },
        impactedBus: bus,
      });
      ioInstance.emit('bus:telemetry-update', bus);
      ioInstance.emit('fleet:update', Object.values(FLEET_STATE));
    });

    socket.on('disconnect', () => {
      console.log(`[Socket.io] Client disconnected: ${socket.id}`);
    });
  });

  // Start background fleet simulation loop (advances buses along waypoints)
  startSimulationLoop();

  return ioInstance;
}

function startSimulationLoop() {
  if (simulationInterval) clearInterval(simulationInterval);

  simulationInterval = setInterval(() => {
    // 1. Advance Shuttle B01
    advanceBus('B01', FLEET_STATE.B01.isDetourActive ? WAYPOINTS.B01_DETOUR : WAYPOINTS.B01_PRIMARY);

    // 2. Advance Shuttle B02
    advanceBus('B02', WAYPOINTS.B02_PATH);

    // 3. Advance Shuttle B03
    advanceBus('B03', WAYPOINTS.B03_PATH);

    // Broadcast fleet updates to all clients
    if (ioInstance) {
      ioInstance.emit('fleet:update', Object.values(FLEET_STATE));
    }
  }, 3000); // Pulse every 3 seconds for smooth telemetry
}

function advanceBus(busId, path) {
  const bus = FLEET_STATE[busId];
  if (!bus || path.length < 2) return;

  const speed = bus.speed || 30;
  if (speed === 0) return; // Bus stopped at signal or stop

  // Step fraction based on speed
  const stepIncrement = (speed / 35) * 0.08;
  bus.stepIndex = (bus.stepIndex || 0) + stepIncrement;

  const numSegments = path.length - 1;
  const totalLength = numSegments;
  const loopPos = bus.stepIndex % (totalLength * 2);
  const forward = loopPos < totalLength;
  const effectivePos = forward ? loopPos : totalLength * 2 - loopPos;

  const segIndex = Math.min(numSegments - 1, Math.floor(effectivePos));
  const segFraction = effectivePos - segIndex;

  const p1 = path[segIndex];
  const p2 = path[segIndex + 1];

  // Interpolated coordinates
  const newLat = p1.lat + (p2.lat - p1.lat) * segFraction;
  const newLng = p1.lng + (p2.lng - p1.lng) * segFraction;

  bus.coordinates = {
    lat: Math.round(newLat * 1000000) / 1000000,
    lng: Math.round(newLng * 1000000) / 1000000,
  };

  // Next stop identifier
  const targetStop = forward ? p2 : p1;
  bus.nextStopName = targetStop.name || 'En Route';

  // Calculate ML predictions
  const ml = predictTransitTelemetry({
    currentLat: bus.coordinates.lat,
    currentLng: bus.coordinates.lng,
    targetLat: 22.5342,
    targetLng: 88.3265,
    currentSpeed: bus.speed,
    occupancy: bus.occupancy,
    capacity: bus.capacity,
    isBottleneckActive: busId === 'B01' ? isBottleneckSimulated : false,
    isDetourActive: bus.isDetourActive,
  });

  bus.etaMinutes = ml.dynamicEtaMin;
  bus.delayMinutes = ml.predictedDelayMin;
  bus.status = isBottleneckSimulated && busId === 'B01' && !bus.isDetourActive ? 'choked' : 'on_route';

  // Update battery / fuel slightly
  if (Math.random() < 0.05) {
    bus.batteryLevel = Math.max(15, bus.batteryLevel - 0.1);
  }
}

function getFleetState() {
  return Object.values(FLEET_STATE);
}

function getBusById(busId) {
  return FLEET_STATE[busId] || null;
}

function getBottleneckState() {
  return {
    active: isBottleneckSimulated,
    name: 'Majerhat Flyover Bottleneck',
    lat: 22.5186,
    lng: 88.3195,
    delayAdditionMin: 14,
    reason: 'Metro construction lane blockage',
  };
}

module.exports = {
  initSocket,
  getFleetState,
  getBusById,
  getBottleneckState,
  FLEET_STATE,
};
