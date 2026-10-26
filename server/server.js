const path = require('path');
const dns = require('dns');

// Public DNS to guarantee MongoDB SRV resolution
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {
  console.warn('[AetherTransit] DNS set notice:', e.message);
}

require('dotenv').config({ path: path.join(__dirname, '.env') });
const http = require('http');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const connectDB = require('./config/db');
const { helmetConfig, errorHandler } = require('./middleware/security');
const { initSocket } = require('./services/socketService');

// Models for initial seeding
const User = require('./models/User');

const app = express();
const server = http.createServer(app);

// Initialize Socket.io
initSocket(server);

// Security Middleware
app.use(helmetConfig);
app.use(
  cors({
    origin: '*',
    credentials: true,
  })
);

// Logging & Body Parsers
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'AetherTransit Telemetry Core',
    version: '1.0.0',
    database: require('mongoose').connection.readyState === 1 ? 'connected' : 'disconnected',
  });
});

// Mount API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/buses', require('./routes/busRoutes'));
app.use('/api/routes', require('./routes/routeRoutes'));
app.use('/api/analytics', require('./routes/analyticsRoutes'));

// 404 Route Handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `API endpoint ${req.originalUrl} not found on this server.`,
  });
});

// Global Error Handler
app.use(errorHandler);

// Seed Initial Admin & Student Data
async function autoSeedDemoData() {
  try {
    const studentCount = await User.countDocuments();
    if (studentCount === 0) {
      console.log('[AetherTransit DB] Seeding default accounts into MongoDB Atlas...');
      await User.create([
        {
          name: 'Sohom Giri',
          email: 'sohom@aethertransit.io',
          password: 'password123',
          role: 'student',
          studentId: 'STCET-CSE-2026-084',
          phone: '+91 98301 44556',
          passDetails: {
            smartCardNumber: 'AETH-2026-STC-991',
            tier: 'Semester Pass · Unlimited Tier',
            validUntil: 'December 2026',
            balanceRides: 120,
            verified: true,
          },
        },
        {
          name: 'Rajesh Kumar',
          email: 'driver@aethertransit.io',
          password: 'password123',
          role: 'driver',
          studentId: 'STAFF-DRV-01',
          phone: '+91 98301 22345',
          assignedBusId: 'B01',
        },
      ]);
      console.log('[AetherTransit DB] Default student & driver accounts successfully seeded!');
    }
  } catch (err) {
    console.warn('[AetherTransit DB] Auto-seed notice:', err.message);
  }
}

const PORT = process.env.PORT || 5000;

// Connect to MongoDB and start server
connectDB().then(() => {
  autoSeedDemoData();
  server.listen(PORT, () => {
    console.log(`\n======================================================`);
    console.log(`  🚀 AETHERTRANSIT BACKEND ENGINE ONLINE`);
    console.log(`  📡 Port: ${PORT} | Mode: ${process.env.NODE_ENV || 'development'}`);
    console.log(`  🔗 REST API:   http://localhost:${PORT}/api/health`);
    console.log(`  ⚡ Socket.io:  ws://localhost:${PORT}`);
    console.log(`======================================================\n`);
  });
});

// Process signal handlers
process.on('SIGINT', () => {
  console.log('\nGracefully shutting down AetherTransit server...');
  server.close(() => {
    process.exit(0);
  });
});
