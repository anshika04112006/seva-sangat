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
    getEventsByOrg,
    getEventVolunteers,
    completeParticipation
} = require('../controllers/eventController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', getAllEvents);
router.get('/by-org/:orgId', getEventsByOrg); // public – for OrganizationDetails page
router.post('/', protect, authorize('organization'), createEvent);
router.get('/recommendations', protect, getRecommendations);
router.get('/my-bookings', protect, getUserBookings);
router.get('/ngo-events', protect, authorize('organization'), getNgoEvents);
router.get('/ngo/stats', protect, authorize('organization'), getNgoStats);
router.get('/:id/volunteers', protect, authorize('organization'), getEventVolunteers);
router.post('/:id/book', protect, bookEvent);
router.put('/bookings/:id/complete', protect, authorize('organization'), completeParticipation);

module.exports = router;
