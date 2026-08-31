import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { FloatingCoachButton } from '../components/FloatingCoachButton';

const QUESTIONS = [
  { id: 1, skill: 'JavaScript Core', difficulty: 'Intermediate', question: 'What does typeof null return in JavaScript?', code: null, options: ['"null"', '"object"', '"undefined"', '"string"'], correct: 1, explanation: 'This is a legacy JavaScript quirk. typeof null returns "object".' },
  { id: 2, skill: 'Node.js', difficulty: 'Intermediate', question: 'Which component of Node.js handles asynchronous file I/O operations?', code: 'const fs = require("fs/promises");\nawait fs.readFile("data.json");', options: ['V8 engine on main thread', 'Libuv worker thread pool', 'Microtask queue', 'OS socket polling layer'], correct: 1, explanation: 'Libuv maintains an asynchronous worker thread pool for file I/O operations.' },
  { id: 3, skill: 'Async JavaScript', difficulty: 'Senior', question: 'What is the exact console output order for this snippet?', code: `console.log('1');\nsetTimeout(() => console.log('2'), 0);\nPromise.resolve().then(() => console.log('3'));\nconsole.log('4');`, options: ['1, 2, 3, 4', '1, 4, 3, 2', '1, 4, 2, 3', '1, 3, 4, 2'], correct: 1, explanation: 'Sync (1, 4) executes first, followed by microtasks (3), then macrotasks (2).' },
  { id: 4, skill: 'REST APIs', difficulty: 'Intermediate', question: 'Which HTTP method is idempotent and replaces the full target resource representation?', code: 'PUT /api/v1/customers/9041 HTTP/1.1', options: ['POST', 'PUT', 'PATCH', 'OPTIONS'], correct: 1, explanation: 'PUT is idempotent and replaces the entire entity representation.' },
  { id: 5, skill: 'Node.js', difficulty: 'Senior', question: 'In modern Node.js, what happens when an unhandled Promise rejection occurs?', code: `async function boot() { throw new Error("DB failure"); }\nboot();`, options: ['Warning emitted, process keeps running', 'Process terminates with a non-zero exit code', 'Promise retried automatically', 'Converts to uncaughtException event'], correct: 1, explanation: 'Unhandled Promise rejections terminate the process with non-zero exit code.' },
  { id: 6, skill: 'Async JavaScript', difficulty: 'Senior', question: 'What is the practical issue with using async callbacks inside Array.prototype.forEach?', code: `items.forEach(async (item) => {\n  await processItem(item);\n});\nconsole.log("All done");`, options: ['Syntax error — async not supported', 'forEach ignores returned Promises — "All done" logs prematurely', 'All Promises cancelled immediately', 'Memory leak from unclosed contexts'], correct: 1, explanation: 'forEach does not await returned promises. Use Promise.all(items.map(...)) or for...of instead.' },
];

