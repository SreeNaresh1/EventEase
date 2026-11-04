/**
 * Calendar Utilities for EventEase
 * Generates Google Calendar link and RFC 5545 .ics download
 */

export const getGoogleCalendarUrl = (event) => {
  if (!event) return '#';

  const formatCalendarDate = (dateStr, timeStr) => {
    const d = new Date(dateStr);
    const [hours, minutes] = (timeStr || '09:00').split(':').map(Number);
    d.setHours(hours || 0, minutes || 0, 0, 0);
    return d.toISOString().replace(/-|:|\.\d\d\d/g, '');
  };

  const start = formatCalendarDate(event.date, event.startTime);
  const end = formatCalendarDate(event.date, event.endTime || event.startTime);

  const title = encodeURIComponent(event.title || 'Campus Event');
  const details = encodeURIComponent(
    `${event.description || ''}\n\nCategory: ${event.category}\nEligibility: ${event.eligibility || 'All students'}\nOrganized via EventEase`
  );
  const location = encodeURIComponent(event.venue || 'Campus');

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${start}/${end}&details=${details}&location=${location}`;
};

export const downloadIcsFile = (event) => {
  if (!event) return;

  const formatIcsDate = (dateStr, timeStr) => {
    const d = new Date(dateStr);
    const [hours, minutes] = (timeStr || '09:00').split(':').map(Number);
    d.setHours(hours || 0, minutes || 0, 0, 0);
    return d.toISOString().replace(/-|:|\.\d\d\d/g, '');
  };

  const start = formatIcsDate(event.date, event.startTime);
  const end = formatIcsDate(event.date, event.endTime || event.startTime);
  const now = new Date().toISOString().replace(/-|:|\.\d\d\d/g, '');

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//EventEase//Campus Event Registration//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${event._id}-${Date.now()}@eventease.edu`,
    `DTSTAMP:${now}`,
    `DTSTART:${start}`,
    `DTEND:${end}`,
    `SUMMARY:${event.title}`,
    `DESCRIPTION:${(event.description || '').replace(/\n/g, '\\n')}`,
    `LOCATION:${event.venue || 'Campus'}`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `${event.title.replace(/[^a-zA-Z0-9]/g, '_')}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

