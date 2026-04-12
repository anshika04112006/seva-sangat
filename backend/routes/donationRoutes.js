const express = require('express');
const router = express.Router();
const {
    submitDonation,
    getDonationsByDonor,
    getDonationsByOrg,
    updateDonationStatus
} = require('../controllers/donationController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/', protect, submitDonation);
router.get('/my-donations', protect, getDonationsByDonor);
router.get('/org', protect, authorize('organization'), getDonationsByOrg);
router.put('/:id/status', protect, authorize('organization'), updateDonationStatus);

module.exports = router;
