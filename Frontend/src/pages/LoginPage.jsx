import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { authApi } from '../api/client';

export const LoginPage = () => {
  const [email, setEmail]       = useState('alex.test@pathcraft.io');
  const [password, setPassword] = useState('password123');
  const [showPw, setShowPw]     = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');
  const { setUser } = useApp();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Please enter both your email address and password.');
      return;
    }
    setLoading(true);

    try {
      // Real backend authentication
      const res = await authApi.login(email, password);
      const token = res?.data?.token || res?.token;
      if (token) {
        localStorage.setItem('pathcraft_token', token);
        setUser(prev => ({
          ...prev,
          name: res.data?.user?.name || res.data?.name || email.split('@')[0],
          email: res.data?.user?.email || res.data?.email || email,
          isLoggedIn: true,
        }));
        navigate('/dashboard');
      } else {
        throw new Error('Authentication succeeded but no token was provided.');
      }
    } catch (apiErr) {
      setError(apiErr.message || 'Login failed. Please check your credentials.');
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
      <div className="ui-card p-4 p-md-5" style={{ maxWidth: 450, width: '100%', boxShadow: 'var(--shadow-xl)' }}>
        <div className="text-center mb-4">
          <div className="brand-icon-box mx-auto mb-3" style={{ width: 48, height: 48, fontSize: '1.35rem' }}>
            <i className="bi bi-compass-fill"></i>
          </div>
          <h1 className="page-title mb-1" style={{ fontSize: '1.6rem' }}>Welcome Back</h1>
          <p className="meta-text mb-0">Log in to resume your adaptive learning roadmap</p>
        </div>

        {error && (
          <div className="p-3 mb-3 rounded-3 d-flex align-items-center gap-2" style={{ background: 'var(--danger-bg)', color: 'var(--danger-text)', fontSize: '0.8125rem' }}>
            <i className="bi bi-exclamation-circle-fill flex-shrink-0"></i>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="caption fw-bold text-dark d-block mb-1">Email Address</label>
            <input
              type="email"
              className="form-input-pill"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="name@domain.com"
              required
            />
          </div>

          <div className="mb-4">
            <div className="d-flex align-items-center justify-content-between mb-1">
              <label className="caption fw-bold text-dark mb-0">Password</label>
              <a href="#" className="caption text-decoration-none" style={{ color: 'var(--pastel-purple-text)', fontWeight: 600 }} onClick={e => e.preventDefault()}>Forgot?</a>
            </div>
            <div className="position-relative">
              <input
                type={showPw ? 'text' : 'password'}
                className="form-input-pill"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                className="btn btn-link position-absolute top-50 end-0 translate-middle-y text-muted text-decoration-none me-2"
                onClick={() => setShowPw(!showPw)}
              >
                <i className={`bi bi-eye${showPw ? '-slash' : ''}`}></i>
              </button>
            </div>
          </div>

          <button type="submit" className="btn-pill-dark w-100 py-2 mb-3" disabled={loading} style={{ fontSize: '0.9375rem' }}>
            {loading ? (
              <span><span className="spinner-border spinner-border-sm me-2"></span>Authenticating...</span>
            ) : (
              <span>Sign In <i className="bi bi-arrow-right ms-1"></i></span>
            )}
          </button>

          <p className="text-center caption mb-0">
            Don't have an account?{' '}
            <Link to="/signup" className="fw-bold text-dark text-decoration-none" style={{ color: 'var(--ink-primary)' }}>
              Create Account
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

