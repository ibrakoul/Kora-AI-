'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────
type View = 'learn' | 'practice' | 'ai' | 'pricing';
interface Msg { text: string; role: 'ai' | 'user' }
interface HistoryItem { role: 'user' | 'assistant'; content: string }

// ─── Data ─────────────────────────────────────────────────────────────────────
const CHARS = [
  { g: '你', p: 'nǐ',   m: 'You',   k: true  },
  { g: '好', p: 'hǎo',  m: 'Good',  k: true  },
  { g: '吃', p: 'chī',  m: 'Eat',   k: false },
  { g: '水', p: 'shuǐ', m: 'Water', k: true  },
  { g: '饭', p: 'fàn',  m: 'Rice',  k: false },
  { g: '谢', p: 'xiè',  m: 'Thank', k: true  },
  { g: '来', p: 'lái',  m: 'Come',  k: false },
  { g: '爱', p: 'ài',   m: 'Love',  k: false },
];

const QUIZ = [
  { char: '好', pinyin: 'hǎo',  correct: 'Good',  options: ['Eat', 'Good', 'Water', 'Come']  },
  { char: '水', pinyin: 'shuǐ', correct: 'Water', options: ['Water', 'Love', 'Thank', 'Rice'] },
  { char: '爱', pinyin: 'ài',   correct: 'Love',  options: ['Come', 'Eat', 'Good', 'Love']   },
  { char: '吃', pinyin: 'chī',  correct: 'Eat',   options: ['Eat', 'Thank', 'You', 'Water']  },
  { char: '谢', pinyin: 'xiè',  correct: 'Thank', options: ['Rice', 'Good', 'Thank', 'Love'] },
];

const LOCAL_REPLIES: Record<string, string> = {
  greet: '你好！很高兴认识你 (nǐ hǎo, hěn gāoxìng rènshi nǐ) — Nice to meet you! I\'m Mei, your AI tutor 🌸',
  name:  '我叫美 (wǒ jiào Měi)! What\'s your name? Try: 我叫... (wǒ jiào...) + your name',
  food:  '你喜欢吃什么 (nǐ xǐhuān chī shénme)? I love 火锅 (huǒguō) — hotpot! What about you?',
  number:'一二三四五 (yī èr sān sì wǔ) — 1 to 5! Numbers are easy. Let\'s count to ten! 🔢',
};

function getLocalReply(text: string): string {
  const t = text.toLowerCase();
  if (t.includes('hello') || t.includes('hi') || t.includes('你好') || t.includes('ni hao')) return LOCAL_REPLIES.greet;
  if (t.includes('name') || t.includes('名字') || t.includes('jiao')) return LOCAL_REPLIES.name;
  if (t.includes('food') || t.includes('eat') || t.includes('吃') || t.includes('chi')) return LOCAL_REPLIES.food;
  if (t.includes('number') || t.includes('count') || t.includes('一') || t.includes('yi')) return LOCAL_REPLIES.number;
  const fallbacks = [
    '很好！(hěn hǎo) Great effort! Keep going 💪',
    '继续练习！(jìxù liànxí) Keep practicing! You\'re improving.',
    '加油！(jiā yóu) — This Chinese phrase means "add oil" but it means "keep it up!" 🔥',
  ];
  return fallbacks[Math.floor(Math.random() * fallbacks.length)];
}

// ─── Pro features ─────────────────────────────────────────────────────────────
const FREE_FEATURES  = ['3 lessons / day', 'Basic quiz (5 chars)', 'Community forum'];
const PRO_FEATURES   = ['Unlimited lessons', 'Full 2000+ character library', 'AI Conversation Partner', 'Spaced-repetition SRS', 'Offline mode', 'Progress analytics', 'HSK 1–6 path'];
const FREE_DISABLED  = new Set(['AI Conversation Partner', 'Spaced-repetition SRS', 'Offline mode', 'Progress analytics', 'HSK 1–6 path']);

