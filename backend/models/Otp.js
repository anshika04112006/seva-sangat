const mongoose = require('mongoose');

const otpSchema = mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
        },
        otp: {
            type: String,
            required: true,
        },
        createdAt: {
            type: Date,
            default: Date.now,
            index: { expires: 600 } // Document will expire in 10 minutes (600 seconds)
        },
    }
);

const Otp = mongoose.model('Otp', otpSchema);
module.exports = Otp;
