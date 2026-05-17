const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('./models/userModel.js');

dotenv.config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const adminExists = await User.findOne({ email: 'admin@system.com' });
    if (adminExists) {
      console.log('Old admin found, removing...');
      await User.deleteOne({ email: 'admin@system.com' });
    }

    const adminUser = new User({
      username: 'SystemAdmin',
      email: 'admin@system.com',
      password: 'admin@123456',
      role: 'admin',
      isApproved: true
    });

    await adminUser.save();
    console.log('Admin created successfully!');
    console.log('Email: admin@system.com');
    console.log('Password: admin@123456');
    process.exit();
  } catch (error) {
    console.error('Error seeding admin:', error);
    process.exit(1);
  }
};

seedAdmin();