// ─── Component ────────────────────────────────────────────────────────────────
export default function SinoFlow() {
  // Navigation
  const [view, setView] = useState<View>('learn');

  // XP / skills animation
  const [xpFill, setXpFill] = useState(0);
  const [skillFills, setSkillFills] = useState([0, 0, 0, 0]);

  // Toast
  const [toastText, setToastText] = useState('');
  const [toastVisible, setToastVisible] = useState(false);
  const toastRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Quiz
  const [qIdx, setQIdx]         = useState(0);
  const [qScore, setQScore]     = useState(0);
  const [qTotal, setQTotal]     = useState(0);
  const [qAnswered, setQAnswered] = useState(false);
  const [qSelected, setQSelected] = useState<string | null>(null);
  const [qOptions, setQOptions]  = useState<string[]>([]);
  const [qFeedback, setQFeedback] = useState('');
  const [qFeedbackColor, setQFeedbackColor] = useState('');
  const [qShowNext, setQShowNext] = useState(false);

  // AI Chat
  const [msgs, setMsgs]         = useState<Msg[]>([
    { role: 'ai', text: '你好！I\'m Mei 🌸 — your AI Mandarin tutor. Write in English or 中文 and I\'ll guide you!' },
    { role: 'ai', text: 'Try asking: 你叫什么名字？(nǐ jiào shénme míngzi?) — What\'s your name?' },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [chatTyping, setChatTyping] = useState(false);
  const [chatHistory, setChatHistory] = useState<HistoryItem[]>([]);
  const msgsEndRef = useRef<HTMLDivElement>(null);

  // ── Boot animations
  useEffect(() => {
    const t = [
      setTimeout(() => setXpFill(68), 350),
      setTimeout(() => setSkillFills([78, 0,  0,  0]),  450),
      setTimeout(() => setSkillFills([78, 63, 0,  0]),  580),
      setTimeout(() => setSkillFills([78, 63, 45, 0]),  700),
      setTimeout(() => setSkillFills([78, 63, 45, 82]), 830),
    ];
    return () => t.forEach(clearTimeout);
  }, []);

  // ── Reset quiz options on question change
  useEffect(() => {
    const q = QUIZ[qIdx % QUIZ.length];
    setQOptions([...q.options].sort(() => Math.random() - 0.5));
    setQAnswered(false);
    setQSelected(null);
    setQFeedback('');
    setQShowNext(false);
  }, [qIdx]);

  // ── Auto-scroll chat
  useEffect(() => {
    msgsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [msgs, chatTyping]);

  // ── Toast helper
  const toast = useCallback((msg: string) => {
    setToastText(msg);
    setToastVisible(true);
    if (toastRef.current) clearTimeout(toastRef.current);
    toastRef.current = setTimeout(() => setToastVisible(false), 2600);
  }, []);

  // ── Quiz answer
  function handleAnswer(chosen: string) {
    if (qAnswered) return;
    const q = QUIZ[qIdx % QUIZ.length];
    setQAnswered(true);
    setQSelected(chosen);
    setQTotal(t => t + 1);
    if (chosen === q.correct) {
      setQScore(s => s + 1);
      setQFeedback('✅ Correct! +10 XP');
      setQFeedbackColor('var(--green)');
      toast('✅ Correct! +10 XP');
    } else {
      setQFeedback(`❌ "${q.correct}" was right`);
      setQFeedbackColor('var(--red)');
    }
    setQShowNext(true);
  }

  // ── Chat
  async function sendMsg() {
    const text = chatInput.trim();
    if (!text || chatTyping) return;
    setChatInput('');
    setMsgs(m => [...m, { role: 'user', text }]);
    setChatTyping(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          history: [...chatHistory.slice(-6), { role: 'user', content: text }],
        }),
      });
      const data = await res.json();
      const reply: string = data.reply || getLocalReply(text);
      setChatHistory(h => [...h, { role: 'user', content: text }, { role: 'assistant', content: reply }]);
      setMsgs(m => [...m, { role: 'ai', text: reply }]);
    } catch {
      setMsgs(m => [...m, { role: 'ai', text: getLocalReply(text) }]);
    }
    setChatTyping(false);
  }

  function onChatKey(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMsg(); }
  }

  // ── Lesson start
  function startLesson() {
    toast('📚 Lesson started! +80 XP incoming...');
    setTimeout(() => {
      setXpFill(100);
      setTimeout(() => toast('🎉 Level up! You\'re now Level 13'), 1300);
    }, 900);
  }

  const currentQ = QUIZ[qIdx % QUIZ.length];

  return (
    <>
      <div className="shell">

        {/* ── TOP NAV ── */}
        <nav className="topnav">
          <div className="logo">
            <div className="logo-emblem">流</div>
            <div className="logo-wordmark">
              <span className="logo-name">SinoFlow</span>
              <span className="logo-sub">Mandarin · AI</span>
            </div>
          </div>
          <div className="streak-pill" onClick={() => toast('🔥 7-day streak! Keep going!')}>
            🔥 7
          </div>
        </nav>

        {/* ── TAB BAR ── */}
        <div className="tabbar">
          {(['learn','practice','ai','pricing'] as View[]).map(v => (
            <div
              key={v}
              className={`tabbar-item${view === v ? ' active' : ''}`}
              onClick={() => setView(v)}
            >
              {v === 'learn' ? 'Learn' : v === 'practice' ? 'Practice' : v === 'ai' ? 'AI Tutor' : 'Pro'}
            </div>
          ))}
        </div>

        {/* ════════════════════ LEARN ════════════════════ */}
        {view === 'learn' && (
          <div className="view">
            <div className="hero">
              <div className="hero-greeting">今天好, Alex 👋</div>
              <div className="hero-headline">
                Master <em>Mandarin</em><br />
                with your <span className="han">流</span>AI tutor.
              </div>
              {/* XP Card */}
              <div className="xp-card">
                <div className="xp-star">⭐</div>
                <div className="xp-body">
                  <div className="xp-row">
                    <span className="xp-label">Level 12 — Daily XP</span>
                    <span className="xp-count">340 / 500</span>
                  </div>
                  <div className="xp-track-bg">
                    <div className="xp-track-fill" style={{ width: `${xpFill}%` }} />
                  </div>
                </div>
                <div className="xp-level-badge">12</div>
              </div>
            </div>

            {/* Today's lesson */}
            <div className="section">
              <div className="sec-header">
                <span className="sec-title">Today&apos;s Lesson</span>
                <span className="sec-link">All units →</span>
              </div>
              <div className="lesson-card" onClick={startLesson}>
                <div className="lesson-eyebrow">📚 HSK 2 · Unit 7</div>
                <div className="lesson-title">At the Restaurant</div>
                <div className="lesson-hanzi">在餐厅</div>
                <div className="lesson-tags">
                  <span className="lesson-tag">⏱ 15 min</span>
                  <span className="lesson-tag">12 words</span>
                  <span className="lesson-tag">+80 XP</span>
                </div>
                <button className="lesson-cta">Start →</button>
              </div>
            </div>

            {/* Stats */}
            <div className="section">
              <div className="sec-header"><span className="sec-title">This Week</span></div>
              <div className="stats-grid">
                <div className="stat-cell">
                  <div className="stat-value" style={{ color: 'var(--gold)' }}>142</div>
                  <div className="stat-name">Characters</div>
                </div>
                <div className="stat-cell">
                  <div className="stat-value" style={{ color: 'var(--cyan)' }}>7</div>
                  <div className="stat-name">Day streak</div>
                </div>
                <div className="stat-cell">
                  <div className="stat-value" style={{ color: 'var(--purple2)' }}>94%</div>
                  <div className="stat-name">Accuracy</div>
                </div>
              </div>
            </div>

            {/* Skills */}
            <div className="section">
              <div className="sec-header">
                <span className="sec-title">Skills</span>
                <span className="sec-link">Details →</span>
              </div>
              <div className="skills-grid">
                {[
                  { icon: '👄', label: 'Speaking',  pct: 78, i: 0, bar: 'linear-gradient(90deg,var(--purple),var(--gold))',  feat: true  },
                  { icon: '👁',  label: 'Reading',   pct: 63, i: 1, bar: 'linear-gradient(90deg,var(--cyan),var(--purple2))', feat: false },
                  { icon: '✍️', label: 'Writing',   pct: 45, i: 2, bar: 'linear-gradient(90deg,var(--green),var(--cyan))',   feat: false },
                  { icon: '👂', label: 'Listening', pct: 82, i: 3, bar: 'linear-gradient(90deg,var(--gold),var(--red))',     feat: false },
                ].map(sk => (
                  <div key={sk.label} className={`skill-card${sk.feat ? ' featured' : ''}`}>
                    <div className="skill-emoji">{sk.icon}</div>
                    <div className="skill-label">{sk.label}</div>
                    <div className="skill-bar-bg">
                      <div className="skill-bar-fill" style={{ width: `${skillFills[sk.i]}%`, background: sk.bar }} />
                    </div>
                    <div className="skill-pct">{sk.pct}%</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Char review */}
            <div className="section">
              <div className="sec-header">
                <span className="sec-title">Review Characters</span>
                <span className="sec-link">All →</span>
              </div>
              <div className="char-scroll">
                {CHARS.map(c => (
                  <div
                    key={c.g}
                    className={`char-tile${c.k ? ' known' : ''}`}
                    onClick={() => toast(`${c.g} = "${c.m}" (${c.p})`)}
                  >
                    <span className="char-glyph">{c.g}</span>
                    <div className="char-pinyin">{c.p}</div>
                    <div className="char-meaning">{c.m}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="spacer" />
          </div>
        )}

        {/* ════════════════════ PRACTICE ════════════════════ */}
        {view === 'practice' && (
          <div className="view">
            <div className="section">
              <div className="sec-header" style={{ marginTop: 10 }}>
                <span className="sec-title">Quick Quiz</span>
                <span className="sec-link">{qScore} / {qTotal} correct</span>
              </div>
            </div>
            <div className="quiz-wrap">
              <div className="quiz-box">
                <div className="quiz-prompt">What does this character mean?</div>
                <span className="quiz-hanzi">{currentQ.char}</span>
                <div className="quiz-pinyin">{currentQ.pinyin}</div>
                <div className="quiz-grid">
                  {qOptions.map(opt => (
                    <button
                      key={opt}
                      className={`quiz-btn${
                        qAnswered && opt === currentQ.correct ? ' correct'
                        : qAnswered && opt === qSelected && opt !== currentQ.correct ? ' wrong'
                        : ''
                      }`}
                      onClick={() => handleAnswer(opt)}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
                <div className="quiz-feedback" style={{ color: qFeedbackColor }}>{qFeedback}</div>
                <button
                  className={`quiz-next${qShowNext ? ' show' : ''}`}
                  onClick={() => setQIdx(i => i + 1)}
                >
                  Next question →
                </button>
              </div>
            </div>
            <div className="spacer" />
          </div>
        )}

        {/* ════════════════════ AI TUTOR ════════════════════ */}
        {view === 'ai' && (
          <div className="view">
            <div className="section" style={{ marginBottom: 14 }}>
              <div className="sec-header" style={{ marginTop: 10 }}>
                <span className="sec-title">AI Conversation Partner</span>
              </div>
            </div>
            <div className="chat-wrap">
              <div className="chat-box">
                <div className="chat-head">
                  <div className="ai-orb">🤖</div>
                  <div>
                    <div className="ai-title">Mei · AI Tutor</div>
                    <div className="ai-online">Online — Mandarin &amp; English</div>
                  </div>
                </div>
                <div className="chat-msgs">
                  {msgs.map((m, i) => (
                    <div key={i} className={`bubble ${m.role}`}>{m.text}</div>
                  ))}
                  {chatTyping && (
                    <div className="typing-dots">
                      <span /><span /><span />
                    </div>
                  )}
                  <div ref={msgsEndRef} />
                </div>
                <div className="chat-input-row">
                  <textarea
                    className="chat-field"
                    value={chatInput}
                    onChange={e => setChatInput(e.target.value)}
                    placeholder="Type in English or 中文..."
                    rows={1}
                    onKeyDown={onChatKey}
                  />
                  <button className="chat-send" onClick={sendMsg}>➤</button>
                </div>
              </div>
            </div>
            <div className="spacer" />
          </div>
        )}

        {/* ════════════════════ PRICING ════════════════════ */}
        {view === 'pricing' && (
          <div className="view">
            <div className="pricing-wrap">
              <div className="pricing-header">
                <div className="pricing-title">Go <em>Pro</em>, learn faster</div>
                <div className="pricing-subtitle">Unlock AI tutoring &amp; the full character library</div>
              </div>

              <div className="plan-grid">
                {/* Free */}
                <div className="plan-card">
                  <div className="plan-name">Free</div>
                  <div className="plan-price">
                    <span className="plan-amount">0</span>
                    <span className="plan-currency">€</span>
                    <span className="plan-period">/ forever</span>
                  </div>
                  <div className="plan-desc">Start your Mandarin journey today.</div>
                  <ul className="plan-features">
                    {FREE_FEATURES.map(f => (
                      <li key={f} className="plan-feature">
                        <span className="feat-check">✅</span>
                        <span className="feat-label on">{f}</span>
                      </li>
                    ))}
                  </ul>
                  <button
                    className="plan-btn free"
                    onClick={() => { setView('learn'); toast('Welcome to SinoFlow! 🎉'); }}
                  >
                    Get started free
                  </button>
                </div>

                {/* Pro */}
                <div className="plan-card pro">
                  <div className="plan-badge">⚡ Most popular</div>
                  <div className="plan-name">Pro</div>
                  <div className="plan-price">
                    <span className="plan-amount cyan">5</span>
                    <span className="plan-currency">.99€</span>
                    <span className="plan-period">/ month</span>
                  </div>
                  <div className="plan-desc">Everything you need to reach fluency.</div>
                  <ul className="plan-features">
                    {PRO_FEATURES.map(f => (
                      <li key={f} className="plan-feature">
                        <span className={FREE_DISABLED.has(f) ? 'feat-check' : 'feat-check'}>✅</span>
                        <span className="feat-label on">{f}</span>
                      </li>
                    ))}
                  </ul>
                  <button
                    className="plan-btn upgrade"
                    onClick={() => toast('🚀 Redirecting to secure checkout...')}
                  >
                    Upgrade to Pro — 5.99€ / mo
                  </button>
                  <div className="plan-guarantee">🔒 7-day money-back guarantee · Cancel anytime</div>
                </div>
              </div>
            </div>
            <div className="spacer" />
          </div>
        )}

        {/* ── BOTTOM NAV ── */}
        <nav className="bottom-nav">
          {([
            { v: 'learn',    icon: '📖', label: 'Learn'    },
            { v: 'practice', icon: '⚡', label: 'Practice' },
            { v: 'ai',       icon: '🤖', label: 'AI Tutor' },
            { v: 'pricing',  icon: '👑', label: 'Pro'      },
          ] as { v: View; icon: string; label: string }[]).map(item => (
            <div
              key={item.v}
              className={`nav-btn${view === item.v ? ' active' : ''}`}
              onClick={() => setView(item.v)}
            >
              <span>{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </div>
          ))}
        </nav>

      </div>

      {/* Toast */}
      <div className={`toast${toastVisible ? ' show' : ''}`}>{toastText}</div>
    </>
  );
}
