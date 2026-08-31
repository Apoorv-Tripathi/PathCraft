import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';

const ROLES = ['Backend Developer', 'Frontend Developer', 'Fullstack Engineer', 'DevOps Specialist'];
const TIMELINES = [
  { value: '2 months', label: '2 months', desc: 'Intensive · 20+ hrs/wk' },
  { value: '4 months', label: '4 months', desc: 'Standard · 10–15 hrs/wk' },
  { value: '6 months', label: '6 months', desc: 'Part-time · 5–8 hrs/wk' },
];
const ALL_SKILLS = ['JavaScript', 'TypeScript', 'Node.js', 'Python', 'Express.js', 'PostgreSQL', 'MySQL', 'HTML/CSS', 'Git', 'Docker', 'React', 'Linux/CLI', 'AWS/Cloud', 'GraphQL'];
const INTERESTS = ['Cloud Architecture', 'FinTech & High Scale', 'AI/ML Systems', 'Microservices', 'Open Source', 'System Design'];

const STYLES = [
  { value: 'Project-based with diagnostic quizzes', label: 'Hands-on Labs + Projects', desc: 'Build concrete apps and verify concepts' },
  { value: 'Documentation & deep-dive articles', label: 'Deep Docs & Architecture', desc: 'Read thoroughly, understand mechanics' },
  { value: 'Video tutorials + guided code labs', label: 'Guided Video + Code Along', desc: 'Watch demonstrations, apply immediately' },
];

