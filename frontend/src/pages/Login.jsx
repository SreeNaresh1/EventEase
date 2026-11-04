import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import {
  GraduationCap,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Mail,
  QrCode,
  CalendarCheck,
  Sparkles,
} from 'lucide-react';

const Login = () => {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const result = await login(form.email, form.password);
    if (result.success) {
      toast.success('Welcome back!');
      navigate(result.role === 'admin' ? '/admin' : '/dashboard');
    } else {
      setError(result.message);
    }
  };

  const handleDemoFill = (email, password) => {
    setForm({ email, password });
  };

  return (
    <div className="auth-page">
      {/* Left Brand Panel */}
      <div className="auth-left">
        <div className="auth-brand">
          <div className="logo-icon">
            <GraduationCap size={26} strokeWidth={2.5} />
          </div>

          <h1>EventEase</h1>
          <p>
            The centralized campus event platform with smart conflict detection,
            live seat tracking, and verified digital entry passes.
          </p>

          <div className="auth-features">
            <div className="auth-feature">
              <div className="check"><CheckCircle2 size={13} /></div>
              <span>Automated schedule overlap & conflict protection</span>
            </div>
            <div className="auth-feature">
              <div className="check"><CheckCircle2 size={13} /></div>
              <span>Instant digital QR code access passes</span>
            </div>
            <div className="auth-feature">
              <div className="check"><CheckCircle2 size={13} /></div>
              <span>Google Calendar & Apple iCal 1-click sync</span>
            </div>
            <div className="auth-feature">
              <div className="check"><CheckCircle2 size={13} /></div>
              <span>Real-time seat counters & registration locks</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="auth-right">
        <div className="auth-form-box">
          <div style={{ marginBottom: '24px' }}>
            <h1>Sign in to portal</h1>
            <p>Access your campus events dashboard and registrations</p>
          </div>

          {error && (
            <div className="alert alert-error" style={{ marginBottom: '20px' }}>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div className="form-group">
              <label>College Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail
                  size={16}
                  color="#71717a"
                  style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }}
                />
                <input
                  type="email"
                  name="email"
                  placeholder="student@college.edu or admin@eventease.com"
                  value={form.email}
                  onChange={handleChange}
                  style={{ paddingLeft: '40px' }}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Security Password</label>
              <div style={{ position: 'relative' }}>
                <Lock
                  size={16}
                  color="#71717a"
                  style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }}
                />
                <input
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={handleChange}
                  style={{ paddingLeft: '40px' }}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-lg"
              disabled={loading}
              style={{ width: '100%', marginTop: '6px' }}
            >
              {loading ? 'Authenticating...' : 'Sign In to EventEase'}
              {!loading && <ArrowRight size={16} />}
            </button>
          </form>

          <div className="auth-divider">
            <span>Or Sign Up</span>
          </div>

          <div style={{ textAlign: 'center' }}>
            <Link to="/register" className="auth-link">
              New student? Create a free campus account →
            </Link>
          </div>

          {/* Quick Demo Credential Pills */}
          <div
            style={{
              marginTop: '32px',
              padding: '16px',
              background: '#f4f4f5',
              borderRadius: '10px',
              border: '1px solid #e4e4e7',
            }}
          >
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#71717a', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '10px' }}>
              Quick 1-Click Demo Login
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                type="button"
                onClick={() => handleDemoFill('admin@eventease.com', 'admin123')}
                className="btn btn-outline btn-sm"
                style={{ flex: 1, fontSize: '11.5px' }}
              >
                <ShieldCheck size={12} /> Fill Admin (Demo)
              </button>
              <button
                type="button"
                onClick={() => handleDemoFill('rahul@student.edu', 'student123')}
                className="btn btn-outline btn-sm"
                style={{ flex: 1, fontSize: '11.5px' }}
              >
                <GraduationCap size={12} /> Fill Student (Demo)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
