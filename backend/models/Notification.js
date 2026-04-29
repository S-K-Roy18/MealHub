const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  messId: { type: mongoose.Schema.Types.ObjectId, ref: 'Mess', required: true },
  type: {
    type: String,
    enum: ['expense_added', 'expense_backdated', 'expense_edited', 'meal_added', 'money_added', 'gas_added', 'manager_changed'],
    required: true,
  },
  message: { type: String, required: true },
  isBackdated: { type: Boolean, default: false },
  isEdited: { type: Boolean, default: false },
  addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  refId: { type: mongoose.Schema.Types.ObjectId, default: null }, // reference to the related document
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);
