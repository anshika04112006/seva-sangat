const Donation = require('../models/Donation');
const Organization = require('../models/Organization');
const sendEmail = require('../utils/sendEmail');

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
            paymentStatus: donationType === 'money' ? 'success' : 'pending',
            status: 'pending',
            trackingHistory: [{
                status: 'pending',
                message: `Donation of ${donationType} initiated for ${org.name}.`
            }]
        });

        // Send confirmation email
        try {
            await sendEmail({
                email: req.user.email,
                subject: 'Donation Confirmation - Seva Sangat',
                message: `Thank you for your donation to ${org.name}. Your contribution is being processed.`,
                html: `
                    <div style="font-family: Arial, sans-serif; color: #333;">
                        <h2 style="color: #2ecc71;">Donation Received!</h2>
                        <p>Hi ${req.user.fullName},</p>
                        <p>Thank you for your generous donation to <strong>${org.name}</strong>.</p>
                        <hr />
                        <p><strong>Type:</strong> ${donationType}</p>
                        ${amount ? `<p><strong>Amount:</strong> ₹${amount}</p>` : ''}
                        ${itemDescription ? `<p><strong>Item:</strong> ${itemDescription}</p>` : ''}
                        <p><strong>Tracking Status:</strong> Pending</p>
                        <hr />
                        <p>You can track the status of your donation on your dashboard.</p>
                        <p>With gratitude,<br/>Team Seva Sangat</p>
                    </div>
                `
            });
        } catch (emailErr) {
            console.error('Email sending failed:', emailErr);
            // Don't fail the request if email fails
        }

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
        let organizationQuery = req.user.id;
        
        // Try to match the authenticated User to an Organization by email
        const orgMatch = await Organization.findOne({ email: req.user.email });
        if (orgMatch) {
            organizationQuery = orgMatch._id;
        }

        const donations = await Donation.find({ organizationId: organizationQuery })
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
        const { status, message } = req.body;
        const donation = await Donation.findById(req.params.id).populate('donorId', 'email fullName');
        
        if (!donation) {
            return res.status(404).json({ success: false, message: 'Donation not found' });
        }

        donation.status = status || donation.status;
        donation.trackingHistory.push({
            status: donation.status,
            message: message || `Donation status updated to ${donation.status}`
        });

        await donation.save();

        // Send status update email
        try {
            await sendEmail({
                email: donation.donorId.email,
                subject: `Donation Update - ${donation.status.toUpperCase()}`,
                message: `Your donation status has been updated to ${donation.status}.`,
                html: `
                    <div style="font-family: Arial, sans-serif; color: #333;">
                        <h2 style="color: #2ecc71;">Donation Update</h2>
                        <p>Hi ${donation.donorId.fullName},</p>
                        <p>The status of your donation has been updated to: <strong style="color: #16a34a;">${donation.status.toUpperCase()}</strong></p>
                        <p><strong>Note from NGO:</strong> ${message || 'No additional notes.'}</p>
                        <hr />
                        <p>Visit your dashboard for real-time tracking.</p>
                        <p>Best regards,<br/>Team Seva Sangat</p>
                    </div>
                `
            });
        } catch (emailErr) {
            console.error('Email sending failed:', emailErr);
        }

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
