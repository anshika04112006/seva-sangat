const User = require('../models/User');
const Organization = require('../models/Organization');
const Donation = require('../models/Donation');
const Event = require('../models/Event');
const Booking = require('../models/Booking');

// @desc    Get platform-wide statistics
// @route   GET /api/admin/stats
// @access  Private/Admin
const getPlatformStats = async (req, res) => {
    try {
        const [userCount, orgCount, donationCount, eventCount] = await Promise.all([
            User.countDocuments({ role: 'volunteer' }),
            Organization.countDocuments(),
            Donation.countDocuments(),
            Event.countDocuments()
        ]);

        const totalMoneyDonations = await Donation.find({ donationType: 'money' });
        const totalFunds = totalMoneyDonations.reduce((acc, curr) => acc + (curr.amount || 0), 0);

        const recentDonations = await Donation.find()
            .populate('donorId', 'fullName')
            .populate('organizationId', 'name')
            .sort({ createdAt: -1 })
            .limit(5);

        res.status(200).json({
            success: true,
            data: {
                totalUsers: userCount,
                totalNGOs: orgCount,
                totalDonations: donationCount,
                totalEvents: eventCount,
                totalFundsRaised: totalFunds,
                recentDonations
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get all organizations for management
// @route   GET /api/admin/organizations
// @access  Private/Admin
const getAllOrganizations = async (req, res) => {
    try {
        const orgs = await Organization.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: orgs.length, data: orgs });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get all users for management
// @route   GET /api/admin/users
// @access  Private/Admin
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({ role: 'volunteer' }).sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: users.length, data: users });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Update organization verification status
// @route   PUT /api/admin/orgs/:id/status
// @access  Private/Admin
const updateOrgStatus = async (req, res) => {
    try {
        const { verified } = req.body;
        const org = await Organization.findByIdAndUpdate(
            req.params.id, 
            { verified }, 
            { new: true, runValidators: true }
        );

        if (!org) {
            return res.status(404).json({ success: false, message: 'Organization not found' });
        }

        res.status(200).json({ success: true, data: org });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    getPlatformStats,
    getAllOrganizations,
    getAllUsers,
    updateOrgStatus
};
