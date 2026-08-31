import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Navbar } from '../components/Navbar';
import { Sidebar } from '../components/Sidebar';
import { Footer } from '../components/Footer';
import { aiApi } from '../api/client';

const CHIPS = [
  { label: 'Why was this recommended?', key: 'why' },
  { label: 'Can I skip this module?',   key: 'skip' },
  { label: 'Explain the Event Loop simply.', key: 'eventloop' },
  { label: 'How to practice concurrency?', key: 'practice' },
];

export const AIAssistantPage = () => {
  const { user, isAdaptiveMode, currentRoadmap } = useApp();
  const currentNode = currentRoadmap.find(n => n.status === 'current');

  const [messages, setMessages] = useState([{
    id: 1, from: 'ai', action: null,
    text: `Hello ${user.name.split(' ')[0]}! I'm your PathCraft Coach. I have context on your ${user.goal} track and active module "${currentNode?.title || 'REST API Architecture'}". What would you like to explore?`
  }]);
  const [input,  setInput]  = useState('');
  const [typing, setTyping] = useState(false);
  const endRef = useRef(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, typing]);

  const sendMessage = async (text) => {
    const msg = text || input;
    if (!msg.trim()) return;
    setInput('');
    setMessages(prev => [...prev, { id: Date.now(), from: 'user', text: msg, action: null }]);
    setTyping(true);

    try {
      // Phase 11: Call Backend AI Coach API
      const res = await aiApi.askCoach(msg);
      if (res?.data?.reply) {
        setMessages(prev => [...prev, {
          id: Date.now() + 1,
          from: 'ai',
          text: res.data.reply,
          action: res.data.action || null,
        }]);
        setTyping(false);
        return;
      }
    } catch (err) {
      console.warn('Backend AI Coach offline, using client reasoning:', err.message);
    }

    // Client fallback
    setTimeout(() => {
      const lower = msg.toLowerCase();
      let replyText = `Regarding "${msg}": For your ${user.goal} track, following the prerequisite-aware roadmap ensures strong fundamentals before scaling into production systems. What specific topic would you like to explore deeper?`;
      let actionObj = null;

      if (lower.includes('why') || lower.includes('recommend')) {
        replyText = 'The **Async JavaScript** module was inserted because your assessment showed a 35% proficiency in Promise error handling. Node.js terminates on unhandled rejections — mastering microtask queues prevents silent crashes in your Express middleware.';
        actionObj = { label: 'View Roadmap', to: '/roadmap' };
      } else if (lower.includes('skip')) {
        replyText = "I'd advise against skipping. Production REST APIs and microservice gateways rely fundamentally on non-blocking async execution. Addressing this now saves dozens of debugging hours later.";
      } else if (lower.includes('event loop') || lower.includes('async')) {
        replyText = 'The Event Loop manages execution phases:\n1. Synchronous code executes on the main thread.\n2. Microtask queue (Promise.then, queueMicrotask) drains completely.\n3. Macrotask queue (setTimeout, I/O) executes.\nThis explains why Promises always resolve before `setTimeout(fn, 0)`.';
        actionObj = { label: 'Start Async Lab', to: '/roadmap' };
      }

      setTyping(false);
      setMessages(prev => [...prev, { id: Date.now() + 1, from: 'ai', text: replyText, action: actionObj }]);
    }, 600);
  };

  return (
    <div className="app-container-wrap">
      <div className="app-shell">
        <Navbar />

        <div className="app-main-layout">
          <Sidebar />

          <main className="page-content-area d-flex flex-column" style={{ height: 'calc(100vh - 120px)' }}>
            {/* Top Bar */}
            <div className="d-flex align-items-center justify-content-between pb-3 mb-3 border-bottom">
              <div>
                <h1 className="page-title mb-0" style={{ fontSize: '1.25rem' }}>AI Learning Coach</h1>
                <span className="caption">Context: {user.goal} · Active Module: {currentNode?.title}</span>
              </div>
              <span className="tag-pill tag-pill-dark">
                <i className="bi bi-stars me-1 text-warning"></i>Active Coach Session
              </span>
            </div>

            {/* Chat Messages Body */}
            <div className="flex-grow-1 overflow-auto p-3 d-flex flex-column gap-3 mb-3" style={{ background: 'var(--surface-subtle)', borderRadius: 'var(--radius-lg)' }}>
              {messages.map(m => (
                <div key={m.id} className={`d-flex ${m.from === 'user' ? 'justify-content-end' : 'justify-content-start'}`}>
                  {m.from === 'ai' && (
                    <div className="user-avatar-circle me-2 flex-shrink-0" style={{ width: 28, height: 28, background: '#6366F1' }}>
                      <i className="bi bi-stars" style={{ fontSize: '0.75rem' }}></i>
                    </div>
                  )}
                  <div className={m.from === 'user' ? 'chat-msg-user' : 'chat-msg-ai'}>
                    <div style={{ whiteSpace: 'pre-line' }}>{m.text}</div>
                    {m.action && (
                      <div className="mt-2 pt-2 border-top">
                        <Link to={m.action.to} className="btn-pill-dark btn-sm" style={{ padding: '0.25rem 0.75rem', fontSize: '0.75rem' }}>
                          {m.action.label} <i className="bi bi-arrow-right ms-1"></i>
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {typing && (
                <div className="d-flex justify-content-start">
                  <div className="chat-msg-ai py-2 px-3">
                    <span className="spinner-grow spinner-grow-sm text-primary me-1"></span>
                    <span className="caption">Coach is reasoning...</span>
                  </div>
                </div>
              )}
              <div ref={endRef}></div>
            </div>

            {/* Chips & Input Box */}
            <div>
              <div className="d-flex gap-2 mb-2 overflow-auto pb-1" style={{ flexWrap: 'nowrap' }}>
                {CHIPS.map(c => (
                  <button key={c.key} className="chat-chip-pill flex-shrink-0" onClick={() => sendMessage(c.label)}>
                    {c.label}
                  </button>
                ))}
              </div>

              <form onSubmit={e => { e.preventDefault(); sendMessage(); }} className="d-flex gap-2">
                <input
                  type="text"
                  className="form-input-pill"
                  placeholder="Ask anything about your learning path, concepts, or gaps..."
                  value={input}
                  onChange={e => setInput(e.target.value)}
                />
                <button type="submit" className="btn-pill-dark px-4" disabled={!input.trim()}>
                  Send <i className="bi bi-send-fill ms-1"></i>
                </button>
              </form>
            </div>
          </main>
        </div>

        <Footer />
      </div>
    </div>
  );
};
