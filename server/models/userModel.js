const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
      enum: ['jobseeker', 'organisation', 'admin'],
      default: 'jobseeker',
    },
    isApproved: {
      type: Boolean,
      default: false,
    },
    contact: {
      type: String,
    },
    profile: {
      // Common profile fields
      fullName: String,
      bio: String,
      avatar: String,
      // Jobseeker specific
      resume: String,
      resumeData: Object,
      skills: [String],
      education: [
        {
          school: String,
          degree: String,
          fieldOfStudy: String,
          from: Date,
          to: Date,
          current: Boolean,
          description: String,
        },
      ],
      experience: [
        {
          title: String,
          company: String,
          location: String,
          from: Date,
          to: Date,
          current: Boolean,
          description: String,
        },
      ],
      // Organisation specific
      companyName: String,
      website: String,
      location: String,
      description: String,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre('save', async function () {
  if (!this.isModified('password')) {
    return;
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
