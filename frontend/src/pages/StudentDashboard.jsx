import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import EventCard from '../components/EventCard';
import { useAuth } from '../context/AuthContext';
import {
  Search,
  Sparkles,
  Calendar,
  Layers,
  CheckCircle2,
  SlidersHorizontal,
  Flame,
  ArrowRight,
  Globe,
  Building,
} from 'lucide-react';
import { Link } from 'react-router-dom';

const CATEGORIES = ['All', 'Technical', 'Hackathon', 'Workshop', 'Cultural', 'Sports', 'Other'];

const StudentDashboard = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [scopeFilter, setScopeFilter] = useState('All'); // 'All', 'Internal', 'External'
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [myRegCount, setMyRegCount] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 350);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    fetchEvents();
  }, [debouncedSearch, category, scopeFilter]);

  useEffect(() => {
    api.get('/registrations/my')
      .then(res => setMyRegCount(res.data?.length || 0))
      .catch(() => {});
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const params = {};
      if (debouncedSearch) params.search = debouncedSearch;
      if (category !== 'All') params.category = category;
      if (scopeFilter !== 'All') params.eventType = scopeFilter;
      const { data } = await api.get('/events', { params });
      setEvents(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const displayedEvents = onlyAvailable
    ? events.filter(e => e.eventType === 'External' || (e.registeredCount < e.maxParticipants && e.status === 'Upcoming'))
    : events;

  const totalEvents = events.length;
  const externalCount = events.filter(e => e.eventType === 'External').length;
  const openSeatsCount = events.reduce(
    (sum, e) => (e.eventType === 'External' ? sum : sum + Math.max(0, e.maxParticipants - e.registeredCount)),
    0
  );

  return (
    <div className="page">
      <div className="container">
        {/* Hero Banner Section */}
        <div
          style={{
            background: '#09090b',
            color: '#ffffff',
            borderRadius: '20px',
            padding: '36px 36px 32px',
            marginBottom: '36px',
            border: '1px solid #27272a',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              flexWrap: 'wrap',
              gap: '24px',
              position: 'relative',
              zIndex: 2,
            }}
          >
            <div style={{ maxWidth: '640px' }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: '#18181b',
                  border: '1px solid #27272a',
                  padding: '5px 12px',
                  borderRadius: '50px',
                  fontSize: '11.5px',
                  fontWeight: 600,
                  color: '#d4d4d8',
                  marginBottom: '14px',
                }}
              >
                <span className="live-indicator-dot" />
                <span>Centralized Campus & Outside Events Hub</span>
              </div>

              <h1
                style={{
                  fontSize: '32px',
                  fontWeight: 900,
                  letterSpacing: '-0.04em',
                  color: '#ffffff',
                  marginBottom: '10px',
                  lineHeight: 1.2,
                }}
              >
                Hello, {user?.name?.split(' ')[0]} 👋
              </h1>

              <p style={{ color: '#a1a1aa', fontSize: '14.5px', lineHeight: 1.6 }}>
                Discover campus workshops, hackathons, and national competitions.
                Register directly or track external opportunities with collision-free schedule detection.
              </p>
            </div>

            {myRegCount > 0 && (
              <div
                style={{
                  background: '#18181b',
                  border: '1px solid #27272a',
                  borderRadius: '12px',
                  padding: '16px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                }}
              >
                <div>
                  <div style={{ fontSize: '11px', color: '#a1a1aa', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Active Registrations
                  </div>
                  <div className="mono" style={{ fontSize: '24px', fontWeight: 800, color: '#ffffff' }}>
                    {myRegCount} Pass{myRegCount !== 1 ? 'es' : ''}
                  </div>
                </div>
                <Link
                  to="/my-registrations"
                  className="btn btn-outline"
                  style={{
                    background: '#ffffff',
                    color: '#000000',
                    fontSize: '12px',
                    padding: '8px 14px',
                    borderColor: '#ffffff',
                  }}
                >
                  View Passes <ArrowRight size={13} />
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* High-level KPIs */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon"><Calendar size={18} /></div>
            <div className="stat-number">{totalEvents}</div>
            <div className="stat-label">Total Opportunities</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon"><Globe size={18} /></div>
            <div className="stat-number">{externalCount}</div>
            <div className="stat-label">Outside Hackathons/Meets</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon"><Flame size={18} /></div>
            <div className="stat-number">{openSeatsCount}</div>
            <div className="stat-label">Campus Open Seats</div>
          </div>
        </div>

        {/* Filter Controls Strip */}
        <div
          style={{
            background: '#ffffff',
            border: '1px solid rgba(0, 0, 0, 0.08)',
            borderRadius: '14px',
            padding: '18px 20px',
            marginBottom: '32px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            boxShadow: 'var(--shadow-subtle)',
          }}
        >
          {/* Top row: Scope toggle & Search */}
          <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', alignItems: 'center' }}>
            {/* Scope Toggle: All vs Campus vs External */}
            <div style={{ display: 'flex', background: '#f4f4f5', padding: '3px', borderRadius: '8px', gap: '4px' }}>
              <button
                type="button"
                onClick={() => setScopeFilter('All')}
                className={`btn btn-sm ${scopeFilter === 'All' ? 'btn-primary' : 'btn-outline'}`}
                style={{ border: 'none', background: scopeFilter === 'All' ? '#09090b' : 'transparent', boxShadow: 'none' }}
              >
                All Events
              </button>
              <button
                type="button"
                onClick={() => setScopeFilter('Internal')}
                className={`btn btn-sm ${scopeFilter === 'Internal' ? 'btn-primary' : 'btn-outline'}`}
                style={{ border: 'none', background: scopeFilter === 'Internal' ? '#09090b' : 'transparent', boxShadow: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                <Building size={12} /> Campus
              </button>
              <button
                type="button"
                onClick={() => setScopeFilter('External')}
                className={`btn btn-sm ${scopeFilter === 'External' ? 'btn-primary' : 'btn-outline'}`}
                style={{ border: 'none', background: scopeFilter === 'External' ? '#09090b' : 'transparent', boxShadow: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                <Globe size={12} /> Outside Events
              </button>
            </div>

            {/* Search Input */}
            <div style={{ flex: 1, minWidth: '220px', position: 'relative' }}>
              <Search
                size={16}
                color="#71717a"
                style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }}
              />
              <input
                type="text"
                placeholder="Search by event title, venue, or keywords..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ paddingLeft: '40px', height: '38px' }}
              />
            </div>

            {/* Quick Toggle for Available Seats */}
            <button
              onClick={() => setOnlyAvailable(!onlyAvailable)}
              className="btn btn-outline"
              style={{
                height: '38px',
                background: onlyAvailable ? '#09090b' : '#ffffff',
                color: onlyAvailable ? '#ffffff' : '#09090b',
                borderColor: onlyAvailable ? '#09090b' : '#d4d4d8',
                fontSize: '12px',
              }}
            >
              <SlidersHorizontal size={13} />
              <span>{onlyAvailable ? 'Showing: Open Only' : 'Open Only'}</span>
            </button>
          </div>

          {/* Category Filter Pills */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#71717a', textTransform: 'uppercase', marginRight: '4px' }}>
              Categories:
            </span>
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                style={{
                  padding: '5px 12px',
                  borderRadius: '50px',
                  border: category === cat ? '1px solid #09090b' : '1px solid #e4e4e7',
                  background: category === cat ? '#09090b' : '#ffffff',
                  color: category === cat ? '#ffffff' : '#52525b',
                  fontWeight: category === cat ? 700 : 500,
                  fontSize: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Events Grid / Empty State */}
        {loading ? (
          <div className="loader-wrap">
            <div className="loader" />
          </div>
        ) : displayedEvents.length === 0 ? (
          <div className="card empty-state">
            <div className="empty-icon">
              <Calendar size={24} />
            </div>
            <h3>No events match your criteria</h3>
            <p>Try searching for a different keyword or reset your category / scope filter.</p>
            <button
              onClick={() => { setSearch(''); setCategory('All'); setScopeFilter('All'); setOnlyAvailable(false); }}
              className="btn btn-outline"
              style={{ marginTop: '16px' }}
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '18px',
              }}
            >
              <span style={{ fontSize: '13px', color: '#71717a', fontWeight: 500 }}>
                Showing <strong style={{ color: '#09090b' }}>{displayedEvents.length}</strong> event{displayedEvents.length !== 1 ? 's' : ''}
              </span>
            </div>

            <div className="events-grid">
              {displayedEvents.map(event => (
                <EventCard key={event._id} event={event} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
