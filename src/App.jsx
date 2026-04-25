import React, { useState, useEffect, useRef, useCallback } from 'react';

/* ============================================================
   GLOBAL STYLES (injected once)
   ============================================================ */
const GLOBAL_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Mono:wght@400;500&family=Outfit:wght@300;400;500;600&display=swap');

*, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

:root {
  --bg: #05080f;
  --s1: #0a0e1a;
  --s2: #0e1422;
  --s3: #131926;
  --teal: #00e5d4;
  --teal2: #00b8aa;
  --purple: #7c5cfc;
  --pink: #f72585;
  --border: rgba(255,255,255,0.07);
  --text: #dde4f0;
  --muted: #5a6a80;
  --danger: #ff4060;
  --warn: #ffaa30;
  --font-head: 'Syne', 'Arial Black', sans-serif;
  --font-body: 'Outfit', 'Segoe UI', system-ui, sans-serif;
  --font-mono: 'DM Mono', monospace;
}

body {
  background: var(--bg);
  color: var(--text);
  font-family: var(--font-body);
  min-height: 100vh;
  overflow-x: hidden;
}

/* grid bg */
body::before {
  content: '';
  position: fixed; inset: 0;
  background-image:
    linear-gradient(rgba(0,229,212,0.022) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0,229,212,0.022) 1px, transparent 1px);
  background-size: 52px 52px;
  pointer-events: none; z-index: 0;
}

/* scrollbar */
::-webkit-scrollbar { width: 4px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: var(--border); border-radius: 2px; }

