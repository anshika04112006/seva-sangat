const Event = require('../models/Event');
const User = require('../models/User');
const Booking = require('../models/Booking');

// @desc    Get all upcoming events
// @route   GET /api/events
// @access  Public
const getAllEvents = async (req, res) => {
    try {
        const events = await Event.find({ status: 'upcoming' }).sort({ date: 1 });
        res.status(200).json({
            success: true,
            count: events.length,
            data: events
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Book an event
// @route   POST /api/events/:id/book
// @access  Private
const bookEvent = async (req, res) => {
    try {
        const eventId = req.params.id;
        const userId = req.user.id;

        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ success: false, message: 'Event not found' });
        }

        // Check if already booked
        const existingBooking = await Booking.findOne({ user: userId, event: eventId });
        if (existingBooking) {
            return res.status(400).json({ success: false, message: 'You have already booked this event' });
        }

        const booking = await Booking.create({
            user: userId,
            event: eventId
        });

        res.status(201).json({
            success: true,
            message: 'Booking successful!',
            data: booking
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get current user's bookings
// @route   GET /api/events/my-bookings
// @access  Private
const getUserBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ user: req.user.id })
            .populate('event')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: bookings.length,
            data: bookings
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get events posted by an NGO
// @route   GET /api/events/ngo-events
// @access  Private/NGO
const getNgoEvents = async (req, res) => {
    try {
        const events = await Event.find({ ngoId: req.user.id }).sort({ date: 1 });
        res.status(200).json({
            success: true,
            count: events.length,
            data: events
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Create a new volunteer opportunity
// @route   POST /api/events
// @access  Private/NGO
const createEvent = async (req, res) => {
    try {
        // Automatically set ngoId from logged in user
        const eventData = { ...req.body, ngoId: req.user.id };
        const event = await Event.create(eventData);
        res.status(201).json({
            success: true,
            data: event
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get recommended events for logged in user
// @route   GET /api/events/recommendations
// @access  Private
const getRecommendations = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const events = await Event.find({ status: 'upcoming' });
        const userSkills = user.skills || [];
        const userLocation = user.location;

        const recommendedEvents = events.map(event => {
            let skillMatchCount = 0;
            const requiredSkills = event.requiredSkills || [];
            
            // Skill Match Logic (60% weight)
            if (requiredSkills.length > 0) {
                requiredSkills.forEach(skill => {
                    if (userSkills.some(s => s.toLowerCase() === skill.toLowerCase())) {
                        skillMatchCount++;
                    }
                });
            }

            const skillScore = requiredSkills.length > 0 
                ? (skillMatchCount / requiredSkills.length) * 60 
                : 30; // Default if no skills required

            // Location Match Logic (40% weight)
            const locationScore = (userLocation && event.location && 
                userLocation.toLowerCase().includes(event.location.toLowerCase()) || 
                event.location.toLowerCase().includes(userLocation.toLowerCase())) 
                ? 40 : 0;

            const matchPercentage = Math.round(skillScore + locationScore);

            return {
                ...event._doc,
                matchPercentage: Math.min(matchPercentage, 100),
                matchedSkills: requiredSkills.filter(skill => 
                    userSkills.some(s => s.toLowerCase() === skill.toLowerCase())
                )
            };
        });

        // Filter out zero matches and sort by percentage
        const filteredResults = recommendedEvents
            .filter(e => e.matchPercentage > 20) // Minimum threshold
            .sort((a, b) => b.matchPercentage - a.matchPercentage);

        res.status(200).json({
            success: true,
            userProfile: {
                skills: userSkills,
                location: userLocation
            },
            data: filteredResults
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get stats for NGO dashboard
// @route   GET /api/events/ngo/stats
// @access  Private/NGO
const getNgoStats = async (req, res) => {
    try {
        const events = await Event.find({ ngoId: req.user.id });
        const eventIds = events.map(e => e._id);

        const totalVolunteers = await Booking.countDocuments({ 
            event: { $in: eventIds },
            participationStatus: 'attended'
        });

        const activeEvents = await Event.countDocuments({ 
            ngoId: req.user.id,
            date: { $gte: new Date() }
        });

        // Sum donations
        const Donation = require('../models/Donation');
        const donations = await Donation.find({ organizationId: req.user.id, donationType: 'money' });
        const totalFunds = donations.reduce((acc, curr) => acc + (curr.amount || 0), 0);

        res.status(200).json({
            success: true,
            data: {
                totalFunds,
                totalVolunteers,
                activeEvents,
                totalEvents: events.length
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get volunteers for a specific event
// @route   GET /api/events/:id/volunteers
// @access  Private/NGO
const getEventVolunteers = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).json({ success: false, message: 'Event not found' });
        }

        if (event.ngoId.toString() !== req.user.id) {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }

        const volunteers = await Booking.find({ event: req.params.id })
            .populate('user', 'fullName email phone skills location');

        res.status(200).json({
            success: true,
            count: volunteers.length,
            data: volunteers
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    getAllEvents,
    bookEvent,
    getUserBookings,
    getNgoEvents,
    createEvent,
    getRecommendations,
    getNgoStats,
    getEventVolunteers
};
