const User = require('../models/User');
const Otp = require('../models/Otp');
const generateToken = require('../utils/generateToken');
const bcrypt = require('bcryptjs');
const sendEmail = require('../utils/sendEmail');

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
    const { fullName, email, phone, password, role, skills, location } = req.body;

    if (!fullName || !email || !phone || !password || !location) {
        return res.status(400).json({ message: 'Please include all required fields' });
    }

    // Basic email validation
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ message: 'Please provide a valid email address' });
    }

    // Password length validation
    if (password.length < 6) {
        return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    try {
        let user = await User.findOne({ email });
        
        if (user && user.isVerified) {
            return res.status(400).json({ message: 'User already exists and is verified' });
        }

        if (user && !user.isVerified) {
            // Update existing unverified user with new details
            user.fullName = fullName;
            user.phone = phone;
            user.password = password;
            user.role = role || 'user';
            user.skills = skills || [];
            user.location = location;
            await user.save();
        } else {
            // Create new unverified user
            user = await User.create({
                fullName,
                email,
                phone,
                password,
                role,
                skills,
                location,
                isVerified: false
            });
        }

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        await Otp.create({ email, otp });

        // Send Real OTP Email
        try {
            await sendEmail({
                email: user.email,
                subject: 'Seva Sangat - Verification OTP',
                message: `Your verification OTP is: ${otp}. It will expire in 10 minutes.`,
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                        <h2 style="color: #ff9f43; text-align: center;">Welcome to Seva Sangat!</h2>
                        <p>Hi ${user.fullName},</p>
                        <p>Thank you for joining our community. Please use the following OTP to verify your account:</p>
                        <div style="background: #f8f9fa; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; color: #2d3436; border-radius: 5px; margin: 20px 0;">
                            ${otp}
                        </div>
                        <p>This code will expire in 10 minutes. If you didn't request this, please ignore this email.</p>
                        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
                        <p style="font-size: 12px; color: #636e72; text-align: center;">&copy; ${new Date().getFullYear()} Seva Sangat. Empowering Social Impact.</p>
                    </div>
                `
            });
        } catch (mailError) {
            console.error('Email sending failed:', mailError);
            // We don't block the response, but log the error. 
            // In a production app, you might want to handle this differently.
        }

        res.status(200).json({
            success: true,
            message: 'Registration initiated. Please verify OTP sent to your email.',
            email: user.email
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Verify Registration OTP
// @route   POST /api/auth/register-verify
// @access  Public
const verifyRegistration = async (req, res) => {
    const { email, otp } = req.body;

    if (!email || !otp) {
        return res.status(400).json({ message: 'Please provide email and OTP' });
    }

    try {
        const otpRecord = await Otp.findOne({ email, otp });

        if (!otpRecord) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.isVerified = true;
        await user.save();

        // Delete used OTP
        await Otp.deleteMany({ email });

        res.status(200).json({
            success: true,
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            role: user.role,
            token: generateToken(user._id),
            message: 'Account verified successfully'
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Please include both email and password' });
    }

    // Basic email validation
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ message: 'Please provide a valid email address' });
    }

    try {
        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            if (!user.isVerified) {
                return res.status(401).json({ 
                    message: 'Please verify your account first',
                    isUnverified: true,
                    email: user.email 
                });
            }
            res.json({
                _id: user._id,
                fullName: user.fullName,
                email: user.email,
                role: user.role,
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Forgot Password - Send OTP
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: 'Please provide an email' });
    }

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User with this email does not exist' });
        }

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Save OTP to database
        await Otp.create({ email, otp });

        // Send Real OTP Email
        try {
            await sendEmail({
                email: user.email,
                subject: 'Seva Sangat - Password Reset OTP',
                message: `Your password reset OTP is: ${otp}. It will expire in 10 minutes.`,
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                        <h2 style="color: #ff9f43; text-align: center;">Password Reset Request</h2>
                        <p>Hi ${user.fullName},</p>
                        <p>We received a request to reset your password. Please use the following OTP to proceed:</p>
                        <div style="background: #f8f9fa; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; color: #2d3436; border-radius: 5px; margin: 20px 0;">
                            ${otp}
                        </div>
                        <p>This code will expire in 10 minutes. If you didn't request a password reset, please secure your account immediately.</p>
                        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
                        <p style="font-size: 12px; color: #636e72; text-align: center;">&copy; ${new Date().getFullYear()} Seva Sangat. Empowering Social Impact.</p>
                    </div>
                `
            });
        } catch (mailError) {
            console.error('Email sending failed:', mailError);
        }
        
        res.status(200).json({ 
            success: true, 
            message: 'OTP sent to your email' 
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Verify OTP
// @route   POST /api/auth/verify-otp
// @access  Public
const verifyOtp = async (req, res) => {
    const { email, otp } = req.body;

    if (!email || !otp) {
        return res.status(400).json({ message: 'Please provide email and OTP' });
    }

    try {
        const otpRecord = await Otp.findOne({ email, otp });

        if (!otpRecord) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        res.status(200).json({ success: true, message: 'OTP verified successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Reset Password
// @route   POST /api/auth/reset-password
// @access  Public
const resetPassword = async (req, res) => {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
        return res.status(400).json({ message: 'Please provide all fields' });
    }

    try {
        const otpRecord = await Otp.findOne({ email, otp });

        if (!otpRecord) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update password (pre-save hook will handle hashing)
        user.password = newPassword;
        await user.save();

        // Delete used OTP
        await Otp.deleteMany({ email });

        res.status(200).json({ success: true, message: 'Password reset successful' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    registerUser,
    loginUser,
    forgotPassword,
    verifyOtp,
    resetPassword,
    verifyRegistration
};
