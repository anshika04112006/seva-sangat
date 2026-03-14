const mongoose = require('mongoose');

const eventSchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Please add an event title'],
            trim: true
        },
        ngoId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        ngoName: {
            type: String,
            required: [true, 'Please add the NGO name']
        },
        description: {
            type: String,
            required: [true, 'Please add a description']
        },
        requiredSkills: {
            type: [String],
            default: [],
            required: [true, 'Please add required skills']
        },
        location: {
            type: String,
            required: [true, 'Please add a location']
        },
        date: {
            type: Date,
            required: [true, 'Please add a date']
        },
        time: {
            type: String,
            required: [true, 'Please add a time']
        },
        maxVolunteers: {
            type: Number,
            required: [true, 'Please add max volunteers'],
            default: 1
        },
        volunteersNeeded: {
            type: Number,
            default: 1
        },
        status: {
            type: String,
            enum: ['upcoming', 'ongoing', 'completed'],
            default: 'upcoming'
        }
    },
    {
        timestamps: true
    }
);

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
