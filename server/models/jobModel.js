const mongoose = require('mongoose');

const jobSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['Full-time', 'Part-time', 'Internship', 'Contract'],
      default: 'Full-time',
    },
    salaryMin: {
      type: Number,
      default: 0,
    },
    salaryMax: {
      type: Number,
      default: 0,
    },
    experienceLevel: {
      type: String,
      default: 'Entry Level',
    },
    educationLevel: {
      type: String,
      default: 'Any',
    },
    requirements: [String],
    termsAndConditions: {
      type: String,
      default: ''
    },
    applicationDeadline: {
      type: Date,
      default: null
    },
    applications: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        resume: String,
        status: {
          type: String,
          enum: ['Pending', 'Reviewed', 'Accepted', 'Rejected'],
          default: 'Pending',
        },
        appliedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Job = mongoose.model('Job', jobSchema);

module.exports = Job;
