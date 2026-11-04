const Event = require('../models/Event');
const Registration = require('../models/Registration');

const getEvents = async (req, res) => {
  try {
    const { category, search, status, eventType, limit } = req.query;
    let filter = {};
    if (category && category !== 'All') filter.category = category;
    if (status) filter.status = status;
    if (eventType && eventType !== 'All') filter.eventType = eventType;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { venue: { $regex: search, $options: 'i' } },
        { organizer: { $regex: search, $options: 'i' } },
      ];
    }
    let query = Event.find(filter).sort({ date: 1 }).populate('createdBy', 'name');
    if (limit) query = query.limit(Number(limit));
    const events = await query;
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate('createdBy', 'name');
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.json(event);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createEvent = async (req, res) => {
  try {
    const event = await Event.create({ ...req.body, createdBy: req.user._id });
    res.status(201).json(event);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.json(event);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    await Registration.deleteMany({ event: req.params.id });
    res.json({ message: 'Event deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getEvents, getEventById, createEvent, updateEvent, deleteEvent };
