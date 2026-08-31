import React from 'react';

export const ReadinessGauge = ({ 
  score = 68, 
  quizAvg = 75,
  benchmark = 85,
  size = 140, 
  strokeWidth = 9 
}) => {
  // Outer Ring (Purple: Overall Readiness)
  const r1 = (size - strokeWidth) / 2;
  const c1 = 2 * Math.PI * r1;
  const off1 = c1 - (Math.min(100, Math.max(0, score)) / 100) * c1;

  // Middle Ring (Peach: Calibration / Assessment)
  const r2 = r1 - strokeWidth - 5;
  const c2 = 2 * Math.PI * r2;
  const off2 = c2 - (Math.min(100, Math.max(0, quizAvg)) / 100) * c2;

  // Inner Ring (Blue: Benchmark Completion)
  const r3 = r2 - strokeWidth - 5;
  const c3 = 2 * Math.PI * r3;
  const off3 = c3 - (Math.min(100, Math.max(0, benchmark)) / 100) * c3;

  return (
    <div className="concentric-rings-wrap" style={{ width: size, height: size, position: 'relative' }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <defs>
          <linearGradient id="purpleRingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#A78BFA" />
            <stop offset="100%" stopColor="#818CF8" />
          </linearGradient>
          <linearGradient id="peachRingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FDBA74" />
            <stop offset="100%" stopColor="#FB923C" />
          </linearGradient>
          <linearGradient id="blueRingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#7DD3FC" />
            <stop offset="100%" stopColor="#38BDF8" />
          </linearGradient>
        </defs>

        {/* Ring 1: Background + Fill */}
        <circle cx={size/2} cy={size/2} r={r1} stroke="#F1F5F9" strokeWidth={strokeWidth} fill="none" />
        <circle
          cx={size/2} cy={size/2} r={r1}
          stroke="url(#purpleRingGrad)"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={c1}
          strokeDashoffset={off1}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1s cubic-bezier(0.16, 1, 0.3, 1)' }}
        />

        {/* Ring 2: Background + Fill */}
        <circle cx={size/2} cy={size/2} r={r2} stroke="#F1F5F9" strokeWidth={strokeWidth} fill="none" />
        <circle
          cx={size/2} cy={size/2} r={r2}
          stroke="url(#peachRingGrad)"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={c2}
          strokeDashoffset={off2}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1s cubic-bezier(0.16, 1, 0.3, 1) 0.15s' }}
        />

        {/* Ring 3: Background + Fill */}
        <circle cx={size/2} cy={size/2} r={r3} stroke="#F1F5F9" strokeWidth={strokeWidth} fill="none" />
        <circle
          cx={size/2} cy={size/2} r={r3}
          stroke="url(#blueRingGrad)"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={c3}
          strokeDashoffset={off3}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1s cubic-bezier(0.16, 1, 0.3, 1) 0.3s' }}
        />
      </svg>

      <div style={{ position: 'absolute', textAlign: 'center', pointerEvents: 'none' }}>
        <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--ink-dark)', lineHeight: 1 }}>
          {score}%
        </div>
        <div style={{ fontSize: '0.625rem', fontWeight: 700, color: '#6366F1', marginTop: 2, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          Readiness
        </div>
      </div>
    </div>
  );
};

