import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import {
  GraduationCap,
  ArrowRight,
  CheckCircle2,
  Lock,
  Mail,
  User,
  Building2,
  Calendar,
} from 'lucide-react';

const Register = () => {
  const { register, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    department: 'Computer Science & Engineering',
    year: '3rd Year',
  });
  const [error, setError] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (form.password.length < 6) {
      setError('Password must contain at least 6 characters');
      return;
    }

    const { confirmPassword, ...data } = form;
    const result = await register(data);
    if (result.success) {
      toast.success('Student Account Created! Welcome to EventEase');
      navigate('/dashboard');
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="auth-page">
      {/* Left Brand Panel */}
      <div className="auth-left">
        <div className="auth-brand">
          <div className="logo-icon">
            <GraduationCap size={26} strokeWidth={2.5} />
          </div>

          <h1>Join EventEase</h1>
          <p>
            Connect with campus clubs, hackathons, and technical symposiums.
            Get verified digital passes, conflict-free scheduling, and event updates.
          </p>

          <div className="auth-features">
            <div className="auth-feature">
              <div className="check"><CheckCircle2 size={13} /></div>
              <span>One-click registration for all verified campus events</span>
            </div>
            <div className="auth-feature">
              <div className="check"><CheckCircle2 size={13} /></div>
              <span>Intelligent schedule collision alerts</span>
            </div>
            <div className="auth-feature">
              <div className="check"><CheckCircle2 size={13} /></div>
              <span>Verifiable digital tickets with QR credentials</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="auth-right">
        <div className="auth-form-box">
          <div style={{ marginBottom: '24px' }}>
            <h1>Student Registration</h1>
            <p>Create your profile to start discovering events</p>
          </div>

          {error && (
            <div className="alert alert-error" style={{ marginBottom: '20px' }}>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="form-group">
              <label>Full Student Name *</label>
              <div style={{ position: 'relative' }}>
                <User
                  size={16}
                  color="#71717a"
                  style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }}
                />
                <input
                  type="text"
                  name="name"
                  placeholder="e.g. Sree Naresh"
                  value={form.name}
                  onChange={handleChange}
                  style={{ paddingLeft: '40px' }}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>College Email Address *</label>
              <div style={{ position: 'relative' }}>
                <Mail
                  size={16}
                  color="#71717a"
                  style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }}
                />
                <input
                  type="email"
                  name="email"
                  placeholder="name@student.college.edu"
                  value={form.email}
                  onChange={handleChange}
                  style={{ paddingLeft: '40px' }}
                  required
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="form-group">
                <label>Department</label>
                <input
                  type="text"
                  name="department"
                  placeholder="e.g. CSE / IT / ECE"
                  value={form.department}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Academic Year</label>
                <select name="year" value={form.year} onChange={handleChange}>
                  <option value="1st Year">1st Year</option>
                  <option value="2nd Year">2nd Year</option>
                  <option value="3rd Year">3rd Year</option>
                  <option value="4th Year">4th Year</option>
                  <option value="Postgraduate">Postgraduate</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="form-group">
                <label>Password *</label>
                <div style={{ position: 'relative' }}>
                  <Lock
                    size={16}
                    color="#71717a"
                    style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }}
                  />
                  <input
                    type="password"
                    name="password"
                    placeholder="Min 6 chars"
                    value={form.password}
                    onChange={handleChange}
                    style={{ paddingLeft: '40px' }}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Confirm Password *</label>
                <div style={{ position: 'relative' }}>
                  <Lock
                    size={16}
                    color="#71717a"
                    style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }}
                  />
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Repeat password"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    style={{ paddingLeft: '40px' }}
                    required
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-lg"
              disabled={loading}
              style={{ width: '100%', marginTop: '6px' }}
            >
              {loading ? 'Creating Student Profile...' : 'Complete Registration'}
              {!loading && <ArrowRight size={16} />}
            </button>
          </form>

          <div className="auth-divider">
            <span>Already registered?</span>
          </div>

          <div style={{ textAlign: 'center' }}>
            <Link to="/login" className="auth-link">
              Sign in with your existing account →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
