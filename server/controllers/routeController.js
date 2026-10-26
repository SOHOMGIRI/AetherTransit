const Route = require('../models/Route');
const { getBottleneckState } = require('../services/socketService');

const DEFAULT_ROUTES = [
  {
    routeId: 'R01',
    name: 'Taratala - Majerhat - STCET Express',
    origin: 'Brace Bridge Terminal',
    destination: 'STCET Campus Gate 1',
    distanceKm: 4.8,
    typicalDurationMin: 18,
    stops: [
      { id: 'stop-brace', name: 'Brace Bridge Terminal', lat: 22.5145, lng: 88.3120, order: 1, etaOffsetMin: 0 },
      { id: 'stop-taratala', name: 'Taratala Crossing', lat: 22.5168, lng: 88.3160, order: 2, etaOffsetMin: 4 },
      { id: 'stop-majerhat', name: 'Majerhat Station', lat: 22.5186, lng: 88.3195, order: 3, etaOffsetMin: 8 },
      { id: 'stop-alipore-tri', name: 'New Alipore Triangle', lat: 22.5220, lng: 88.3245, order: 4, etaOffsetMin: 12 },
      { id: 'stop-chetla', name: 'Chetla Central', lat: 22.5285, lng: 88.3290, order: 5, etaOffsetMin: 15 },
      { id: 'stop-stcet', name: 'STCET Campus Gate 1', lat: 22.5342, lng: 88.3265, order: 6, etaOffsetMin: 18 },
    ],
  },
  {
    routeId: 'R02',
    name: 'Behala Tram Depot - STCET Rapid',
    origin: 'Sakherbazar',
    destination: 'STCET Campus Gate 1',
    distanceKm: 6.2,
    typicalDurationMin: 24,
    stops: [
      { id: 'stop-sakher', name: 'Sakherbazar', lat: 22.4950, lng: 88.3100, order: 1, etaOffsetMin: 0 },
      { id: 'stop-behala', name: 'Behala Tram Depot', lat: 22.5020, lng: 88.3130, order: 2, etaOffsetMin: 6 },
      { id: 'stop-tara-south', name: 'Taratala South', lat: 22.5120, lng: 88.3150, order: 3, etaOffsetMin: 12 },
      { id: 'stop-alipore-c', name: 'New Alipore Block C', lat: 22.5240, lng: 88.3220, order: 4, etaOffsetMin: 18 },
      { id: 'stop-stcet', name: 'STCET Campus Gate 1', lat: 22.5342, lng: 88.3265, order: 5, etaOffsetMin: 24 },
    ],
  },
  {
    routeId: 'R03',
    name: 'Exide - Alipore Zoo - STCET Corridor',
    origin: 'Exide Crossing',
    destination: 'STCET Campus Gate 1',
    distanceKm: 5.1,
    typicalDurationMin: 16,
    stops: [
      { id: 'stop-exide', name: 'Exide Crossing', lat: 22.5390, lng: 88.3370, order: 1, etaOffsetMin: 0 },
      { id: 'stop-alipore-zoo', name: 'Alipore Zoo Crossing', lat: 22.5280, lng: 88.3320, order: 2, etaOffsetMin: 5 },
      { id: 'stop-burdwan', name: 'Burdwan Road', lat: 22.5230, lng: 88.3270, order: 3, etaOffsetMin: 10 },
      { id: 'stop-stcet', name: 'STCET Campus Gate 1', lat: 22.5342, lng: 88.3265, order: 4, etaOffsetMin: 16 },
    ],
  },
];

// @desc    Get all campus transit routes
// @route   GET /api/routes
exports.getRoutes = async (req, res, next) => {
  try {
    const bottleneck = getBottleneckState();
    res.json({
      success: true,
      count: DEFAULT_ROUTES.length,
      data: DEFAULT_ROUTES,
      bottleneck,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single route by ID
// @route   GET /api/routes/:routeId
exports.getRouteById = async (req, res, next) => {
  try {
    const route = DEFAULT_ROUTES.find((r) => r.routeId.toLowerCase() === req.params.routeId.toLowerCase());
    if (!route) {
      return res.status(404).json({ success: false, message: `Route ${req.params.routeId} not found` });
    }
    res.json({
      success: true,
      data: route,
    });
  } catch (error) {
    next(error);
  }
};
