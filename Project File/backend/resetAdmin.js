// Run this script with: node resetAdmin.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/learnhub';
const userModel = require('./schemas/userModel');

async function resetAdmin() {
  await mongoose.connect(MONGO_URI);
  const adminEmail = 'admin@admin.com';
  const adminType = 'Admin';
  const adminPassword = '$2b$10$wQn6Qw6Qw6Qw6Qw6Qw6QwOQw6Qw6Qw6Qw6Qw6Qw6Qw6Qw6Qw6Qw6'; // bcrypt for 'admin123'

  // Remove all admins except the default
  await userModel.deleteMany({ type: adminType, email: { $ne: adminEmail } });

  // Remove duplicate admin@admin.com if any
  const admins = await userModel.find({ email: adminEmail, type: adminType });
  if (admins.length > 1) {
    // Keep only one
    await userModel.deleteMany({ email: adminEmail, type: adminType });
  }

  // Ensure the admin exists
  let admin = await userModel.findOne({ email: adminEmail, type: adminType });
  if (!admin) {
    admin = await userModel.create({
      name: 'Admin',
      email: adminEmail,
      password: adminPassword,
      type: adminType
    });
    console.log('Admin user created: admin@admin.com / admin123');
  } else {
    // Reset password to default
    admin.password = adminPassword;
    await admin.save();
    console.log('Admin user password reset to default.');
  }
  mongoose.disconnect();
}

resetAdmin();
