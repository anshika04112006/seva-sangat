const mongoose = require('mongoose');
const Organization = require('./models/Organization');

const injectCertificates = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/sevasangat');
        
        let count = 0;
        
        // Find all organizations that don't have a valid certificate
        const orgs = await Organization.find({ 
            $or: [
                { registrationCertificate: null },
                { registrationCertificate: { $exists: false } },
                { registrationCertificate: '' }
            ]
        });
        
        for (let org of orgs) {
            org.registrationCertificate = 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf';
            await org.save();
            count++;
        }
        
        console.log(`Injected dummy certificates into ${count} legacy organizations.`);
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

injectCertificates();
