import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const NAV_ITEMS = [
  { to: '/dashboard',    label: 'Dashboard' },
  { to: '/roadmap',      label: 'Roadmap' },
  { to: '/assessment',   label: 'Assessment' },
  { to: '/ai-assistant', label: 'AI Coach' },
  { to: '/profile',      label: 'Profile' },
];

export const Navbar = () => {
  const location = useLocation();
  const navigate  = useNavigate();
  const { user, logout } = useApp();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="app-nav">
      {/* Brand logo */}
      <Link className="nav-brand-group" to={user.isLoggedIn ? '/dashboard' : '/'}>
        <div className="brand-icon-box">
          <i className="bi bi-compass-fill"></i>
        </div>
        <span className="brand-name">PathCraft</span>
      </Link>

      {/* Pill navigation buttons in center */}
      {user.isLoggedIn ? (
        <nav className="nav-pill-group d-none d-md-flex">
          {NAV_ITEMS.map(item => (
            <Link
              key={item.to}
              to={item.to}
              className={`nav-pill-link ${location.pathname === item.to ? 'active' : ''}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      ) : (
        <nav className="nav-pill-group d-none d-md-flex">
          <Link to="/" className={`nav-pill-link ${location.pathname === '/' ? 'active' : ''}`}>
            Home
          </Link>
          <a href="/#how" className="nav-pill-link">
            How it Works
          </a>
          <a href="/#gap-intelligence" className="nav-pill-link">
            Features
          </a>
        </nav>
      )}

      {/* Actions & Profile pill right */}
      <div className="nav-actions-group">
        {user.isLoggedIn ? (
          <div className="dropdown">
            <button
              className="user-profile-pill btn p-0 border-0"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <div className="user-avatar-circle">
                {(user.name || 'User').split(' ').map(n => n[0]).join('').slice(0, 2)}
              </div>
              <div className="d-none d-sm-flex flex-column text-start me-1">
                <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--ink-dark)', lineHeight: 1.1 }}>
                  {user.name || 'Learner'}
                </span>
                <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
                  {(user.goal || 'Track').split(' ')[0]}
                </span>
              </div>
              <i className="bi bi-chevron-down" style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}></i>
            </button>

            <ul className="dropdown-menu dropdown-menu-end shadow-sm" style={{
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              padding: '0.5rem',
              minWidth: '200px'
            }}>
              <li className="px-3 py-2 border-bottom">
                <div style={{ fontWeight: 700, fontSize: '0.875rem' }}>{user.name || 'Learner'}</div>
                <div className="caption">{user.email}</div>
              </li>
              <li>
                <Link className="dropdown-item py-2 mt-1 rounded" to="/profile">
                  <i className="bi bi-person-gear me-2"></i>Profile & Goals
                </Link>
              </li>
              <li><hr className="dropdown-divider" /></li>
              <li>
                <button
                  className="dropdown-item py-2 text-danger rounded"
                  onClick={handleLogout}
                >
                  <i className="bi bi-box-arrow-right me-2"></i>Log out
                </button>
              </li>
            </ul>
          </div>
        ) : (
          <div className="d-flex align-items-center gap-2">
            <Link to="/login" className="btn-pill-white btn-sm" style={{ padding: '0.45rem 1.125rem' }}>
              Log in
            </Link>
            <Link to="/onboarding" className="btn-pill-dark btn-sm" style={{ padding: '0.45rem 1.125rem' }}>
              Get started <i className="bi bi-arrow-right ms-1"></i>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};
