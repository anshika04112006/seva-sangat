const mongoose = require('mongoose');

const organizationSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please add the organization name'],
            trim: true
        },
        category: {
            type: String,
            required: [true, 'Please select a category'],
            enum: ['NGO', 'Orphanage', 'Old Age Home']
        },
        address: {
            type: String,
            required: [true, 'Please add an address']
        },
        city: {
            type: String,
            required: [true, 'Please add a city'],
            trim: true
        },
        state: {
            type: String,
            required: [true, 'Please add a state'],
            trim: true
        },
        phone: {
            type: String,
            required: [true, 'Please add a contact phone number']
        },
        email: {
            type: String,
            required: [true, 'Please add a contact email'],
            unique: true,
            trim: true,
            lowercase: true
        },
        description: {
            type: String,
            required: [true, 'Please add a description']
        },
        verified: {
            type: Boolean,
            default: false
        },
        location: {
            type: {
                type: String,
                enum: ['Point'],
                default: 'Point'
            },
            coordinates: {
                type: [Number],
                required: false
            }
        }
    },
    {
        timestamps: true
    }
);

// Index for geo-spatial queries if needed later
organizationSchema.index({ location: '2dsphere' });

const Organization = mongoose.model('Organization', organizationSchema);

module.exports = Organization;
