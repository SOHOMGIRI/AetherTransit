const express = require('express');
const router = express.Router();
const { getRoutes, getRouteById } = require('../controllers/routeController');
const { apiLimiter } = require('../middleware/security');

router.get('/', apiLimiter, getRoutes);
router.get('/:routeId', apiLimiter, getRouteById);

module.exports = router;
