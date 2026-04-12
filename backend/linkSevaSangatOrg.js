const mongoose = require('mongoose');

const init = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/sevasangat');
        const Organization = require('./models/Organization');
        
        let org = await Organization.findOne({email: 'hello@sevasangat.org'});
        if (!org) {
            org = await Organization.create({
                name: 'Seva Sangat Official',
                email: 'hello@sevasangat.org',
                phone: '1800111222',
                category: 'NGO',
                address: 'DTI Headquarters',
                city: 'New Delhi',
                state: 'Delhi',
                description: 'Central management for the Seva Sangat social welfare initiative.',
                verified: true,
                location: {
                    type: 'Point',
                    coordinates: [77.2090, 28.6139]
                }
            });
            console.log('Created Org for hello@sevasangat.org');
        } else {
            console.log('Org already exists:', !!org);
        }
        process.exit(0);
    } catch(err) {
        console.error(err);
        process.exit(1);
    }
};

init();
