const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Event = require('./models/Event');
const User = require('./models/User');
const connectDB = require('./config/db');

dotenv.config({ path: require('path').resolve(__dirname, './.env') });

const seedEvents = async () => {
    try {
        await connectDB();

        // Find or create an NGO user to act as the owner of these events
        let ngoUser = await User.findOne({ email: 'hello@sevasangat.org' });

        if (!ngoUser) {
            ngoUser = await User.create({
                fullName: 'Seva Sangat Official',
                email: 'hello@sevasangat.org',
                phone: '1800111222',
                password: 'password123',
                role: 'organization',
                isVerified: true
            });
            console.log('✅ Created official NGO user account');
        }

        const events = [
            {
                title: 'Healthcare Camp for Elderly',
                ngoId: ngoUser._id,
                ngoName: ngoUser.fullName,
                description: 'Join us in providing basic medical checkups and distributing medicines to the elderly in rural areas.',
                requiredSkills: ['Healthcare', 'Medical', 'Compassion'],
                location: 'Delhi',
                date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
                time: '09:00 AM',
                maxVolunteers: 15,
                volunteersNeeded: 10,
                status: 'upcoming',
                isUrgent: true,
                averageRating: 4.8
            },
            {
                title: 'Digital Literacy Workshop',
                ngoId: ngoUser._id,
                ngoName: ngoUser.fullName,
                description: 'Teach basic computer and smartphone usage to women from underprivileged backgrounds to help them find digital work.',
                requiredSkills: ['Teaching', 'Tech Support', 'Digital'],
                location: 'Noida',
                date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
                time: '11:00 AM',
                maxVolunteers: 20,
                volunteersNeeded: 15,
                status: 'upcoming',
                isUrgent: false,
                averageRating: 4.5
            },
            {
                title: 'Legal Aid & Awareness Drive',
                ngoId: ngoUser._id,
                ngoName: ngoUser.fullName,
                description: 'Help us conduct awareness seminars about fundamental rights and provide free consultation to those in need.',
                requiredSkills: ['Legal', 'Public Speaking', 'Counseling'],
                location: 'Gurgaon',
                date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
                time: '10:00 AM',
                maxVolunteers: 5,
                volunteersNeeded: 5,
                status: 'upcoming',
                isUrgent: true,
                averageRating: 4.9
            },
            {
                title: 'Food Distribution Drive',
                ngoId: ngoUser._id,
                ngoName: ngoUser.fullName,
                description: 'Help distribute food packets to homeless individuals across the city over the weekend.',
                requiredSkills: ['Management', 'Logistics'],
                location: 'New Delhi',
                date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
                time: '08:00 AM',
                maxVolunteers: 30,
                volunteersNeeded: 22,
                status: 'upcoming',
                isUrgent: false,
                averageRating: 4.6
            },
            {
                title: 'Skill Development Bootcamp',
                ngoId: ngoUser._id,
                ngoName: ngoUser.fullName,
                description: 'A 2-day bootcamp focusing on resume building, interview techniques, and basic soft skills for youth.',
                requiredSkills: ['Teaching', 'Management'],
                location: 'Delhi',
                date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days from now
                time: '09:30 AM',
                maxVolunteers: 10,
                volunteersNeeded: 8,
                status: 'upcoming',
                isUrgent: false,
                averageRating: 4.7
            }
        ];

        await Event.deleteMany({});
        console.log('🗑️ Cleared existing events');

        await Event.insertMany(events);
        console.log('🎉 Successfully seeded 5 realistic volunteer events!');

        process.exit();
    } catch (error) {
        console.error(`❌ Error seeding events: ${error.message}`);
        process.exit(1);
    }
};

seedEvents();
