
require('dotenv').config();
const Admin = require('../models/adminmodel');
const bcrypt = require('bcryptjs');

async function createAdmin() {
  try {
    const email = process.env.ADMIN_EMAIL;
    const plainPassword = process.env.ADMIN_PASSWORD;

    if (!email || !plainPassword) {
      console.log('Missing ADMIN_EMAIL or ADMIN_PASSWORD in .env');
      return;
    }

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      console.log('Admin already exists');
      return;
    }

    const hashedPassword = await bcrypt.hash(plainPassword, 10);
    const admin = new Admin({ email, password: hashedPassword });
    await admin.save();
    console.log('✅ Admin created successfully');
  } catch (err) {
    console.error('❌ Error creating admin:', err);
  }
}

module.exports = createAdmin;
