const mongoose = require('mongoose');

const seedAdmin = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/sevasangat');
        const User = require('./models/User');

        let admin = await User.findOne({ role: 'admin' });
        if (!admin) {
            admin = await User.create({
                fullName: 'System Administrator',
                email: 'admin@sevasangat.com',
                phone: '0000000000',
                password: 'password123',
                role: 'admin',
                isVerified: true
            });
            console.log('Created Admin: admin@sevasangat.com / password123');
        } else {
            console.log('Admin already exists:', admin.email);
            admin.password = 'password123';
            await admin.save();
            console.log('Reset admin password to: password123');
        }
        process.exit(0);
    } catch(err) {
        console.error(err);
        process.exit(1);
    }
};
seedAdmin();
