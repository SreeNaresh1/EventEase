/**
 * Export Utilities for EventEase
 * Generates sanitized CSV from attendee list
 */

export const exportAttendeesToCsv = (eventTitle, attendees = []) => {
  if (!attendees || attendees.length === 0) return;

  const headers = [
    'S.No',
    'Student Name',
    'Email Address',
    'Department',
    'Year',
    'Registered Date',
    'Attendance Status',
    'Check-in Time',
  ];

  const escapeCsv = (val) => {
    if (val === null || val === undefined) return '""';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  };

  const rows = attendees.map((reg, index) => [
    index + 1,
    reg.student?.name || 'N/A',
    reg.student?.email || 'N/A',
    reg.student?.department || 'N/A',
    reg.student?.year || 'N/A',
    reg.createdAt ? new Date(reg.createdAt).toLocaleDateString('en-IN') : 'N/A',
    reg.attended ? 'Attended' : 'Registered (Pending)',
    reg.checkedInAt ? new Date(reg.checkedInAt).toLocaleTimeString('en-IN') : 'Not Checked In',
  ]);

  const csvContent = [
    headers.map(escapeCsv).join(','),
    ...rows.map(row => row.map(escapeCsv).join(',')),
  ].join('\r\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  const sanitizedTitle = (eventTitle || 'Event').replace(/[^a-zA-Z0-9]/g, '_');
  link.setAttribute('download', `${sanitizedTitle}_Attendees_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

