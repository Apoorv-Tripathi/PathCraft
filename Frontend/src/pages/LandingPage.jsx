import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';

const standardPath = [
  { title: 'JavaScript Fundamentals', status: 'completed', score: 92 },
  { title: 'Node.js Core Architecture', status: 'completed', score: 84 },
  { title: 'Production REST API', status: 'current', progress: 45 },
  { title: 'Authentication & Security', status: 'upcoming' },
  { title: 'Docker & Containers', status: 'upcoming' },
];

const adaptivePath = [
  { title: 'JavaScript Fundamentals', status: 'completed', score: 92 },
  { title: 'Node.js Core Architecture', status: 'completed', score: 84 },
  { title: 'Async JS Deep Dive', status: 'current', isRemedial: true, progress: 25 },
  { title: 'Concurrency Lab', status: 'upcoming', isRemedial: true },
  { title: 'Async Verification Quiz', status: 'upcoming', isRemedial: true },
  { title: 'Production REST API', status: 'upcoming' },
  { title: 'Authentication & Security', status: 'upcoming' },
];

const HOW_ITEMS = [
  { n: '01', title: 'Define your goal', body: 'Select your target role, existing skill strengths, and weekly study commitment.', color: 'var(--pastel-blue-bg)', text: 'var(--pastel-blue-text)' },
  { n: '02', title: 'Take a diagnostic', body: 'A focused technical calibration maps your true proficiency across key benchmarks.', color: 'var(--pastel-purple-bg)', text: 'var(--pastel-purple-text)' },
  { n: '03', title: 'Generate roadmap', body: 'A prerequisite-aware curriculum is personalized to prioritize your exact skill gaps.', color: 'var(--pastel-peach-bg)', text: 'var(--pastel-peach-text)' },
  { n: '04', title: 'Adapt with AI', body: 'Every quiz reshapes your path in real time. Critical gaps trigger remedial labs.', color: 'var(--pastel-mint-bg)', text: 'var(--pastel-mint-text)' },
];

