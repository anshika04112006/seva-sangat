const Complaint = require('../models/Complaint');

// @desc    Submit a new complaint
// @route   POST /api/complaints
// @access  Private
const submitComplaint = async (req, res) => {
    try {
        const { subject, description } = req.body;

        const complaint = await Complaint.create({
            user: req.user.id,
            subject,
            description
        });

        res.status(201).json({
            success: true,
            data: complaint
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Get all complaints
// @route   GET /api/complaints/admin
// @access  Private/Admin
const getAllComplaints = async (req, res) => {
    try {
        const complaints = await Complaint.find()
            .populate('user', 'fullName email phone')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: complaints.length,
            data: complaints
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Update complaint status
// @route   PUT /api/complaints/:id/status
// @access  Private/Admin
const updateComplaintStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const complaint = await Complaint.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true, runValidators: true }
        );

        if (!complaint) {
            return res.status(404).json({ success: false, message: 'Complaint not found' });
        }

        res.status(200).json({ success: true, data: complaint });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

module.exports = {
    submitComplaint,
    getAllComplaints,
    updateComplaintStatus
};
