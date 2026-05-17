const mongoose = require('mongoose');

const otpSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  userData: {
    type: Object,
    required: true,
  },
  createdAt: {
    type: Date,
    expires: 600, // Automatically delete document after 10 minutes
    default: Date.now,
  },
});

module.exports = mongoose.model('OTP', otpSchema);
