import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  GraduationCap,
  Compass,
  Ticket,
  LayoutDashboard,
  CalendarDays,
  LogOut,
  ShieldCheck,
  User as UserIcon,
} from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav style={{
      background: 'rgba(9, 9, 11, 0.95)',
      backdropFilter: 'blur(16px)',
      position: 'sticky',
      top: 0,
      zIndex: 999,
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      height: '68px',
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '100%',
      }}>
        {/* Brand Logo */}
        <Link
          to={user?.role === 'admin' ? '/admin' : '/dashboard'}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            textDecoration: 'none',
          }}
        >
          <div style={{
            width: '36px',
            height: '36px',
            background: '#ffffff',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#09090b',
            boxShadow: '0 2px 8px rgba(255, 255, 255, 0.2)',
          }}>
            <GraduationCap size={20} strokeWidth={2.5} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{
              color: '#ffffff',
              fontWeight: 800,
              fontSize: '18px',
              letterSpacing: '-0.04em',
              lineHeight: 1.1,
            }}>
              Event<span style={{ color: '#a1a1aa' }}>Ease</span>
            </span>
            <span style={{
              color: '#71717a',
              fontSize: '9.5px',
              fontWeight: 600,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}>
              Smart Campus Network
            </span>
          </div>
        </Link>

        {/* Navigation Links */}
        {user && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: 'rgba(255, 255, 255, 0.05)',
            padding: '4px',
            borderRadius: '10px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
          }}>
            {user.role === 'student' ? (
              <>
                <NavLink to="/dashboard" active={isActive('/dashboard')}>
                  <Compass size={15} />
                  <span>Discover</span>
                </NavLink>
                <NavLink to="/my-registrations" active={isActive('/my-registrations')}>
                  <Ticket size={15} />
                  <span>My Passes</span>
                </NavLink>
              </>
            ) : (
              <>
                <NavLink to="/admin" active={isActive('/admin')}>
                  <LayoutDashboard size={15} />
                  <span>Overview</span>
                </NavLink>
                <NavLink to="/admin/events" active={isActive('/admin/events')}>
                  <CalendarDays size={15} />
                  <span>Manage Events</span>
                </NavLink>
              </>
            )}
          </div>
        )}

        {/* User Profile & Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          {user ? (
            <>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '5px 10px',
                borderRadius: '8px',
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
              }}>
                <div style={{
                  width: '28px',
                  height: '28px',
                  background: '#27272a',
                  color: '#ffffff',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '12px',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                }}>
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ color: '#f4f4f5', fontSize: '13px', fontWeight: 600, lineHeight: 1.2 }}>
                    {user.name}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    {user.role === 'admin' ? (
                      <span style={{
                        color: '#ffffff',
                        fontSize: '9.5px',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '3px',
                      }}>
                        <ShieldCheck size={10} /> Administrator
                      </span>
                    ) : (
                      <span style={{ color: '#a1a1aa', fontSize: '10px' }}>
                        {user.department || 'Student'} {user.year ? `· ${user.year}` : ''}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <button
                onClick={handleLogout}
                style={{
                  background: 'transparent',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  color: '#d4d4d8',
                  padding: '7px 14px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '12.5px',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = '#ffffff';
                  e.currentTarget.style.color = '#000000';
                  e.currentTarget.style.borderColor = '#ffffff';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = '#d4d4d8';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
                }}
              >
                <LogOut size={14} />
                <span>Exit</span>
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="btn btn-outline"
              style={{
                background: '#ffffff',
                color: '#000000',
                borderColor: '#ffffff',
                fontSize: '13px',
                padding: '8px 16px',
              }}
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

const NavLink = ({ to, children, active }) => (
  <Link
    to={to}
    style={{
      color: active ? '#ffffff' : '#a1a1aa',
      textDecoration: 'none',
      padding: '7px 14px',
      borderRadius: '8px',
      fontWeight: active ? 700 : 500,
      fontSize: '13px',
      background: active ? '#27272a' : 'transparent',
      display: 'flex',
      alignItems: 'center',
      gap: '7px',
      transition: 'all 0.15s ease',
    }}
    onMouseEnter={e => {
      if (!active) {
        e.currentTarget.style.color = '#ffffff';
        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
      }
    }}
    onMouseLeave={e => {
      if (!active) {
        e.currentTarget.style.color = '#a1a1aa';
        e.currentTarget.style.background = 'transparent';
      }
    }}
  >
    {children}
  </Link>
);

export default Navbar;
