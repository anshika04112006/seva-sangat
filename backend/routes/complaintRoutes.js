const express = require('express');
const router = express.Router();
const { 
    submitComplaint, 
    getAllComplaints, 
    updateComplaintStatus 
} = require('../controllers/complaintController');
const { protect } = require('../middleware/authMiddleware');

// Admin role check middleware
const adminOnly = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ success: false, message: 'Admin access required' });
    }
};

router.post('/', protect, submitComplaint);
router.get('/admin', protect, adminOnly, getAllComplaints);
router.put('/:id/status', protect, adminOnly, updateComplaintStatus);

module.exports = router;
