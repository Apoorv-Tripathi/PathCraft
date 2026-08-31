import React, { useState } from 'react';

export const RoadmapNode = ({ node, index }) => {
  const [open, setOpen] = useState(false);
  const {
    title,
    category,
    status,
    estimatedHours,
    description,
    isRemedial,
    topics,
    prerequisites,
    whyRecommended,
    completedDate,
    quizScore,
    progress,
    resources,
    projectDeliverable
  } = node;

  const isDone    = status === 'completed';
  const isCurrent = status === 'current';
  const isLocked  = status === 'locked';

  let cardClass = 'roadmap-card-node';
  if (isCurrent) cardClass += ' node-active';
  else if (isDone) cardClass += ' node-completed';
  else if (isRemedial) cardClass += ' node-remedial';

  // Default curated resources if not provided by backend (Req #3)
  const moduleResources = resources || [
    { title: 'Official Documentation & Standards', type: 'Docs', duration: '45 mins' },
    { title: 'System Architecture Deep Dive', type: 'Video Guide', duration: '1.5 hrs' },
    { title: 'Interactive Sandbox Lab', type: 'Code Exercise', duration: '1 hr' }
  ];

  const defaultProject = projectDeliverable || (
    isRemedial 
      ? 'Hands-on Refactoring: Convert blocking callback pipelines into concurrency-safe Promise error handlers.'
      : `Capstone Milestone: Build and unit-test a production-ready ${title} module with validation and logging.`
  );

  return (
    <div className={cardClass} onClick={() => setOpen(!open)}>
      <div className="d-flex align-items-start justify-content-between gap-3">
        <div className="d-flex align-items-start gap-3 flex-grow-1">
          {/* Index or status icon */}
          <div style={{
            width: 36, height: 36, borderRadius: '50%',
            background: isDone ? 'var(--pastel-mint-bg)' : isCurrent ? 'var(--pastel-purple-bg)' : isRemedial ? 'var(--pastel-amber-bg)' : 'var(--surface-subtle)',
            color: isDone ? 'var(--pastel-mint-text)' : isCurrent ? 'var(--pastel-purple-text)' : isRemedial ? 'var(--pastel-amber-text)' : 'var(--text-muted)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '0.875rem', fontWeight: 800, flexShrink: 0
          }}>
            {isDone && <i className="bi bi-check-lg"></i>}
            {isCurrent && <i className="bi bi-play-fill"></i>}
            {isRemedial && !isCurrent && <i className="bi bi-lightning-fill"></i>}
            {isLocked && <i className="bi bi-lock-fill"></i>}
            {!isDone && !isCurrent && !isRemedial && !isLocked && (index + 1)}
          </div>

          <div style={{ flex: 1 }}>
            <div className="d-flex align-items-center gap-2 mb-1 flex-wrap">
              <span className="badge-label">{category}</span>
              {isRemedial && (
                <span className="tag-pill" style={{ background: 'var(--pastel-amber-bg)', color: 'var(--pastel-amber-text)', fontSize: '0.65rem' }}>
                  Auto-Injected Remedial
                </span>
              )}
            </div>

            <h3 style={{
              fontSize: '1rem',
              fontWeight: isCurrent ? 800 : 700,
              color: isLocked ? 'var(--text-faint)' : 'var(--ink-dark)',
              marginBottom: '0.25rem'
            }}>
              {title}
            </h3>

            <div className="d-flex align-items-center gap-3 caption flex-wrap">
              <span><i className="bi bi-clock me-1"></i>{estimatedHours} hours</span>
              {completedDate && <span className="text-success"><i className="bi bi-calendar-check me-1"></i>Completed {completedDate}</span>}
              {quizScore && <span style={{ color: 'var(--pastel-purple-text)', fontWeight: 700 }}><i className="bi bi-patch-check-fill me-1"></i>Score {quizScore}%</span>}
              {isCurrent && progress && <span style={{ color: '#6366F1', fontWeight: 700 }}><i className="bi bi-bar-chart-fill me-1"></i>{progress}% Completed</span>}
            </div>

            {isCurrent && progress && (
              <div className="custom-progress-track mt-2" style={{ maxWidth: 280, height: 6 }}>
                <div className="custom-progress-fill bg-accent-purple" style={{ width: `${progress}%` }}></div>
              </div>
            )}
          </div>
        </div>

        <div className="d-flex align-items-center gap-2">
          {isDone && <span className="tag-pill" style={{ background: 'var(--pastel-mint-bg)', color: 'var(--pastel-mint-text)' }}>Done</span>}
          {isCurrent && <span className="tag-pill" style={{ background: 'var(--pastel-purple-bg)', color: 'var(--pastel-purple-text)' }}>In Progress</span>}
          {isRemedial && !isCurrent && <span className="tag-pill" style={{ background: 'var(--pastel-amber-bg)', color: 'var(--pastel-amber-text)' }}>Remedial</span>}
          {status === 'upcoming' && !isRemedial && <span className="tag-pill" style={{ background: 'var(--surface-subtle)', color: 'var(--text-muted)' }}>Upcoming</span>}
          {isLocked && <span className="tag-pill" style={{ background: 'var(--surface-subtle)', color: 'var(--text-faint)' }}>Locked</span>}

          <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--surface-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <i className={`bi bi-chevron-${open ? 'up' : 'down'}`} style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}></i>
          </div>
        </div>
      </div>

      {open && (
        <div className="mt-3 pt-3" style={{ borderTop: '1px solid var(--border-light)' }}>
          <p className="meta-text mb-3" style={{ lineHeight: 1.65 }}>{description}</p>

          {/* AI Explanation Pill (Req #5) */}
          {whyRecommended && (
            <div className="p-3 mb-3" style={{
              background: isRemedial ? 'var(--pastel-amber-bg)' : 'var(--pastel-blue-bg)',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.8125rem',
              color: isRemedial ? 'var(--pastel-amber-text)' : 'var(--pastel-blue-text)',
              fontWeight: 500
            }}>
              <i className={`bi bi-${isRemedial ? 'lightning-fill' : 'lightbulb-fill'} me-2`}></i>
              <strong>Why recommended:</strong> {whyRecommended}
            </div>
          )}

          {/* Recommended Resources (Req #3) */}
          <div className="p-3 mb-3 rounded-3" style={{ background: 'var(--surface-subtle)', border: '1px solid var(--border-subtle)' }}>
            <span className="caption fw-bold text-dark d-block mb-2">
              <i className="bi bi-journal-bookmark-fill me-1 text-primary"></i>Recommended Learning Resources & Courses
            </span>
            <div className="d-flex flex-column gap-2">
              {moduleResources.map((res, i) => (
                <div key={i} className="d-flex align-items-center justify-content-between p-2 bg-white rounded border">
                  <div className="d-flex align-items-center gap-2">
                    <span className="tag-pill tag-pill-white" style={{ fontSize: '0.65rem' }}>{res.type}</span>
                    <span style={{ fontSize: '0.8125rem', fontWeight: 600 }}>{res.title}</span>
                  </div>
                  <span className="caption text-muted">{res.duration}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Hands-on Project Deliverable (Req #3) */}
          <div className="p-3 mb-3 rounded-3" style={{ background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
            <span className="caption fw-bold text-dark d-block mb-1">
              <i className="bi bi-tools me-1 text-warning"></i>Hands-on Project Deliverable
            </span>
            <p className="caption mb-0" style={{ color: 'var(--ink-dark)', lineHeight: 1.5 }}>
              {defaultProject}
            </p>
          </div>

          {topics?.length > 0 && (
            <div className="mb-2">
              <span className="caption fw-bold text-dark me-2">Core Topics:</span>
              <span className="caption text-muted">{topics.join(' • ')}</span>
            </div>
          )}

          {prerequisites?.length > 0 && (
            <div>
              <span className="caption fw-bold text-dark me-2">Prerequisites:</span>
              <span className="caption text-muted">{prerequisites.join(', ')}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
