const User = require('../models/User');
const Organization = require('../models/Organization');
const generateToken = require('../utils/generateToken');
const bcrypt = require('bcryptjs');
const sendEmail = require('../utils/sendEmail');

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
    const { fullName, email, phone, password, role, profileData, orgData } = req.body;

    if (!fullName || !email || !phone || !password || !role) {
        return res.status(400).json({ message: 'Please include all required fields' });
    }

    if (role === 'organization' && !orgData) {
        return res.status(400).json({ message: 'Organization details are required for NGOs' });
    }

    try {
        let user = await User.findOne({ email });
        
        if (user && user.isVerified) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpire = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

        if (user && !user.isVerified) {
            user.fullName = fullName;
            user.phone = phone;
            user.password = password;
            user.role = role;
            user.profileData = profileData;
            user.otp = otp;
            user.otpExpire = otpExpire;
            await user.save();
        } else {
            user = await User.create({
                fullName,
                email,
                phone,
                password,
                role,
                profileData,
                otp,
                otpExpire,
                isVerified: false
            });
        }

        if (role === 'organization' && orgData) {
            // Check to avoid duplicate Org creations
            const existingOrg = await Organization.findOne({ email });
            if (!existingOrg) {
                await Organization.create({
                    name: fullName,
                    email: email,
                    phone: phone,
                    category: orgData.category,
                    address: orgData.address,
                    city: orgData.city,
                    state: orgData.state,
                    description: orgData.description,
                    registrationCertificate: orgData.registrationCertificate,
                    verified: false
                });
            }
        }

        // Send real OTP email
        try {
            await sendEmail({
                email: user.email,
                subject: 'Your Seva Sangat OTP Verification Code',
                message: `Your OTP is: ${otp}. It will expire in 10 minutes.`,
                html: `
                    <div style="font-family: Arial, sans-serif; color: #333; max-width: 480px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden;">
                        <div style="background: linear-gradient(135deg, #16a34a, #2ecc71); padding: 30px; text-align: center;">
                            <h1 style="color: white; margin: 0; font-size: 1.8rem;">Seva Sangat</h1>
                            <p style="color: rgba(255,255,255,0.9); margin: 5px 0 0;">Email Verification</p>
                        </div>
                        <div style="padding: 40px 30px; text-align: center;">
                            <p style="font-size: 1.1rem; color: #475569; margin-bottom: 30px;">Hi <strong>${fullName}</strong>, use this OTP to verify your email address:</p>
                            <div style="background: #f0fdf4; border: 2px dashed #16a34a; border-radius: 12px; padding: 25px; margin: 20px 0; display: inline-block;">
                                <span style="font-size: 2.5rem; font-weight: 900; letter-spacing: 12px; color: #16a34a;">${otp}</span>
                            </div>
                            <p style="color: #94a3b8; font-size: 0.85rem; margin-top: 20px;">This code expires in <strong>10 minutes</strong>. Do not share it with anyone.</p>
                        </div>
                        <div style="background: #f8fafc; padding: 20px; text-align: center; font-size: 0.8rem; color: #94a3b8;">
                            Team Seva Sangat • Empowering Kindness Through Technology
                        </div>
                    </div>
                `
            });
        } catch (emailErr) {
            console.error('OTP email failed, logging to console instead:', emailErr.message);
            console.log(`[FALLBACK] OTP for ${email}: ${otp}`);
        }

        res.status(201).json({
            message: 'Registration successful. Please verify OTP sent to your email.',
            email: user.email
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

    try {
        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            if (!user.isVerified) {
                return res.status(401).json({ message: 'Please verify your account first' });
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

const verifyOTP = async (req, res) => {
    const { email, otp } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.otp !== otp || user.otpExpire < Date.now()) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        user.isVerified = true;
        user.otp = undefined;
        user.otpExpire = undefined;
        await user.save();

        res.json({
            _id: user._id,
            token: generateToken(user._id),
            message: 'Email verified successfully'
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get logged-in user profile
// @route   GET /api/auth/profile
// @access  Private
const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password -otp -otpExpire');
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        res.status(200).json({ success: true, data: user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    registerUser,
    loginUser,
    verifyOTP,
    getProfile,
};
