const { getFleetState, getBottleneckState } = require('../services/socketService');
const { isPeakHour } = require('../services/mlService');

// @desc    Get fleet sustainability & predictive analytics summary
// @route   GET /api/analytics/summary
exports.getAnalyticsSummary = async (req, res, next) => {
  try {
    const fleet = getFleetState();
    const bottleneck = getBottleneckState();
    const peak = isPeakHour();

    const totalOccupancy = fleet.reduce((sum, b) => sum + (b.occupancy || 0), 0);
    const avgSpeed = Math.round(fleet.reduce((sum, b) => sum + (b.speed || 0), 0) / (fleet.length || 1));
    const avgDelay = Math.round((fleet.reduce((sum, b) => sum + (b.delayMinutes || 0), 0) / (fleet.length || 1)) * 10) / 10;

    // Eco-metric: 148 rides consolidated today + current live passengers
    const totalTripsToday = 148 + totalOccupancy;
    const co2SavedTodayKg = Math.round((42.6 + totalOccupancy * 0.28) * 10) / 10;

    res.json({
      success: true,
      timestamp: new Date().toISOString(),
      sustainability: {
        co2SavedKg: co2SavedTodayKg,
        privateTripsPrevented: totalTripsToday,
        treesEquivalent: Math.round(co2SavedTodayKg * 0.048 * 10) / 10,
        fuelConservedLiters: Math.round(co2SavedTodayKg * 0.43 * 10) / 10,
      },
      performance: {
        fleetSize: fleet.length,
        activeOnRoute: fleet.filter((b) => b.status === 'on_route').length,
        chokedCount: fleet.filter((b) => b.status === 'choked').length,
        onTimeReliabilityPct: bottleneck.active ? 88.4 : 96.2,
        averageSpeedKmh: avgSpeed,
        averageDelayMin: avgDelay,
        corridorCongestionLevel: bottleneck.active ? 'Severe Bottleneck' : peak ? 'Moderate Peak' : 'Free Flow',
      },
      bottleneck,
    });
  } catch (error) {
    next(error);
  }
};
