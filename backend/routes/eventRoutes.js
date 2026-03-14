const express = require('express');
const router = express.Router();
const {
    createEvent,
    getRecommendations,
    getAllEvents,
    bookEvent,
    getUserBookings,
    getNgoEvents,
    getNgoStats,
    getEventVolunteers
} = require('../controllers/eventController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', getAllEvents);
router.post('/', protect, createEvent);
router.get('/recommendations', protect, getRecommendations);
router.get('/my-bookings', protect, getUserBookings);
router.get('/ngo-events', protect, getNgoEvents);
router.get('/ngo/stats', protect, getNgoStats);
router.get('/:id/volunteers', protect, getEventVolunteers);
router.post('/:id/book', protect, bookEvent);

module.exports = router;
