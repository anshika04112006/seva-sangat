const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema(
    {
        fullName: {
            type: String,
            required: [true, 'Please add a full name'],
        },
        email: {
            type: String,
            required: [true, 'Please add an email'],
            unique: true,
            match: [
                /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                'Please add a valid email',
            ],
        },
        phone: {
            type: String,
            required: [true, 'Please add a phone number'],
            unique: true,
        },
        password: {
            type: String,
            required: [true, 'Please add a password'],
            minlength: 6,
        },
        role: {
            type: String,
            enum: ['volunteer', 'beneficiary', 'admin', 'organization'],
            default: 'volunteer',
        },
        skills: {
            type: [String],
            default: [],
        },
        // Demographic Data for AI Matching
        demographicData: {
            age: Number,
            gender: String,
            householdSize: Number,
            income: Number,
        },
        needs: {
            type: [String],
            default: [], // e.g., 'healthcare', 'legal_aid', 'jobs'
        },
        location: {
            type: String,
            default: '',
        },
        isVerified: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

// Hashing password before saving
userSchema.pre('save', async function () {
    if (!this.isModified('password')) {
        return;
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare entered password with hashed password
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
module.exports = User;
