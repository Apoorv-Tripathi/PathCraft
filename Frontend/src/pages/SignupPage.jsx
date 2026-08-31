import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { authApi } from '../api/client';

export const SignupPage = () => {
  const [name, setName]         = useState('');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw]     = useState(false);
  const [loading, setLoading]   = useState(false);
  const [errors, setErrors]     = useState({});
  const [serverError, setServerError] = useState('');
  const { setUser } = useApp();
  const navigate = useNavigate();

  const validate = () => {
    const e = {};
    if (!name.trim()) e.name = 'Full name is required.';
    if (!email.includes('@')) e.email = 'Valid email is required.';
    if (password.length < 6) e.password = 'Password must be at least 6 characters.';
    return e;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    setServerError('');
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);

    try {
      // Real backend registration
      const res = await authApi.register(name, email, password);
      const token = res?.data?.token || res?.token;
      if (token) {
        localStorage.setItem('pathcraft_token', token);
        setUser(prev => ({
          ...prev,
          name: res.data?.user?.name || name,
          email: res.data?.user?.email || email,
          isLoggedIn: true,
        }));
        navigate('/onboarding');
      } else {
        throw new Error('Registration succeeded but no token was provided.');
      }
    } catch (apiErr) {
      setServerError(apiErr.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="app-container-wrap d-flex align-items-center justify-content-center min-vh-100"
      style={{
        background: 'radial-gradient(circle at 10% 20%, rgba(224, 242, 254, 0.5) 0%, transparent 40%), radial-gradient(circle at 90% 80%, rgba(254, 215, 170, 0.4) 0%, transparent 40%)'
      }}
    >
      <div className="ui-card p-4 p-md-5" style={{ maxWidth: 460, width: '100%', boxShadow: 'var(--shadow-xl)' }}>
        <div className="text-center mb-4">
          <div className="brand-icon-box mx-auto mb-3" style={{ width: 48, height: 48, fontSize: '1.35rem' }}>
            <i className="bi bi-compass-fill"></i>
          </div>
          <h1 className="page-title mb-1" style={{ fontSize: '1.6rem' }}>Create Account</h1>
          <p className="meta-text mb-0">Start building your personalized learning roadmap</p>
        </div>

        {serverError && (
          <div className="p-3 mb-3 rounded-3 d-flex align-items-center gap-2" style={{ background: 'var(--danger-bg)', color: 'var(--danger-text)', fontSize: '0.8125rem' }}>
            <i className="bi bi-exclamation-circle-fill flex-shrink-0"></i>
            <span>{serverError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="caption fw-bold text-dark d-block mb-1">Full Name</label>
            <input
              type="text"
              className="form-input-pill"
              value={name}
              onChange={e => { setName(e.target.value); setErrors(prev => ({ ...prev, name: '' })); }}
              placeholder="Alex Chen"
            />
            {errors.name && <span className="caption text-danger mt-1 d-block">{errors.name}</span>}
          </div>

          <div className="mb-3">
            <label className="caption fw-bold text-dark d-block mb-1">Email Address</label>
            <input
              type="email"
              className="form-input-pill"
              value={email}
              onChange={e => { setEmail(e.target.value); setErrors(prev => ({ ...prev, email: '' })); }}
              placeholder="you@domain.com"
            />
            {errors.email && <span className="caption text-danger mt-1 d-block">{errors.email}</span>}
          </div>

          <div className="mb-4">
            <label className="caption fw-bold text-dark d-block mb-1">Password</label>
            <div className="position-relative">
              <input
                type={showPw ? 'text' : 'password'}
                className="form-input-pill"
                value={password}
                onChange={e => { setPassword(e.target.value); setErrors(prev => ({ ...prev, password: '' })); }}
                placeholder="At least 6 characters"
              />
              <button
                type="button"
                className="btn btn-link position-absolute top-50 end-0 translate-middle-y text-muted text-decoration-none me-2"
                onClick={() => setShowPw(!showPw)}
              >
                <i className={`bi bi-eye${showPw ? '-slash' : ''}`}></i>
              </button>
            </div>
            {errors.password && <span className="caption text-danger mt-1 d-block">{errors.password}</span>}
          </div>

          <button type="submit" className="btn-pill-dark w-100 py-2 mb-3" disabled={loading} style={{ fontSize: '0.9375rem' }}>
            {loading ? (
              <span><span className="spinner-border spinner-border-sm me-2"></span>Creating Account...</span>
            ) : (
              <span>Get Started <i className="bi bi-arrow-right ms-1"></i></span>
            )}
          </button>

          <p className="text-center caption mb-0">
            Already have an account?{' '}
            <Link to="/login" className="fw-bold text-dark text-decoration-none" style={{ color: 'var(--ink-primary)' }}>
              Sign In
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

