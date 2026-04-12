const Organization = require('../models/Organization');

// @desc    Add a new organization
// @route   POST /api/orgs
// @access  Private/Admin
const addOrganization = async (req, res) => {
    try {
        const org = await Organization.create(req.body);
        res.status(201).json({
            success: true,
            data: org
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get all organizations (with filters)
// @route   GET /api/orgs
// @access  Public
const getOrganizations = async (req, res) => {
    try {
        const { category, city, search } = req.query;
        let query = {};

        if (category && category !== 'All') {
            query.category = category;
        }

        if (city && city !== 'All') {
            query.city = city;
        }

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        const orgs = await Organization.find(query).sort({ verified: -1, createdAt: -1 });

        res.status(200).json({
            success: true,
            count: orgs.length,
            data: orgs
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get featured organizations
// @route   GET /api/orgs/featured
// @access  Public
const getFeaturedOrganizations = async (req, res) => {
    try {
        const orgs = await Organization.find({ isFeatured: true }).limit(6);
        res.status(200).json({
            success: true,
            count: orgs.length,
            data: orgs
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get organization by ID
// @route   GET /api/orgs/:id
// @access  Public
const getOrganizationById = async (req, res) => {
    try {
        const org = await Organization.findById(req.params.id);
        if (!org) {
            return res.status(404).json({ success: false, message: 'Organization not found' });
        }
        res.status(200).json({ success: true, data: org });
    } catch (error) {
        res.status(400).json({ success: false, message: 'Invalid Organization ID' });
    }
};

// @desc    Update verification status (Admin only)
// @route   PUT /api/orgs/:id/verify
// @access  Private/Admin
const updateVerificationStatus = async (req, res) => {
    try {
        const org = await Organization.findById(req.params.id);
        if (!org) return res.status(404).json({ success: false, message: 'Organization not found' });

        org.verified = req.body.verified !== undefined ? req.body.verified : !org.verified;
        await org.save();

        res.status(200).json({ success: true, data: org });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Update urgent note (NGO only)
// @route   PUT /api/orgs/urgent-note
// @access  Private/NGO
const updateUrgentNote = async (req, res) => {
    try {
        const org = await Organization.findOne({ email: req.user.email });
        if (!org) return res.status(404).json({ success: false, message: 'Organization not found' });

        org.emergencyNote = req.body.emergencyNote;
        await org.save();

        res.status(200).json({ success: true, data: org });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Get organization by email (my org)
// @route   GET /api/orgs/my-org
// @access  Private/NGO
const getMyOrganization = async (req, res) => {
    try {
        const org = await Organization.findOne({ email: req.user.email });
        if (!org) {
            return res.status(200).json({ success: true, data: {} });
        }
        res.status(200).json({ success: true, data: org });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

module.exports = {
    addOrganization,
    getOrganizations,
    getFeaturedOrganizations,
    getOrganizationById,
    updateVerificationStatus,
    updateUrgentNote,
    getMyOrganization
};
