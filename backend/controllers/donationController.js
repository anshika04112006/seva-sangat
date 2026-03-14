const Donation = require('../models/Donation');
const Organization = require('../models/Organization');

// @desc    Submit a new donation
// @route   POST /api/donations
// @access  Private
const submitDonation = async (req, res) => {
    try {
        const { organizationId, donationType, amount, itemDescription, quantity } = req.body;

        const org = await Organization.findById(organizationId);
        if (!org) {
            return res.status(404).json({ success: false, message: 'Organization not found' });
        }

        const donation = await Donation.create({
            donorId: req.user.id,
            organizationId,
            donationType,
            amount: donationType === 'money' ? amount : undefined,
            itemDescription: donationType !== 'money' ? itemDescription : undefined,
            quantity: donationType !== 'money' ? quantity : undefined,
            paymentStatus: donationType === 'money' ? 'success' : 'pending' // Dummy success for money
        });

        res.status(201).json({
            success: true,
            message: 'Thank you for your donation!',
            data: donation
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get donations by donor (User)
// @route   GET /api/donations/my-donations
// @access  Private
const getDonationsByDonor = async (req, res) => {
    try {
        const donations = await Donation.find({ donorId: req.user.id })
            .populate('organizationId', 'name category')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: donations.length,
            data: donations
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get donations for an organization
// @route   GET /api/donations/org
// @access  Private/NGO
const getDonationsByOrg = async (req, res) => {
    try {
        // Assuming req.user is the organization user and we have a way to link it to Org model
        // For now, filtering by organizationId directly if it matches user ID (simple mapping)
        const donations = await Donation.find({ organizationId: req.user.id })
            .populate('donorId', 'fullName email phone')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: donations.length,
            data: donations
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Update donation status
// @route   PUT /api/donations/:id/status
// @access  Private/NGO
const updateDonationStatus = async (req, res) => {
    try {
        const donation = await Donation.findById(req.params.id);
        if (!donation) {
            return res.status(404).json({ success: false, message: 'Donation not found' });
        }

        donation.status = req.body.status || donation.status;
        await donation.save();

        res.status(200).json({
            success: true,
            message: 'Donation status updated',
            data: donation
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

module.exports = {
    submitDonation,
    getDonationsByDonor,
    getDonationsByOrg,
    updateDonationStatus
};
