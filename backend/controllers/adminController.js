const Event = require('../models/Event');
const Registration = require('../models/Registration');
const User = require('../models/User');

const getAdminStats = async (req, res) => {
  try {
    const totalEvents = await Event.countDocuments();
    const totalRegistrations = await Registration.countDocuments({ status: 'active' });
    const totalStudents = await User.countDocuments({ role: 'student' });
    const upcomingEvents = await Event.countDocuments({
      date: { $gte: new Date() }
    });

    res.json({
      totalEvents,
      totalRegistrations,
      totalStudents,
      upcomingEvents,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getAdminRegistrations = async (req, res) => {
  try {
    const limit = req.query.limit ? Number(req.query.limit) : 20;
    const registrations = await Registration.find({ status: 'active' })
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate('student', 'name email department year')
      .populate('event', 'title date venue category');
    res.json(registrations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getAdminEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 }).populate('createdBy', 'name');
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createAdminEvent = async (req, res) => {
  try {
    const event = await Event.create({ ...req.body, createdBy: req.user._id });
    res.status(201).json(event);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateAdminEvent = async (req, res) => {
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

const deleteAdminEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    await Registration.deleteMany({ event: req.params.id });
    res.json({ message: 'Event deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getAdminEventRegistrations = async (req, res) => {
  try {
    const registrations = await Registration.find({
      event: req.params.id,
      status: 'active',
    })
      .populate('student', 'name email department year')
      .sort({ createdAt: -1 });
    res.json(registrations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const toggleCheckIn = async (req, res) => {
  try {
    const registration = await Registration.findById(req.params.id);
    if (!registration) return res.status(404).json({ message: 'Registration not found' });
    
    registration.attended = !registration.attended;
    registration.checkedInAt = registration.attended ? new Date() : null;
    await registration.save();
    
    await registration.populate('student', 'name email department year');
    res.json({ message: 'Attendance status updated', registration });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getAdminStats,
  getAdminRegistrations,
  getAdminEvents,
  createAdminEvent,
  updateAdminEvent,
  deleteAdminEvent,
  getAdminEventRegistrations,
  toggleCheckIn,
};

