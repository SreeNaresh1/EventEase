const Registration = require('../models/Registration');
const Event = require('../models/Event');

const registerForEvent = async (req, res) => {
  try {
    const { eventId } = req.body;
    const studentId = req.user._id;

    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    // Check registration deadline (if specified)
    if (event.registrationDeadline && new Date(event.registrationDeadline) < new Date()) {
      return res.status(400).json({ message: 'Registration deadline has passed' });
    }

    // Check seat availability (only enforced for internal college events)
    if (event.eventType !== 'External' && event.registeredCount >= event.maxParticipants) {
      return res.status(400).json({ message: 'Event is full. No seats available.' });
    }

    // Strict duplicate + re-registration check (checks ALL statuses, not just active)
    const existing = await Registration.findOne({ student: studentId, event: eventId });
    if (existing) {
      if (existing.status === 'active') {
        return res.status(400).json({ message: 'You are already registered for this event.' });
      }
      if (existing.status === 'cancelled') {
        return res.status(400).json({
          message: 'You have previously cancelled your registration for this event. Re-registration is not allowed to ensure fairness for other students.',
        });
      }
    }

    // Schedule conflict check
    const eventDate = new Date(event.date).toDateString();
    const myRegistrations = await Registration.find({ student: studentId, status: 'active' }).populate('event');
    
    for (const reg of myRegistrations) {
      const regEventDate = new Date(reg.event.date).toDateString();
      if (regEventDate === eventDate) {
        // Check time overlap
        const toMinutes = (t) => {
          const [h, m] = t.split(':').map(Number);
          return h * 60 + m;
        };
        const newStart = toMinutes(event.startTime);
        const newEnd = toMinutes(event.endTime);
        const existStart = toMinutes(reg.event.startTime);
        const existEnd = toMinutes(reg.event.endTime);

        if (newStart < existEnd && newEnd > existStart) {
          return res.status(409).json({
            message: `Schedule conflict detected! This event overlaps with "${reg.event.title}" which you are already registered for.`,
            conflictEvent: reg.event.title,
          });
        }
      }
    }

    // Create registration
    const registration = await Registration.create({ student: studentId, event: eventId });

    // Update seat count
    await Event.findByIdAndUpdate(eventId, { $inc: { registeredCount: 1 } });

    const populated = await registration.populate('event');
    res.status(201).json({ message: 'Successfully registered!', registration: populated });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: 'You are already registered for this event.' });
    }
    res.status(500).json({ message: err.message });
  }
};

const getMyRegistrations = async (req, res) => {
  try {
    const registrations = await Registration.find({
      student: req.user._id,
      status: 'active',
    }).populate('event').sort({ createdAt: -1 });
    res.json(registrations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const cancelRegistration = async (req, res) => {
  try {
    const registration = await Registration.findOne({
      _id: req.params.id,
      student: req.user._id,
    });
    if (!registration) return res.status(404).json({ message: 'Registration not found' });

    // ── 24-hour cancellation window guard ─────────────────────────
    const event = await Event.findById(registration.event);
    if (event) {
      const hoursUntilEvent = (new Date(event.date) - new Date()) / (1000 * 60 * 60);
      if (hoursUntilEvent >= 0 && hoursUntilEvent < 24) {
        return res.status(400).json({
          message: `Cancellation is not allowed within 24 hours of the event. This event starts in ${Math.round(hoursUntilEvent)} hour(s).`,
        });
      }
    }

    registration.status = 'cancelled';
    await registration.save();

    // Decrement seat count (only for internal events)
    if (!event || event.eventType !== 'External') {
      await Event.findByIdAndUpdate(registration.event, { $inc: { registeredCount: -1 } });
    }

    res.json({ message: 'Registration cancelled. Note: you will not be able to re-register for this event.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getEventRegistrations = async (req, res) => {
  try {
    const registrations = await Registration.find({
      event: req.params.eventId,
      status: 'active',
    }).populate('student', 'name email department year').sort({ createdAt: -1 });
    res.json(registrations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { registerForEvent, getMyRegistrations, cancelRegistration, getEventRegistrations };
