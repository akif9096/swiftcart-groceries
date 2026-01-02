const mongoose = require('mongoose');

const AdminSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Admin', AdminSchema);