export const LandingPage = () => {
  const [mode, setMode] = useState('standard');
  const path = mode === 'adaptive' ? adaptivePath : standardPath;

  return (
    <div className="app-container-wrap">
      <div className="app-shell">
        <Navbar />

        {/* Hero Section */}
        <section className="p-4 p-md-5" style={{ background: 'linear-gradient(180deg, #FFFFFF 0%, var(--bg-canvas) 100%)' }}>
          <div className="container" style={{ maxWidth: 1180 }}>
            <div className="row align-items-center g-5">
              {/* Left Column */}
              <div className="col-lg-6">
                <span className="tag-pill tag-pill-dark mb-3">
                  <i className="bi bi-compass-fill me-1 text-warning"></i>Adaptive Career Roadmap
                </span>
                <h1 className="display-title mb-3">
                  Master your craft with an adaptive learning path.
                </h1>
                <p className="meta-text mb-4" style={{ fontSize: '1.05rem', lineHeight: 1.6 }}>
                  PathCraft diagnoses your technical gaps, constructs a prerequisite-sequenced curriculum, and dynamically updates your roadmap as you learn.
                </p>
                <div className="d-flex align-items-center gap-3 flex-wrap">
                  <Link to="/onboarding" className="btn-pill-dark" style={{ padding: '0.75rem 1.75rem' }}>
                    Build My Learning Path <i className="bi bi-arrow-right ms-2"></i>
                  </Link>
                  <a href="#how" className="btn-pill-white" style={{ padding: '0.75rem 1.5rem' }}>
                    Explore How it Works
                  </a>
                </div>
              </div>

              {/* Right Column: Interactive Card Preview */}
              <div className="col-lg-6">
                <div className="ui-card p-4 shadow-lg">
                  <div className="d-flex align-items-center justify-content-between mb-3 pb-3 border-bottom">
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--ink-dark)' }}>
                        Backend Developer Track
                      </div>
                      <span className="caption">
                        {mode === 'adaptive' ? `${adaptivePath.length} Modules · Adaptive Mode Active` : `${standardPath.length} Modules · Standard Baseline`}
                      </span>
                    </div>

                    <div className="d-flex p-1 rounded-pill" style={{ background: 'var(--surface-subtle)', border: '1px solid var(--border-subtle)' }}>
                      <button
                        className={`btn btn-sm rounded-pill px-3 py-1 ${mode === 'standard' ? 'btn-dark' : 'btn-light border-0'}`}
                        style={{ fontSize: '0.75rem', fontWeight: 700 }}
                        onClick={() => setMode('standard')}
                      >
                        Standard
                      </button>
                      <button
                        className={`btn btn-sm rounded-pill px-3 py-1 ${mode === 'adaptive' ? 'btn-dark' : 'btn-light border-0'}`}
                        style={{ fontSize: '0.75rem', fontWeight: 700 }}
                        onClick={() => setMode('adaptive')}
                      >
                        ⚡ Adaptive
                      </button>
                    </div>
                  </div>

                  {mode === 'adaptive' && (
                    <div className="p-3 mb-3 rounded-3 d-flex align-items-start gap-2" style={{ background: 'var(--pastel-amber-bg)', border: '1px solid var(--pastel-amber-tag)' }}>
                      <i className="bi bi-lightning-fill text-warning mt-1"></i>
                      <div style={{ fontSize: '0.8125rem', color: 'var(--pastel-amber-text)' }}>
                        <strong>Gap Detected:</strong> Async JavaScript scored 35%. Three remedial modules automatically injected.
                      </div>
                    </div>
                  )}

                  <div className="d-flex flex-column gap-2">
                    {path.map((item, i) => (
                      <div
                        key={i}
                        className="p-2 px-3 rounded-3 d-flex align-items-center justify-content-between"
                        style={{
                          background: item.status === 'current' ? 'var(--pastel-purple-bg)' : item.isRemedial ? 'var(--pastel-amber-bg)' : 'var(--surface-subtle)',
                          border: item.status === 'current' ? '1px solid #C7D2FE' : '1px solid transparent'
                        }}
                      >
                        <div className="d-flex align-items-center gap-2">
                          {item.status === 'completed' && <i className="bi bi-check-circle-fill text-success"></i>}
                          {item.status === 'current' && <i className="bi bi-play-circle-fill" style={{ color: '#4F46E5' }}></i>}
                          {item.isRemedial && item.status !== 'current' && <i className="bi bi-lightning-fill text-warning"></i>}
                          {item.status === 'upcoming' && !item.isRemedial && <i className="bi bi-circle text-muted"></i>}
                          <span style={{ fontSize: '0.8125rem', fontWeight: item.status === 'current' ? 700 : 500 }}>
                            {item.title}
                          </span>
                        </div>

                        <div>
                          {item.score && <span className="caption fw-bold text-success">{item.score}%</span>}
                          {item.isRemedial && <span className="tag-pill" style={{ background: 'var(--pastel-amber-tag)', color: 'var(--pastel-amber-text)', fontSize: '0.625rem' }}>Remedial</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how" className="p-4 p-md-5" style={{ borderTop: '1px solid var(--border-light)' }}>
          <div className="container" style={{ maxWidth: 1180 }}>
            <div className="text-center mb-5">
              <span className="tag-pill tag-pill-dark mb-2">Process</span>
              <h2 className="display-title" style={{ fontSize: '2rem' }}>How PathCraft Accelerates Learning</h2>
            </div>

            <div className="row g-4">
              {HOW_ITEMS.map((item, idx) => (
                <div key={idx} className="col-lg-3 col-md-6">
                  <div className="ui-card h-100 p-4 d-flex flex-column justify-content-between">
                    <div>
                      <div
                        className="rounded-3 d-flex align-items-center justify-content-center mb-3"
                        style={{ width: 44, height: 44, background: item.color, color: item.text, fontWeight: 800, fontSize: '1rem' }}
                      >
                        {item.n}
                      </div>
                      <h3 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '0.5rem' }}>{item.title}</h3>
                      <p className="meta-text mb-0" style={{ fontSize: '0.875rem', lineHeight: 1.5 }}>{item.body}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Skill Gap Section */}
        <section id="gap-intelligence" className="p-4 p-md-5" style={{ background: 'var(--surface-subtle)', borderTop: '1px solid var(--border-light)' }}>
          <div className="container" style={{ maxWidth: 1180 }}>
            <div className="row align-items-center g-5">
              <div className="col-lg-5">
                <span className="tag-pill tag-pill-dark mb-2">Diagnostic Precision</span>
                <h2 className="display-title mb-3" style={{ fontSize: '2rem' }}>
                  Target what matters. Skip what you know.
                </h2>
                <p className="meta-text mb-4">
                  Traditional roadmaps assume one pace fits all. PathCraft measures your actual performance and isolates specific bottlenecks before they stall complex projects.
                </p>
                <Link to="/onboarding" className="btn-pill-dark">
                  Start Calibration Quiz <i className="bi bi-arrow-right ms-2"></i>
                </Link>
              </div>

              <div className="col-lg-7">
                <div className="ui-card p-4">
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <span className="badge-label">Skill Competency Benchmark</span>
                    <span className="caption">Diagnostic Threshold: 80%</span>
                  </div>

                  <div className="d-flex flex-column gap-3">
                    {[
                      { name: 'JavaScript Fundamentals', level: 90, target: 85, color: '#10B981' },
                      { name: 'Node.js Core Architecture', level: 60, target: 80, color: '#38BDF8' },
                      { name: 'Async JavaScript & Event Loop', level: 35, target: 85, color: '#F59E0B', gap: true },
                      { name: 'Production REST APIs', level: 40, target: 80, color: '#818CF8' },
                    ].map(s => (
                      <div key={s.name}>
                        <div className="d-flex justify-content-between align-items-center mb-1">
                          <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>{s.name}</span>
                          <div className="d-flex align-items-center gap-2">
                            <span style={{ fontSize: '0.8125rem', fontWeight: 700 }}>{s.level}% / {s.target}%</span>
                            {s.gap && <span className="tag-pill" style={{ background: 'var(--pastel-amber-bg)', color: 'var(--pastel-amber-text)', fontSize: '0.625rem' }}>Gap Detected</span>}
                          </div>
                        </div>
                        <div className="custom-progress-track">
                          <div className="custom-progress-fill" style={{ width: `${s.level}%`, background: s.color }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Strip */}
        <section className="p-4 p-md-5 text-center text-white" style={{ background: 'var(--ink-primary)' }}>
          <div className="container" style={{ maxWidth: 640 }}>
            <h2 className="mb-3 text-white" style={{ fontSize: '2.25rem', fontWeight: 800 }}>Ready to Build Your Path?</h2>
            <p className="text-white-50 mb-4">
              Take the 5-minute calibration and unlock your adaptive learning roadmap today.
            </p>
            <Link to="/onboarding" className="btn-pill-white" style={{ padding: '0.85rem 2rem', fontSize: '1rem' }}>
              Get Started Free <i className="bi bi-arrow-right ms-2"></i>
            </Link>
          </div>
        </section>

        <Footer />
      </div>
    </div>
  );
};
