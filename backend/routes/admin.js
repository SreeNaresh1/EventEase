const express = require('express');
const router = express.Router();
const {
  getAdminStats,
  getAdminRegistrations,
  getAdminEvents,
  createAdminEvent,
  updateAdminEvent,
  deleteAdminEvent,
  getAdminEventRegistrations,
  toggleCheckIn,
} = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/auth');

router.use(protect, adminOnly);

router.get('/stats', getAdminStats);
router.get('/registrations', getAdminRegistrations);
router.get('/events', getAdminEvents);
router.post('/events', createAdminEvent);
router.put('/events/:id', updateAdminEvent);
router.delete('/events/:id', deleteAdminEvent);
router.get('/events/:id/registrations', getAdminEventRegistrations);
router.patch('/registrations/:id/checkin', toggleCheckIn);

module.exports = router;

