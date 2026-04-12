const express = require('express');
const router = express.Router();
const { 
    downloadCertificate,
    downloadDonationCertificate
} = require('../controllers/certificateController');
const { protect } = require('../middleware/authMiddleware');

router.get('/download/:id', protect, downloadCertificate);
router.get('/donation/:id', protect, downloadDonationCertificate);

module.exports = router;
