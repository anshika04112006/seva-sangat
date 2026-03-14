const PDFDocument = require('pdfkit');
const Booking = require('../models/Booking');

// @desc    Generate and download participation certificate
// @route   GET /api/certificates/download/:id
// @access  Private
const downloadCertificate = async (req, res) => {
    try {
        const bookingId = req.params.id;

        const booking = await Booking.findById(bookingId)
            .populate('user', 'fullName')
            .populate({
                path: 'event',
                populate: { path: 'ngoId', select: 'name' }
            });

        if (!booking) {
            return res.status(404).json({ success: false, message: 'Booking record not found' });
        }

        // Security check: Only the owner of the booking can download
        if (booking.user._id.toString() !== req.user.id) {
            return res.status(403).json({ success: false, message: 'You are not authorized to download this certificate' });
        }

        // Participation check
        if (booking.participationStatus !== 'attended') {
            return res.status(400).json({ success: false, message: 'Certificate is only available for attended events' });
        }

        const doc = new PDFDocument({ 
            layout: 'landscape', 
            size: 'A4',
            margins: { top: 50, bottom: 50, left: 50, right: 50 }
        });

        // Set response headers for file download
        const filename = `Certificate_${booking.event.title.replace(/\s+/g, '_')}.pdf`;
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=${filename}`);

        // Pipe PDF to response
        doc.pipe(res);

        // --- DRAWING LOGIC ---

        const width = doc.page.width;
        const height = doc.page.height;

        // Outer Border (Gold)
        doc.rect(20, 20, width - 40, height - 40)
           .lineWidth(8)
           .stroke('#d4af37');

        // Inner Border (Thin Gold)
        doc.rect(35, 35, width - 70, height - 70)
           .lineWidth(1)
           .stroke('#d4af37');

        // Header - Logo Placeholder
        doc.circle(width / 2, 80, 25)
           .fill('#ff9933')
           .stroke('#d4af37');
        
        doc.fillColor('white')
           .font('Helvetica-Bold')
           .fontSize(15)
           .text('SS', width / 2 - 10, 73);

        // Company Name
        doc.fillColor('#1a1a1a')
           .fontSize(35)
           .font('Helvetica-Bold')
           .text('SEVA SANGAT', 0, 115, { align: 'center', characterSpacing: 5 });

        doc.fontSize(12)
           .font('Helvetica')
           .fillColor('#d4af37')
           .text('FOUNDATION FOR SOCIAL IMPACT', 0, 155, { align: 'center', characterSpacing: 2 });

        // Main Title
        doc.moveDown(2);
        doc.fillColor('#1a1a1a')
           .fontSize(30)
           .font('Helvetica')
           .text('CERTIFICATE OF PARTICIPATION', { align: 'center' });

        // Body text
        doc.moveDown(1);
        doc.fontSize(16)
           .font('Helvetica-Oblique')
           .fillColor('#666666')
           .text('This is proudly presented to', { align: 'center' });

        // Volunteer Name
        doc.moveDown(0.5);
        doc.fontSize(45)
           .font('Helvetica-Bold')
           .fillColor('#1a1a1a')
           .text(booking.user.fullName.toUpperCase(), { align: 'center' });

        // Recognition
        doc.moveDown(0.5);
        doc.fontSize(14)
           .font('Helvetica')
           .fillColor('#555555')
           .text('For their outstanding commitment and invaluable contribution as a volunteer in', { align: 'center' });

        // Event Name
        doc.moveDown(0.5);
        doc.fontSize(24)
           .font('Helvetica-Bold')
           .fillColor('#ff9933')
           .text(`"${booking.event.title}"`, { align: 'center' });

        // NGO / Location
        doc.moveDown(0.5);
        doc.fontSize(14)
           .font('Helvetica')
           .fillColor('#666666')
           .text(`Organized by ${booking.event.ngoId.name}`, { align: 'center' });

        doc.text(`on ${new Date(booking.event.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}`, { align: 'center' });

        // Signatures Section
        const sigY = height - 120;
        
        // Left Signature
        doc.moveTo(100, sigY).lineTo(300, sigY).lineWidth(1).stroke('#333333');
        doc.fillColor('#333333')
           .font('Helvetica-Bold')
           .fontSize(12)
           .text('AUTHORIZED SIGNATORY', 100, sigY + 10, { width: 200, align: 'center' });
        doc.font('Helvetica').fontSize(10).text(booking.event.ngoId.name, 100, sigY + 25, { width: 200, align: 'center' });

        // Right Signature
        doc.moveTo(width - 300, sigY).lineTo(width - 100, sigY).lineWidth(1).stroke('#333333');
        doc.font('Helvetica-Bold')
           .fontSize(12)
           .text('FOUNDATION DIRECTOR', width - 300, sigY + 10, { width: 200, align: 'center' });
        doc.font('Helvetica').fontSize(10).text('Seva Sangat Foundation', width - 300, sigY + 25, { width: 200, align: 'center' });

        // Seal Placeholder
        doc.circle(width / 2, sigY - 10, 40).dash(5, { space: 2 }).stroke('#d4af37');
        doc.fillColor('#d4af37').fontSize(10).font('Helvetica-Bold').text('OFFICIAL SEAL', width / 2 - 35, sigY - 15, { width: 70, align: 'center' });

        doc.end();

    } catch (error) {
        if (!res.headersSent) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
};

module.exports = {
    downloadCertificate
};
