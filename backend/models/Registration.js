const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  status: {
    type: String,
    enum: ['active', 'cancelled'],
    default: 'active',
  },
  attended: {
    type: Boolean,
    default: false,
  },
  checkedInAt: {
    type: Date,
  },
  registeredAt: { type: Date, default: Date.now },
}, { timestamps: true });

// Prevent duplicate registrations
registrationSchema.index({ student: 1, event: 1 }, { unique: true });

module.exports = mongoose.model('Registration', registrationSchema);
