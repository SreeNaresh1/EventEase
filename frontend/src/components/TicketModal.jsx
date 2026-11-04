import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { Calendar, Clock, MapPin, Download, X, CheckCircle2, Share2 } from 'lucide-react';
import { getGoogleCalendarUrl, downloadIcsFile } from '../utils/calendarUtils';

const TicketModal = ({ registration, onClose }) => {
  const [qrDataUrl, setQrDataUrl] = useState('');

  if (!registration || !registration.event) return null;
  const { event, student } = registration;

  useEffect(() => {
    // Generate secure QR verification payload
    const payload = JSON.stringify({
      regId: registration._id,
      eventId: event._id,
      studentEmail: student?.email,
      eventTitle: event.title,
      valid: true,
      issuedAt: registration.createdAt || registration.registeredAt,
    });

    QRCode.toDataURL(payload, {
      width: 180,
      margin: 1,
      color: {
        dark: '#000000',
        light: '#ffffff',
      },
    })
      .then(url => setQrDataUrl(url))
      .catch(err => console.error('QR generation error:', err));
  }, [registration]);

  const formatDate = (d) => {
    return new Date(d).toLocaleDateString('en-IN', {
      weekday: 'short',
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="ticket-modal-wrapper" onClick={(e) => e.stopPropagation()}>
        {/* Actions bar above ticket */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#fff', fontSize: '13px', fontWeight: 600 }}>
            <span className="live-indicator-dot" />
            Verified Campus Access Pass
          </div>
          <button
            onClick={onClose}
            className="ticket-close-btn"
            title="Close ticket"
          >
            <X size={18} />
          </button>
        </div>

        {/* The Digital Pass */}
        <div className="ticket-card" id="printable-ticket">
          {/* Top Banner */}
          <div className="ticket-header">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div className="ticket-brand">
                  <span className="ticket-logo-box">🎓</span>
                  <span>EventEase Pass</span>
                </div>
                <div className="ticket-ref">PASS ID: {registration._id.slice(-8).toUpperCase()}</div>
              </div>
              <div className="ticket-status-pill">
                <CheckCircle2 size={13} />
                CONFIRMED
              </div>
            </div>

            <h2 className="ticket-event-title">{event.title}</h2>
            <div className="ticket-category-tag">{event.category}</div>
          </div>

          {/* Ticket Perforations / Notches */}
          <div className="ticket-divider-strip">
            <div className="ticket-notch left" />
            <div className="ticket-dashed-line" />
            <div className="ticket-notch right" />
          </div>

          {/* Middle Body */}
          <div className="ticket-body">
            <div className="ticket-details-grid">
              <div className="ticket-field">
                <label>STUDENT ATTENDEE</label>
                <div className="ticket-val bold">{student?.name || 'Student'}</div>
                <div className="ticket-subval">{student?.department || 'Student'} · {student?.year || ''}</div>
              </div>

              <div className="ticket-field">
                <label>DATE & TIME</label>
                <div className="ticket-val">{formatDate(event.date)}</div>
                <div className="ticket-subval">{event.startTime} – {event.endTime}</div>
              </div>

              <div className="ticket-field" style={{ gridColumn: 'span 2' }}>
                <label>VENUE</label>
                <div className="ticket-val" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <MapPin size={14} /> {event.venue}
                </div>
              </div>
            </div>

            {/* QR Code Section */}
            <div className="ticket-qr-section">
              <div className="ticket-qr-box">
                {qrDataUrl ? (
                  <img src={qrDataUrl} alt="Event Verification QR Code" style={{ width: '130px', height: '130px' }} />
                ) : (
                  <div style={{ width: '130px', height: '130px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    Loading QR...
                  </div>
                )}
              </div>
              <div style={{ textAlign: 'center', marginTop: '8px' }}>
                <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase' }}>
                  Scan at Entrance
                </div>
                <div style={{ fontSize: '10px', color: '#71717a' }}>One entry per pass</div>
              </div>
            </div>
          </div>

          {/* Footer Bar */}
          <div className="ticket-footer">
            <span>Organized by {event.organizer || 'College Activity Center'}</span>
            <span>EventEase Security Protocol</span>
          </div>
        </div>

        {/* Action Buttons Below Pass */}
        <div style={{ display: 'flex', gap: '10px', marginTop: '16px', flexWrap: 'wrap' }}>
          <button
            onClick={handlePrint}
            className="btn btn-outline"
            style={{ flex: 1, background: '#fff', color: '#000', borderColor: '#fff' }}
          >
            <Download size={15} /> Print / Save PDF
          </button>
          <a
            href={getGoogleCalendarUrl(event)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline"
            style={{ flex: 1, background: '#18181b', color: '#fff', borderColor: '#27272a' }}
          >
            <Calendar size={15} /> Google Calendar
          </a>
          <button
            onClick={() => downloadIcsFile(event)}
            className="btn btn-outline"
            style={{ flex: 1, background: '#18181b', color: '#fff', borderColor: '#27272a' }}
          >
            <Clock size={15} /> Download iCal (.ics)
          </button>
        </div>
      </div>
    </div>
  );
};

export default TicketModal;

