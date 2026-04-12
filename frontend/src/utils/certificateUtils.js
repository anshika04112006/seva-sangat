import jsPDF from 'jspdf';

export const generateCertificate = (userData, eventData) => {
    const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
    });

    const width = doc.internal.pageSize.getWidth();
    const height = doc.internal.pageSize.getHeight();

    // 1. Background Watermark
    doc.setTextColor(220, 220, 220); // Very light grey
    doc.setFontSize(60);
    doc.setFont('helvetica', 'bold');
    
    // Rotate for diagonal watermark
    doc.saveGraphicsState();
    doc.setGState(new doc.GState({ opacity: 0.1 }));
    doc.text('SEVA SANGAT FOUNDATION', width / 2, height / 2, { align: 'center', angle: 45 });
    doc.restoreGraphicsState();

    // 2. High-Fidelity Borders
    // Outer Emerald Border
    doc.setDrawColor(22, 163, 74); // Emerald-600
    doc.setLineWidth(4);
    doc.rect(5, 5, width - 10, height - 10);
    
    // Inner Gold Border
    doc.setDrawColor(202, 138, 4); // Gold-600
    doc.setLineWidth(0.5);
    doc.rect(8, 8, width - 16, height - 16);

    // 3. Header Branding
    doc.setTextColor(22, 163, 74);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(48);
    doc.text('SEVA SANGAT', width / 2, 40, { align: 'center', charSpace: 2 });
    
    doc.setTextColor(202, 138, 4);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'normal');
    doc.text('COMMUNITY IMPACT & SOCIAL WELFARE', width / 2, 48, { align: 'center', charSpace: 1 });

    // 4. Main Content
    doc.setTextColor(31, 41, 55); // Dark Slate
    doc.setFontSize(28);
    doc.setFont('helvetica', 'normal');
    doc.text('CERTIFICATE OF PARTICIPATION', width / 2, 75, { align: 'center' });

    doc.setFontSize(16);
    doc.setFont('times', 'italic');
    doc.text('This is proudly presented to', width / 2, 90, { align: 'center' });

    doc.setTextColor(22, 163, 74);
    doc.setFontSize(42);
    doc.setFont('helvetica', 'bold');
    doc.text(userData.fullName.toUpperCase(), width / 2, 110, { align: 'center' });

    doc.setTextColor(31, 41, 55);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'normal');
    doc.text('Has successfully completed this mission and fulfilled all required responsibilities related to:', width / 2, 125, { align: 'center' });

    doc.setTextColor(202, 138, 4);
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text(`"${eventData.title}"`, width / 2, 140, { align: 'center' });

    doc.setTextColor(75, 85, 99);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'normal');
    doc.text(`Organized with ${eventData.ngoName} on ${new Date(eventData.date).toLocaleDateString()}`, width / 2, 155, { align: 'center' });

    // 5. Verification Section
    doc.setDrawColor(229, 231, 235);
    doc.line(40, 185, 100, 185);
    doc.line(width - 100, 185, width - 40, 185);

    doc.setTextColor(107, 114, 128);
    doc.setFontSize(10);
    doc.text('AUTHORIZED SIGNATURE', 70, 192, { align: 'center' });
    doc.text('FOUNDATION DIRECTOR', width - 70, 192, { align: 'center' });

    // 6. Certification ID & Verification
    doc.setFillColor(249, 250, 251);
    doc.rect(width / 2 - 40, height - 25, 80, 15, 'F');
    doc.setTextColor(156, 163, 175);
    doc.setFontSize(8);
    doc.text('VERIFICATION ID', width / 2, height - 20, { align: 'center' });
    doc.setTextColor(31, 41, 55);
    doc.setFontSize(10);
    doc.setFont('courier', 'bold');
    doc.text(eventData.certificateId || `CERT-${Date.now()}`, width / 2, height - 14, { align: 'center' });

    // Save
    const fileName = `SevaSangat_Certificate_${userData.fullName.replace(/\s+/g, '_')}.pdf`;
    doc.save(fileName);
};
