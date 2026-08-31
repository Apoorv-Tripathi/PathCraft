import React from 'react';
import { useNavigate } from 'react-router-dom';

export const FloatingCoachButton = () => {
  const navigate = useNavigate();

  return (
    <button
      className="fab-coach-pill"
      onClick={() => navigate('/ai-assistant')}
      aria-label="Ask AI Coach"
    >
      <div style={{ width: 22, height: 22, borderRadius: '50%', background: '#818CF8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem' }}>
        <i className="bi bi-stars"></i>
      </div>
      <span>Ask AI Coach</span>
    </button>
  );
};
