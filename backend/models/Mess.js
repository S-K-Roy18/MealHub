const mongoose = require('mongoose');

const monthlyManagerSchema = new mongoose.Schema({
  month: { type: Number, required: true }, // 1-12
  year: { type: Number, required: true },
  managerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { _id: false });

const messSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  monthlyManagers: [monthlyManagerSchema],
}, { timestamps: true });

// Get current manager
messSchema.methods.getCurrentManager = function () {
  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();
  return this.monthlyManagers.find(m => m.month === month && m.year === year) || null;
};

module.exports = mongoose.model('Mess', messSchema);
