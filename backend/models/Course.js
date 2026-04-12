const mongoose = require('mongoose');

const courseSchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Please add a course title'],
        },
        description: {
            type: String,
            required: [true, 'Please add a description'],
        },
        category: {
            type: String,
            required: true,
            enum: ['vocational', 'digital_literacy', 'financial_literacy', 'healthcare_training'],
        },
        duration: {
            type: String,
            required: true,
        },
        modules: [
            {
                name: String,
                content: String,
                isCompleted: {
                    type: Boolean,
                    default: false,
                },
            },
        ],
        enrolledStudents: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
        certificatesIssued: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Course', courseSchema);
