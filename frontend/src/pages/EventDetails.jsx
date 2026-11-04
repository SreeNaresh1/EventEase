import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import TicketModal from '../components/TicketModal';
import { getGoogleCalendarUrl, downloadIcsFile } from '../utils/calendarUtils';
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  Award,
  Users,
  Building2,
  Ticket,
  Flame,
  Hourglass,
  Globe,
  ExternalLink,
  BookmarkCheck,
} from 'lucide-react';

const EventDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [conflict, setConflict] = useState(null);
  const [registrationData, setRegistrationData] = useState(null);
  const [showTicketModal, setShowTicketModal] = useState(false);

  useEffect(() => {
    fetchEvent();
    if (user?.role === 'student') {
      checkRegistration();
    }
  }, [id]);

  const fetchEvent = async () => {
    try {
      const { data } = await api.get(`/events/${id}`);
      setEvent(data);
    } catch (err) {
      toast.error('Event not found');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const checkRegistration = async () => {
    try {
      const { data } = await api.get('/registrations/my');
      const found = data.find(r => r.event?._id === id);
      if (found) setRegistrationData(found);
    } catch {}
  };

  const handleRegister = async () => {
    setRegistering(true);
    setConflict(null);
    try {
      const { data } = await api.post('/registrations', { eventId: id });
      toast.success(
        event?.eventType === 'External'
          ? 'Event added to your tracked schedule! 📌'
          : 'Registration Confirmed! 🎉'
      );
      setRegistrationData(data.registration);
      setShowTicketModal(true);
      fetchEvent();
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed';
      if (err.response?.status === 409 || err.response?.data?.conflictEvent) {
        setConflict(msg);
      } else {
        toast.error(msg);
      }
    } finally {
      setRegistering(false);
    }
  };

  if (loading) {
    return (
      <div className="loader-wrap">
        <div className="loader" />
      </div>
    );
  }

  if (!event) return null;

  const isExternal = event.eventType === 'External';
  const seatsLeft = Math.max(0, event.maxParticipants - event.registeredCount);
  const fillPercent = Math.min(
    Math.round((event.registeredCount / event.maxParticipants) * 100),
    100
  );
  const isFull = !isExternal && (seatsLeft <= 0 || event.status === 'Full');
  const isDeadlinePassed = event.registrationDeadline && new Date(event.registrationDeadline) < new Date();
  const canRegister = isExternal || (!isFull && !isDeadlinePassed && event.status !== 'Completed' && !registrationData);

  const formatDate = (d) =>
    new Date(d).toLocaleDateString('en-IN', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });

  const formatDeadline = (d) =>
    d
      ? new Date(d).toLocaleString('en-IN', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        })
      : 'Refer to official external link';

  // Calculate Countdown
  const eventDateObj = new Date(event.date);
  const diffTime = eventDateObj - new Date();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return (
    <div className="page">
      <div className="container">
        {/* Breadcrumb / Back button */}
        <button
          onClick={() => navigate(-1)}
          className="btn btn-outline"
          style={{
            border: 'none',
            background: 'transparent',
            padding: '0 0 20px',
            color: '#71717a',
            fontSize: '13px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            boxShadow: 'none',
          }}
        >
          <ArrowLeft size={16} /> Back to Events
        </button>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '32px', alignItems: 'start' }}>
          {/* Main Event Article */}
          <div>
            {/* Header Hero Card */}
            <div
              style={{
                background: '#09090b',
                color: '#ffffff',
                borderRadius: '20px',
                padding: '40px',
                marginBottom: '28px',
                border: '1px solid #27272a',
                position: 'relative',
              }}
            >
              <div style={{ display: 'flex', gap: '8px', marginBottom: '18px', flexWrap: 'wrap' }}>
                {isExternal ? (
                  <span
                    className="badge"
                    style={{
                      background: '#ffffff',
                      color: '#000000',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                    }}
                  >
                    <Globe size={12} /> Outside College Event
                  </span>
                ) : (
                  <span className="badge" style={{ background: '#27272a', color: '#ffffff' }}>
                    {event.category}
                  </span>
                )}

                <span
                  className="badge"
                  style={{
                    background: isFull ? '#ffffff' : '#18181b',
                    color: isFull ? '#000000' : '#d4d4d8',
                    border: isFull ? 'none' : '1px solid #27272a',
                  }}
                >
                  {!isFull && <span className="live-indicator-dot" />}
                  {event.status}
                </span>

                {diffDays > 0 && (
                  <span
                    className="badge"
                    style={{
                      background: '#18181b',
                      color: '#ffffff',
                      border: '1px solid #27272a',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <Hourglass size={11} /> Starts in {diffDays} day{diffDays !== 1 ? 's' : ''}
                  </span>
                )}
              </div>

              <h1
                style={{
                  fontSize: '32px',
                  fontWeight: 900,
                  letterSpacing: '-0.035em',
                  lineHeight: 1.25,
                  color: '#ffffff',
                  marginBottom: '12px',
                }}
              >
                {event.title}
              </h1>

              {event.organizer && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '13.5px',
                    color: '#a1a1aa',
                  }}
                >
                  <Building2 size={14} /> Organized by <strong>{event.organizer}</strong>
                </div>
              )}
            </div>

            {/* Description Card */}
            <div className="card" style={{ padding: '32px', marginBottom: '28px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '16px' }}>
                About the Event
              </h2>
              <p
                style={{
                  color: '#3f3f46',
                  lineHeight: 1.8,
                  fontSize: '15px',
                  whiteSpace: 'pre-line',
                }}
              >
                {event.description}
              </p>
            </div>

            {/* Specifications Grid */}
            <div className="card" style={{ padding: '32px', marginBottom: '28px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '24px' }}>
                Event Specifications & Location
              </h2>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                  gap: '24px',
                }}
              >
                <SpecItem
                  icon={<Calendar size={18} color="#71717a" />}
                  label="Event Date"
                  value={formatDate(event.date)}
                />
                <SpecItem
                  icon={<Clock size={18} color="#71717a" />}
                  label="Session Timing"
                  value={`${event.startTime} – ${event.endTime}`}
                />
                <SpecItem
                  icon={<MapPin size={18} color="#71717a" />}
                  label="Venue / Host Location"
                  value={event.venue}
                />
                <SpecItem
                  icon={<Users size={18} color="#71717a" />}
                  label="Eligibility Criteria"
                  value={event.eligibility || 'All Students'}
                />
                <SpecItem
                  icon={<Clock size={18} color="#71717a" />}
                  label="Registration Deadline"
                  value={formatDeadline(event.registrationDeadline)}
                />
                {event.prize && (
                  <SpecItem
                    icon={<Award size={18} color="#71717a" />}
                    label="Prize Pool / Incentive"
                    value={event.prize}
                  />
                )}
                {isExternal && event.registrationLink && (
                  <SpecItem
                    icon={<Globe size={18} color="#71717a" />}
                    label="Official Registration Link"
                    value={
                      <a
                        href={event.registrationLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: '#09090b', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                      >
                        Visit External Website <ExternalLink size={12} />
                      </a>
                    }
                  />
                )}
              </div>
            </div>
          </div>

          {/* Sticky Sidebar Action Card */}
          <div style={{ position: 'sticky', top: '92px' }}>
            <div className="card" style={{ padding: '28px', border: '1px solid rgba(0,0,0,0.12)' }}>
              {isExternal ? (
                /* ─── EXTERNAL EVENT ACTION CARD ─── */
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '14px' }}>
                    <Globe size={16} />
                    <h3 style={{ fontSize: '14px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      External Registration Portal
                    </h3>
                  </div>

                  <p style={{ fontSize: '13px', color: '#52525b', lineHeight: 1.6, marginBottom: '20px' }}>
                    This event is hosted outside our college. You must submit your registration directly on their official website.
                  </p>

                  {/* Primary Direct Registration Link */}
                  {event.registrationLink ? (
                    <a
                      href={event.registrationLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-primary btn-lg"
                      style={{
                        width: '100%',
                        justifyContent: 'center',
                        marginBottom: '14px',
                        textDecoration: 'none',
                        fontSize: '14px',
                      }}
                    >
                      <span>Register on Official Portal</span>
                      <ExternalLink size={16} />
                    </a>
                  ) : (
                    <div className="alert alert-warning" style={{ fontSize: '12.5px' }}>
                      Registration link will be announced soon.
                    </div>
                  )}

                  {/* Track in EventEase (Schedule Conflict Protection + Calendar) */}
                  {user?.role === 'student' && (
                    <div style={{ borderTop: '1px solid #e4e4e7', paddingTop: '16px', marginTop: '12px' }}>
                      {registrationData ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                          <div
                            style={{
                              background: '#f4f4f5',
                              border: '1px solid #d4d4d8',
                              borderRadius: '8px',
                              padding: '12px',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                              fontSize: '12.5px',
                              fontWeight: 600,
                            }}
                          >
                            <BookmarkCheck size={16} /> Tracked in Your Schedule
                          </div>

                          <button
                            onClick={() => setShowTicketModal(true)}
                            className="btn btn-outline btn-sm"
                            style={{ width: '100%' }}
                          >
                            <Ticket size={14} /> View Digital Pass
                          </button>
                        </div>
                      ) : (
                        <div>
                          <div style={{ fontSize: '11px', color: '#71717a', marginBottom: '8px' }}>
                            Want schedule conflict protection & calendar alerts for this event?
                          </div>
                          <button
                            onClick={handleRegister}
                            disabled={registering}
                            className="btn btn-outline"
                            style={{ width: '100%', fontSize: '12.5px', justifyContent: 'center' }}
                          >
                            {registering ? 'Adding...' : '+ Track Event in EventEase'}
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Calendar Sync Links */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '16px' }}>
                    <a
                      href={getGoogleCalendarUrl(event)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-outline btn-sm"
                      style={{ fontSize: '11px', justifyContent: 'center' }}
                    >
                      Google Cal
                    </a>
                    <button
                      onClick={() => downloadIcsFile(event)}
                      className="btn btn-outline btn-sm"
                      style={{ fontSize: '11px', justifyContent: 'center' }}
                    >
                      Apple iCal (.ics)
                    </button>
                  </div>
                </div>
              ) : (
                /* ─── INTERNAL CAMPUS EVENT ACTION CARD ─── */
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h3 style={{ fontSize: '15px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      Live Seat Availability
                    </h3>
                    <span className="mono" style={{ fontSize: '12px', color: '#71717a' }}>
                      {fillPercent}% Booked
                    </span>
                  </div>

                  {/* Big Remaining Seats Stat */}
                  <div
                    style={{
                      background: '#f4f4f5',
                      border: '1px solid #e4e4e7',
                      borderRadius: '12px',
                      padding: '20px',
                      textAlign: 'center',
                      marginBottom: '20px',
                    }}
                  >
                    <div
                      className="mono"
                      style={{
                        fontSize: '48px',
                        fontWeight: 900,
                        color: isFull ? '#71717a' : '#09090b',
                        lineHeight: 1,
                      }}
                    >
                      {isFull ? '0' : seatsLeft}
                    </div>
                    <div style={{ fontSize: '12px', color: '#71717a', fontWeight: 600, marginTop: '6px' }}>
                      {isFull ? 'NO SEATS AVAILABLE' : 'REMAINING OPEN SEATS'}
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div style={{ marginBottom: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#52525b', marginBottom: '6px' }}>
                      <span>{event.registeredCount} Registered</span>
                      <span>{event.maxParticipants} Maximum</span>
                    </div>
                    <div style={{ height: '7px', background: '#e4e4e7', borderRadius: '4px', overflow: 'hidden' }}>
                      <div
                        style={{
                          height: '100%',
                          width: `${fillPercent}%`,
                          background: isFull ? '#71717a' : '#09090b',
                          borderRadius: '4px',
                          transition: 'width 0.4s ease',
                        }}
                      />
                    </div>
                  </div>

                  {/* Schedule Conflict Warning Banner */}
                  {conflict && (
                    <div
                      className="alert alert-warning"
                      style={{
                        background: '#18181b',
                        color: '#ffffff',
                        borderLeft: '4px solid #ffffff',
                        marginBottom: '20px',
                        padding: '16px',
                      }}
                    >
                      <AlertTriangle size={20} style={{ flexShrink: 0, marginTop: '2px' }} />
                      <div>
                        <strong style={{ display: 'block', fontSize: '13px', marginBottom: '4px' }}>
                          Schedule Conflict Detected
                        </strong>
                        <div style={{ fontSize: '12px', color: '#d4d4d8', lineHeight: 1.5 }}>
                          {conflict}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Registration Action Zone */}
                  {user?.role === 'student' ? (
                    <>
                      {registrationData ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                          <div
                            style={{
                              background: '#f4f4f5',
                              border: '1px solid #d4d4d8',
                              borderRadius: '10px',
                              padding: '14px',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '10px',
                              color: '#09090b',
                              fontSize: '13px',
                              fontWeight: 600,
                            }}
                          >
                            <CheckCircle2 size={18} /> You are registered for this event!
                          </div>

                          <button
                            onClick={() => setShowTicketModal(true)}
                            className="btn btn-primary"
                            style={{ width: '100%', padding: '12px' }}
                          >
                            <Ticket size={16} /> View Verified Campus Pass
                          </button>

                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '6px' }}>
                            <a
                              href={getGoogleCalendarUrl(event)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn btn-outline btn-sm"
                              style={{ fontSize: '11.5px', justifyContent: 'center' }}
                            >
                              Google Cal
                            </a>
                            <button
                              onClick={() => downloadIcsFile(event)}
                              className="btn btn-outline btn-sm"
                              style={{ fontSize: '11.5px', justifyContent: 'center' }}
                            >
                              Apple iCal (.ics)
                            </button>
                          </div>
                        </div>
                      ) : canRegister ? (
                        <button
                          onClick={handleRegister}
                          disabled={registering}
                          className="btn btn-primary btn-lg"
                          style={{ width: '100%', justifyContent: 'center' }}
                        >
                          {registering ? 'Securing Seat...' : 'Confirm Registration →'}
                        </button>
                      ) : (
                        <div
                          style={{
                            textAlign: 'center',
                            color: '#71717a',
                            fontSize: '13px',
                            padding: '16px',
                            background: '#f4f4f5',
                            borderRadius: '8px',
                            fontWeight: 600,
                          }}
                        >
                          {isFull
                            ? 'Event is completely booked'
                            : isDeadlinePassed
                            ? 'Registration deadline has passed'
                            : 'Registration closed'}
                        </div>
                      )}
                    </>
                  ) : (
                    <div style={{ textAlign: 'center', color: '#71717a', fontSize: '13px' }}>
                      Logged in as Administrator
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Ticket Pass Modal */}
      {showTicketModal && registrationData && (
        <TicketModal
          registration={registrationData}
          onClose={() => setShowTicketModal(false)}
        />
      )}
    </div>
  );
};

const SpecItem = ({ icon, label, value }) => (
  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
    <div
      style={{
        width: '36px',
        height: '36px',
        background: '#f4f4f5',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      {icon}
    </div>
    <div>
      <div
        style={{
          fontSize: '10.5px',
          fontWeight: 700,
          color: '#71717a',
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
          marginBottom: '2px',
        }}
      >
        {label}
      </div>
      <div style={{ fontSize: '14px', fontWeight: 600, color: '#09090b', lineHeight: 1.4 }}>
        {value}
      </div>
    </div>
  </div>
);

export default EventDetails;
