const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback_secret_key', {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

// @desc    Register a new student/user
// @route   POST /api/auth/register
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role, studentId, phone } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists with this email' });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: role || 'student',
      studentId: studentId || `STCET-CSE-2026-${Math.floor(100 + Math.random() * 900)}`,
      phone: phone || '+91 98765 43210',
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        studentId: user.studentId,
        phone: user.phone,
        passDetails: user.passDetails,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        studentId: user.studentId,
        phone: user.phone,
        passDetails: user.passDetails,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
exports.getMe = async (req, res) => {
  res.json({
    success: true,
    user: req.user,
  });
};

// @desc    Seed demo accounts for interview live demo
// @route   POST /api/auth/seed-demo
exports.seedDemoAccounts = async (req, res, next) => {
  try {
    // 1. Sohom Giri (Student)
    let student = await User.findOne({ email: 'sohom@aethertransit.io' });
    if (!student) {
      student = await User.create({
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
      });
    }

    // 2. Rajesh Kumar (Driver)
    let driver = await User.findOne({ email: 'driver@aethertransit.io' });
    if (!driver) {
      driver = await User.create({
        name: 'Rajesh Kumar',
        email: 'driver@aethertransit.io',
        password: 'password123',
        role: 'driver',
        studentId: 'STAFF-DRV-01',
        phone: '+91 98301 22345',
        assignedBusId: 'B01',
      });
    }

    res.json({
      success: true,
      message: 'Demo accounts verified in MongoDB Atlas',
      demoAccounts: {
        student: { email: 'sohom@aethertransit.io', password: 'password123' },
        driver: { email: 'driver@aethertransit.io', password: 'password123' },
      },
    });
  } catch (error) {
    next(error);
  }
};
