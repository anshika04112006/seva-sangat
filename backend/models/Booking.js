const mongoose = require('mongoose');

const bookingSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        event: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Event',
            required: true
        },
        bookingStatus: {
            type: String,
            enum: ['pending', 'confirmed', 'cancelled'],
            default: 'confirmed'
        },
        participationStatus: {
            type: String,
            enum: ['not-attended', 'attended', 'completed', 'no-show'],
            default: 'not-attended'
        },
        certificateId: {
            type: String,
            default: null
        }
    },
    {
        timestamps: true
    }
);

// Ensure a user can only book an event once
bookingSchema.index({ user: 1, event: 1 }, { unique: true });

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
