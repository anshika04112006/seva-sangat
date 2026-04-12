const mongoose = require('mongoose');
const Organization = require('./models/Organization');
const User = require('./models/User');

const sync = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/sevasangat');
        const orgs = await Organization.find();
        let count = 0;
        for (let org of orgs) {
            const exists = await User.findOne({ email: org.email });
            if (!exists) {
                await User.create({
                    fullName: org.name,
                    email: org.email,
                    phone: org.phone,
                    password: 'password123',
                    role: 'organization',
                    isVerified: true
                });
                count++;
            }
        }
        console.log('Synced ' + count + ' orgs to users');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};
sync();
