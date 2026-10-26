const mongoose = require('mongoose');
const dns = require('dns');

// Configure public DNS servers to guarantee SRV record resolution across all local network environments
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {
  console.warn('[AetherTransit DB] Note: Custom DNS set fallback:', e.message);
}

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });

    console.log(`[AetherTransit DB] MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`[AetherTransit DB Error] ${error.message}`);
    console.warn('[AetherTransit DB] Running with in-memory fallback telemetry if DB connection fails.');
    return null;
  }
};

mongoose.connection.on('disconnected', () => {
  console.warn('[AetherTransit DB] MongoDB connection disconnected.');
});

mongoose.connection.on('reconnected', () => {
  console.log('[AetherTransit DB] MongoDB reconnected.');
});

module.exports = connectDB;