/* animations */
@keyframes orbF { from { transform: translate(0,0) scale(1); } to { transform: translate(35px,25px) scale(1.08); } }
@keyframes ringS { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
@keyframes spIn { from { opacity: 0; transform: scale(.65) translateY(20px); } to { opacity: 1; transform: none; } }
@keyframes icPop { from { opacity: 0; transform: scale(.3) rotate(-25deg); } to { opacity: 1; transform: none; } }
@keyframes fuIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }
@keyframes slideR { from { opacity: 0; transform: translateX(18px); } to { opacity: 1; transform: none; } }
@keyframes toastIn { from { opacity: 0; transform: translateX(24px); } to { opacity: 1; transform: none; } }
@keyframes toastOut { to { opacity: 0; transform: translateX(24px); } }
@keyframes pulse { 0%,100% { box-shadow: 0 0 0 0 rgba(0,229,212,0.45); } 50% { box-shadow: 0 0 0 6px rgba(0,229,212,0); } }
@keyframes hexGl { from { box-shadow: 0 0 8px rgba(0,229,212,0.35); } to { box-shadow: 0 0 20px rgba(124,92,252,0.6); } }
@keyframes barFill { from { width: 0; } to { width: var(--target-w); } }
@keyframes countUp { from { opacity: 0; } to { opacity: 1; } }
@keyframes splashHide { to { opacity: 0; visibility: hidden; pointer-events: none; } }
`;

/* ============================================================
   CONSTANTS
   ============================================================ */
const COLORS = ['#00e5d4','#f72585','#7c5cfc','#ffaa30','#00b4d8','#39d353','#ff6b35','#a8dadc'];
const VIEWS = ['dashboard','users','analytics','notifs','settings'];

function ini(p, n) {
  return ((p||'')[0]||'').toUpperCase() + ((n||'')[0]||'').toUpperCase();
}
function ts() {
  return new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
}

/* ============================================================
   HOOKS
   ============================================================ */
function useLocalStorage(key, initial) {
  const [val, setVal] = useState(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : initial;
    } catch { return initial; }
  });
  const set = useCallback(v => {
    setVal(v);
    try { localStorage.setItem(key, JSON.stringify(v)); } catch {}
  }, [key]);
  return [val, set];
}

/* ============================================================
   SPLASH
   ============================================================ */
function Splash({ onDone }) {
  const [pct, setPct] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let p = 0;
    const iv = setInterval(() => {
      p = Math.min(100, p + Math.random() * 9 + 2);
      setPct(Math.floor(p));
      if (p >= 100) {
        clearInterval(iv);
        setTimeout(() => { setDone(true); setTimeout(onDone, 600); }, 200);
      }
    }, 55);
    return () => clearInterval(iv);
  }, [onDone]);

  const particles = Array.from({ length: 22 }, (_, i) => {
    const angle = (i / 22) * 360 + Math.random() * 20;
    const dist = 110 + Math.random() * 160;
    return {
      left: `${48 + Math.random() * 4}%`,
      top: `${44 + Math.random() * 6}%`,
      dx: Math.cos(angle * Math.PI / 180) * dist,
      dy: Math.sin(angle * Math.PI / 180) * dist,
      size: 2 + Math.random() * 3,
      color: Math.random() > 0.5 ? '#00e5d4' : '#7c5cfc',
      dur: 1.5 + Math.random() * 2,
      delay: 0.8 + Math.random() * 0.8,
    };
  });

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: 'var(--bg)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      gap: 24, overflow: 'hidden',
      transition: 'opacity 0.7s, visibility 0.7s',
      opacity: done ? 0 : 1, visibility: done ? 'hidden' : 'visible',
    }}>
      {/* particles */}
      {particles.map((p, i) => (
        <div key={i} style={{
          position: 'absolute', left: p.left, top: p.top,
          width: p.size, height: p.size, borderRadius: '50%',
          background: p.color, opacity: 0,
          animation: `ptFly ${p.dur}s linear ${p.delay}s infinite`,
          '--dx': `${p.dx}px`, '--dy': `${p.dy}px`,
          animationName: 'none',
        }} />
      ))}
      <style>{`
        @keyframes ptFly {
          0% { opacity:0; transform:translate(0,0) scale(0); }
          20% { opacity:.9; }
          100% { opacity:0; transform:translate(var(--dx),var(--dy)) scale(.2); }
        }
      `}</style>

      <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
        {/* rings */}
        {[180, 260].map((s, i) => (
          <div key={i} style={{
            position: 'absolute', width: s, height: s, borderRadius: '50%',
            border: `1px solid ${i === 0 ? 'rgba(0,229,212,0.13)' : 'rgba(124,92,252,0.09)'}`,
            animation: `ringS ${i === 0 ? 8 : 12}s linear infinite`,
            animationDirection: i === 1 ? 'reverse' : 'normal',
          }} />
        ))}

        {/* brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, position: 'relative', zIndex: 2, animation: 'spIn .8s cubic-bezier(.22,1,.36,1) .3s both' }}>
          <div style={{
            width: 46, height: 46, borderRadius: '50%',
            background: 'linear-gradient(135deg,#00e5d4,#7c5cfc)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 22px rgba(0,229,212,0.55)',
            animation: 'icPop .65s cubic-bezier(.34,1.56,.64,1) .9s both',
          }}>
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <circle cx="9" cy="9" r="6" stroke="white" strokeWidth="2.2"/>
              <line x1="13.5" y1="13.5" x2="19" y2="19" stroke="white" strokeWidth="2.2" strokeLinecap="round"/>
            </svg>
          </div>
          <div style={{
            fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: '3rem', letterSpacing: '-2px',
            background: 'linear-gradient(135deg,#00e5d4,#7c5cfc)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            backgroundClip: 'text', lineHeight: 1,
          }}>seomaniak</div>
        </div>

        <div style={{ color: 'var(--muted)', fontSize: '.75rem', letterSpacing: '4px', textTransform: 'uppercase', animation: 'fuIn .5s ease 1.1s both', opacity: 0, animationFillMode: 'forwards' }}>
          User Dashboard — Stage 2025
        </div>

        {/* progress */}
        <div style={{ width: 260, height: 2, background: 'rgba(255,255,255,0.05)', borderRadius: 2, overflow: 'hidden', animation: 'fuIn .5s ease 1.2s both', opacity: 0, animationFillMode: 'forwards' }}>
          <div style={{ height: '100%', width: `${pct}%`, background: 'linear-gradient(90deg,#00e5d4,#7c5cfc)', borderRadius: 2, transition: 'width .05s linear' }} />
        </div>
        <div style={{ color: 'var(--muted)', fontSize: '.7rem', fontFamily: 'var(--font-mono)', animation: 'fuIn .5s ease 1.3s both', opacity: 0, animationFillMode: 'forwards' }}>
          {pct}%
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   TOAST
   ============================================================ */
function ToastContainer({ toasts }) {
  return (
    <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 8000, display: 'flex', flexDirection: 'column', gap: 8, pointerEvents: 'none' }}>
      {toasts.map(t => (
        <div key={t.id} style={{
          background: 'var(--s1)', border: '1px solid var(--border)', borderRadius: 12,
          padding: '11px 16px', fontSize: '.78rem', display: 'flex', alignItems: 'center', gap: 10,
          boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
          animation: t.removing ? 'toastOut .3s ease forwards' : 'toastIn .3s ease',
          pointerEvents: 'auto',
        }}>
          <div style={{ width: 7, height: 7, borderRadius: '50%', background: t.color, flexShrink: 0 }} />
          {t.msg}
        </div>
      ))}
    </div>
  );
}

/* ============================================================
   MODAL
   ============================================================ */
function Modal({ id, show, onClose, title, children, actions }) {
  useEffect(() => {
    const handler = e => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  if (!show) return null;
  return (
    <div onClick={e => { if (e.target === e.currentTarget) onClose(); }} style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)',
      backdropFilter: 'blur(7px)', zIndex: 500,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      animation: 'fuIn .2s ease',
    }}>
      <div style={{
        background: 'var(--s1)', border: '1px solid var(--border)', borderRadius: 18,
        padding: 26, width: 400, maxWidth: '92vw', position: 'relative',
        maxHeight: '85vh', overflowY: 'auto',
      }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg,transparent,rgba(0,229,212,0.4),transparent)' }} />
        <button onClick={onClose} style={{
          position: 'absolute', top: 14, right: 14, width: 26, height: 26,
          borderRadius: 7, border: '1px solid var(--border)', background: 'transparent',
          color: 'var(--muted)', cursor: 'pointer', fontSize: '.75rem',
          display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all .2s',
        }}>✕</button>
        <div style={{ fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: '1.05rem', marginBottom: 16, color: '#fff' }}>{title}</div>
        <div style={{ color: 'var(--muted)', fontSize: '.83rem', lineHeight: 1.7 }}>{children}</div>
        {actions && <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>{actions}</div>}
      </div>
    </div>
  );
}

function MBtn({ variant = 'primary', onClick, children }) {
  const styles = {
    primary: { background: 'linear-gradient(135deg,var(--teal),var(--teal2))', color: '#000', border: 'none' },
    sec: { background: 'var(--s2)', border: '1px solid var(--border)', color: 'var(--text)' },
    dng: { background: 'rgba(255,64,96,0.08)', border: '1px solid rgba(255,64,96,0.2)', color: 'var(--danger)' },
  };
  return (
    <button onClick={onClick} style={{
      flex: 1, padding: '10px', borderRadius: 10,
      fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: '.8rem',
      cursor: 'pointer', transition: 'all .2s', ...styles[variant],
    }}>{children}</button>
  );
}

/* ============================================================
   SIDEBAR
   ============================================================ */
function Sidebar({ view, setView, userCount, notifCount }) {
  const navItems = [
    { id: 'dashboard', icon: '⊞', label: 'Dashboard' },
    { id: 'users', icon: '👥', label: 'Utilisateurs', badge: userCount, badgeColor: 'var(--teal)' },
    { id: 'analytics', icon: '📊', label: 'Analytics' },
    { id: 'notifs', icon: '🔔', label: 'Notifications', badge: notifCount || null, badgeColor: 'var(--danger)' },
    { id: 'settings', icon: '⚙️', label: 'Paramètres' },
  ];
  return (
    <aside style={{
      width: 224, flexShrink: 0,
      background: 'rgba(10,14,26,0.94)',
      borderRight: '1px solid var(--border)',
      display: 'flex', flexDirection: 'column',
      position: 'sticky', top: 0, height: '100vh',
      backdropFilter: 'blur(20px)', zIndex: 10,
    }}>
      {/* brand */}
      <div style={{ padding: '22px 20px 18px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          width: 32, height: 32, flexShrink: 0,
          background: 'linear-gradient(135deg,#00e5d4,#7c5cfc)',
          borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center',
          animation: 'hexGl 3s ease-in-out infinite alternate',
        }}>
          <svg width="17" height="17" viewBox="0 0 18 18" fill="none">
            <circle cx="7" cy="7" r="4.5" stroke="white" strokeWidth="2"/>
            <line x1="10.5" y1="10.5" x2="15" y2="15" stroke="white" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>
        <span style={{
          fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: '1.1rem', letterSpacing: '-.5px',
          background: 'linear-gradient(135deg,#00e5d4,rgba(255,255,255,.9))',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
        }}>seomaniak</span>
      </div>

      {/* nav */}
      <nav style={{ flex: 1, padding: '12px 0' }}>
        {navItems.map(item => (
          <div key={item.id} onClick={() => setView(item.id)} style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '11px 20px', cursor: 'pointer',
            fontSize: '.8rem', fontWeight: 500,
            color: view === item.id ? 'var(--teal)' : 'var(--muted)',
            borderLeft: `2px solid ${view === item.id ? 'var(--teal)' : 'transparent'}`,
            background: view === item.id ? 'linear-gradient(90deg,rgba(0,229,212,0.08),transparent)' : 'transparent',
            transition: 'all .2s', userSelect: 'none',
            position: 'relative',
          }}>
            <span style={{ fontSize: '.85rem', width: 16, textAlign: 'center', flexShrink: 0 }}>{item.icon}</span>
            {item.label}
            {item.badge !== undefined && item.badge !== null && (
              <span style={{
                marginLeft: 'auto', background: item.badgeColor,
                color: '#000', fontSize: '.58rem', fontWeight: 700,
                padding: '2px 6px', borderRadius: 20, minWidth: 18, textAlign: 'center',
              }}>{item.badge}</span>
            )}
          </div>
        ))}
      </nav>

      <div style={{ padding: '12px 20px', borderTop: '1px solid var(--border)' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          background: 'rgba(0,229,212,0.08)', border: '1px solid rgba(0,229,212,0.2)',
          borderRadius: 20, padding: '5px 10px', fontSize: '.68rem', color: 'var(--teal)',
        }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--teal)', animation: 'pulse 1.5s infinite' }} />
          Système actif
        </div>
      </div>
    </aside>
  );
}

/* ============================================================
   STAT CARD
   ============================================================ */
function StatCard({ icon, value, label, delta, barWidth, barColor, onClick }) {
  return (
    <div onClick={onClick} style={{
      background: 'var(--s1)', border: '1px solid var(--border)', borderRadius: 14,
      padding: 16, position: 'relative', overflow: 'hidden',
      transition: 'all .3s', cursor: 'pointer',
    }}
    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = 'rgba(0,229,212,0.22)'; e.currentTarget.style.boxShadow = '0 12px 36px rgba(0,229,212,0.09)'; }}
    onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = ''; }}
    >
      <div style={{ position: 'absolute', top: '-50%', right: '-30%', width: '80%', height: '80%', background: 'radial-gradient(circle,rgba(0,229,212,0.05),transparent 60%)', pointerEvents: 'none' }} />
      <div style={{ fontSize: '.9rem', width: 30, height: 30, borderRadius: 9, background: 'rgba(0,229,212,0.08)', border: '1px solid rgba(0,229,212,0.13)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>{icon}</div>
      <div style={{ fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: '1.8rem', lineHeight: 1, transition: 'all .5s' }}>{value}</div>
      <div style={{ fontSize: '.67rem', color: 'var(--muted)', marginTop: 4, textTransform: 'uppercase', letterSpacing: '.5px' }}>{label}</div>
      <div style={{ fontSize: '.66rem', marginTop: 6, color: 'var(--teal)' }}>{delta}</div>
      <div style={{ height: 2, background: 'rgba(255,255,255,0.04)', borderRadius: 2, marginTop: 10, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${barWidth}%`, borderRadius: 2, background: barColor || 'linear-gradient(90deg,var(--teal),var(--purple))', transition: 'width 1.2s cubic-bezier(.4,0,.2,1)' }} />
      </div>
    </div>
  );
}

