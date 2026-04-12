const express = require('express');
const router = express.Router();
const { submitReview, getTargetReviews } = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, submitReview);
router.get('/:targetId', getTargetReviews);

module.exports = router;
