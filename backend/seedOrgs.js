const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Organization = require('./models/Organization');
const connectDB = require('./config/db');

dotenv.config({ path: require('path').resolve(__dirname, './.env') });

const organizations = [
    // Old Age Homes
    {
        name: 'Guru Vishram Vridh Ashram (SHEOWS)',
        category: 'Old Age Home',
        address: 'Badarpur, New Delhi',
        city: 'Delhi',
        state: 'Delhi',
        phone: '+91 11 2697 3418',
        email: 'info@sheows.org',
        description: 'Guru Vishram Vridh Ashram, run by SHEOWS, provides free shelter, medical care, and food for the needy and homeless elderly. They focus on rescuing abandoned seniors from the streets and providing them with a dignified life.',
        image: 'https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
        verified: true,
        location: { type: 'Point', coordinates: [77.3015, 28.5031] }
    },
    {
        name: 'Gracias Living',
        category: 'Old Age Home',
        address: 'Sector 45, Gurgaon',
        city: 'Gurgaon',
        state: 'Haryana',
        phone: '+91 8700484949',
        email: 'info@graciasliving.com',
        description: 'Gracias Living provides luxury assisted living with a focus on specialized care for dementia, Parkinson’s, and post-surgery rehabilitation. They offer personalized care plans and a premium environment for seniors.',
        image: 'https://images.unsplash.com/photo-1544333323-5099b4694742?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
        verified: true,
        location: { type: 'Point', coordinates: [77.0658, 28.4394] }
    },
    {
        name: 'Antara Senior Living',
        category: 'Old Age Home',
        address: 'Sector 150, Noida',
        city: 'Noida',
        state: 'Uttar Pradesh',
        phone: '+91 9643111222',
        email: 'contact@antaraseniorcare.com',
        description: 'Antara Senior Living (Max Group) offers premium, integrated senior care, combining independent living with comprehensive healthcare and rehabilitation facilities. It is designed to promote active and healthy aging.',
        image: 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
        verified: true,
        location: { type: 'Point', coordinates: [77.4612, 28.4526] }
    },

    // NGOs
    {
        name: 'Smile Foundation',
        category: 'NGO',
        address: 'V-11, Level-1, Green Park Extension, New Delhi-110016',
        city: 'New Delhi',
        state: 'Delhi',
        phone: '+91 11 43123700',
        email: 'info@smilefoundationindia.org',
        description: 'Smile Foundation is a national-level development organization directly benefiting children and families through projects on education, healthcare, livelihood, and women empowerment.',
        image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
        verified: true,
        location: { type: 'Point', coordinates: [77.2064, 28.5588] }
    },
    {
        name: 'Goonj',
        category: 'NGO',
        address: 'J-93, Sarita Vihar, New Delhi-110076',
        city: 'New Delhi',
        state: 'Delhi',
        phone: '+91 11 41344459',
        email: 'mail@goonj.org',
        description: 'Goonj focuses on disaster relief, community development, and humanitarian aid. They are well-known for their unique approach to using recycled materials as a resource for rural development.',
        image: 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
        verified: true,
        location: { type: 'Point', coordinates: [77.2913, 28.5303] }
    },
    {
        name: 'HelpAge India',
        category: 'NGO',
        address: 'C-14, Qutab Institutional Area, New Delhi-110016',
        city: 'New Delhi',
        state: 'Delhi',
        phone: '+91 11 41688955',
        email: 'info@helpageindia.org',
        description: 'HelpAge India is a leading charity working with and for disadvantaged elderly people for more than four decades. They run programs for age care, healthcare, and livelihood support.',
        image: 'https://images.unsplash.com/photo-1516733725897-1aa73b87c8e8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
        verified: true,
        location: { type: 'Point', coordinates: [77.1777, 28.5398] }
    },

    // Orphanages
    {
        name: 'Salaam Baalak Trust',
        category: 'Orphanage',
        address: '2nd Floor, DDA Community Centre, Paharganj, New Delhi',
        city: 'New Delhi',
        state: 'Delhi',
        phone: '+91 11 23584164',
        email: 'contact@salaambaalaktrust.com',
        description: 'Salaam Baalak Trust provides comprehensive support to street children, including shelter, education, mental health support, and vocational training to help them lead a better life.',
        image: 'https://images.unsplash.com/photo-1484662020986-75935d2ebc66?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
        verified: true,
        location: { type: 'Point', coordinates: [77.2131, 28.6441] }
    },
    {
        name: 'Asha Grih (Girls Home)',
        category: 'Orphanage',
        address: 'Sector 12, Dwarka, New Delhi',
        city: 'New Delhi',
        state: 'Delhi',
        phone: '+91 11 45034962',
        email: 'ashagrih2013@gmail.com',
        description: 'Asha Grih (Girls Home) provides a safe residential environment and care for vulnerable and orphaned girls, focusing on their education and overall development.',
        image: 'https://images.unsplash.com/photo-1509099836639-18ba1795216d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
        verified: true,
        location: { type: 'Point', coordinates: [77.0450, 28.5921] }
    },
    {
        name: 'Bal Sahyog',
        category: 'Orphanage',
        address: 'Connaught Place, New Delhi',
        city: 'New Delhi',
        state: 'Delhi',
        phone: '+91 11 23411995',
        email: 'info@balsahyog.org',
        description: 'Bal Sahyog is a premier organization for the care and protection of children. Located in the heart of Delhi, it focuses on the welfare and development of orphaned and vulnerable children.',
        image: 'https://images.unsplash.com/photo-1594608661623-aa0bd3a69d98?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
        verified: true,
        location: { type: 'Point', coordinates: [77.2183, 28.6289] }
    }
];

const seedData = async () => {
    try {
        await connectDB();

        // Clear existing organizations
        await Organization.deleteMany();
        console.log('🗑️ Existing organizations cleared');

        // Insert new organizations
        await Organization.insertMany(organizations);
        console.log('🚀 Real organization data with images seeded successfully!');

        process.exit();
    } catch (error) {
        console.error(`❌ Error seeding data: ${error.message}`);
        process.exit(1);
    }
};

seedData();
