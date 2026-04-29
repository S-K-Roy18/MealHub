const mongoose = require('mongoose');

const gasCylinderSchema = new mongoose.Schema({
  messId: { type: mongoose.Schema.Types.ObjectId, ref: 'Mess', required: true },
  date: { type: Date, required: true },
  remark: { type: String, enum: ['paid', 'due'], default: 'paid' },
  month: { type: Number, required: true },
  year: { type: Number, required: true },
  addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

module.exports = mongoose.model('GasCylinder', gasCylinderSchema);
