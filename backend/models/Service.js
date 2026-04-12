const mongoose = require('mongoose');

const serviceSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please add a service name'],
        },
        category: {
            type: String,
            required: [true, 'Please add a category'],
            enum: ['healthcare', 'legal_aid', 'jobs', 'training', 'education'],
        },
        description: {
            type: String,
            required: [true, 'Please add a description'],
        },
        address: String,
        provider: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        contactInfo: {
            phone: String,
            email: String,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Service', serviceSchema);