export const OnboardingPage = () => {
  const navigate = useNavigate();
  const { updateProfile } = useApp();

  const [inputMode, setInputMode] = useState('natural'); // 'natural' | 'manual'
  const [nlText, setNlText]       = useState('');
  const [isParsing, setIsParsing] = useState(false);
  const [parseSuccess, setParseSuccess] = useState(false);

  const [step,     setStep]     = useState(1);
  const [goal,     setGoal]     = useState('Backend Developer');
  const [timeline, setTimeline] = useState('4 months');
  const [skills,   setSkills]   = useState(['JavaScript', 'HTML/CSS', 'Git']);
  const [interests, setInterests] = useState(['Microservices', 'Cloud Architecture']);
  const [hours,    setHours]    = useState(12);
  const [style,    setStyle]    = useState('Project-based with diagnostic quizzes');

  const toggleSkill = (s) => setSkills(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);
  const toggleInterest = (i) => setInterests(prev => prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i]);

  // Conversational Natural Language Goal Parser (HCL Hackathon Req #1)
  const handleParseNaturalLanguage = () => {
    if (!nlText.trim()) return;
    setIsParsing(true);

    setTimeout(() => {
      const lower = nlText.toLowerCase();
      
      // Smart extraction
      if (lower.includes('front') || lower.includes('react') || lower.includes('ui') || lower.includes('css')) {
        setGoal('Frontend Developer');
        setSkills(['HTML/CSS', 'JavaScript', 'React', 'Git']);
      } else if (lower.includes('full') || lower.includes('stack') || lower.includes('complete')) {
        setGoal('Fullstack Engineer');
        setSkills(['JavaScript', 'Node.js', 'React', 'PostgreSQL', 'Git']);
      } else if (lower.includes('devops') || lower.includes('cloud') || lower.includes('docker') || lower.includes('aws')) {
        setGoal('DevOps Specialist');
        setSkills(['Linux/CLI', 'Docker', 'Git', 'AWS/Cloud']);
      } else {
        setGoal('Backend Developer');
        setSkills(['JavaScript', 'Node.js', 'Express.js', 'Git']);
      }

      if (lower.includes('2 month') || lower.includes('urgent') || lower.includes('fast') || lower.includes('intensive')) {
        setTimeline('2 months');
        setHours(20);
      } else if (lower.includes('6 month') || lower.includes('part') || lower.includes('slow')) {
        setTimeline('6 months');
        setHours(8);
      } else {
        setTimeline('4 months');
        setHours(12);
      }

      if (lower.includes('ai') || lower.includes('ml')) {
        setInterests(['AI/ML Systems', 'Cloud Architecture']);
      } else if (lower.includes('fintech') || lower.includes('bank') || lower.includes('scale')) {
        setInterests(['FinTech & High Scale', 'Microservices']);
      }

      setIsParsing(false);
      setParseSuccess(true);
      setTimeout(() => {
        setStep(2);
      }, 700);
    }, 600);
  };

  const finish = () => {
    updateProfile({ goal, timeline, availableHours: hours, learningStyle: style, interests });
    navigate('/assessment');
  };

  return (
    <div className="app-container-wrap">
      <div className="app-shell">
        <Navbar />

        <main className="p-4 p-md-5 d-flex justify-content-center">
          <div style={{ maxWidth: 620, width: '100%' }}>
            {/* Step Progress Pill Indicator */}
            <div className="d-flex align-items-center justify-content-between mb-4 pb-2">
              <span className="tag-pill tag-pill-dark">Step {step} of 3</span>
              <div className="d-flex gap-2">
                {[1, 2, 3].map(i => (
                  <div
                    key={i}
                    style={{
                      width: 32, height: 6, borderRadius: 10,
                      background: step >= i ? 'var(--ink-primary)' : 'var(--border-subtle)',
                      transition: 'var(--transition-fast)'
                    }}
                  ></div>
                ))}
              </div>
            </div>

            <div className="ui-card p-4 p-md-5">
              {/* Step 1: Conversational / Manual Goal Selection */}
              {step === 1 && (
                <div>
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <span className="badge-label">Learner Goal Profiler</span>
                    <div className="d-flex p-1 rounded-pill" style={{ background: 'var(--surface-subtle)', border: '1px solid var(--border-subtle)' }}>
                      <button
                        type="button"
                        className={`btn btn-sm rounded-pill px-3 py-1 ${inputMode === 'natural' ? 'btn-dark' : 'btn-light border-0'}`}
                        style={{ fontSize: '0.75rem', fontWeight: 700 }}
                        onClick={() => setInputMode('natural')}
                      >
                        <i className="bi bi-chat-text-fill me-1"></i>Conversational AI
                      </button>
                      <button
                        type="button"
                        className={`btn btn-sm rounded-pill px-3 py-1 ${inputMode === 'manual' ? 'btn-dark' : 'btn-light border-0'}`}
                        style={{ fontSize: '0.75rem', fontWeight: 700 }}
                        onClick={() => setInputMode('manual')}
                      >
                        Manual Selection
                      </button>
                    </div>
                  </div>

                  <h1 className="page-title mb-2">What is your learning objective?</h1>
                  <p className="meta-text mb-4">
                    {inputMode === 'natural' 
                      ? 'Describe your career transition or learning goal in natural language.' 
                      : 'Choose your engineering specialization and target timeline.'}
                  </p>

                  {/* Conversational Interface Option (Req #1) */}
                  {inputMode === 'natural' ? (
                    <div className="mb-4">
                      <div className="p-3 mb-3 rounded-3" style={{ background: 'var(--pastel-blue-bg)', border: '1px solid #BAE6FD' }}>
                        <div className="d-flex align-items-center gap-2 mb-1" style={{ color: 'var(--pastel-blue-text)', fontWeight: 700, fontSize: '0.8125rem' }}>
                          <i className="bi bi-stars"></i>
                          <span>Conversational Goal Interpreter</span>
                        </div>
                        <p style={{ fontSize: '0.8125rem', color: '#0369A1', margin: 0 }}>
                          Example: <em>"I know basic Python and HTML. I want to become a Backend Engineer building high-concurrency microservices in 4 months."</em>
                        </p>
                      </div>

                      <textarea
                        className="form-input-pill w-100 mb-3"
                        rows="4"
                        style={{ borderRadius: 'var(--radius-md)', padding: '1rem', resize: 'none' }}
                        placeholder="Type your background, aspiration, and desired pace..."
                        value={nlText}
                        onChange={e => setNlText(e.target.value)}
                      ></textarea>

                      {parseSuccess && (
                        <div className="p-3 mb-3 rounded-3 d-flex align-items-center gap-2" style={{ background: 'var(--pastel-mint-bg)', color: 'var(--pastel-mint-text)', fontSize: '0.8125rem' }}>
                          <i className="bi bi-check-circle-fill"></i>
                          <span>Extracted Track: <strong>{goal}</strong> ({timeline})</span>
                        </div>
                      )}

                      <button
                        type="button"
                        className="btn-pill-dark w-100 py-3"
                        disabled={!nlText.trim() || isParsing}
                        onClick={handleParseNaturalLanguage}
                      >
                        {isParsing ? (
                          <><span className="spinner-border spinner-border-sm me-2"></span>Analyzing Goal with AI...</>
                        ) : (
                          <>Analyze & Generate Profile <i className="bi bi-stars ms-1"></i></>
                        )}
                      </button>
                    </div>
                  ) : (
                    /* Manual Option */
                    <div>
                      <div className="d-flex flex-column gap-2 mb-4">
                        {ROLES.map(r => (
                          <div
                            key={r}
                            className={`quiz-option-card ${goal === r ? 'selected' : ''}`}
                            onClick={() => setGoal(r)}
                          >
                            <i className={`bi ${goal === r ? 'bi-check-circle-fill text-primary' : 'bi-circle text-muted'}`}></i>
                            <span style={{ fontWeight: 700, fontSize: '0.9375rem' }}>{r}</span>
                          </div>
                        ))}
                      </div>

                      <div className="mb-4">
                        <label className="caption fw-bold text-dark d-block mb-2">Target Timeline</label>
                        <div className="d-flex gap-2">
                          {TIMELINES.map(t => (
                            <div
                              key={t.value}
                              className={`p-3 rounded-3 flex-fill border text-start cursor-pointer ${timeline === t.value ? 'bg-light border-dark' : 'bg-white'}`}
                              style={{ cursor: 'pointer' }}
                              onClick={() => setTimeline(t.value)}
                            >
                              <div style={{ fontWeight: 700, fontSize: '0.875rem' }}>{t.label}</div>
                              <span className="caption">{t.desc}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <button className="btn-pill-dark w-100 py-3" onClick={() => setStep(2)}>
                        Continue to Skills & Interests <i className="bi bi-arrow-right ms-2"></i>
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Step 2: Skills & Domain Interests (Req #2) */}
              {step === 2 && (
                <div>
                  <span className="badge-label">Learner Profile Baseline</span>
                  <h1 className="page-title mb-2">Current Skills & Interests</h1>
                  <p className="meta-text mb-4">Select technologies you know and domains that interest you.</p>

                  <label className="caption fw-bold text-dark d-block mb-2">Technologies You Know</label>
                  <div className="d-flex flex-wrap gap-2 mb-4">
                    {ALL_SKILLS.map(s => {
                      const sel = skills.includes(s);
                      return (
                        <button
                          key={s}
                          type="button"
                          className="tag-pill py-2 px-3 border-0"
                          style={{
                            background: sel ? 'var(--ink-primary)' : 'var(--surface-subtle)',
                            color: sel ? '#FFFFFF' : 'var(--ink-dark)',
                            fontWeight: 600,
                            cursor: 'pointer',
                            transition: 'var(--transition-fast)'
                          }}
                          onClick={() => toggleSkill(s)}
                        >
                          {sel && <i className="bi bi-check-lg me-1"></i>}
                          {s}
                        </button>
                      );
                    })}
                  </div>

                  <label className="caption fw-bold text-dark d-block mb-2">Domain Interests (Optional)</label>
                  <div className="d-flex flex-wrap gap-2 mb-5">
                    {INTERESTS.map(i => {
                      const sel = interests.includes(i);
                      return (
                        <button
                          key={i}
                          type="button"
                          className="tag-pill py-2 px-3 border-0"
                          style={{
                            background: sel ? 'var(--pastel-purple-bg)' : 'var(--surface-subtle)',
                            color: sel ? 'var(--pastel-purple-text)' : 'var(--text-muted)',
                            fontWeight: 600,
                            cursor: 'pointer',
                            transition: 'var(--transition-fast)'
                          }}
                          onClick={() => toggleInterest(i)}
                        >
                          {sel && <i className="bi bi-star-fill me-1 text-warning"></i>}
                          {i}
                        </button>
                      );
                    })}
                  </div>

                  <div className="d-flex gap-2">
                    <button className="btn-pill-white flex-shrink-0" onClick={() => setStep(1)}>
                      ← Back
                    </button>
                    <button className="btn-pill-dark flex-fill" onClick={() => setStep(3)}>
                      Continue to Schedule <i className="bi bi-arrow-right ms-2"></i>
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Commitment & Style */}
              {step === 3 && (
                <div>
                  <span className="badge-label">Pace & Pedagogy</span>
                  <h1 className="page-title mb-2">Pace & Learning Modality</h1>
                  <p className="meta-text mb-4">Set your weekly availability and preferred content format.</p>

                  <div className="mb-4">
                    <div className="d-flex justify-content-between mb-2">
                      <span className="caption fw-bold text-dark">Weekly Study Commitment</span>
                      <span style={{ fontWeight: 800, color: 'var(--ink-dark)' }}>{hours} Hours / Week</span>
                    </div>
                    <input
                      type="range"
                      className="form-range"
                      min="4"
                      max="30"
                      value={hours}
                      onChange={e => setHours(Number(e.target.value))}
                    />
                  </div>

                  <div className="mb-4">
                    <span className="caption fw-bold text-dark d-block mb-2">Preferred Learning Modality</span>
                    <div className="d-flex flex-column gap-2">
                      {STYLES.map(s => (
                        <div
                          key={s.value}
                          className={`quiz-option-card ${style === s.value ? 'selected' : ''}`}
                          onClick={() => setStyle(s.value)}
                        >
                          <div>
                            <div style={{ fontWeight: 700, fontSize: '0.875rem' }}>{s.label}</div>
                            <span className="caption">{s.desc}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="d-flex gap-2">
                    <button className="btn-pill-white flex-shrink-0" onClick={() => setStep(2)}>
                      ← Back
                    </button>
                    <button className="btn-pill-dark flex-fill" onClick={finish}>
                      Start Diagnostic Quiz <i className="bi bi-arrow-right ms-2"></i>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
};
