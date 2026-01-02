require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Admin = require('../models/Admin');

async function run(){
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('MONGODB_URI not set in .env');
    process.exit(1);
  }
  await mongoose.connect(uri);
  const id = process.argv[2];
  const pwd = process.argv[3];
  if (!id || !pwd) {
    console.error('Usage: node scripts/createAdmin.js <id> <password>');
    process.exit(1);
  }
  const exists = await Admin.findOne({ id });
  if (exists) {
    console.error('Admin already exists');
    process.exit(1);
  }
  const hash = await bcrypt.hash(pwd, 10);
  await Admin.create({ id, passwordHash: hash });
  console.log('Admin created:', id);
  process.exit(0);
}

run().catch(e=>{ console.error(e); process.exit(1); });
