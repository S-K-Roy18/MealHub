const mongoose = require('mongoose');

const periodSchema = new mongoose.Schema({
  messId: { type: mongoose.Schema.Types.ObjectId, ref: 'Mess', required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  managerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  isActive: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Period', periodSchema);
