const express = require('express');
const router = express.Router();
const { getAllBuses, getBusById, updateThrottle, toggleDetour } = require('../controllers/busController');
const { apiLimiter } = require('../middleware/security');

router.get('/', apiLimiter, getAllBuses);
router.get('/:busId', apiLimiter, getBusById);
router.post('/:busId/throttle', updateThrottle);
router.post('/:busId/toggle-detour', toggleDetour);

module.exports = router;
