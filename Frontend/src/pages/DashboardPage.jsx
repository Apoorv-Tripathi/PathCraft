import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Navbar } from '../components/Navbar';
import { Sidebar } from '../components/Sidebar';
import { Footer } from '../components/Footer';
import { ReadinessGauge } from '../components/ReadinessGauge';
import { FloatingCoachButton } from '../components/FloatingCoachButton';

export const DashboardPage = () => {
  const { user, skills, currentRoadmap, isAdaptiveMode, toggleAdaptiveRoadmap } = useApp();
  const navigate = useNavigate();

  const currentNode = currentRoadmap.find(n => n.status === 'current');
  const criticalGap = skills.find(s => s.status === 'Critical Gap');
  const completed   = currentRoadmap.filter(n => n.status === 'completed').length;
  const total       = currentRoadmap.length;
  const loggedHours = user.weeklyLoggedHours || 8.5;
  const pathPercent = total > 0 ? Math.round((completed / total) * 100) : 40;

  return (
    <div className="app-container-wrap">
      <div className="app-shell">
        <Navbar />
        
        <div className="app-main-layout">
          <Sidebar />

          <main className="page-content-area">
            {/* Top Project Banner (Tasklyn Style) */}
            <div className="d-flex align-items-center justify-content-between flex-wrap gap-3 mb-4">
              <div>
                <div className="d-flex align-items-center gap-2">
                  <h1 className="page-title mb-0" style={{ fontSize: '1.5rem' }}>{user.goal} Track</h1>
                  <span className="tag-pill tag-pill-dark" style={{ fontSize: '0.6875rem' }}>
                    ID: PC-{user.id ? String(user.id).slice(-6).toUpperCase() : 'HCL849'}
                  </span>
                </div>
                <p className="meta-text mb-0 mt-1">
                  Target: <strong>{user.timeline}</strong> · Experience: <strong>{user.experienceLevel || 'Intermediate'}</strong>
                </p>
              </div>
              
              <div className="d-flex align-items-center gap-2">
                {isAdaptiveMode ? (
                  <div className="tag-pill" style={{ background: 'var(--pastel-amber-bg)', color: 'var(--pastel-amber-text)' }}>
                    <i className="bi bi-lightning-fill me-1"></i>Adaptive Active
                    <button 
                      className="btn btn-link p-0 ms-2 text-decoration-none" 
                      style={{ fontSize: '0.75rem', color: 'var(--pastel-amber-text)', fontWeight: 700 }} 
                      onClick={() => toggleAdaptiveRoadmap(false)}
                    >
                      (Reset)
                    </button>
                  </div>
                ) : (
                  <button className="btn-pill-subtle" onClick={() => toggleAdaptiveRoadmap(true)}>
                    <i className="bi bi-lightning me-1"></i>Simulate Gap Injection
                  </button>
                )}
                <Link to="/assessment" className="btn-pill-dark btn-sm">
                  <i className="bi bi-plus-lg me-1"></i>Quick Quiz
                </Link>
              </div>
            </div>

            {/* Section 1: Today Focus Cards & Multi-ring Gauge (Matches Tasklyn Today Task + Project Completed) */}
            <div className="row g-4 mb-4">
              {/* Left 7 Cols: Focus Card Shell containing 3 pastel cards */}
              <div className="col-xl-8 col-lg-7">
                <div className="ui-card p-4 h-100">
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <h2 className="section-title mb-0">Today's Focus & Next Milestones</h2>
                    <Link to="/roadmap" className="caption text-decoration-none fw-bold" style={{ color: 'var(--pastel-purple-text)' }}>
                      See All →
                    </Link>
                  </div>

                  <div className="row g-3">
                    {/* Pastel Blue Card: Current Active Node */}
                    <div className="col-md-4">
                      <div className="card-pastel-blue h-100 d-flex flex-column justify-content-between p-3" style={{ minHeight: 210 }}>
                        <div>
                          <div className="d-flex align-items-center justify-content-between mb-2">
                            <span className="tag-pill tag-pill-white">High Priority</span>
                            <span className="caption fw-bold" style={{ color: 'var(--pastel-blue-text)' }}>
                              {currentNode?.estimatedHours || 35}h
                            </span>
                          </div>
                          <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--ink-dark)', marginBottom: '0.4rem', lineHeight: 1.25 }}>
                            {currentNode?.title || 'REST API Architecture'}
                          </h3>
                          <p className="caption mb-2" style={{ color: '#0369A1', lineHeight: 1.4 }}>
                            {currentNode?.category || 'Core Backend System'}
                          </p>
                        </div>

                        <div>
                          <div className="d-flex align-items-center justify-content-between caption mb-1" style={{ color: '#0369A1', fontWeight: 700 }}>
                            <span>Progress</span>
                            <span>{currentNode?.progress || 45}%</span>
                          </div>
                          <div className="custom-progress-track" style={{ background: 'rgba(255,255,255,0.7)', height: 6 }}>
                            <div className="custom-progress-fill bg-accent-blue" style={{ width: `${currentNode?.progress || 45}%` }}></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Pastel Purple Card: Prerequisite Review */}
                    <div className="col-md-4">
                      <div className="card-pastel-purple h-100 d-flex flex-column justify-content-between p-3" style={{ minHeight: 210 }}>
                        <div>
                          <div className="d-flex align-items-center justify-content-between mb-2">
                            <span className="tag-pill tag-pill-white">Deep Dive</span>
                            <span className="caption fw-bold" style={{ color: 'var(--pastel-purple-text)' }}>Quiz</span>
                          </div>
                          <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--ink-dark)', marginBottom: '0.4rem', lineHeight: 1.25 }}>
                            Async & Event Loop
                          </h3>
                          <p className="caption mb-2" style={{ color: '#4F46E5', lineHeight: 1.4 }}>
                            Promise microtask queues & libuv pool
                          </p>
                        </div>

                        <div>
                          <div className="d-flex align-items-center justify-content-between caption mb-1" style={{ color: '#4F46E5', fontWeight: 700 }}>
                            <span>Calibration</span>
                            <span>75%</span>
                          </div>
                          <div className="custom-progress-track" style={{ background: 'rgba(255,255,255,0.7)', height: 6 }}>
                            <div className="custom-progress-fill bg-accent-purple" style={{ width: '75%' }}></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Pastel Peach Card: Capstone Deliverable */}
                    <div className="col-md-4">
                      <div className="card-pastel-peach h-100 d-flex flex-column justify-content-between p-3" style={{ minHeight: 210 }}>
                        <div>
                          <div className="d-flex align-items-center justify-content-between mb-2">
                            <span className="tag-pill tag-pill-white">Milestone</span>
                            <span className="caption fw-bold" style={{ color: 'var(--pastel-peach-text)' }}>Project</span>
                          </div>
                          <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--ink-dark)', marginBottom: '0.4rem', lineHeight: 1.25 }}>
                            API Auth Gateway
                          </h3>
                          <p className="caption mb-2" style={{ color: '#C2410C', lineHeight: 1.4 }}>
                            JWT verification & rate limiting
                          </p>
                        </div>

                        <div>
                          <div className="d-flex align-items-center justify-content-between caption mb-1" style={{ color: '#C2410C', fontWeight: 700 }}>
                            <span>Deliverable</span>
                            <span>{completed}/{total} Done</span>
                          </div>
                          <div className="custom-progress-track" style={{ background: 'rgba(255,255,255,0.7)', height: 6 }}>
                            <div className="custom-progress-fill bg-accent-peach" style={{ width: `${pathPercent}%` }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right 5 Cols: Concentric Ring Readiness Gauge with Metric Legend */}
              <div className="col-xl-4 col-lg-5">
                <div className="ui-card p-4 h-100 d-flex flex-column justify-content-between">
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <h2 className="section-title mb-0">Curriculum Readiness</h2>
                    <span className="caption text-muted">Total Path {total}</span>
                  </div>

                  <div className="d-flex align-items-center justify-content-between gap-3 my-2">
                    {/* Metric Legend */}
                    <div className="d-flex flex-column gap-3">
                      <div>
                        <div className="d-flex align-items-center gap-2 mb-1">
                          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#818CF8' }}></span>
                          <span className="caption fw-bold text-dark">Overall Readiness</span>
                        </div>
                        <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--ink-dark)' }}>
                          {user.readiness}%
                        </div>
                      </div>

                      <div>
                        <div className="d-flex align-items-center gap-2 mb-1">
                          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#FB923C' }}></span>
                          <span className="caption fw-bold text-dark">Quiz Calibration</span>
                        </div>
                        <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--ink-dark)' }}>
                          75%
                        </div>
                      </div>

                      <div>
                        <div className="d-flex align-items-center gap-2 mb-1">
                          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#38BDF8' }}></span>
                          <span className="caption fw-bold text-dark">Path Completion</span>
                        </div>
                        <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--ink-dark)' }}>
                          {pathPercent}%
                        </div>
                      </div>
                    </div>

                    {/* Concentric Multi-Ring SVG Chart */}
                    <div>
                      <ReadinessGauge score={user.readiness} quizAvg={75} benchmark={pathPercent} size={145} strokeWidth={9} />
                    </div>
                  </div>

                  <div className="pt-3 border-top d-flex align-items-center justify-content-between">
                    <span className="caption text-muted">Target Benchmark: 85%</span>
                    <Link to="/roadmap" className="btn-pill-subtle btn-sm">
                      Full Breakdown →
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: Three Column Bottom Grid (Competency Diagnostics, Weekly Study Tracker, AI Coach) */}
            <div className="row g-4">
              {/* Col 1: Skill Competency Diagnostics */}
              <div className="col-lg-4 col-md-6">
                <div className="ui-card p-4 h-100 d-flex flex-column justify-content-between">
                  <div>
                    <div className="d-flex align-items-center justify-content-between mb-3">
                      <h2 className="section-title mb-0">Skill Diagnostics</h2>
                      <Link to="/assessment" className="caption text-decoration-none fw-bold" style={{ color: 'var(--pastel-purple-text)' }}>
                        Calibrate →
                      </Link>
                    </div>

                    <div className="d-flex flex-column gap-3 mb-3">
                      {skills.slice(0, 3).map((s, idx) => (
                        <div key={s.name} className="d-flex align-items-center justify-content-between p-2 rounded-3" style={{ background: 'var(--surface-subtle)' }}>
                          <div className="d-flex align-items-center gap-2">
                            <div style={{
                              width: 32, height: 32, borderRadius: '50%',
                              background: idx === 0 ? 'var(--pastel-mint-bg)' : idx === 1 ? 'var(--pastel-blue-bg)' : 'var(--pastel-peach-bg)',
                              color: idx === 0 ? 'var(--pastel-mint-text)' : idx === 1 ? 'var(--pastel-blue-text)' : 'var(--pastel-peach-text)',
                              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8125rem', fontWeight: 800
                            }}>
                              {s.name[0]}
                            </div>
                            <div>
                              <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--ink-dark)' }}>{s.name}</div>
                              <span className="caption text-muted">{s.status || 'Active Track'}</span>
                            </div>
                          </div>
                          <div className="text-end">
                            <div style={{ fontSize: '0.875rem', fontWeight: 800, color: 'var(--ink-dark)' }}>{s.proficiency}%</div>
                            <span className="caption text-muted">Target {s.targetBenchmark}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Link to="/profile" className="btn-pill-white w-100 btn-sm text-center">
                    Manage All Skills <i className="bi bi-gear ms-1"></i>
                  </Link>
                </div>
              </div>

              {/* Col 2: Study Tracker Pillars (Tasklyn Tracker Detail Aesthetic) */}
              <div className="col-lg-4 col-md-6">
                <div className="ui-card p-4 h-100 d-flex flex-column justify-content-between">
                  <div>
                    <div className="d-flex align-items-center justify-content-between mb-2">
                      <h2 className="section-title mb-0">Study Hours Tracker</h2>
                      <span className="caption text-muted">{loggedHours}h / 12h goal</span>
                    </div>

                    <div className="d-flex align-items-center gap-3 mb-3">
                      <div className="d-flex align-items-center gap-1">
                        <span style={{ width: 10, height: 10, borderRadius: 2, background: '#FB923C' }}></span>
                        <span className="caption text-muted">Focus Labs</span>
                      </div>
                      <div className="d-flex align-items-center gap-1">
                        <span style={{ width: 10, height: 10, borderRadius: 2, background: '#94A3B8' }}></span>
                        <span className="caption text-muted">Docs & Quizzes</span>
                      </div>
                    </div>

                    {/* Dual-Pillar Bar Visualization */}
                    <div className="d-flex align-items-end justify-content-between pt-3 pb-1" style={{ height: 120 }}>
                      {[
                        { day: 'Mon', h1: 65, h2: 30 },
                        { day: 'Tue', h1: 85, h2: 45 },
                        { day: 'Wed', h1: 40, h2: 25 },
                        { day: 'Thu', h1: 95, h2: 50 },
                        { day: 'Fri', h1: 70, h2: 35 },
                        { day: 'Sat', h1: 50, h2: 20 },
                      ].map((item, idx) => (
                        <div key={item.day} className="d-flex flex-column align-items-center gap-1">
                          <div className="d-flex align-items-end gap-1" style={{ height: 85 }}>
                            <div 
                              style={{ 
                                width: 10, 
                                height: `${item.h1}%`, 
                                background: idx === 3 ? '#FB923C' : '#FED7AA', 
                                borderRadius: '10px 10px 0 0',
                                transition: 'height 0.6s ease'
                              }}
                            ></div>
                            <div 
                              style={{ 
                                width: 10, 
                                height: `${item.h2}%`, 
                                background: idx === 3 ? '#94A3B8' : '#E2E8F0', 
                                borderRadius: '10px 10px 0 0',
                                transition: 'height 0.6s ease'
                              }}
                            ></div>
                          </div>
                          <span className="caption text-muted" style={{ fontSize: '0.6875rem' }}>{item.day}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2 border-top d-flex align-items-center justify-content-between">
                    <span className="caption" style={{ color: 'var(--success-text)', fontWeight: 600 }}>
                      <i className="bi bi-arrow-up-right me-1"></i>+2.4h vs last week
                    </span>
                    <span className="caption text-muted">Weekly Target 12h</span>
                  </div>
                </div>
              </div>

              {/* Col 3: Context-Aware AI Coach Preview */}
              <div className="col-lg-4 col-md-12">
                <div className="ui-card p-4 h-100 d-flex flex-column justify-content-between">
                  <div>
                    <div className="d-flex align-items-center justify-content-between mb-3">
                      <div className="d-flex align-items-center gap-2">
                        <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--pastel-purple-bg)', color: 'var(--pastel-purple-text)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <i className="bi bi-stars" style={{ fontSize: '0.8125rem' }}></i>
                        </div>
                        <h2 className="section-title mb-0" style={{ fontSize: '1rem' }}>AI Learning Coach</h2>
                      </div>
                      <span className="tag-pill tag-pill-dark" style={{ fontSize: '0.65rem' }}>Online</span>
                    </div>

                    <div className="chat-msg-ai mb-3" style={{ fontSize: '0.8125rem', padding: '0.875rem 1rem' }}>
                      "Your JavaScript fundamentals are solid at 92%. Focus on the Async module before REST APIs — promise error handling is critical for Express microservices."
                    </div>

                    <div className="d-flex flex-column gap-2 mb-3">
                      {['Why was this module recommended?', 'Explain Node.js event loop simply.'].map((q, idx) => (
                        <div key={idx} className="chat-chip-pill d-flex align-items-center justify-content-between" onClick={() => navigate('/ai-assistant')}>
                          <span style={{ fontSize: '0.75rem' }}>"{q}"</span>
                          <i className="bi bi-arrow-right" style={{ fontSize: '0.7rem' }}></i>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Link to="/ai-assistant" className="btn-pill-dark w-100 btn-sm text-center">
                    Chat with AI Coach <i className="bi bi-chat-dots ms-1"></i>
                  </Link>
                </div>
              </div>
            </div>
          </main>
        </div>

        <FloatingCoachButton />
        <Footer />
      </div>
    </div>
  );
};

