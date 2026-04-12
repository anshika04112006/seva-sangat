const mongoose = require('mongoose');

const donationSchema = mongoose.Schema(
    {
        donorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        organizationId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Organization',
            required: true
        },
        donationType: {
            type: String,
            enum: ['money', 'food', 'clothes', 'books', 'medical'],
            required: true
        },
        amount: {
            type: Number,
            required: function() { return this.donationType === 'money'; }
        },
        itemDescription: {
            type: String,
            required: function() { return this.donationType !== 'money'; }
        },
        quantity: {
            type: String,
            required: function() { return this.donationType !== 'money'; }
        },
        status: {
            type: String,
            enum: ['pending', 'received', 'dispatched', 'distributing', 'completed', 'cancelled'],
            default: 'pending'
        },
        paymentId: {
            type: String,
            default: null
        },
        paymentGateway: {
            type: String,
            default: 'dummy'
        },
        paymentStatus: {
            type: String,
            enum: ['pending', 'success', 'failed'],
            default: 'pending'
        },
        trackingHistory: [
            {
                status: String,
                timestamp: { type: Date, default: Date.now },
                message: String
            }
        ]
    },
    {
        timestamps: true
    }
);

const Donation = mongoose.model('Donation', donationSchema);

module.exports = Donation;
