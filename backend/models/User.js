const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, trim: true },
  mobile: { type: String, required: true, unique: true, trim: true },
  gmail: { type: String, required: true, unique: true, lowercase: true, trim: true },
  messId: { type: mongoose.Schema.Types.ObjectId, ref: 'Mess', default: null },
  isAdmin: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
