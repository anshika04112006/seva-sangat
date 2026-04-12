const express = require('express');
const router = express.Router();
const { 
    getPlatformStats, 
    getAllOrganizations, 
    getAllUsers, 
    updateOrgStatus,
    updateOrgFeatured
} = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');

// Specialized admin check middleware (inline for simplicity)
const adminOnly = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ success: false, message: 'Access denied. Administrator only.' });
    }
};

router.use(protect);
router.use(adminOnly);

router.get('/stats', getPlatformStats);
router.get('/organizations', getAllOrganizations);
router.get('/users', getAllUsers);
router.put('/orgs/:id/status', updateOrgStatus);
router.put('/orgs/:id/verify', updateOrgStatus);       // frontend calls /verify
router.put('/orgs/:id/featured', updateOrgFeatured);   // feature/unfeature org

module.exports = router;

