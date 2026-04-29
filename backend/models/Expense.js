const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  messId: { type: mongoose.Schema.Types.ObjectId, ref: 'Mess', required: true },
  date: { type: Date, required: true },
  itemName: { type: String, required: true, trim: true },
  price: { type: Number, required: true, min: 0 },
  mealType: { type: String, enum: ['lunch', 'dinner', 'other'], required: true },
  notes: { type: String, trim: true, default: '' },
  month: { type: Number, required: true },
  year: { type: Number, required: true },
  addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  isEdited: { type: Boolean, default: false },
  isBackdated: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Expense', expenseSchema);
