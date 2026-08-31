import React from 'react';

export const Footer = () => (
  <footer className="app-footer">
    <div className="container d-flex align-items-center justify-content-between flex-wrap gap-3" style={{ maxWidth: 1200 }}>
      <div className="d-flex align-items-center gap-2">
        <div className="brand-icon-box" style={{ width: 24, height: 24, fontSize: '0.75rem' }}>
          <i className="bi bi-compass-fill"></i>
        </div>
        <span style={{ fontWeight: 800, fontSize: '0.9375rem', color: 'var(--ink-dark)' }}>PathCraft</span>
        <span className="caption ms-2">© {new Date().getFullYear()} Modern Learning Paths</span>
      </div>
      <div className="d-flex align-items-center gap-3">
        <span className="caption">Built for continuous mastery & career growth</span>
      </div>
    </div>
  </footer>
);
