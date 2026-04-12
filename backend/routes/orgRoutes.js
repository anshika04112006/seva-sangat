const express = require('express');
const router = express.Router();
const {
    addOrganization,
    getOrganizations,
    getFeaturedOrganizations,
    getOrganizationById,
    updateVerificationStatus,
    updateUrgentNote,
    getMyOrganization
} = require('../controllers/orgController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', getOrganizations);
router.get('/featured', getFeaturedOrganizations);
router.get('/my-org', protect, authorize('organization', 'ngo'), getMyOrganization);
router.get('/:id', getOrganizationById);

// Protected routes
router.post('/', protect, authorize('admin', 'organization'), addOrganization);
router.put('/urgent-note', protect, authorize('organization'), updateUrgentNote);
router.put('/:id/verify', protect, authorize('admin'), updateVerificationStatus);

module.exports = router;
