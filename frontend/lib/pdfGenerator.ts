import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { Company, DashboardStats, TimelineEvent } from '@/types/placement';

interface ReportData {
  user: {
    name: string;
    email: string;
    techStacks?: string[];
  };
  stats: DashboardStats;
  companies: Company[];
  timeline: TimelineEvent[];
}

export const generateStudentReport = ({ user, stats, companies, timeline }: ReportData) => {
  // Initialize document
  const doc = new jsPDF();
  
  // Settings
  const pageWidth = doc.internal.pageSize.width;
  const margin = 14;
  
  // 1. Header Section
  doc.setFillColor(197, 176, 244); // #c5b0f4 signature color
  doc.rect(0, 0, pageWidth, 40, 'F');
  
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('Placement Portal - Student Report', margin, 20);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  const dateStr = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' 
  });
  doc.text(`Generated on: ${dateStr}`, margin, 28);
  
  // 2. Profile & Summary Section
  let currentY = 50;
  
  // User Info
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Student Profile', margin, currentY);
  
  currentY += 8;
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text(`Name: ${user.name}`, margin, currentY);
  currentY += 6;
  doc.text(`Email: ${user.email}`, margin, currentY);
  currentY += 6;
  const skillsStr = user.techStacks && user.techStacks.length > 0 
    ? user.techStacks.join(', ') 
    : 'None configured';
  doc.text(`Tech Stacks: ${skillsStr}`, margin, currentY, { maxWidth: pageWidth - margin * 2 });
  
  // Adjust Y based on skills wrap
  const skillsLines = doc.splitTextToSize(`Tech Stacks: ${skillsStr}`, pageWidth - margin * 2);
  currentY += (skillsLines.length * 6) + 4;
  
  // Pipeline Stats
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Pipeline Overview', margin, currentY);
  
  currentY += 8;
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text(`Total Applications: ${stats.totalApplied}`, margin, currentY);
  doc.text(`Active Pipeline: ${stats.totalActive}`, margin + 60, currentY);
  currentY += 6;
  doc.text(`Offers/Selected: ${stats.totalOffers}`, margin, currentY);
  doc.text(`Success Rate: ${stats.successRate}%`, margin + 60, currentY);
  
  currentY += 15;
  
  // 3. Timeline Events Table
  if (timeline.length > 0) {
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Timeline & Important Dates', margin, currentY);
    
    autoTable(doc, {
      startY: currentY + 4,
      head: [['Status', 'Date', 'Event', 'Description']],
      body: timeline.map(event => {
        const eventDate = new Date(event.date);
        const isCompleted = eventDate < new Date();
        return [
          isCompleted ? 'COMPLETED' : 'UPCOMING',
          eventDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          event.title,
          event.description || '-'
        ];
      }),
      headStyles: { fillColor: [0, 0, 0], textColor: [255, 255, 255] },
      styles: { fontSize: 9, cellPadding: 3 },
      columnStyles: { 0: { cellWidth: 25 }, 1: { cellWidth: 20 }, 2: { cellWidth: 50 } }
    });
    
    currentY = (doc as any).lastAutoTable.finalY + 15;
  }
  
  // 4. Application History Table
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  
  // Check page break for title
  if (currentY > doc.internal.pageSize.height - 30) {
    doc.addPage();
    currentY = margin;
  }
  
  doc.text('Application History', margin, currentY);
  
  autoTable(doc, {
    startY: currentY + 4,
    head: [['Company', 'Role', 'Status', 'Applied On', 'Match %']],
    body: companies.map(c => {
      // Calculate match %
      let matchStr = '-';
      if (c.techStacks && c.techStacks.length > 0) {
        const userStacks = user.techStacks || [];
        const matchingStacks = c.techStacks.filter(t => userStacks.includes(t));
        const matchPercentage = Math.round((matchingStacks.length / c.techStacks.length) * 100);
        matchStr = `${matchPercentage}%`;
      }

      return [
        c.companyName,
        c.role,
        c.status,
        c.applicationDate ? new Date(c.applicationDate).toLocaleDateString() : '-',
        matchStr
      ];
    }),
    headStyles: { fillColor: [0, 0, 0], textColor: [255, 255, 255] },
    styles: { fontSize: 9, cellPadding: 3 },
  });
  
  // 5. Save the document
  const fileName = `Placement_Report_${user.name.replace(/\s+/g, '_')}.pdf`;
  doc.save(fileName);
};
