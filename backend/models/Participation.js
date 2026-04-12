const mongoose = require('mongoose');

const participationSchema = mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        eventId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Event',
            required: true
        },
        status: {
            type: String,
            enum: ['registered', 'attended', 'completed'],
            default: 'registered'
        },
        feedback: {
            type: String,
            default: ''
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

// Prevent duplicate participation
participationSchema.index({ userId: 1, eventId: 1 }, { unique: true });

const Participation = mongoose.model('Participation', participationSchema);

module.exports = Participation;
