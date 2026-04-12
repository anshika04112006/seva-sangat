const Withdrawal = require('../models/Withdrawal');
const User = require('../models/User');

// @desc    Request a withdrawal
// @route   POST /api/withdrawals
// @access  Private/NGO
const requestWithdrawal = async (req, res) => {
    const { amount, reason } = req.body;

    if (!amount || !reason) {
        return res.status(400).json({ message: 'Please provide amount and reason' });
    }

    try {
        const withdrawal = await Withdrawal.create({
            ngoId: req.user._id,
            amount,
            reason
        });

        res.status(201).json({
            success: true,
            data: withdrawal,
            message: 'Withdrawal request submitted successfully'
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all withdrawals (Admin)
// @route   GET /api/withdrawals
// @access  Private/Admin
const getWithdrawals = async (req, res) => {
    try {
        const withdrawals = await Withdrawal.find().populate('ngoId', 'fullName email');
        res.status(200).json({ success: true, data: withdrawals });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get NGO's own withdrawals
// @route   GET /api/withdrawals/my
// @access  Private/NGO
const getMyWithdrawals = async (req, res) => {
    try {
        const withdrawals = await Withdrawal.find({ ngoId: req.user._id });
        res.status(200).json({ success: true, data: withdrawals });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update withdrawal status (Admin)
// @route   PUT /api/withdrawals/:id
// @access  Private/Admin
const updateWithdrawalStatus = async (req, res) => {
    const { status, adminNote } = req.body;

    try {
        const withdrawal = await Withdrawal.findById(req.params.id);

        if (!withdrawal) {
            return res.status(404).json({ message: 'Withdrawal request not found' });
        }

        withdrawal.status = status || withdrawal.status;
        withdrawal.adminNote = adminNote || withdrawal.adminNote;
        
        await withdrawal.save();

        res.status(200).json({
            success: true,
            data: withdrawal,
            message: `Withdrawal request ${status}`
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    requestWithdrawal,
    getWithdrawals,
    getMyWithdrawals,
    updateWithdrawalStatus
};