/* ============================================================
   USER ITEM
   ============================================================ */
function UserItem({ user, onDelete, onClick, delay = 0 }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '9px 11px', borderRadius: 11,
        background: hov ? 'rgba(0,229,212,0.03)' : 'var(--s2)',
        border: `1px solid ${hov ? 'rgba(0,229,212,0.18)' : 'var(--border)'}`,
        transition: 'all .18s', cursor: 'pointer',
        transform: hov ? 'translateX(3px)' : '',
        animation: `slideR .35s ease ${delay}s both`,
      }}
    >
      <div style={{ width: 32, height: 32, borderRadius: '50%', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '.7rem', color: '#000', background: user.color }}>{ini(user.p, user.n)}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 500, fontSize: '.8rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.p} {user.n}{user.v ? ` · ${user.v}` : ''}</div>
        <div style={{ fontSize: '.69rem', color: 'var(--muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.e}</div>
      </div>
      <span style={{
        fontSize: '.62rem', fontWeight: 700, padding: '2px 8px', borderRadius: 20, flexShrink: 0,
        background: user.r === 'Admin' ? 'rgba(247,37,133,0.1)' : 'rgba(0,229,212,0.1)',
        color: user.r === 'Admin' ? 'var(--pink)' : 'var(--teal)',
        border: `1px solid ${user.r === 'Admin' ? 'rgba(247,37,133,0.2)' : 'rgba(0,229,212,0.2)'}`,
      }}>{user.r}</span>
      <button
        onClick={e => { e.stopPropagation(); onDelete(); }}
        style={{
          width: 20, height: 20, borderRadius: 5, border: '1px solid rgba(255,64,96,0.2)',
          background: 'transparent', color: 'var(--danger)', cursor: 'pointer', fontSize: '.6rem',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          opacity: hov ? 1 : 0, transition: 'all .18s', flexShrink: 0,
        }}
      >✕</button>
    </div>
  );
}

/* ============================================================
   RING CHART
   ============================================================ */
