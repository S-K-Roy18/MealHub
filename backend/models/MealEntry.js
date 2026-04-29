const mongoose = require('mongoose');

const memberMealSchema = new mongoose.Schema({
  memberId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  lunch: { type: Boolean, default: false },
  dinner: { type: Boolean, default: false },
}, { _id: false });

const mealEntrySchema = new mongoose.Schema({
  messId: { type: mongoose.Schema.Types.ObjectId, ref: 'Mess', required: true },
  date: { type: Date, required: true },
  month: { type: Number, required: true },
  year: { type: Number, required: true },
  entries: [memberMealSchema],
  addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  isBackdated: { type: Boolean, default: false },
}, { timestamps: true });

// Compound index: one meal entry document per date per mess
mealEntrySchema.index({ messId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('MealEntry', mealEntrySchema);
