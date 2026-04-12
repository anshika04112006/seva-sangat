const mongoose = require('mongoose');
const Donation = require('./models/Donation');
const User = require('./models/User');
const Organization = require('./models/Organization');
const Event = require('./models/Event');
const Booking = require('./models/Booking');

const inject = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/sevasangat');

        const orgMatch = await Organization.findOne({email: 'hello@sevasangat.org'});
        const userOrg = await User.findOne({email: 'hello@sevasangat.org'});
        const vol = await User.findOne({email: 'testvol@example.com'});

        if(orgMatch && vol) {
            // Create a test donation
            await Donation.create({
                donorId: vol._id,
                organizationId: orgMatch._id,
                donationType: 'money',
                amount: 10000,
                status: 'pending',
                paymentStatus: 'success',
                trackingHistory: [{status: 'pending', message: 'Test donation initialized.'}]
            });
            console.log('Test donation injected.');
            
            // Reassign the first event to Seva Sangat
            const ev = await Event.findOne();
            if(ev) {
                ev.ngoId = userOrg._id;
                ev.ngoName = userOrg.fullName;
                await ev.save();
                console.log('Event assigned to Seva Sangat.');
                
                // Book the event
                const exist = await Booking.findOne({user: vol._id, event: ev._id});
                if(!exist) {
                    await Booking.create({user: vol._id, event: ev._id});
                    console.log('Test booking injected.');
                }
            }
        }
        process.exit(0);
    } catch(err) {
        console.error(err);
        process.exit(1);
    }
}
inject();
