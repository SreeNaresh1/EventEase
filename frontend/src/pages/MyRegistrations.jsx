import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';
import TicketModal from '../components/TicketModal';
import { getGoogleCalendarUrl, downloadIcsFile } from '../utils/calendarUtils';
import {
  Ticket,
  Calendar,
  Clock,
  MapPin,
  ArrowRight,
  Trash2,
  CalendarCheck,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Globe,
} from 'lucide-react';

const MyRegistrations = () => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(null);
  const [activeTab, setActiveTab] = useState('all'); // all, upcoming, past
  const [selectedTicket, setSelectedTicket] = useState(null);

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const fetchRegistrations = async () => {
    try {
      const { data } = await api.get('/registrations/my');
      setRegistrations(data);
    } catch (err) {
      toast.error('Failed to load registrations');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (regId) => {
    if (
      !window.confirm(
        '⚠️ Cancel Registration?\n\nThis action is PERMANENT.\n• Your seat will be released to other students.\n• You will NOT be able to re-register for this event.\n• Cancellation is not allowed within 24 hours of the event.\n\nAre you sure you want to proceed?'
      )
    )
      return;
    setCancelling(regId);
    try {
      await api.delete(`/registrations/${regId}`);
      toast.success('Registration cancelled. You cannot re-register for this event.');
      fetchRegistrations();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to cancel');
    } finally {
      setCancelling(null);
    }
  };

  const formatDate = (d) =>
    new Date(d).toLocaleDateString('en-IN', {
      weekday: 'short',
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });

  const now = new Date();
  const upcomingRegs = registrations.filter(r => r.event && new Date(r.event.date) >= now);
  const pastRegs = registrations.filter(r => r.event && new Date(r.event.date) < now);

  const displayedRegs =
    activeTab === 'upcoming'
      ? upcomingRegs
      : activeTab === 'past'
        ? pastRegs
        : registrations;

  if (loading) {
    return (
      <div className="loader-wrap">
        <div className="loader" />
      </div>
    );
  }

  return (
    <div className="page">
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <h1 className="section-title">My Registered Passes</h1>
          <p className="section-subtitle">
            View your verified campus event access tickets, QR credentials, and attendance status
          </p>
        </div>

        {/* Stats Row */}
        <div className="stats-grid" style={{ marginBottom: '32px' }}>
          <div className="stat-card">
            <div className="stat-icon"><Ticket size={18} /></div>
            <div className="stat-number">{registrations.length}</div>
            <div className="stat-label">Total Passes</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon"><CalendarCheck size={18} /></div>
            <div className="stat-number">{upcomingRegs.length}</div>
            <div className="stat-label">Upcoming Events</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon"><CheckCircle2 size={18} /></div>
            <div className="stat-number">
              {registrations.filter(r => r.attended).length}
            </div>
            <div className="stat-label">Attended / Verified</div>
          </div>
        </div>

        {/* Tab Filters */}
        <div
          style={{
            display: 'flex',
            gap: '8px',
            marginBottom: '24px',
            borderBottom: '1px solid #e4e4e7',
            paddingBottom: '12px',
          }}
        >
          <button
            onClick={() => setActiveTab('all')}
            className={`btn btn-sm ${activeTab === 'all' ? 'btn-primary' : 'btn-outline'}`}
          >
            All Passes ({registrations.length})
          </button>
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`btn btn-sm ${activeTab === 'upcoming' ? 'btn-primary' : 'btn-outline'}`}
          >
            Upcoming ({upcomingRegs.length})
          </button>
          <button
            onClick={() => setActiveTab('past')}
            className={`btn btn-sm ${activeTab === 'past' ? 'btn-primary' : 'btn-outline'}`}
          >
            Completed ({pastRegs.length})
          </button>
        </div>

        {/* List of Registrations */}
        {displayedRegs.length === 0 ? (
          <div className="card empty-state">
            <div className="empty-icon"><Ticket size={24} /></div>
            <h3>No registrations in this category</h3>
            <p>Explore upcoming events and secure your access passes online.</p>
            <Link to="/dashboard" className="btn btn-primary" style={{ marginTop: '16px' }}>
              Discover Events →
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {displayedRegs.map(reg => {
              const event = reg.event;
              if (!event) return null;
              const isPast = new Date(event.date) < now;

              return (
                <div
                  key={reg._id}
                  className="card"
                  style={{
                    padding: '24px 28px',
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '20px',
                  }}
                >
                  {/* Left Column: Event details */}
                  <div style={{ flex: '1 1 360px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
                      {event.eventType === 'External' ? (
                        <span className="badge" style={{ background: '#ffffff', color: '#09090b', border: '1px solid #d4d4d8', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Globe size={11} /> Outside Event
                        </span>
                      ) : (
                        <span className="badge badge-technical" style={{ background: '#09090b' }}>
                          {event.category}
                        </span>
                      )}

                      {reg.attended ? (
                        <span className="badge" style={{ background: '#09090b', color: '#ffffff', border: '1px solid #27272a' }}>
                          <CheckCircle2 size={11} /> Attended
                        </span>
                      ) : isPast ? (
                        <span className="badge badge-completed">Completed</span>
                      ) : (
                        <span className="badge badge-upcoming">
                          <span className="live-indicator-black" /> {event.eventType === 'External' ? 'Tracking' : 'Confirmed'}
                        </span>
                      )}

                      <span className="mono" style={{ fontSize: '11px', color: '#71717a' }}>
                        PASS #{reg._id.slice(-6).toUpperCase()}
                      </span>
                    </div>

                    <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '8px', color: '#09090b' }}>
                      {event.title}
                    </h3>

                    <div style={{ display: 'flex', gap: '16px', fontSize: '13px', color: '#52525b', flexWrap: 'wrap' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Calendar size={14} color="#71717a" />
                        <span className="mono">{formatDate(event.date)}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Clock size={14} color="#71717a" />
                        <span className="mono">{event.startTime} – {event.endTime}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <MapPin size={14} color="#71717a" />
                        <span>{event.venue}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Interactive Pass Actions */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                    {/* View Digital Pass with QR */}
                    <button
                      onClick={() => setSelectedTicket(reg)}
                      className="btn btn-primary btn-sm"
                      style={{ padding: '8px 16px' }}
                    >
                      <Ticket size={14} /> View Digital Pass
                    </button>

                    {/* Google Calendar Link */}
                    <a
                      href={getGoogleCalendarUrl(event)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-outline btn-sm"
                      title="Add to Google Calendar"
                    >
                      <Calendar size={13} />
                    </a>

                    {/* iCal download */}
                    <button
                      onClick={() => downloadIcsFile(event)}
                      className="btn btn-outline btn-sm"
                      title="Download Apple / Outlook .ics calendar"
                    >
                      <Clock size={13} />
                    </button>

                    {/* View Details Link */}
                    <Link
                      to={`/events/${event._id}`}
                      className="btn btn-outline btn-sm"
                      title="Event Details"
                    >
                      <ExternalLink size={13} />
                    </Link>

                    {/* Cancel Registration */}
                    {!isPast && (
                      <button
                        onClick={() => handleCancel(reg._id)}
                        disabled={cancelling === reg._id}
                        className="btn btn-danger btn-sm"
                        title="Cancel Registration"
                        style={{ padding: '8px 12px' }}
                      >
                        <Trash2 size={13} />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Ticket Modal */}
      {selectedTicket && (
        <TicketModal
          registration={selectedTicket}
          onClose={() => setSelectedTicket(null)}
        />
      )}
    </div>
  );
};

export default MyRegistrations;