function RingChart({ total, admins, members, id = '' }) {
  const C = 2 * Math.PI * 38;
  const mbrLen = total ? (members / total) * C : 0;
  const admLen = total ? (admins / total) * C : 0;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 18, paddingTop: 4 }}>
      <svg width="100" height="100" viewBox="0 0 110 110">
        <circle cx="55" cy="55" r="38" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="13"/>
        <circle cx="55" cy="55" r="38" fill="none" stroke="#00e5d4" strokeWidth="13"
          strokeDasharray={`${mbrLen} ${C - mbrLen}`} strokeLinecap="round"
          transform="rotate(-90 55 55)" style={{ transition: 'stroke-dasharray 1.1s ease' }}/>
        <circle cx="55" cy="55" r="38" fill="none" stroke="#f72585" strokeWidth="13"
          strokeDasharray={`${admLen} ${C - admLen}`} strokeLinecap="round"
          transform="rotate(-90 55 55)" strokeDashoffset={-mbrLen}
          style={{ transition: 'stroke-dasharray 1.1s ease' }}/>
        <text x="55" y="51" textAnchor="middle" fill="white" fontFamily="Arial Black,sans-serif" fontSize="15" fontWeight="800">{total}</text>
        <text x="55" y="64" textAnchor="middle" fill="#5a6a80" fontSize="8.5" fontFamily="Arial,sans-serif">total</text>
      </svg>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 9, flex: 1 }}>
        {[['#00e5d4','Membres', members],['#f72585','Admins', admins]].map(([c, l, v]) => (
          <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: '.75rem' }}>
            <div style={{ width: 7, height: 7, borderRadius: '50%', background: c, flexShrink: 0 }} />
            <span style={{ color: 'var(--muted)', flex: 1 }}>{l}</span>
            <span style={{ fontWeight: 600 }}>{v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============================================================
   CITY BARS
   ============================================================ */
function CityBars({ users }) {
  const cities = {};
  users.forEach(u => { if (u.v) cities[u.v] = (cities[u.v] || 0) + 1; });
  const sorted = Object.entries(cities).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const max = sorted[0]?.[1] || 1;

  if (!sorted.length) return <div style={{ color: 'var(--muted)', fontSize: '.8rem', padding: '8px 0' }}>Ajoutez des utilisateurs pour voir les stats.</div>;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
      {sorted.map(([city, count], i) => (
        <div key={city}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '.72rem', marginBottom: 4 }}>
            <span>{city}</span><span style={{ color: 'var(--muted)' }}>{count}</span>
          </div>
          <div style={{ height: 5, background: 'rgba(255,255,255,0.04)', borderRadius: 3, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${count / max * 100}%`, borderRadius: 3, background: COLORS[i % COLORS.length], transition: 'width 1.1s cubic-bezier(.4,0,.2,1)' }} />
          </div>
        </div>
      ))}
    </div>
  );
}

/* ============================================================
   CARD
   ============================================================ */
function Card({ children, style = {} }) {
  return (
    <div style={{
      background: 'var(--s1)', border: '1px solid var(--border)', borderRadius: 14,
      padding: 20, position: 'relative', overflow: 'hidden', transition: 'border-color .3s',
      ...style,
    }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg,transparent,rgba(0,229,212,0.25),transparent)' }} />
      {children}
    </div>
  );
}

function CardHd({ icon, children, extra }) {
  return (
    <div style={{ fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: '.88rem', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 7, color: '#fff' }}>
      <div style={{ width: 26, height: 26, borderRadius: 7, background: 'rgba(0,229,212,0.1)', border: '1px solid rgba(0,229,212,0.16)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '.72rem', flexShrink: 0 }}>{icon}</div>
      {children}
      {extra}
    </div>
  );
}

/* ============================================================
   FORM
   ============================================================ */
function FormInput({ label, id, type = 'text', value, onChange, placeholder, error }) {
  return (
    <div style={{ marginBottom: 11 }}>
      <label style={{ display: 'block', fontSize: '.67rem', color: 'var(--muted)', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '.7px', fontWeight: 500 }}>{label}</label>
      <input
        id={id} type={type} value={value} onChange={onChange} placeholder={placeholder}
        style={{
          width: '100%', background: 'var(--s3)',
          border: `1px solid ${error ? 'rgba(255,64,96,0.55)' : 'var(--border)'}`,
          borderRadius: 9, padding: '9px 12px', color: 'var(--text)',
          fontFamily: 'var(--font-body)', fontSize: '.82rem', outline: 'none',
          transition: 'all .22s',
        }}
        onFocus={e => { e.target.style.borderColor = 'var(--teal)'; e.target.style.boxShadow = '0 0 0 3px rgba(0,229,212,0.07)'; }}
        onBlur={e => { e.target.style.borderColor = error ? 'rgba(255,64,96,0.55)' : 'var(--border)'; e.target.style.boxShadow = ''; }}
      />
    </div>
  );
}

/* ============================================================
   DASHBOARD VIEW
   ============================================================ */
function DashboardView({ users, addUser, deleteUser, notifCount, setView }) {
  const [form, setForm] = useState({ p: '', n: '', e: '', r: 'Membre', v: '' });
  const [errors, setErrors] = useState({});
  const [okMsg, setOkMsg] = useState(false);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [statModal, setStatModal] = useState(null);
  const [userModal, setUserModal] = useState(null);
  const [profileModal, setProfileModal] = useState(false);

  const total = users.length;
  const admins = users.filter(u => u.r === 'Admin').length;
  const members = total - admins;

  const filtered = users.filter(u => {
    const mf = filter === 'all' || u.r === filter;
    const ms = !search || `${u.p}${u.n}${u.e}${u.v}`.toLowerCase().includes(search.toLowerCase());
    return mf && ms;
  });

  const handleAdd = () => {
    const errs = {};
    if (!form.p.trim()) errs.p = true;
    if (!form.n.trim()) errs.n = true;
    if (!form.e.trim()) errs.e = true;
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    addUser({ p: form.p.trim(), n: form.n.trim(), e: form.e.trim(), r: form.r, v: form.v.trim(), color: COLORS[users.length % COLORS.length], id: Date.now() });
    setOkMsg(true); setTimeout(() => setOkMsg(false), 3000);
    setForm({ p: '', n: '', e: '', r: 'Membre', v: '' });
  };

  const openStatModal = (type) => {
    const data = {
      total: { title: '👥 Total Utilisateurs', body: `${total} utilisateur(s) enregistré(s) au total.`, val: total, color: 'var(--teal)' },
      admin: { title: '🛡️ Administrateurs', body: `${admins} admin(s) sur ${total} (${total ? Math.round(admins / total * 100) : 0}%)`, val: admins, color: '#f72585' },
      membre: { title: '🌐 Membres', body: `${members} membre(s) sur ${total} (${total ? Math.round(members / total * 100) : 0}%)`, val: members, color: 'var(--purple)' },
      rate: { title: "✅ Taux d'activation", body: 'Tous les utilisateurs sont actifs.', val: total ? '100%' : '0%', color: 'var(--warn)' },
    };
    setStatModal(data[type]);
  };

  return (
    <div>
      {/* topbar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22 }}>
        <div>
          <div style={{ fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: '1.4rem', letterSpacing: '-.5px', background: 'linear-gradient(135deg,#fff 60%,#00e5d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Dashboard</div>
          <div style={{ color: 'var(--muted)', fontSize: '.76rem', marginTop: 2 }}>Gérez vos utilisateurs en temps réel</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div onClick={() => setView('notifs')} style={{ width: 34, height: 34, borderRadius: 9, background: 'var(--s2)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '.85rem', position: 'relative', transition: 'all .2s' }}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(0,229,212,.3)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
          >
            🔔
            {notifCount > 0 && <div style={{ position: 'absolute', top: 6, right: 6, width: 6, height: 6, borderRadius: '50%', background: 'var(--danger)', border: '1.5px solid var(--bg)', animation: 'pulse 2s infinite' }} />}
          </div>
          <div onClick={() => setProfileModal(true)} style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg,var(--teal),var(--purple))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '.75rem', color: '#000', cursor: 'pointer', boxShadow: '0 0 0 2px var(--bg),0 0 0 3px var(--teal)', transition: 'all .2s' }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.05)'; e.currentTarget.style.boxShadow = '0 0 0 2px var(--bg),0 0 0 3px var(--teal),0 0 18px rgba(0,229,212,.4)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 0 0 2px var(--bg),0 0 0 3px var(--teal)'; }}
          >AD</div>
        </div>
      </div>

      {/* stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 18 }}>
        <StatCard icon="👥" value={total} label="Total" delta={`+${total} ce mois`} barWidth={Math.min(100, total * 10)} onClick={() => openStatModal('total')} />
        <StatCard icon="🛡️" value={admins} label="Admins" delta="Accès total" barWidth={total ? admins / total * 100 : 0} barColor="linear-gradient(90deg,#f72585,#7c5cfc)" onClick={() => openStatModal('admin')} />
        <StatCard icon="🌐" value={members} label="Membres" delta="Accès standard" barWidth={total ? members / total * 100 : 0} barColor="linear-gradient(90deg,#7c5cfc,#5c6ffc)" onClick={() => openStatModal('membre')} />
        <StatCard icon="✅" value={total ? '100%' : '0%'} label="Activation" delta="Tous actifs" barWidth={total ? 100 : 0} barColor="linear-gradient(90deg,#ffaa30,#ffdd60)" onClick={() => openStatModal('rate')} />
      </div>

      {/* form + list */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
        <Card>
          <CardHd icon="➕">Ajouter un utilisateur</CardHd>
          {okMsg && <div style={{ background: 'rgba(0,229,212,.07)', border: '1px solid rgba(0,229,212,.18)', borderRadius: 9, padding: '9px 12px', marginBottom: 11, fontSize: '.78rem', color: 'var(--teal)', display: 'flex', alignItems: 'center', gap: 7, animation: 'fuIn .3s ease' }}>✓ Utilisateur ajouté !</div>}
          {Object.keys(errors).length > 0 && <div style={{ background: 'rgba(255,64,96,.07)', border: '1px solid rgba(255,64,96,.18)', borderRadius: 9, padding: '9px 12px', marginBottom: 11, fontSize: '.78rem', color: 'var(--danger)', display: 'flex', alignItems: 'center', gap: 7 }}>⚠ Remplissez les champs requis.</div>}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <FormInput label="Prénom *" value={form.p} onChange={e => setForm(f => ({ ...f, p: e.target.value }))} placeholder="Mohamed" error={errors.p} />
            <FormInput label="Nom *" value={form.n} onChange={e => setForm(f => ({ ...f, n: e.target.value }))} placeholder="Alami" error={errors.n} />
          </div>
          <FormInput label="Email *" type="email" value={form.e} onChange={e => setForm(f => ({ ...f, e: e.target.value }))} placeholder="m.alami@email.com" error={errors.e} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div style={{ marginBottom: 11 }}>
              <label style={{ display: 'block', fontSize: '.67rem', color: 'var(--muted)', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '.7px', fontWeight: 500 }}>Rôle</label>
              <select value={form.r} onChange={e => setForm(f => ({ ...f, r: e.target.value }))} style={{ width: '100%', background: 'var(--s3)', border: '1px solid var(--border)', borderRadius: 9, padding: '9px 12px', color: 'var(--text)', fontFamily: 'var(--font-body)', fontSize: '.82rem', outline: 'none' }}>
                <option>Membre</option><option>Admin</option>
              </select>
            </div>
            <FormInput label="Ville" value={form.v} onChange={e => setForm(f => ({ ...f, v: e.target.value }))} placeholder="Casablanca" />
          </div>
          <button onClick={handleAdd} style={{ width: '100%', padding: 11, border: 'none', borderRadius: 9, background: 'linear-gradient(135deg,var(--teal),var(--teal2))', color: '#000', fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: '.84rem', cursor: 'pointer', marginTop: 5, transition: 'all .22s' }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 7px 20px rgba(0,229,212,.3)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}
          >Ajouter l'utilisateur →</button>
          <button onClick={() => setForm({ p: '', n: '', e: '', r: 'Membre', v: '' })} style={{ width: '100%', padding: 9, border: '1px solid var(--border)', borderRadius: 9, background: 'transparent', color: 'var(--muted)', fontFamily: 'var(--font-head)', fontWeight: 600, fontSize: '.8rem', cursor: 'pointer', marginTop: 5, transition: 'all .22s' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,64,96,.35)'; e.currentTarget.style.color = 'var(--danger)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--muted)'; }}
          >↺ Réinitialiser</button>
        </Card>

        <Card>
          <CardHd icon="👤" extra={
            <button onClick={() => {
              if (!users.length) return;
              const rows = users.map(u => `${u.p},${u.n},${u.e},${u.r},${u.v||''}`).join('\n');
              const blob = new Blob(['Prénom,Nom,Email,Rôle,Ville\n' + rows], { type: 'text/csv' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a'); a.href = url; a.download = 'utilisateurs_seomaniak.csv'; a.click();
              URL.revokeObjectURL(url);
            }} style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 5, padding: '5px 11px', borderRadius: 7, border: '1px solid rgba(0,229,212,.22)', background: 'rgba(0,229,212,.05)', color: 'var(--teal)', fontSize: '.7rem', fontFamily: 'var(--font-head)', fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all .18s' }}>⬇ CSV</button>
          }>Utilisateurs</CardHd>

          {/* search */}
          <div style={{ position: 'relative', marginBottom: 10 }}>
            <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)', fontSize: '.75rem', pointerEvents: 'none' }}>🔍</span>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher..." style={{ width: '100%', background: 'var(--s3)', border: '1px solid var(--border)', borderRadius: 9, padding: '8px 12px 8px 30px', color: 'var(--text)', fontFamily: 'var(--font-body)', fontSize: '.8rem', outline: 'none', transition: 'all .22s' }} onFocus={e => e.target.style.borderColor = 'var(--teal)'} onBlur={e => e.target.style.borderColor = 'var(--border)'} />
          </div>

          {/* filters */}
          <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
            {['all','Membre','Admin'].map(f => (
              <button key={f} onClick={() => setFilter(f)} style={{ flex: 1, padding: '6px 8px', borderRadius: 7, border: `1px solid ${filter === f ? 'rgba(0,229,212,.38)' : 'var(--border)'}`, background: filter === f ? 'rgba(0,229,212,.06)' : 'transparent', color: filter === f ? 'var(--teal)' : 'var(--muted)', fontSize: '.7rem', fontFamily: 'var(--font-body)', cursor: 'pointer', transition: 'all .18s', textAlign: 'center' }}>
                {f === 'all' ? 'Tous' : f}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 7, maxHeight: 260, overflowY: 'auto' }}>
            {filtered.length === 0
              ? <div style={{ textAlign: 'center', padding: '28px 0', color: 'var(--muted)', fontSize: '.8rem' }}><div style={{ fontSize: '1.6rem', opacity: .3, marginBottom: 6 }}>👥</div>{users.length ? 'Aucun résultat.' : 'Ajoutez un utilisateur.'}</div>
              : filtered.map((u, i) => <UserItem key={u.id} user={u} delay={i * 0.035} onClick={() => setUserModal(u)} onDelete={() => deleteUser(u.id)} />)
            }
          </div>
        </Card>
      </div>

      {/* charts */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <Card><CardHd icon="🍩">Répartition rôles</CardHd><RingChart total={total} admins={admins} members={members} /></Card>
        <Card><CardHd icon="📍">Top villes</CardHd><CityBars users={users} /></Card>
      </div>

      {/* STAT MODAL */}
      <Modal show={!!statModal} onClose={() => setStatModal(null)} title={statModal?.title || ''} actions={<MBtn variant="primary" onClick={() => setStatModal(null)}>OK</MBtn>}>
        {statModal && <div><div style={{ fontSize: '2rem', fontWeight: 800, fontFamily: 'var(--font-head)', color: statModal.color, marginBottom: 8 }}>{statModal.val}</div>{statModal.body}</div>}
      </Modal>

      {/* USER MODAL */}
      <Modal show={!!userModal} onClose={() => setUserModal(null)} title={
        userModal ? <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: '50%', background: userModal.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#000', fontSize: '.82rem' }}>{ini(userModal.p, userModal.n)}</div>
          {userModal.p} {userModal.n}
        </div> : ''
      } actions={<><MBtn variant="dng" onClick={() => { deleteUser(userModal.id); setUserModal(null); }}>🗑 Supprimer</MBtn><MBtn variant="sec" onClick={() => setUserModal(null)}>Fermer</MBtn></>}>
        {userModal && <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 4 }}>
          <div>📧 <strong style={{ color: 'var(--text)' }}>{userModal.e}</strong></div>
          {userModal.v && <div>📍 <strong style={{ color: 'var(--text)' }}>{userModal.v}</strong></div>}
          <div>🎭 Rôle : <span style={{ background: userModal.r === 'Admin' ? 'rgba(247,37,133,0.1)' : 'rgba(0,229,212,0.1)', color: userModal.r === 'Admin' ? 'var(--pink)' : 'var(--teal)', border: `1px solid ${userModal.r === 'Admin' ? 'rgba(247,37,133,0.2)' : 'rgba(0,229,212,0.2)'}`, borderRadius: 6, padding: '2px 8px', fontSize: '.72rem', fontWeight: 600 }}>{userModal.r}</span></div>
        </div>}
      </Modal>

      {/* PROFILE MODAL */}
      <Modal show={profileModal} onClose={() => setProfileModal(false)} title="👤 Profil Admin" actions={<MBtn variant="primary" onClick={() => setProfileModal(false)}>Fermer</MBtn>}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
          <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'linear-gradient(135deg,#00e5d4,#7c5cfc)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.1rem', color: '#000', boxShadow: '0 0 0 3px rgba(0,229,212,0.3)' }}>AD</div>
          <div><div style={{ fontWeight: 600, color: '#fff' }}>Administrateur Principal</div><div style={{ fontSize: '.75rem', color: 'var(--muted)', marginTop: 2 }}>admin@seomaniak.ma</div></div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 14 }}>
          {[['var(--teal)', total, 'Utilisateurs'],['var(--purple)', 1, 'Session active']].map(([c, v, l]) => (
            <div key={l} style={{ background: 'var(--s2)', border: '1px solid var(--border)', borderRadius: 10, padding: 12, textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: '1.4rem', color: c }}>{v}</div>
              <div style={{ fontSize: '.68rem', color: 'var(--muted)', marginTop: 2, textTransform: 'uppercase', letterSpacing: '.5px' }}>{l}</div>
            </div>
          ))}
        </div>
      </Modal>
    </div>
  );
}

/* ============================================================
   USERS VIEW
   ============================================================ */
function UsersView({ users, deleteUser }) {
  const [search, setSearch] = useState('');
  const [userModal, setUserModal] = useState(null);
  const filtered = users.filter(u => !search || `${u.p}${u.n}${u.e}${u.v}`.toLowerCase().includes(search.toLowerCase()));
  return (
    <div>
      <div style={{ marginBottom: 22 }}>
        <div style={{ fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: '1.4rem', letterSpacing: '-.5px', background: 'linear-gradient(135deg,#fff 60%,#00e5d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Utilisateurs</div>
        <div style={{ color: 'var(--muted)', fontSize: '.76rem', marginTop: 2 }}>Liste complète — {users.length} enregistré(s)</div>
      </div>
      <Card>
        <CardHd icon="👥">Tous les utilisateurs ({users.length})</CardHd>
        <div style={{ position: 'relative', marginBottom: 12 }}>
          <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)', fontSize: '.75rem', pointerEvents: 'none' }}>🔍</span>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher..." style={{ width: '100%', background: 'var(--s3)', border: '1px solid var(--border)', borderRadius: 9, padding: '8px 12px 8px 30px', color: 'var(--text)', fontFamily: 'var(--font-body)', fontSize: '.8rem', outline: 'none', transition: 'all .22s' }} onFocus={e => e.target.style.borderColor = 'var(--teal)'} onBlur={e => e.target.style.borderColor = 'var(--border)'} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 7, maxHeight: 500, overflowY: 'auto' }}>
          {filtered.length === 0
            ? <div style={{ textAlign: 'center', padding: '32px 0', color: 'var(--muted)', fontSize: '.8rem' }}><div style={{ fontSize: '1.6rem', opacity: .3, marginBottom: 6 }}>👥</div>Aucun utilisateur.</div>
            : filtered.map((u, i) => <UserItem key={u.id} user={u} delay={i * 0.03} onClick={() => setUserModal(u)} onDelete={() => deleteUser(u.id)} />)
          }
        </div>
      </Card>
      <Modal show={!!userModal} onClose={() => setUserModal(null)} title={userModal ? `${userModal.p} ${userModal.n}` : ''} actions={<><MBtn variant="dng" onClick={() => { deleteUser(userModal.id); setUserModal(null); }}>🗑 Supprimer</MBtn><MBtn variant="sec" onClick={() => setUserModal(null)}>Fermer</MBtn></>}>
        {userModal && <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div>📧 <strong style={{ color: 'var(--text)' }}>{userModal.e}</strong></div>
          {userModal.v && <div>📍 <strong style={{ color: 'var(--text)' }}>{userModal.v}</strong></div>}
          <div>🎭 Rôle : <strong style={{ color: 'var(--teal)' }}>{userModal.r}</strong></div>
        </div>}
      </Modal>
    </div>
  );
}

/* ============================================================
   ANALYTICS VIEW
   ============================================================ */
function AnalyticsView({ users }) {
  const total = users.length, admins = users.filter(u => u.r === 'Admin').length, members = total - admins;
  const cities = {};
  users.forEach(u => { if (u.v) cities[u.v] = (cities[u.v] || 0) + 1; });
  const topCity = Object.entries(cities).sort((a, b) => b[1] - a[1])[0];
  return (
    <div>
      <div style={{ marginBottom: 22 }}>
        <div style={{ fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: '1.4rem', letterSpacing: '-.5px', background: 'linear-gradient(135deg,#fff 60%,#00e5d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Analytics</div>
        <div style={{ color: 'var(--muted)', fontSize: '.76rem', marginTop: 2 }}>Statistiques et répartitions</div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginBottom: 16 }}>
        {[['var(--teal)', total, 'Total'],['var(--pink)', admins, 'Admins'],['var(--purple)', members, 'Membres']].map(([c,v,l]) => (
          <div key={l} style={{ background: 'var(--s1)', border: '1px solid var(--border)', borderRadius: 12, padding: 16, textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: '1.6rem', marginBottom: 4, color: c }}>{v}</div>
            <div style={{ fontSize: '.68rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.5px' }}>{l}</div>
          </div>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
        <Card><CardHd icon="🍩">Répartition rôles</CardHd><RingChart total={total} admins={admins} members={members} /></Card>
        <Card><CardHd icon="📍">Top villes</CardHd><CityBars users={users} /></Card>
      </div>
      <Card>
        <CardHd icon="📈">Insights</CardHd>
        {total ? (
          <div style={{ color: 'var(--text)', fontSize: '.82rem', lineHeight: 2 }}>
            <div>📍 Ville principale : <strong style={{ color: 'var(--teal)' }}>{topCity ? `${topCity[0]} (${topCity[1]})` : '—'}</strong></div>
            <div>📊 Ratio Admin/Membre : <strong style={{ color: 'var(--teal)' }}>{Math.round(admins/total*100)}% / {Math.round(members/total*100)}%</strong></div>
            <div>✅ Taux d'activation : <strong style={{ color: 'var(--teal)' }}>100%</strong></div>
            <div>🕐 Dernier ajout : <strong style={{ color: 'var(--teal)' }}>{users[0] ? `${users[0].p} ${users[0].n}` : '—'}</strong></div>
          </div>
        ) : <div style={{ color: 'var(--muted)', fontSize: '.82rem' }}>Ajoutez des utilisateurs pour voir les insights.</div>}
      </Card>
    </div>
  );
}

/* ============================================================
   NOTIFS VIEW
   ============================================================ */
function NotifsView({ notifs, clearNotifs }) {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22 }}>
        <div>
          <div style={{ fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: '1.4rem', letterSpacing: '-.5px', background: 'linear-gradient(135deg,#fff 60%,#00e5d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Notifications</div>
          <div style={{ color: 'var(--muted)', fontSize: '.76rem', marginTop: 2 }}>Historique des activités</div>
        </div>
        <button onClick={clearNotifs} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '6px 14px', borderRadius: 7, border: '1px solid rgba(255,64,96,.22)', background: 'rgba(255,64,96,.05)', color: 'var(--danger)', fontSize: '.72rem', fontFamily: 'var(--font-head)', fontWeight: 700, cursor: 'pointer', transition: 'all .18s' }}>🗑 Effacer tout</button>
      </div>
      <Card>
        <CardHd icon="🔔">Activités récentes</CardHd>
        {notifs.length ? notifs.map((n, i) => (
          <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', padding: 12, borderRadius: 10, background: 'var(--s2)', border: '1px solid var(--border)', marginBottom: 8, animation: 'fuIn .3s ease' }}>
            <div style={{ width: 7, height: 7, borderRadius: '50%', background: n.color, flexShrink: 0, marginTop: 5 }} />
            <div>
              <div style={{ fontSize: '.8rem', color: 'var(--text)', lineHeight: 1.5 }}>{n.msg}</div>
              <div style={{ fontSize: '.68rem', color: 'var(--muted)', marginTop: 2 }}>{n.time}</div>
            </div>
          </div>
        )) : <div style={{ textAlign: 'center', padding: '28px 0', color: 'var(--muted)', fontSize: '.8rem' }}><div style={{ fontSize: '1.6rem', opacity: .3, marginBottom: 6 }}>🔔</div>Aucune notification.</div>}
      </Card>
    </div>
  );
}

/* ============================================================
   SETTINGS VIEW
   ============================================================ */
function SettingsView({ users, deleteAllUsers, clearNotifs, addNotif }) {
  const [delModal, setDelModal] = useState(false);
  const colors = ['#00e5d4','#7c5cfc','#f72585','#ffaa30','#39d353','#00b4d8'];
  const [activeColor, setActiveColor] = useState('#00e5d4');
  const [cursorOn, setCursorOn] = useState(true);
  const [gridOn, setGridOn] = useState(true);

  const setAccent = (c) => {
    document.documentElement.style.setProperty('--teal', c);
    setActiveColor(c);
    addNotif('Couleur du thème modifiée', '#7c5cfc');
  };

  const Row = ({ label, sub, right }) => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,.04)' }}>
      <div><div style={{ fontSize: '.82rem', fontWeight: 500 }}>{label}</div><div style={{ fontSize: '.72rem', color: 'var(--muted)', marginTop: 2 }}>{sub}</div></div>
      {right}
    </div>
  );

  const Toggle = ({ on, onToggle }) => (
    <button onClick={onToggle} style={{ width: 36, height: 20, borderRadius: 10, background: on ? 'var(--teal)' : 'rgba(255,255,255,.1)', cursor: 'pointer', position: 'relative', transition: 'all .25s', flexShrink: 0, border: 'none' }}>
      <div style={{ position: 'absolute', width: 14, height: 14, borderRadius: '50%', background: '#fff', top: 3, left: on ? 19 : 3, transition: 'left .25s' }} />
    </button>
  );

  const SmBtn = ({ color = 'teal', onClick, children }) => {
    const cols = { teal: { border: 'rgba(0,229,212,.22)', color: 'var(--teal)', bg: 'rgba(0,229,212,.05)' }, danger: { border: 'rgba(255,64,96,.22)', color: 'var(--danger)', bg: 'rgba(255,64,96,.05)' }, warn: { border: 'rgba(255,170,48,.22)', color: 'var(--warn)', bg: 'rgba(255,170,48,.05)' } };
    const s = cols[color];
    return <button onClick={onClick} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '6px 12px', borderRadius: 7, border: `1px solid ${s.border}`, background: s.bg, color: s.color, fontSize: '.72rem', fontFamily: 'var(--font-head)', fontWeight: 700, cursor: 'pointer', transition: 'all .18s', whiteSpace: 'nowrap' }}>{children}</button>;
  };

  return (
    <div>
      <div style={{ marginBottom: 22 }}>
        <div style={{ fontFamily: 'var(--font-head)', fontWeight: 800, fontSize: '1.4rem', letterSpacing: '-.5px', background: 'linear-gradient(135deg,#fff 60%,#00e5d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Paramètres</div>
        <div style={{ color: 'var(--muted)', fontSize: '.76rem', marginTop: 2 }}>Personnalisation et configuration</div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
        <Card>
          <CardHd icon="🎨">Apparence</CardHd>
          <Row label="Couleur principale" sub="Thème du dashboard" right={
            <div style={{ display: 'flex', gap: 8 }}>
              {colors.map(c => (
                <div key={c} onClick={() => setAccent(c)} style={{ width: 24, height: 24, borderRadius: '50%', background: c, cursor: 'pointer', border: `2px solid ${activeColor === c ? 'rgba(255,255,255,.7)' : 'rgba(255,255,255,.2)'}`, transform: activeColor === c ? 'scale(1.1)' : '', transition: 'all .18s' }} />
              ))}
            </div>
          }/>
          <Row label="Cursor glow" sub="Effet lumineux sur la souris" right={
            <Toggle on={cursorOn} onToggle={() => { const next = !cursorOn; setCursorOn(next); const el = document.getElementById('cursor-glow-el'); if (el) el.style.opacity = next ? '1' : '0'; }} />
          }/>
          <Row label="Grille de fond" sub="Lignes décoratives" right={
            <Toggle on={gridOn} onToggle={() => { const next = !gridOn; setGridOn(next); document.body.style.backgroundImage = next ? '' : 'none'; }} />
          }/>
        </Card>
        <Card>
          <CardHd icon="🗄️">Données</CardHd>
          <Row label="Exporter CSV" sub="Télécharger la liste des utilisateurs" right={
            <SmBtn color="teal" onClick={() => {
              if (!users.length) return;
              const rows = users.map(u => `${u.p},${u.n},${u.e},${u.r},${u.v||''}`).join('\n');
              const blob = new Blob(['Prénom,Nom,Email,Rôle,Ville\n' + rows], { type: 'text/csv' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a'); a.href = url; a.download = 'utilisateurs_seomaniak.csv'; a.click();
              URL.revokeObjectURL(url);
              addNotif('Export CSV téléchargé', '#7c5cfc');
            }}>⬇ CSV</SmBtn>
          }/>
          <Row label="Vider les utilisateurs" sub="Supprimer tous les utilisateurs" right={<SmBtn color="danger" onClick={() => setDelModal(true)}>🗑 Vider</SmBtn>}/>
          <Row label="Effacer notifications" sub="Vider l'historique" right={<SmBtn color="warn" onClick={clearNotifs}>🔔 Effacer</SmBtn>}/>
        </Card>
      </div>
      <Card>
        <CardHd icon="ℹ️">À propos</CardHd>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
          {[['var(--teal)','Version 1.0.0'],['var(--purple)','React 18'],['var(--pink)','Stage 2025'],['var(--warn)','Seomaniak']].map(([c,l]) => (
            <span key={l} style={{ background: 'rgba(0,229,212,0.07)', border: '1px solid rgba(0,229,212,0.15)', color: c, borderRadius: 6, padding: '2px 9px', fontSize: '.72rem', fontWeight: 600 }}>{l}</span>
          ))}
        </div>
        <div style={{ color: 'var(--muted)', fontSize: '.8rem', lineHeight: 1.8 }}>
          Dashboard utilisateur React — données persistées via localStorage. Toutes fonctionnalités opérationnelles : ajout, suppression, filtres, export CSV, analytics, notifications, thèmes.
        </div>
      </Card>

      <Modal show={delModal} onClose={() => setDelModal(false)} title="⚠️ Confirmer la suppression" actions={<><MBtn variant="dng" onClick={() => { deleteAllUsers(); setDelModal(false); addNotif(`Tous les utilisateurs supprimés`, '#ff4060'); }}>🗑 Supprimer tout</MBtn><MBtn variant="sec" onClick={() => setDelModal(false)}>Annuler</MBtn></>}>
        Supprimer <strong style={{ color: 'var(--danger)' }}>{users.length}</strong> utilisateur(s) ? Action irréversible.
      </Modal>
    </div>
  );
}

/* ============================================================
   CURSOR GLOW
   ============================================================ */
function CursorGlow() {
  const ref = useRef(null);
  useEffect(() => {
    const handler = e => {
      if (ref.current) {
        ref.current.style.left = e.clientX + 'px';
        ref.current.style.top = e.clientY + 'px';
      }
    };
    document.addEventListener('mousemove', handler);
    return () => document.removeEventListener('mousemove', handler);
  }, []);
  return <div id="cursor-glow-el" ref={ref} style={{ position: 'fixed', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle,rgba(0,229,212,0.06) 0%,transparent 70%)', pointerEvents: 'none', zIndex: 1, transform: 'translate(-50%,-50%)', transition: 'left .1s,top .1s' }} />;
}

/* ============================================================
   ORB BACKGROUNDS
   ============================================================ */
function Orbs() {
  return <>
    {[
      { w: 500, h: 500, bg: 'rgba(0,229,212,0.06)', top: -120, left: -120, delay: 0 },
      { w: 420, h: 420, bg: 'rgba(124,92,252,0.07)', bottom: -100, right: -100, delay: -5 },
    ].map((o, i) => (
      <div key={i} style={{
        position: 'fixed', borderRadius: '50%', filter: 'blur(90px)',
        pointerEvents: 'none', zIndex: 0,
        width: o.w, height: o.h, background: o.bg,
        top: o.top, left: o.left, bottom: o.bottom, right: o.right,
        animation: `orbF 9s ease-in-out ${o.delay}s infinite alternate`,
      }} />
    ))}
  </>;
}

/* ============================================================
   MAIN APP
   ============================================================ */
export default function App() {
  const [splashDone, setSplashDone] = useState(false);
  const [view, setView] = useState('dashboard');
  const [users, setUsers] = useLocalStorage('seo_users', []);
  const [notifs, setNotifs] = useLocalStorage('seo_notifs', []);
  const [toasts, setToasts] = useState([]);

  // inject global CSS
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = GLOBAL_CSS;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  const addToast = useCallback((msg, color = '#00e5d4') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, msg, color }]);
    setTimeout(() => {
      setToasts(prev => prev.map(t => t.id === id ? { ...t, removing: true } : t));
      setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 350);
    }, 2800);
  }, []);

  const addNotif = useCallback((msg, color = '#00e5d4') => {
    const n = { msg, color, time: ts() };
    setNotifs(prev => [n, ...prev]);
    addToast(msg, color);
  }, [setNotifs, addToast]);

  const addUser = useCallback(user => {
    setUsers(prev => [user, ...prev]);
    addNotif(`${user.p} ${user.n} ajouté(e) comme ${user.r}`, user.r === 'Admin' ? '#f72585' : '#00e5d4');
  }, [setUsers, addNotif]);

  const deleteUser = useCallback(id => {
    setUsers(prev => {
      const u = prev.find(x => x.id === id);
      if (u) addNotif(`${u.p} ${u.n} supprimé(e)`, '#ff4060');
      return prev.filter(x => x.id !== id);
    });
  }, [setUsers, addNotif]);

  const deleteAllUsers = useCallback(() => {
    setUsers([]);
  }, [setUsers]);

  const clearNotifs = useCallback(() => {
    setNotifs([]);
    addToast('Notifications effacées', '#ffaa30');
  }, [setNotifs, addToast]);

  const viewProps = { users, addUser, deleteUser, deleteAllUsers, notifCount: notifs.length, setView, notifs, clearNotifs, addNotif };

  return (
    <div style={{ position: 'relative', zIndex: 0 }}>
      <style>{GLOBAL_CSS}</style>
      <Orbs />
      <CursorGlow />
      <ToastContainer toasts={toasts} />
      <Splash onDone={() => setSplashDone(true)} />

      <div style={{ display: 'flex', minHeight: '100vh', position: 'relative', zIndex: 3, opacity: splashDone ? 1 : 0, transition: 'opacity .7s' }}>
        <Sidebar view={view} setView={setView} userCount={users.length} notifCount={notifs.length} />
        <main style={{ flex: 1, padding: 24, overflowY: 'auto', minWidth: 0 }}>
          {view === 'dashboard' && <DashboardView {...viewProps} />}
          {view === 'users' && <UsersView {...viewProps} />}
          {view === 'analytics' && <AnalyticsView {...viewProps} />}
          {view === 'notifs' && <NotifsView {...viewProps} />}
          {view === 'settings' && <SettingsView {...viewProps} />}
        </main>
      </div>
    </div>
  );
}
