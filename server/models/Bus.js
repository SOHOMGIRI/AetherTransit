const mongoose = require('mongoose');

const BusSchema = new mongoose.Schema({
  busId: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  routeId: {
    type: String,
    required: true,
    default: 'R01',
  },
  status: {
    type: String,
    enum: ['on_route', 'idle', 'choked', 'detoured', 'maintenance'],
    default: 'on_route',
  },
  driverName: {
    type: String,
    default: 'Rajesh Kumar',
  },
  driverPhone: {
    type: String,
    default: '+91 98301 22345',
  },
  capacity: {
    type: Number,
    default: 45,
  },
  currentOccupancy: {
    type: Number,
    default: 28,
  },
  speed: {
    type: Number, // km/h
    default: 34,
  },
  heading: {
    type: Number, // degrees 0-360
    default: 65,
  },
  batteryLevel: {
    type: Number, // percent (for EV shuttles)
    default: 88,
  },
  fuelLevel: {
    type: Number,
    default: 92,
  },
  coordinates: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  nextStopId: {
    type: String,
    default: 'stop-taratala',
  },
  nextStopName: {
    type: String,
    default: 'Taratala Crossing',
  },
  etaMinutes: {
    type: Number,
    default: 4,
  },
  delayMinutes: {
    type: Number,
    default: 0,
  },
  isDetourActive: {
    type: Boolean,
    default: false,
  },
  lastPing: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Bus', BusSchema);
