import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { exportAttendeesToCsv } from '../utils/exportUtils';
import {
  Calendar,
  Users,
  Search,
  Plus,
  Edit2,
  Trash2,
  Download,
  CheckCircle2,
  X,
  MapPin,
  Clock,
  Sparkles,
  Check,
  Globe,
  ExternalLink,
} from 'lucide-react';

const CATEGORIES = ['Technical', 'Hackathon', 'Workshop', 'Cultural', 'Sports', 'Other'];

const emptyForm = {
  title: '',
  description: '',
  category: 'Technical',
  eventType: 'Internal',
  registrationLink: '',
  date: '',
  startTime: '09:00',
  endTime: '17:00',
  venue: '',
  maxParticipants: '',
  registrationDeadline: '',
  eligibility: 'All Students',
  organizer: '',
  prize: '',
};

const AdminEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [viewRegsModal, setViewRegsModal] = useState(null);
  const [regs, setRegs] = useState([]);
  const [regsLoading, setRegsLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [checkingInId, setCheckingInId] = useState(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/admin/events');
      setEvents(data);
    } catch (err) {
      toast.error('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  const openCreate = () => {
    setEditingEvent(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEdit = (event) => {
    setEditingEvent(event);
    setForm({
      title: event.title || '',
      description: event.description || '',
      category: event.category || 'Technical',
      eventType: event.eventType || 'Internal',
      registrationLink: event.registrationLink || '',
      date: event.date ? event.date.slice(0, 10) : '',
      startTime: event.startTime || '',
      endTime: event.endTime || '',
      venue: event.venue || '',
      maxParticipants: event.maxParticipants || '',
      registrationDeadline: event.registrationDeadline ? event.registrationDeadline.slice(0, 16) : '',
      eligibility: event.eligibility || 'All Students',
      organizer: event.organizer || '',
      prize: event.prize || '',
    });
    setShowModal(true);
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const isExt = form.eventType === 'External';
      const payload = {
        ...form,
        maxParticipants: form.maxParticipants ? Number(form.maxParticipants) : (isExt ? 5000 : 100),
        date: new Date(form.date).toISOString(),
        registrationDeadline: form.registrationDeadline ? new Date(form.registrationDeadline).toISOString() : undefined,
      };

      if (editingEvent) {
        await api.put(`/admin/events/${editingEvent._id}`, payload);
        toast.success('Event updated successfully');
      } else {
        await api.post('/admin/events', payload);
        toast.success(isExt ? 'External opportunity published' : 'Campus event published');
      }
      setShowModal(false);
      fetchEvents();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save event');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (eventId) => {
    if (!window.confirm('Delete this event? This will also remove all student registrations.')) return;
    try {
      await api.delete(`/admin/events/${eventId}`);
      toast.success('Event deleted');
      fetchEvents();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete');
    }
  };

  const viewRegistrations = async (event) => {
    setViewRegsModal(event);
    setRegsLoading(true);
    try {
      const { data } = await api.get(`/admin/events/${event._id}/registrations`);
      setRegs(data);
    } catch {
      toast.error('Failed to load attendees');
    } finally {
      setRegsLoading(false);
    }
  };

  const handleToggleCheckIn = async (regId) => {
    setCheckingInId(regId);
    try {
      const { data } = await api.patch(`/admin/registrations/${regId}/checkin`);
      setRegs(prev =>
        prev.map(r => (r._id === regId ? { ...r, attended: data.registration.attended, checkedInAt: data.registration.checkedInAt } : r))
      );
      toast.success(data.message || 'Check-in updated');
    } catch (err) {
      toast.error('Failed to update check-in status');
    } finally {
      setCheckingInId(null);
    }
  };

  const formatDate = (d) =>
    new Date(d).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });

  const filtered = events.filter(
    e =>
      e.title?.toLowerCase().includes(search.toLowerCase()) ||
      e.category?.toLowerCase().includes(search.toLowerCase()) ||
      e.venue?.toLowerCase().includes(search.toLowerCase()) ||
      e.eventType?.toLowerCase().includes(search.toLowerCase())
  );

  const attendedCount = regs.filter(r => r.attended).length;
  const attendanceRate = regs.length > 0 ? Math.round((attendedCount / regs.length) * 100) : 0;

  return (
    <div className="page">
      <div className="container">
        {/* Header Actions */}
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
            <h1 className="section-title">Event Operations Hub</h1>
            <p className="section-subtitle">
              Publish campus events, curate outside hackathons & competitions, and track attendance
            </p>
          </div>

          <button onClick={openCreate} className="btn btn-primary btn-lg">
            <Plus size={16} /> Publish New Event
          </button>
        </div>

        {/* Filter & Search Bar */}
        <div style={{ marginBottom: '24px', maxWidth: '420px', position: 'relative' }}>
          <Search
            size={16}
            color="#71717a"
            style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }}
          />
          <input
            placeholder="Search events, venues, or external opportunities..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ paddingLeft: '40px', height: '42px' }}
          />
        </div>

        {/* Events Table View */}
        {loading ? (
          <div className="loader-wrap">
            <div className="loader" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="card empty-state">
            <div className="empty-icon"><Calendar size={24} /></div>
            <h3>No events found</h3>
            <p>Publish a campus event or outside opportunity</p>
            <button onClick={openCreate} className="btn btn-primary" style={{ marginTop: '16px' }}>
              Create Event Now
            </button>
          </div>
        ) : (
          <div className="card" style={{ border: '1px solid rgba(0,0,0,0.08)' }}>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Event Details</th>
                    <th>Scope / Type</th>
                    <th>Category</th>
                    <th>Date & Time</th>
                    <th>Registration Capacity</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'right' }}>Management</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(event => {
                    const isExt = event.eventType === 'External';
                    const fillPercent = Math.min(
                      Math.round((event.registeredCount / (event.maxParticipants || 1)) * 100),
                      100
                    );

                    return (
                      <tr key={event._id}>
                        <td style={{ maxWidth: '260px' }}>
                          <div style={{ fontWeight: 700, fontSize: '14px', color: '#09090b' }}>
                            {event.title}
                          </div>
                          <div style={{ fontSize: '12px', color: '#71717a', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                            <MapPin size={12} /> {event.venue}
                          </div>
                          {isExt && event.registrationLink && (
                            <a
                              href={event.registrationLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{
                                fontSize: '11px',
                                color: '#09090b',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '3px',
                                textDecoration: 'underline',
                                marginTop: '3px',
                              }}
                            >
                              External Link <ExternalLink size={10} />
                            </a>
                          )}
                        </td>

                        <td>
                          {isExt ? (
                            <span
                              className="badge"
                              style={{
                                background: '#ffffff',
                                color: '#09090b',
                                border: '1px solid #d4d4d8',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                fontSize: '10.5px',
                              }}
                            >
                              <Globe size={11} /> Outside Event
                            </span>
                          ) : (
                            <span
                              className="badge"
                              style={{
                                background: '#f4f4f5',
                                color: '#09090b',
                                border: '1px solid #e4e4e7',
                                fontSize: '10.5px',
                              }}
                            >
                              Campus Event
                            </span>
                          )}
                        </td>

                        <td>
                          <span className="badge badge-technical" style={{ background: '#09090b', fontSize: '10.5px' }}>
                            {event.category}
                          </span>
                        </td>

                        <td>
                          <div className="mono" style={{ fontSize: '12.5px', fontWeight: 600 }}>
                            {formatDate(event.date)}
                          </div>
                          <div style={{ fontSize: '11.5px', color: '#71717a' }}>
                            {event.startTime} – {event.endTime}
                          </div>
                        </td>

                        <td style={{ minWidth: '150px' }}>
                          {isExt ? (
                            <div>
                              <div className="mono" style={{ fontSize: '12px', fontWeight: 700, color: '#09090b' }}>
                                {event.registeredCount} Tracking
                              </div>
                              <div style={{ fontSize: '11px', color: '#71717a' }}>External Portal</div>
                            </div>
                          ) : (
                            <>
                              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px', marginBottom: '4px' }}>
                                <span className="mono" style={{ fontWeight: 700, color: '#09090b' }}>
                                  {event.registeredCount} / {event.maxParticipants}
                                </span>
                                <span className="mono" style={{ color: '#71717a' }}>
                                  {fillPercent}%
                                </span>
                              </div>
                              <div style={{ height: '5px', background: '#e4e4e7', borderRadius: '3px', overflow: 'hidden' }}>
                                <div style={{ height: '100%', width: `${fillPercent}%`, background: '#09090b' }} />
                              </div>
                            </>
                          )}
                        </td>

                        <td>
                          <span className={`badge badge-${event.status === 'Upcoming' ? 'upcoming' : event.status === 'Full' ? 'full' : 'closed'}`}>
                            {event.status}
                          </span>
                        </td>

                        <td style={{ textAlign: 'right' }}>
                          <div style={{ display: 'inline-flex', gap: '6px', alignItems: 'center' }}>
                            {/* View Registrations / Attendees */}
                            <button
                              onClick={() => viewRegistrations(event)}
                              className="btn btn-outline btn-sm"
                              title={isExt ? 'View Students Tracking Event' : 'View & Check In Attendees'}
                              style={{ display: 'flex', alignItems: 'center', gap: '5px' }}
                            >
                              <Users size={13} />
                              <span className="mono">{event.registeredCount}</span>
                            </button>

                            {/* Edit */}
                            <button
                              onClick={() => openEdit(event)}
                              className="btn btn-outline btn-sm"
                              title="Edit Event"
                            >
                              <Edit2 size={13} />
                            </button>

                            {/* Delete */}
                            <button
                              onClick={() => handleDelete(event._id)}
                              className="btn btn-danger btn-sm"
                              title="Delete Event"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Create / Edit Event Modal */}
        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal" style={{ maxWidth: '660px' }} onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <h2>{editingEvent ? 'Modify Event Details' : 'Publish New Event / Opportunity'}</h2>
                <button className="modal-close" onClick={() => setShowModal(false)}>
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                  {/* Event Scope Selection Toggle */}
                  <div className="form-group">
                    <label>Event Hosting Type / Location Scope *</label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                      <button
                        type="button"
                        onClick={() => setForm({ ...form, eventType: 'Internal' })}
                        className={`btn ${form.eventType === 'Internal' ? 'btn-primary' : 'btn-outline'}`}
                        style={{ justifyContent: 'center', padding: '10px' }}
                      >
                        🏫 College Campus Event
                      </button>
                      <button
                        type="button"
                        onClick={() => setForm({ ...form, eventType: 'External' })}
                        className={`btn ${form.eventType === 'External' ? 'btn-primary' : 'btn-outline'}`}
                        style={{ justifyContent: 'center', padding: '10px' }}
                      >
                        🌐 Outside / External Event
                      </button>
                    </div>
                  </div>

                  {/* External Registration Link (if External) */}
                  {form.eventType === 'External' && (
                    <div
                      className="form-group"
                      style={{
                        background: '#f4f4f5',
                        padding: '16px',
                        borderRadius: '10px',
                        border: '1px solid #d4d4d8',
                      }}
                    >
                      <label style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <Globe size={14} /> Official Registration Website Link *
                      </label>
                      <input
                        type="url"
                        name="registrationLink"
                        placeholder="e.g. https://unstop.com/hackathons/xyz or https://www.sih.gov.in"
                        value={form.registrationLink}
                        onChange={handleChange}
                        required={form.eventType === 'External'}
                        style={{ background: '#ffffff' }}
                      />
                      <span style={{ fontSize: '11.5px', color: '#52525b', marginTop: '4px' }}>
                        Students will click this link to register directly on the external organizer's portal.
                      </span>
                    </div>
                  )}

                  <div className="form-group">
                    <label>Event Title *</label>
                    <input
                      name="title"
                      placeholder={form.eventType === 'External' ? 'e.g. Smart India Hackathon 2024' : 'e.g. Annual Technical Symposium'}
                      value={form.title}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Description *</label>
                    <textarea
                      name="description"
                      placeholder="Comprehensive overview of agenda, eligibility, prizes, and external guidelines..."
                      value={form.description}
                      onChange={handleChange}
                      required
                      rows={3}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                    <div className="form-group">
                      <label>Category *</label>
                      <select name="category" value={form.category} onChange={handleChange}>
                        {CATEGORIES.map(c => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Target Audience / Eligibility</label>
                      <input
                        name="eligibility"
                        placeholder="e.g. All Students / CSE 3rd Year"
                        value={form.eligibility}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                    <div className="form-group">
                      <label>Event Date *</label>
                      <input
                        type="date"
                        name="date"
                        value={form.date}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Start Time *</label>
                      <input
                        type="time"
                        name="startTime"
                        value={form.startTime}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>End Time *</label>
                      <input
                        type="time"
                        name="endTime"
                        value={form.endTime}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Venue / Location *</label>
                    <input
                      name="venue"
                      placeholder={form.eventType === 'External' ? 'e.g. IIT Madras Campus / Virtual Online' : 'e.g. Seminar Hall B, Block C'}
                      value={form.venue}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                    <div className="form-group">
                      <label>{form.eventType === 'External' ? 'Capacity Limit (Optional)' : 'Max Participant Capacity *'}</label>
                      <input
                        type="number"
                        name="maxParticipants"
                        placeholder={form.eventType === 'External' ? 'Leave empty for open entry' : 'e.g. 100'}
                        min="1"
                        value={form.maxParticipants}
                        onChange={handleChange}
                        required={form.eventType === 'Internal'}
                      />
                    </div>
                    <div className="form-group">
                      <label>Registration Deadline {form.eventType === 'External' ? '(Optional)' : '*'}</label>
                      <input
                        type="datetime-local"
                        name="registrationDeadline"
                        value={form.registrationDeadline}
                        onChange={handleChange}
                        required={form.eventType === 'Internal'}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                    <div className="form-group">
                      <label>Organizing Body / External Host</label>
                      <input
                        name="organizer"
                        placeholder={form.eventType === 'External' ? 'e.g. Ministry of Education / Google' : 'e.g. CSE Department Club'}
                        value={form.organizer}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="form-group">
                      <label>Prize Pool / Awards</label>
                      <input
                        name="prize"
                        placeholder="e.g. ₹1,00,000 Cash Prize"
                        value={form.prize}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>

                <div className="modal-footer">
                  <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={submitting}>
                    {submitting ? 'Publishing...' : editingEvent ? 'Save Changes' : 'Publish Opportunity'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Attendees & Live Check-In Modal */}
        {viewRegsModal && (
          <div className="modal-overlay" onClick={() => setViewRegsModal(null)}>
            <div className="modal" style={{ maxWidth: '800px' }} onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <div>
                  <h2>
                    {viewRegsModal.eventType === 'External' ? 'Students Tracking External Event' : 'Attendee Roster & Venue Check-In'}
                  </h2>
                  <div style={{ fontSize: '13px', color: '#71717a', marginTop: '2px' }}>
                    {viewRegsModal.title} · {regs.length} student{regs.length !== 1 ? 's' : ''} enrolled
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <button
                    onClick={() => exportAttendeesToCsv(viewRegsModal.title, regs)}
                    disabled={regs.length === 0}
                    className="btn btn-outline btn-sm"
                    title="Export Attendees as CSV Spreadsheet"
                  >
                    <Download size={13} /> Export CSV
                  </button>
                  <button className="modal-close" onClick={() => setViewRegsModal(null)}>
                    <X size={16} />
                  </button>
                </div>
              </div>

              <div className="modal-body" style={{ padding: '20px 28px' }}>
                {viewRegsModal.eventType === 'Internal' && (
                  <div
                    style={{
                      background: '#f4f4f5',
                      borderRadius: '10px',
                      padding: '14px 18px',
                      marginBottom: '20px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '12px', color: '#71717a', textTransform: 'uppercase', fontWeight: 600 }}>
                        Live Attendance Rate
                      </div>
                      <div className="mono" style={{ fontSize: '18px', fontWeight: 800, color: '#09090b' }}>
                        {attendedCount} / {regs.length} Checked In ({attendanceRate}%)
                      </div>
                    </div>
                    <div style={{ width: '160px', height: '6px', background: '#e4e4e7', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${attendanceRate}%`, background: '#09090b' }} />
                    </div>
                  </div>
                )}

                {regsLoading ? (
                  <div className="loader-wrap">
                    <div className="loader" />
                  </div>
                ) : regs.length === 0 ? (
                  <p style={{ color: '#71717a', textAlign: 'center', padding: '40px 0' }}>
                    No students have registered or tracked this event yet.
                  </p>
                ) : (
                  <div className="table-wrap">
                    <table>
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Student Name</th>
                          <th>Department & Year</th>
                          <th>Registered On</th>
                          <th style={{ textAlign: 'right' }}>
                            {viewRegsModal.eventType === 'External' ? 'Tracking Status' : 'Attendance Check-In'}
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {regs.map((reg, idx) => (
                          <tr key={reg._id}>
                            <td className="mono" style={{ color: '#a1a1aa' }}>{idx + 1}</td>
                            <td>
                              <div style={{ fontWeight: 600, color: '#09090b' }}>
                                {reg.student?.name || 'Student'}
                              </div>
                              <div style={{ fontSize: '11.5px', color: '#71717a' }}>
                                {reg.student?.email}
                              </div>
                            </td>
                            <td>
                              <span style={{ fontSize: '13px' }}>
                                {reg.student?.department || '—'}
                              </span>{' '}
                              <span style={{ fontSize: '11.5px', color: '#71717a' }}>
                                {reg.student?.year ? `(${reg.student.year})` : ''}
                              </span>
                            </td>
                            <td className="mono" style={{ fontSize: '12px', color: '#71717a' }}>
                              {reg.createdAt ? formatDate(reg.createdAt) : '—'}
                            </td>
                            <td style={{ textAlign: 'right' }}>
                              {viewRegsModal.eventType === 'External' ? (
                                <span className="badge badge-upcoming" style={{ fontSize: '11px' }}>
                                  ✓ Tracked
                                </span>
                              ) : (
                                <button
                                  onClick={() => handleToggleCheckIn(reg._id)}
                                  disabled={checkingInId === reg._id}
                                  className={`btn btn-sm ${reg.attended ? 'btn-primary' : 'btn-outline'}`}
                                  style={{ minWidth: '110px' }}
                                >
                                  {reg.attended ? (
                                    <>
                                      <Check size={12} /> Attended
                                    </>
                                  ) : (
                                    'Check In'
                                  )}
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              <div className="modal-footer">
                <button className="btn btn-outline" onClick={() => setViewRegsModal(null)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminEvents;
