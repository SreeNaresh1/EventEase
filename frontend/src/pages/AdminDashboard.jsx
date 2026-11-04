import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import {
  Calendar,
  Users,
  CheckCircle2,
  CalendarDays,
  ArrowUpRight,
  TrendingUp,
  Layers,
  Plus,
  Clock,
} from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentEvents, setRecentEvents] = useState([]);
  const [recentRegs, setRecentRegs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, eventsRes, regsRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/events?limit=5'),
        api.get('/admin/registrations?limit=5'),
      ]);
      setStats(statsRes.data);
      setRecentEvents(eventsRes.data.slice(0, 5));
      setRecentRegs(regsRes.data.slice(0, 5));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (d) =>
    new Date(d).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });

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
        {/* Header Strip with Action */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '32px',
            flexWrap: 'wrap',
            gap: '16px',
          }}
        >
          <div>
            <h1 className="section-title">Campus Operations Command</h1>
            <p className="section-subtitle">
              Overview of registrations, event capacity, and student participation metrics
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <Link to="/admin/events" className="btn btn-primary">
              <Plus size={16} /> Create / Manage Events
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon"><Calendar size={18} /></div>
            <div className="stat-number">{stats?.totalEvents ?? 0}</div>
            <div className="stat-label">Total Campus Events</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon"><TrendingUp size={18} /></div>
            <div className="stat-number">{stats?.totalRegistrations ?? 0}</div>
            <div className="stat-label">Total Registrations</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon"><Users size={18} /></div>
            <div className="stat-number">{stats?.totalStudents ?? 0}</div>
            <div className="stat-label">Enrolled Students</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon"><CalendarDays size={18} /></div>
            <div className="stat-number">{stats?.upcomingEvents ?? 0}</div>
            <div className="stat-label">Active / Upcoming</div>
          </div>
        </div>

        {/* Two-Column Operations Layout */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '24px' }}>
          {/* Recent Events Card */}
          <div className="card" style={{ padding: '28px' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '20px',
              }}
            >
              <h2 style={{ fontSize: '18px', fontWeight: 800 }}>Events Velocity</h2>
              <Link to="/admin/events" className="btn btn-outline btn-sm">
                View All <ArrowUpRight size={13} />
              </Link>
            </div>

            {recentEvents.length === 0 ? (
              <p style={{ color: '#71717a', fontSize: '14px' }}>No events created yet.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {recentEvents.map(event => {
                  const fillPercent = Math.min(
                    Math.round((event.registeredCount / event.maxParticipants) * 100),
                    100
                  );
                  return (
                    <div
                      key={event._id}
                      style={{
                        padding: '14px 16px',
                        borderRadius: '10px',
                        background: '#f4f4f5',
                        border: '1px solid #e4e4e7',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'flex-start',
                          marginBottom: '6px',
                        }}
                      >
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '14px', color: '#09090b' }}>
                            {event.title}
                          </div>
                          <div style={{ fontSize: '12px', color: '#71717a' }}>
                            {formatDate(event.date)} · {event.venue}
                          </div>
                        </div>

                        <span className="badge badge-technical" style={{ background: '#09090b', fontSize: '10px' }}>
                          {event.category}
                        </span>
                      </div>

                      <div style={{ marginTop: '10px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#52525b', marginBottom: '4px' }}>
                          <span>Capacity</span>
                          <span className="mono" style={{ fontWeight: 600 }}>
                            {event.registeredCount} / {event.maxParticipants} ({fillPercent}%)
                          </span>
                        </div>
                        <div style={{ height: '5px', background: '#d4d4d8', borderRadius: '3px', overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${fillPercent}%`, background: '#09090b' }} />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Recent Registrations Card */}
          <div className="card" style={{ padding: '28px' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '20px',
              }}
            >
              <h2 style={{ fontSize: '18px', fontWeight: 800 }}>Recent Student Signups</h2>
              <span className="badge badge-upcoming">Live Feed</span>
            </div>

            {recentRegs.length === 0 ? (
              <p style={{ color: '#71717a', fontSize: '14px' }}>No registrations recorded yet.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {recentRegs.map(reg => (
                  <div
                    key={reg._id}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '12px 14px',
                      borderRadius: '8px',
                      borderBottom: '1px solid #f4f4f5',
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '13.5px', color: '#09090b' }}>
                        {reg.student?.name || 'Student'}
                      </div>
                      <div style={{ fontSize: '12px', color: '#71717a' }}>
                        for <strong>{reg.event?.title || 'Event'}</strong>
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div className="mono" style={{ fontSize: '11px', color: '#a1a1aa' }}>
                        {formatDate(reg.createdAt)}
                      </div>
                      {reg.attended && (
                        <span style={{ fontSize: '10px', color: '#09090b', fontWeight: 700 }}>
                          ✓ Checked In
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
