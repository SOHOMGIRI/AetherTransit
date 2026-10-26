const express = require('express');
const router = express.Router();
const { register, login, getMe, seedDemoAccounts } = require('../controllers/authController');
const { verifyToken } = require('../middleware/auth');
const { authLimiter } = require('../middleware/security');

router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);
router.get('/me', verifyToken, getMe);
router.post('/seed-demo', seedDemoAccounts);

module.exports = router;
