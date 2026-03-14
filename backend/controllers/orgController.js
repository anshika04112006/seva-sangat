const Organization = require('../models/Organization');

// @desc    Add a new organization
// @route   POST /api/orgs
// @access  Private/Admin (Public for now as per req)
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

        // Filter by category
        if (category && category !== 'All') {
            query.category = category;
        }

        // Filter by city
        if (city && city !== 'All') {
            query.city = city;
        }

        // Search by name or description
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        const orgs = await Organization.find(query);

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

// @desc    Get single organization by ID
// @route   GET /api/orgs/:id
// @access  Public
const getOrganizationById = async (req, res) => {
    try {
        const org = await Organization.findById(req.params.id);

        if (!org) {
            return res.status(404).json({
                success: false,
                message: 'Organization not found'
            });
        }

        res.status(200).json({
            success: true,
            data: org
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Invalid Organization ID'
        });
    }
};

module.exports = {
    addOrganization,
    getOrganizations,
    getOrganizationById
};
