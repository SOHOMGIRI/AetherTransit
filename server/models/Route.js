const mongoose = require('mongoose');

const StopSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  lat: { type: Number, required: true },
  lng: { type: Number, required: true },
  order: { type: Number, required: true },
  etaOffsetMin: { type: Number, default: 0 },
  isPickupZone: { type: Boolean, default: true },
});

const RouteSchema = new mongoose.Schema({
  routeId: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  origin: {
    type: String,
    required: true,
  },
  destination: {
    type: String,
    required: true,
  },
  distanceKm: {
    type: Number,
    required: true,
  },
  typicalDurationMin: {
    type: Number,
    required: true,
  },
  stops: [StopSchema],
  primaryPath: {
    type: [[Number]], // Array of [lat, lng]
    default: [],
  },
  detourPath: {
    type: [[Number]], // Alternate route [lat, lng]
    default: [],
  },
  congestionBottleneck: {
    active: { type: Boolean, default: false },
    name: { type: String, default: 'Majerhat Flyover Bottleneck' },
    lat: { type: Number, default: 22.5186 },
    lng: { type: Number, default: 88.3195 },
    delayAdditionMin: { type: Number, default: 14 },
    reason: { type: String, default: 'Heavy Metro expansion gridlock and lane restriction' },
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Route', RouteSchema);
