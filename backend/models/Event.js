const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  category: {
    type: String,
    required: true,
    enum: ['Technical', 'Cultural', 'Sports', 'Workshop', 'Hackathon', 'Other'],
  },
  date: { type: Date, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  venue: { type: String, required: true, trim: true },
  eligibility: { type: String, default: 'All students' },
  eventType: {
    type: String,
    enum: ['Internal', 'External'],
    default: 'Internal',
  },
  registrationLink: {
    type: String,
    default: '',
    trim: true,
  },
  maxParticipants: { type: Number, default: 100 },
  registeredCount: { type: Number, default: 0 },
  registrationDeadline: { type: Date },
  status: {
    type: String,
    enum: ['Upcoming', 'Registration Closed', 'Full', 'Completed'],
    default: 'Upcoming',
  },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  image: { type: String, default: '' },
  prize: { type: String, default: '' },
  organizer: { type: String, default: '' },
}, { timestamps: true });

// Auto-update status
eventSchema.pre('save', function() {
  const now = new Date();
  if (this.eventType === 'External') {
    if (new Date(this.date) < now) {
      this.status = 'Completed';
    } else if (this.registrationDeadline && new Date(this.registrationDeadline) < now) {
      this.status = 'Registration Closed';
    } else {
      this.status = 'Upcoming';
    }
  } else {
    if (this.maxParticipants && this.registeredCount >= this.maxParticipants) {
      this.status = 'Full';
    } else if (this.registrationDeadline && new Date(this.registrationDeadline) < now) {
      this.status = 'Registration Closed';
    } else if (new Date(this.date) < now) {
      this.status = 'Completed';
    } else {
      this.status = 'Upcoming';
    }
  }
});

module.exports = mongoose.model('Event', eventSchema);
