const Event = require('../models/Event');
const User = require('../models/User');
const Booking = require('../models/Booking');
const sendEmail = require('../utils/sendEmail');

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

        // Send booking confirmation email
        try {
            await sendEmail({
                email: req.user.email,
                subject: `Booking Confirmed: ${event.title}`,
                message: `You have successfully booked your spot for the event: ${event.title}.`,
                html: `
                    <div style="font-family: Arial, sans-serif; color: #333;">
                        <h2 style="color: #2ecc71;">Booking Confirmed!</h2>
                        <p>Hi ${req.user.fullName},</p>
                        <p>You're all set! You've successfully registered for the following social impact event:</p>
                        <div style="background: #f8fafc; padding: 15px; border-radius: 12px; border-left: 4px solid #2ecc71;">
                            <h3 style="margin-top: 0;">${event.title}</h3>
                            <p><strong>NGO:</strong> ${event.ngoName}</p>
                            <p><strong>Date:</strong> ${new Date(event.date).toDateString()}</p>
                            <p><strong>Location:</strong> ${event.location}</p>
                        </div>
                        <p>We look forward to seeing you there!</p>
                        <p>Best regards,<br/>Team Seva Sangat</p>
                    </div>
                `
            });
        } catch (emailErr) {
            console.error('Email sending failed:', emailErr);
        }

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
        // Find the org document by email so we can match ngoId correctly
        const Organization = require('../models/Organization');
        const org = await Organization.findOne({ email: req.user.email });
        const ngoId = org ? org._id : req.user.id;

        const events = await Event.find({ ngoId }).sort({ date: 1 });
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
        // Look up org by email so ngoId matches org._id (not user._id)
        const Organization = require('../models/Organization');
        const org = await Organization.findOne({ email: req.user.email });
        const ngoId = org ? org._id : req.user.id;
        const ngoName = org ? org.name : (req.user.fullName || 'Seva Sangat NGO');

        const eventData = { ...req.body, ngoId, ngoName };
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
        const userLocation = user.location || '';

        const recommendedEvents = events.map(event => {
            let score = 0;
            const requiredSkills = event.requiredSkills || [];
            
            // 1. Skill Match (Max 50 points)
            if (requiredSkills.length > 0) {
                let matchCount = 0;
                requiredSkills.forEach(skill => {
                    if (userSkills.some(s => s.toLowerCase().trim() === skill.toLowerCase().trim())) {
                        matchCount++;
                    }
                });
                score += (matchCount / requiredSkills.length) * 50;
            } else {
                score += 25; // Default points if no skills listed
            }

            // 2. Location Proximity (Max 30 points)
            if (userLocation && event.location) {
                const uLoc = userLocation.toLowerCase().trim();
                const eLoc = event.location.toLowerCase().trim();
                if (uLoc === eLoc) {
                    score += 30; // Exact city match
                } else if (uLoc.includes(eLoc) || eLoc.includes(uLoc)) {
                    score += 15; // Regional/Substring match
                }
            }

            // 3. Urgency & Engagement (Max 20 points)
            if (event.isUrgent) score += 10;
            
            // Rating Multiplier (Boosts score for highly rated events)
            const ratingBoost = event.averageRating ? (event.averageRating / 5) * 10 : 0;
            score += ratingBoost;

            const matchPercentage = Math.round(Math.min(score, 100));

            return {
                ...event._doc,
                matchPercentage,
                matchedSkills: requiredSkills.filter(skill => 
                    userSkills.some(s => s.toLowerCase().trim() === skill.toLowerCase().trim())
                )
            };
        });

        // Sort by percentage and return top results
        const filteredResults = recommendedEvents
            .filter(e => e.matchPercentage > 10)
            .sort((a, b) => b.matchPercentage - a.matchPercentage)
            .slice(0, 10);

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
        // Resolve org by email so IDs line up correctly
        const Organization = require('../models/Organization');
        const org = await Organization.findOne({ email: req.user.email });
        const ngoId = org ? org._id : req.user.id;

        const events = await Event.find({ ngoId });
        const eventIds = events.map(e => e._id);

        const totalVolunteers = await Booking.countDocuments({ 
            event: { $in: eventIds },
            participationStatus: { $in: ['attended', 'completed'] }
        });

        const activeEvents = await Event.countDocuments({ 
            ngoId,
            date: { $gte: new Date() }
        });

        const Donation = require('../models/Donation');
        // Use org._id (not user._id) to match how donations are saved
        const donations = await Donation.find({ organizationId: ngoId, donationType: 'money' });
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

// @desc    Get upcoming events for a specific org (public)
// @route   GET /api/events/by-org/:orgId
// @access  Public
const getEventsByOrg = async (req, res) => {
    try {
        const events = await Event.find({ 
            ngoId: req.params.orgId,
            date: { $gte: new Date() }
        }).sort({ date: 1 }).limit(5);

        res.status(200).json({
            success: true,
            count: events.length,
            data: events
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

// @desc    Mark volunteer participation as completed
// @route   PUT /api/events/bookings/:id/complete
// @access  Private/NGO
const completeParticipation = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id).populate('user', 'email fullName').populate('event', 'title ngoName');
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        booking.participationStatus = 'completed';
        booking.certificateId = `CERT-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        await booking.save();

        // Send completion email
        try {
            await sendEmail({
                email: booking.user.email,
                subject: `Certificate Ready: ${booking.event.title}`,
                message: `Congratulations! Your participation in ${booking.event.title} has been verified and your certificate is ready.`,
                html: `
                    <div style="font-family: Arial, sans-serif; color: #333;">
                        <h2 style="color: #2ecc71;">Congratulations, ${booking.user.fullName}!</h2>
                        <p>Your contribution to <strong>${booking.event.title}</strong> has been successfully verified by <strong>${booking.event.ngoName}</strong>.</p>
                        <p>Your certificate of participation is now available for download on your dashboard.</p>
                        <hr />
                        <p>Thank you for making a difference!</p>
                        <p>Best regards,<br/>Team Seva Sangat</p>
                    </div>
                `
            });
        } catch (emailErr) {
            console.error('Email sending failed:', emailErr);
        }

        res.status(200).json({
            success: true,
            message: 'Participation marked as completed',
            data: booking
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
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
    getEventsByOrg,
    getEventVolunteers,
    completeParticipation
};