export const AssessmentPage = () => {
  const navigate = useNavigate();
  const { toggleAdaptiveRoadmap, setAssessmentResult, user } = useApp();

  const [index,     setIndex]     = useState(0);
  const [answers,   setAnswers]   = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [result,    setResult]    = useState(null);

  const q   = QUESTIONS[index];
  const pct = Math.round(((index + 1) / QUESTIONS.length) * 100);

  const submit = () => {
    let correct = 0;
    QUESTIONS.forEach((item, i) => { if (answers[i] === item.correct) correct++; });
    const score = Math.round((correct / QUESTIONS.length) * 100);
    const r = { score, correct, total: QUESTIONS.length };
    setResult(r);
    setAssessmentResult({ ...r, weakSkill: 'Async JavaScript' });
    if (score < 70) toggleAdaptiveRoadmap(true);
    setSubmitted(true);
  };

  return (
    <div className="app-container-wrap">
      <div className="app-shell">
        <Navbar />

        <main className="p-4 p-md-5 d-flex justify-content-center">
          <div style={{ maxWidth: 680, width: '100%' }}>
            {!submitted ? (
              <div className="ui-card p-4 p-md-5">
                {/* Header */}
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <div>
                    <span className="tag-pill tag-pill-dark mb-2">Technical Diagnostic</span>
                    <h1 className="page-title mb-1" style={{ fontSize: '1.35rem' }}>Skill Calibration</h1>
                    <p className="meta-text mb-0">{user.goal} · Question {index + 1} of {QUESTIONS.length}</p>
                  </div>
                  <span className="tag-pill" style={{ background: 'var(--pastel-purple-bg)', color: 'var(--pastel-purple-text)', fontWeight: 700 }}>
                    {q.skill} · {q.difficulty}
                  </span>
                </div>

                {/* Progress */}
                <div className="custom-progress-track mb-4" style={{ height: 8 }}>
                  <div className="custom-progress-fill bg-accent-purple" style={{ width: `${pct}%` }}></div>
                </div>

                {/* Question */}
                <h2 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--ink-dark)', lineHeight: 1.5, marginBottom: '1.25rem' }}>
                  {q.question}
                </h2>

                {q.code && (
                  <pre className="snippet-box mb-4"><code>{q.code}</code></pre>
                )}

                {/* Options list */}
                <div className="d-flex flex-column gap-2 mb-4">
                  {q.options.map((opt, i) => (
                    <div
                      key={i}
                      className={`quiz-option-card ${answers[index] === i ? 'selected' : ''}`}
                      onClick={() => setAnswers({ ...answers, [index]: i })}
                    >
                      <div className="quiz-key-badge">{String.fromCharCode(65 + i)}</div>
                      <span style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--ink-dark)' }}>{opt}</span>
                    </div>
                  ))}
                </div>

                {/* Navigation Buttons */}
                <div className="d-flex align-items-center justify-content-between pt-3 border-top">
                  <button
                    className="btn-pill-white btn-sm"
                    disabled={index === 0}
                    onClick={() => setIndex(index - 1)}
                  >
                    ← Previous
                  </button>

                  <div className="d-flex align-items-center gap-2">
                    <button className="btn btn-link text-muted text-decoration-none" style={{ fontSize: '0.8125rem' }} onClick={submit}>
                      Skip to Result
                    </button>
                    <button
                      className="btn-pill-dark btn-sm px-4"
                      disabled={answers[index] === undefined}
                      onClick={() => index < QUESTIONS.length - 1 ? setIndex(index + 1) : submit()}
                    >
                      {index === QUESTIONS.length - 1 ? 'Complete Assessment' : 'Next Question →'}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              /* Results view */
              <div className="ui-card p-4 p-md-5 text-center">
                <span className="tag-pill tag-pill-dark mb-3">Diagnostic Complete</span>
                <h1 className="page-title mb-2">Assessment Results</h1>
                <p className="meta-text mb-4">Your knowledge profile calibrated for {user.goal}</p>

                {/* Score circle */}
                <div className="my-4 d-inline-flex flex-column align-items-center justify-content-center p-4 rounded-circle" style={{
                  width: 140, height: 140,
                  background: result.score >= 70 ? 'var(--pastel-mint-bg)' : 'var(--pastel-peach-bg)',
                  border: `4px solid ${result.score >= 70 ? '#34D399' : '#FB923C'}`
                }}>
                  <div style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--ink-dark)', lineHeight: 1 }}>
                    {result.score}%
                  </div>
                  <span className="caption fw-bold mt-1" style={{ color: result.score >= 70 ? '#15803D' : '#C2410C' }}>
                    {result.score >= 70 ? 'Passed' : 'Needs Practice'}
                  </span>
                </div>

                {/* Skill breakdown list */}
                <div className="text-start p-3 rounded-3 mb-4" style={{ background: 'var(--surface-subtle)', border: '1px solid var(--border-subtle)' }}>
                  <span className="badge-label mb-2 d-block">Competency Breakdown</span>
                  {[
                    { name: 'JavaScript Core', score: 90, status: 'Mastered' },
                    { name: 'Node.js Architecture', score: 65, status: 'Proficient' },
                    { name: 'Async JavaScript & Event Loop', score: 35, status: 'Critical Gap' },
                    { name: 'REST APIs & Middleware', score: 50, status: 'Developing' },
                  ].map(s => (
                    <div key={s.name} className="d-flex align-items-center justify-content-between py-2 border-bottom">
                      <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>{s.name}</span>
                      <div className="d-flex align-items-center gap-2">
                        <span style={{ fontSize: '0.875rem', fontWeight: 700 }}>{s.score}%</span>
                        <span className="tag-pill" style={{
                          background: s.status === 'Mastered' ? 'var(--pastel-mint-bg)' : s.status === 'Critical Gap' ? 'var(--pastel-peach-bg)' : 'var(--pastel-blue-bg)',
                          color: s.status === 'Mastered' ? 'var(--pastel-mint-text)' : s.status === 'Critical Gap' ? 'var(--pastel-peach-text)' : 'var(--pastel-blue-text)',
                          fontSize: '0.6875rem'
                        }}>
                          {s.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {result.score < 70 && (
                  <div className="p-3 rounded-3 mb-4 text-start" style={{ background: 'var(--pastel-amber-bg)', border: '1px solid var(--pastel-amber-tag)' }}>
                    <div className="d-flex align-items-center gap-2 mb-1">
                      <i className="bi bi-lightning-fill text-warning"></i>
                      <strong style={{ fontSize: '0.875rem', color: 'var(--pastel-amber-text)' }}>Adaptive Path Generated</strong>
                    </div>
                    <p style={{ fontSize: '0.8125rem', color: '#92400E', margin: 0 }}>
                      3 remedial modules inserted into your roadmap to reinforce Async JavaScript concepts before advanced API microservices.
                    </p>
                  </div>
                )}

                <div className="d-flex justify-content-center gap-3">
                  <button className="btn-pill-dark" onClick={() => navigate('/dashboard')}>
                    Return to Dashboard <i className="bi bi-arrow-right ms-1"></i>
                  </button>
                  <button className="btn-pill-white" onClick={() => navigate('/roadmap')}>
                    View Roadmap
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>

        <FloatingCoachButton />
        <Footer />
      </div>
    </div>
  );
};
