const User = require('../models/userModel');
const { generateToken } = require('../utils/generateToken');
const sendEmail = require('../utils/email');
const { getOtpTemplate, getJobseekerWelcomeTemplate, getOrgWelcomeTemplate } = require('../utils/emailTemplates');

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
const registerUser = async (req, res) => {
  const { username, email, password, role, contact, fullName } = req.body;

  // Remove any previous unverified accounts with the same email or username
  await User.deleteMany({ email, isVerified: false });
  await User.deleteMany({ username, isVerified: false });

  const userExists = await User.findOne({ $or: [{ email }, { username }] });

  if (userExists) {
    if (userExists.email === email) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }
    return res.status(400).json({ message: 'Username is already taken' });
  }

  const user = await User.create({
    username,
    email,
    password,
    role,
    contact,
    profile: { fullName: fullName || '' },
    isApproved: role === 'organisation' ? false : true,
    isVerified: false,
  });

  if (user) {
    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save();

    // Send OTP email
    try {
      await sendEmail({
        email: user.email,
        subject: 'Verify your Career Portal Account',
        message: `Your OTP for account verification is: ${otp}\nThis OTP is valid for 10 minutes.`,
        html: getOtpTemplate(otp),
      });
    } catch (error) {
      console.error('Email could not be sent', error);
    }

    res.status(201).json({
      message: 'Registration successful. Please verify your email with the OTP sent to you.',
      userId: user._id,
      email: user.email,
      requireOTP: true
    });
  } else {
    res.status(400).json({ message: 'Invalid user data' });
  }
};

// @desc    Verify OTP
// @route   POST /api/users/verify-otp
// @access  Public
const verifyOTP = async (req, res) => {
  const { userId, otp } = req.body;

  const user = await User.findById(userId);

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  if (user.isVerified) {
    return res.status(400).json({ message: 'User already verified' });
  }

  if (user.otp !== otp || user.otpExpires < Date.now()) {
    return res.status(400).json({ message: 'Invalid or expired OTP' });
  }

  user.isVerified = true;
  user.otp = undefined;
  user.otpExpires = undefined;
  await user.save();

  // Send Welcome Email for jobseekers
  if (user.role === 'jobseeker') {
    try {
      await sendEmail({
        email: user.email,
        subject: 'Welcome to Career Portal!',
        message: `Hi ${user.profile?.fullName || user.username},\n\nWelcome to Career Portal! Your account has been successfully verified. You can now start applying for jobs and building your career profile.\n\nBest Regards,\nThe Career Portal Team`,
        html: getJobseekerWelcomeTemplate(user.profile?.fullName || user.username),
      });
    } catch (error) {
      console.error('Welcome email could not be sent', error);
    }
  }

  res.json({
    _id: user._id,
    username: user.username,
    email: user.email,
    role: user.role,
    profile: user.profile,
    token: generateToken(user._id),
  });
};

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const authUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    if (!user.isVerified) {
      // Resend OTP logic
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      user.otp = otp;
      user.otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
      await user.save();

      try {
        await sendEmail({
          email: user.email,
          subject: 'Verify your Career Portal Account',
          message: `Your OTP for account verification is: ${otp}\nThis OTP is valid for 10 minutes.`,
          html: getOtpTemplate(otp),
        });
      } catch (error) {
        console.error('Email could not be sent', error);
      }

      return res.status(401).json({ message: 'Please verify your email first. A new OTP has been sent.', requireOTP: true, userId: user._id });
    }
    if (user.role === 'organisation' && !user.isApproved) {
      return res.status(401).json({ message: 'Organisation account pending admin approval' });
    }
    
    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      profile: user.profile,
      token: generateToken(user._id),
    });
  } else {
    res.status(401).json({ message: 'Invalid email or password' });
  }
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      profile: user.profile,
    });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.username = req.body.username || user.username;
    user.email = req.body.email || user.email;
    if (req.body.password) {
      user.password = req.body.password;
    }
    
    // Update profile fields
    if (req.body.profile) {
      const oldAvatar = user.profile?.avatar;
      
      // If the avatar is changing, we can potentially delete the old one here (or just rely on the frontend to delete it if we want, but doing it in the backend requires cloudinary sdk)
      // Since we don't have cloudinary SDK in the backend, we should just properly merge the profile fields.
      user.profile = { 
        ...(user.profile ? user.profile.toObject() : {}), 
        ...req.body.profile 
      };
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      role: updatedUser.role,
      profile: updatedUser.profile,
      token: generateToken(updatedUser._id),
    });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

// @desc    Get all users
// @route   GET /api/users/all
// @access  Private/Admin
const getUsers = async (req, res) => {
  const users = await User.find({});
  res.json(users);
};

// @desc    Approve user
// @route   PUT /api/users/:id/approve
// @access  Private/Admin
const approveUser = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) {
    user.isApproved = true;
    await user.save();

    // Send Welcome Email to Organisation
    try {
      await sendEmail({
        email: user.email,
        subject: 'Your Organisation Account is Approved!',
        message: `Hi ${user.profile?.fullName || user.username},\n\nGood news! Your organisation account on Career Portal has been approved by the admin. You can now log in and start posting jobs.\n\nBest Regards,\nThe Career Portal Team`,
        html: getOrgWelcomeTemplate(user.profile?.fullName || user.username),
      });
    } catch (error) {
      console.error('Org welcome email could not be sent', error);
    }

    res.json({ message: 'User approved successfully' });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

module.exports = {
  registerUser,
  authUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  approveUser,
  verifyOTP,
};
