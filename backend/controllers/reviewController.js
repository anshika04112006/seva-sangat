const Review = require('../models/Review');
const Organization = require('../models/Organization');
const Event = require('../models/Event');

// @desc    Submit a review
// @route   POST /api/reviews
// @access  Private
const submitReview = async (req, res) => {
    try {
        const { targetId, targetType, rating, comment } = req.body;

        // Check if target exists
        let target;
        if (targetType === 'Organization') {
            target = await Organization.findById(targetId);
        } else {
            target = await Event.findById(targetId);
        }

        if (!target) {
            return res.status(404).json({ success: false, message: 'Target not found' });
        }

        const review = await Review.create({
            user: req.user.id,
            targetId,
            targetType,
            rating,
            comment
        });

        // Recalculate average rating for target
        const reviews = await Review.find({ targetId });
        const avgRating = reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length;

        target.averageRating = avgRating;
        if (targetType === 'Organization') {
            target.reviewCount = reviews.length;
        }
        await target.save();

        res.status(201).json({
            success: true,
            data: review
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Get reviews for a target
// @route   GET /api/reviews/:targetId
// @access  Public
const getTargetReviews = async (req, res) => {
    try {
        const reviews = await Review.find({ targetId: req.params.targetId })
            .populate('user', 'fullName')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: reviews.length,
            data: reviews
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    submitReview,
    getTargetReviews
};
