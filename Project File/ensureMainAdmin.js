const bcrypt = require('bcryptjs');
const userModel = require('./schemas/userModel');

async function ensureMainAdmin() {
  const adminEmail = 'admin@gmail.com';
  const adminType = 'Admin';
  const adminName = 'Rajatkumar';
  const adminPass = 'admin143';
  const existing = await userModel.findOne({ email: adminEmail, type: adminType });
  if (!existing) {
    const hashedPassword = await bcrypt.hash(adminPass, 10);
    await userModel.create({
      name: adminName,
      email: adminEmail,
      password: hashedPassword,
      type: adminType,
    });
  }
}

module.exports = ensureMainAdmin;
