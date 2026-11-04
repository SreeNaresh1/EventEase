import React from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  Clock,
  MapPin,
  ArrowUpRight,
  Code2,
  Theater,
  Trophy,
  Wrench,
  Rocket,
  CalendarCheck,
  Flame,
  Globe,
  ExternalLink,
} from 'lucide-react';

const categoryIcons = {
  Technical: Code2,
  Cultural: Theater,
  Sports: Trophy,
  Workshop: Wrench,
  Hackathon: Rocket,
  Other: CalendarCheck,
};

const EventCard = ({ event }) => {
  const isExternal = event.eventType === 'External';
  const seatsLeft = Math.max(0, event.maxParticipants - event.registeredCount);
  const fillPercent = Math.min(
    Math.round((event.registeredCount / event.maxParticipants) * 100),
    100
  );
  const isFull = !isExternal && (seatsLeft <= 0 || event.status === 'Full');
  const isUrgent = !isExternal && seatsLeft > 0 && seatsLeft <= 8;

  const CategoryIconComponent = categoryIcons[event.category] || CalendarCheck;

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      weekday: 'short',
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <div
      className="card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100%',
      }}
    >
      <div>
        {/* Card Header Strip */}
        <div
          style={{
            background: '#09090b',
            color: '#ffffff',
            padding: '24px 22px 20px',
            position: 'relative',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: '16px',
            }}
          >
            <div
              style={{
                width: '42px',
                height: '42px',
                background: '#18181b',
                border: '1px solid #27272a',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
              }}
            >
              <CategoryIconComponent size={20} strokeWidth={2} />
            </div>

            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
              {isExternal ? (
                <span
                  className="badge"
                  style={{
                    background: '#ffffff',
                    color: '#000000',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <Globe size={11} /> Outside Event
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
            </div>
          </div>

          <h3
            style={{
              fontSize: '18px',
              fontWeight: 800,
              color: '#ffffff',
              lineHeight: 1.3,
              letterSpacing: '-0.025em',
            }}
          >
            {event.title}
          </h3>

          {event.organizer && (
            <div style={{ fontSize: '11.5px', color: '#a1a1aa', marginTop: '4px' }}>
              by {event.organizer}
            </div>
          )}
        </div>

        {/* Card Body */}
        <div style={{ padding: '20px 22px' }}>
          <p
            style={{
              fontSize: '13px',
              color: '#52525b',
              lineHeight: 1.6,
              marginBottom: '18px',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {event.description}
          </p>

          {/* Metadata Rows */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '9px', marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12.5px', color: '#3f3f46' }}>
              <Calendar size={14} color="#71717a" />
              <span className="mono" style={{ fontWeight: 600 }}>{formatDate(event.date)}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12.5px', color: '#3f3f46' }}>
              <Clock size={14} color="#71717a" />
              <span className="mono">{event.startTime} – {event.endTime}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12.5px', color: '#3f3f46' }}>
              <MapPin size={14} color="#71717a" />
              <span>{event.venue}</span>
            </div>
          </div>

          {/* Registration Mode / Seat Capacity */}
          <div style={{ background: '#f4f4f5', borderRadius: '8px', padding: '12px', border: '1px solid #e4e4e7' }}>
            {isExternal ? (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11.5px' }}>
                  <span style={{ fontWeight: 700, color: '#09090b', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Globe size={13} /> External Portal Registration
                  </span>
                  <span style={{ color: '#71717a', fontSize: '11px' }}>
                    {event.registeredCount > 0 ? `${event.registeredCount} students tracking` : 'Open Entry'}
                  </span>
                </div>
                <div style={{ fontSize: '11px', color: '#71717a', marginTop: '4px' }}>
                  Register via official external website link
                </div>
              </div>
            ) : (
              <>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: '11.5px',
                    marginBottom: '6px',
                  }}
                >
                  <span style={{ fontWeight: 600, color: '#52525b' }}>
                    <span className="mono" style={{ color: '#09090b', fontWeight: 700 }}>
                      {event.registeredCount}
                    </span>{' '}
                    / {event.maxParticipants} Campus Seats
                  </span>

                  {isFull ? (
                    <span style={{ fontWeight: 700, color: '#09090b', textTransform: 'uppercase', fontSize: '10.5px' }}>
                      At Capacity
                    </span>
                  ) : isUrgent ? (
                    <span
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontWeight: 700,
                        color: '#09090b',
                        fontSize: '11px',
                      }}
                    >
                      <Flame size={12} /> {seatsLeft} left!
                    </span>
                  ) : (
                    <span className="mono" style={{ color: '#71717a', fontSize: '11px' }}>
                      {seatsLeft} remaining
                    </span>
                  )}
                </div>

                <div
                  style={{
                    height: '6px',
                    background: '#e4e4e7',
                    borderRadius: '3px',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      width: `${fillPercent}%`,
                      background: isFull ? '#71717a' : '#09090b',
                      borderRadius: '3px',
                      transition: 'width 0.4s ease',
                    }}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Card Action Footer */}
      <div
        style={{
          padding: '14px 22px',
          borderTop: '1px solid #f4f4f5',
          background: '#ffffff',
          display: 'flex',
          gap: '8px',
        }}
      >
        <Link
          to={`/events/${event._id}`}
          className="btn btn-outline"
          style={{
            flex: 1,
            justifyContent: 'space-between',
            padding: '10px 16px',
            fontSize: '13px',
          }}
        >
          <span>{isExternal ? 'View Info & Link' : 'Explore & Register'}</span>
          <ArrowUpRight size={15} />
        </Link>

        {isExternal && event.registrationLink && (
          <a
            href={event.registrationLink}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary"
            style={{ padding: '10px 14px' }}
            title="Open External Registration Website"
          >
            <ExternalLink size={14} />
          </a>
        )}
      </div>
    </div>
  );
};

export default EventCard;
