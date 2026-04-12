const mongoose = require('mongoose');
const Donation = require('./models/Donation');
const User = require('./models/User');
const Organization = require('./models/Organization');

const check = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/sevasangat');

        console.log("--- DONATIONS ---");
        const donations = await Donation.find();
        for(let d of donations) {
            const org = await Organization.findById(d.organizationId);
            const userOrg = await User.findById(d.organizationId);
            console.log(`Donation: amount=${d.amount}, item=${d.itemDescription}, orgId=${d.organizationId}, mappedToOrgDb=${!!org}, mappedToUserDb=${!!userOrg}`);
        }

        console.log("--- SEVA SANGAT DB ENTITIES ---");
        const user = await User.findOne({email: 'hello@sevasangat.org'});
        console.log("User (hello@sevasangat.org):", user ? user._id : 'null');
        
        const orgMatch = await Organization.findOne({email: 'hello@sevasangat.org'});
        console.log("Organization (hello@sevasangat.org):", orgMatch ? orgMatch._id : 'null');
        
        process.exit(0);
    } catch(err) {
        console.error(err);
        process.exit(1);
    }
}
check();
