const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 6,
    select: false,
  },
  role: {
    type: String,
    enum: ['student', 'driver', 'admin', 'STUDENT', 'DRIVER', 'ADMIN'],
    set: (v) => (v ? v.toLowerCase() : 'student'),
    default: 'student',
  },
  studentId: {
    type: String,
    default: 'STCET-CSE-2026-084',
  },
  phone: {
    type: String,
    default: '+91 98765 43210',
  },
  assignedBusId: {
    type: String,
    default: 'B01',
  },
  passDetails: {
    smartCardNumber: {
      type: String,
      default: 'AETH-2026-STC-991',
    },
    tier: {
      type: String,
      default: 'Semester Pass · Unlimited Tier',
    },
    validUntil: {
      type: String,
      default: 'December 2026',
    },
    balanceRides: {
      type: Number,
      default: 120,
    },
    verified: {
      type: Boolean,
      default: true,
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
