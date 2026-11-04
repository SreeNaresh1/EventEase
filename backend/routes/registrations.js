const express = require('express');
const router = express.Router();
const {
  registerForEvent,
  getMyRegistrations,
  cancelRegistration,
  getEventRegistrations,
} = require('../controllers/registrationController');
const { protect, adminOnly } = require('../middleware/auth');

router.post('/', protect, registerForEvent);
router.get('/my', protect, getMyRegistrations);
router.delete('/:id', protect, cancelRegistration);
router.get('/event/:eventId', protect, adminOnly, getEventRegistrations);

module.exports = router;
