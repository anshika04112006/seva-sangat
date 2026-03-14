const express = require('express');
const router = express.Router();
const {
    submitDonation,
    getDonationsByDonor,
    getDonationsByOrg,
    updateDonationStatus
} = require('../controllers/donationController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, submitDonation);
router.get('/my-donations', protect, getDonationsByDonor);
router.get('/org', protect, getDonationsByOrg);
router.put('/:id/status', protect, updateDonationStatus);

module.exports = router;
