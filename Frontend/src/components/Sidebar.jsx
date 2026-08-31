import React from 'react';
import { NavLink } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const NAV_ITEMS = [
  { to: '/dashboard',    label: 'Dashboard',        icon: 'bi-grid-1x2-fill' },
  { to: '/roadmap',      label: 'Learning Path',    icon: 'bi-signpost-split-fill' },
  { to: '/assessment',   label: 'Assessment',       icon: 'bi-patch-check-fill' },
  { to: '/ai-assistant', label: 'AI Coach',         icon: 'bi-chat-dots-fill' },
  { to: '/profile',      label: 'Settings',         icon: 'bi-gear-fill' },
];

export const Sidebar = () => {
  const { user } = useApp();

  return (
    <aside className="app-sidebar d-none d-lg-flex">
      {/* Goal badge top */}
      <div className="sidebar-goal-badge">
        <div className="d-flex align-items-center justify-content-between mb-1">
          <span className="tag-pill tag-pill-white" style={{ fontSize: '0.65rem' }}>Track</span>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--pastel-blue-text)' }}>
            {user.readiness}% Ready
          </span>
        </div>
        <div className="sidebar-goal-title">{user.goal}</div>
        <div className="sidebar-goal-meta">
          <i className="bi bi-clock me-1"></i>{user.timeline} · {user.availableHours}h/wk
        </div>
        
        <div className="custom-progress-track mt-2" style={{ height: 6 }}>
          <div
            className="custom-progress-fill bg-accent-blue"
            style={{ width: `${user.readiness}%` }}
          ></div>
        </div>
      </div>

      {/* Navigation menu */}
      <div className="sidebar-menu">
        {NAV_ITEMS.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
          >
            <i className={`bi ${item.icon}`}></i>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </div>

      {/* Quick stats bottom */}
      <div className="p-3 mt-auto rounded-3" style={{ background: 'var(--surface-subtle)', border: '1px solid var(--border-subtle)' }}>
        <div className="d-flex align-items-center justify-content-between mb-1">
          <span className="caption">Weekly Target</span>
          <span style={{ fontSize: '0.75rem', fontWeight: 700 }}>8.5 / {user.availableHours}h</span>
        </div>
        <div className="custom-progress-track" style={{ height: 6 }}>
          <div className="custom-progress-fill bg-accent-purple" style={{ width: `${(8.5 / user.availableHours) * 100}%` }}></div>
        </div>
      </div>
    </aside>
  );
};
