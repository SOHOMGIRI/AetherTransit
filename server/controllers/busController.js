const Bus = require('../models/Bus');
const { getFleetState, getBusById, getBottleneckState, FLEET_STATE } = require('../services/socketService');

// @desc    Get all fleet shuttles
// @route   GET /api/buses
exports.getAllBuses = async (req, res, next) => {
  try {
    const fleet = getFleetState();
    const bottleneck = getBottleneckState();
    res.json({
      success: true,
      count: fleet.length,
      data: fleet,
      bottleneck,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single bus telemetry
// @route   GET /api/buses/:busId
exports.getBusById = async (req, res, next) => {
  try {
    const bus = getBusById(req.params.busId);
    if (!bus) {
      return res.status(404).json({ success: false, message: `Bus with ID ${req.params.busId} not found` });
    }
    res.json({
      success: true,
      data: bus,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update driver throttle
// @route   POST /api/buses/:busId/throttle
exports.updateThrottle = async (req, res, next) => {
  try {
    const { speed } = req.body;
    const bus = getBusById(req.params.busId);
    if (!bus) {
      return res.status(404).json({ success: false, message: `Bus with ID ${req.params.busId} not found` });
    }

    bus.speed = Math.max(0, Math.min(80, Number(speed)));
    res.json({
      success: true,
      message: `Speed updated for ${req.params.busId}`,
      speed: bus.speed,
      data: bus,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle detour corridor
// @route   POST /api/buses/:busId/toggle-detour
exports.toggleDetour = async (req, res, next) => {
  try {
    const { isDetourActive } = req.body;
    const bus = getBusById(req.params.busId);
    if (!bus) {
      return res.status(404).json({ success: false, message: `Bus with ID ${req.params.busId} not found` });
    }

    bus.isDetourActive = typeof isDetourActive === 'boolean' ? isDetourActive : !bus.isDetourActive;
    res.json({
      success: true,
      message: `Detour mode set to ${bus.isDetourActive} for ${req.params.busId}`,
      isDetourActive: bus.isDetourActive,
      data: bus,
    });
  } catch (error) {
    next(error);
  }
};
