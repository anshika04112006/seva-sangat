const mongoose = require('mongoose');

const withdrawalSchema = mongoose.Schema(
    {
        ngoId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        amount: {
            type: Number,
            required: true
        },
        reason: {
            type: String,
            required: true
        },
        status: {
            type: String,
            enum: ['pending', 'approved', 'rejected'],
            default: 'pending'
        },
        adminNote: {
            type: String,
            default: ''
        }
    },
    {
        timestamps: true
    }
);

const Withdrawal = mongoose.model('Withdrawal', withdrawalSchema);

module.exports = Withdrawal;
