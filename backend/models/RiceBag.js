const mongoose = require('mongoose');

const riceBagSchema = new mongoose.Schema({
  messId: { type: mongoose.Schema.Types.ObjectId, ref: 'Mess', required: true },
  buyingDate: { type: Date, required: true },
  paymentDate: { type: Date },
  isPaid: { type: Boolean, default: true },
  price: { type: Number, default: 0 },
  weight: { type: String, trim: true }, // Extra field for rice bags (e.g., 25kg)
  remark: { type: String, trim: true },
  month: { type: Number, required: true },
  year: { type: Number, required: true },
  addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

module.exports = mongoose.model('RiceBag', riceBagSchema);
