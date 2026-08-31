import React from 'react';
import { useApp } from '../context/AppContext';
import { Navbar } from '../components/Navbar';
import { Sidebar } from '../components/Sidebar';
import { Footer } from '../components/Footer';
import { RoadmapNode } from '../components/RoadmapNode';
import { FloatingCoachButton } from '../components/FloatingCoachButton';

export const RoadmapPage = () => {
  const { currentRoadmap, isAdaptiveMode, toggleAdaptiveRoadmap, user } = useApp();

  const completed = currentRoadmap.filter(n => n.status === 'completed').length;
  const total     = currentRoadmap.length;
  const pct       = Math.round((completed / total) * 100);

  return (
    <div className="app-container-wrap">
      <div className="app-shell">
        <Navbar />

        <div className="app-main-layout">
          <Sidebar />

          <main className="page-content-area">
            {/* Header */}
            <div className="d-flex align-items-center justify-content-between flex-wrap gap-3 mb-4">
              <div>
                <h1 className="page-title mb-1">Learning Roadmap</h1>
                <p className="meta-text mb-0">Personalized sequence for <strong>{user.goal}</strong> · {completed} of {total} completed</p>
              </div>

              <div className="d-flex align-items-center gap-2">
                <button
                  className={isAdaptiveMode ? 'btn-pill-white btn-sm' : 'btn-pill-dark btn-sm'}
                  onClick={() => toggleAdaptiveRoadmap()}
                >
                  {isAdaptiveMode ? (
                    <><i className="bi bi-arrow-counterclockwise me-1"></i>Reset to Baseline</>
                  ) : (
                    <><i className="bi bi-lightning me-1"></i>Simulate Adaptive Injection</>
                  )}
                </button>
              </div>
            </div>

            {/* Overall Progress Banner Card */}
            <div className="ui-card p-4 mb-4">
              <div className="d-flex align-items-center justify-content-between mb-2">
                <div className="d-flex align-items-center gap-2">
                  <span className="tag-pill tag-pill-dark">Overall Progress</span>
                  <span className="caption text-muted">{completed} of {total} Modules</span>
                </div>
                <span style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--ink-dark)' }}>{pct}%</span>
              </div>
              <div className="custom-progress-track" style={{ height: 10 }}>
                <div className="custom-progress-fill bg-accent-navy" style={{ width: `${pct}%` }}></div>
              </div>
            </div>

            {/* Adaptive Banner if active */}
            {isAdaptiveMode && (
              <div className="p-4 mb-4 rounded-4 d-flex align-items-start gap-3" style={{ background: 'var(--pastel-amber-bg)', border: '1px solid var(--pastel-amber-tag)' }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#F59E0B', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <i className="bi bi-lightning-fill"></i>
                </div>
                <div>
                  <h4 style={{ fontSize: '0.9375rem', fontWeight: 800, color: 'var(--pastel-amber-text)', marginBottom: 2 }}>
                    Adaptive Gap Remediation Activated
                  </h4>
                  <p style={{ fontSize: '0.8125rem', color: '#92400E', margin: 0, lineHeight: 1.5 }}>
                    Assessment detected a 50% gap in <strong>Async JavaScript & Event Loop</strong>. Three targeted practice modules have been dynamically inserted before REST API development.
                  </p>
                </div>
              </div>
            )}

            {/* Status Legend Pills */}
            <div className="d-flex align-items-center gap-2 flex-wrap mb-4">
              <span className="caption fw-bold text-dark me-1">Legend:</span>
              <span className="tag-pill" style={{ background: 'var(--pastel-mint-bg)', color: 'var(--pastel-mint-text)' }}><i className="bi bi-check-circle-fill me-1"></i>Completed</span>
              <span className="tag-pill" style={{ background: 'var(--pastel-purple-bg)', color: 'var(--pastel-purple-text)' }}><i className="bi bi-play-circle-fill me-1"></i>In Progress</span>
              <span className="tag-pill" style={{ background: 'var(--pastel-amber-bg)', color: 'var(--pastel-amber-text)' }}><i className="bi bi-lightning-fill me-1"></i>Auto-Injected Remedial</span>
              <span className="tag-pill" style={{ background: 'var(--surface-subtle)', color: 'var(--text-muted)' }}><i className="bi bi-circle me-1"></i>Upcoming</span>
              <span className="tag-pill" style={{ background: 'var(--surface-subtle)', color: 'var(--text-faint)' }}><i className="bi bi-lock-fill me-1"></i>Locked</span>
            </div>

            {/* Roadmap Flow Nodes */}
            <div className="roadmap-flow-container">
              {currentRoadmap.map((node, i) => (
                <RoadmapNode key={node.id} node={node} index={i} />
              ))}
            </div>
          </main>
        </div>

        <FloatingCoachButton />
        <Footer />
      </div>
    </div>
  );
};
