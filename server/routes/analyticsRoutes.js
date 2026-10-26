const express = require('express');
const router = express.Router();
const { getAnalyticsSummary } = require('../controllers/analyticsController');
const { apiLimiter } = require('../middleware/security');

router.get('/summary', apiLimiter, getAnalyticsSummary);

module.exports = router;
