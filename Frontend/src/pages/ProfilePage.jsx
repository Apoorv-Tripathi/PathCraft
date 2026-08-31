import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Navbar } from '../components/Navbar';
import { Sidebar } from '../components/Sidebar';
import { Footer } from '../components/Footer';

const INTEREST_OPTIONS = ['Cloud Architecture', 'FinTech & High Scale', 'AI/ML Systems', 'Microservices', 'Open Source', 'System Design'];

export const ProfilePage = () => {
  const { user, updateProfile, skills, setSkills } = useApp();

  const [name,        setName]        = useState(user.name || 'Alex Chen');
  const [goal,        setGoal]        = useState(user.goal || 'Backend Developer');
  const [timeline,    setTimeline]    = useState(user.timeline || '4 months');
  const [hours,       setHours]       = useState(user.availableHours || 12);
  const [style,       setStyle]       = useState(user.learningStyle || 'Project-based with diagnostic quizzes');
  const [experience,  setExperience]  = useState(user.experienceLevel || 'Intermediate');
  const [interests,   setInterests]   = useState(user.interests || ['Microservices', 'Cloud Architecture']);
  const [saved,       setSaved]       = useState(false);

  const toggleInterest = (item) => {
    setInterests(prev => prev.includes(item) ? prev.filter(x => x !== item) : [...prev, item]);
  };

  const handleSave = (e) => {
    e.preventDefault();
    updateProfile({
      name,
      goal,
      timeline,
      availableHours: hours,
      learningStyle: style,
      experienceLevel: experience,
      interests
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const updateSkill = (i, val) => {
    const updated = [...skills];
    updated[i] = { ...updated[i], proficiency: Number(val) };
    setSkills(updated);
  };

  return (
    <div className="app-container-wrap">
      <div className="app-shell">
        <Navbar />

        <div className="app-main-layout">
          <Sidebar />

          <main className="page-content-area">
            <div className="d-flex align-items-center justify-content-between mb-4">
              <div>
                <h1 className="page-title mb-1">Learner Profile & Track Settings</h1>
                <p className="meta-text mb-0">Manage your learning objectives, background, interests, and skill competencies.</p>
              </div>
              {saved && (
                <span className="tag-pill" style={{ background: 'var(--pastel-mint-bg)', color: 'var(--pastel-mint-text)' }}>
                  <i className="bi bi-check-circle-fill me-1"></i>Saved Successfully
                </span>
              )}
            </div>

            <form onSubmit={handleSave} className="d-flex flex-column gap-4">
              {/* Profile Card */}
              <div className="ui-card p-4">
                <h2 className="section-title mb-3">Core Learning Objectives & Background</h2>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="caption fw-bold text-dark d-block mb-1">Full Name</label>
                    <input
                      type="text"
                      className="form-input-pill"
                      value={name}
                      onChange={e => setName(e.target.value)}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="caption fw-bold text-dark d-block mb-1">Target Engineering Role</label>
                    <select
                      className="form-input-pill"
                      value={goal}
                      onChange={e => setGoal(e.target.value)}
                    >
                      {['Backend Developer', 'Frontend Developer', 'Fullstack Engineer', 'DevOps Specialist'].map(r => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="caption fw-bold text-dark d-block mb-1">Experience Level / Background</label>
                    <select
                      className="form-input-pill"
                      value={experience}
                      onChange={e => setExperience(e.target.value)}
                    >
                      <option value="Beginner">Beginner (New to programming)</option>
                      <option value="Intermediate">Intermediate (1-2 years experience)</option>
                      <option value="Career Switcher">Career Switcher (Transitioning roles)</option>
                      <option value="Advanced">Advanced (Leveling up to Senior)</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="caption fw-bold text-dark d-block mb-1">Target Timeline</label>
                    <select
                      className="form-input-pill"
                      value={timeline}
                      onChange={e => setTimeline(e.target.value)}
                    >
                      <option value="2 months">2 months — Intensive (20h/wk)</option>
                      <option value="4 months">4 months — Standard (10-15h/wk)</option>
                      <option value="6 months">6 months — Part-time (5-8h/wk)</option>
                    </select>
                  </div>
                  <div className="col-md-12">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <label className="caption fw-bold text-dark mb-0">Weekly Availability</label>
                      <span style={{ fontWeight: 800, fontSize: '0.875rem' }}>{hours}h / week</span>
                    </div>
                    <input
                      type="range"
                      className="form-range mt-2"
                      min="4"
                      max="30"
                      value={hours}
                      onChange={e => setHours(Number(e.target.value))}
                    />
                  </div>
                </div>
              </div>

              {/* Interests & Domains Card (Req #2) */}
              <div className="ui-card p-4">
                <h2 className="section-title mb-1">Domain Interests & Electives</h2>
                <p className="meta-text mb-3">Choose areas of interest to tailor project recommendations and elective modules.</p>

                <div className="d-flex flex-wrap gap-2">
                  {INTEREST_OPTIONS.map(item => {
                    const sel = interests.includes(item);
                    return (
                      <button
                        key={item}
                        type="button"
                        className="tag-pill py-2 px-3 border-0"
                        style={{
                          background: sel ? 'var(--pastel-purple-bg)' : 'var(--surface-subtle)',
                          color: sel ? 'var(--pastel-purple-text)' : 'var(--text-muted)',
                          fontWeight: 600,
                          cursor: 'pointer',
                          transition: 'var(--transition-fast)'
                        }}
                        onClick={() => toggleInterest(item)}
                      >
                        {sel && <i className="bi bi-star-fill me-1 text-warning"></i>}
                        {item}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Skill Competencies Slider Card */}
              <div className="ui-card p-4">
                <h2 className="section-title mb-1">Self-Reported Skill Competencies</h2>
                <p className="meta-text mb-4">Adjust baseline values or take diagnostic quizzes to calibrate automatically.</p>

                <div className="d-flex flex-column gap-3">
                  {skills.map((skill, i) => (
                    <div key={skill.name}>
                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>{skill.name}</span>
                        <span style={{ fontSize: '0.8125rem', fontWeight: 700 }}>
                          {skill.proficiency}% <span className="text-muted fw-normal">/ {skill.targetBenchmark}% target</span>
                        </span>
                      </div>
                      <input
                        type="range"
                        className="form-range"
                        min="0"
                        max="100"
                        value={skill.proficiency}
                        onChange={e => updateSkill(i, e.target.value)}
                      />
                      <div className="custom-progress-track mt-1" style={{ height: 5 }}>
                        <div
                          className="custom-progress-fill"
                          style={{
                            width: `${skill.proficiency}%`,
                            background: skill.proficiency < skill.targetBenchmark * 0.6 ? '#FB923C' : '#34D399'
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <button type="submit" className="btn-pill-dark px-5">
                  Save Changes <i className="bi bi-check-lg ms-1"></i>
                </button>
              </div>
            </form>
          </main>
        </div>

        <Footer />
      </div>
    </div>
  );
};
