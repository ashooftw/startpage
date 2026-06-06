/* ═══════════════════════════════════════════════════════
   ASHOO STARTPAGE — app.js
   ═══════════════════════════════════════════════════════ */

'use strict';

/* ─── CLOCK ─── */
const Clock = (() => {
  const el = document.getElementById('clock');
  const render = () => {
    el.textContent = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  return {
    init() {
      render();
      setInterval(render, 10_000);
    }
  };
})();


/* ─── SEARCH ─── */
const Search = (() => {
  const ENGINES = {
    google:  q => `https://www.google.com/search?q=${q}`,
    ddg:     q => `https://duckduckgo.com/?q=${q}`,
    youtube: q => `https://www.youtube.com/results?search_query=${q}`,
    github:  q => `https://github.com/search?q=${q}`,
  };

  return {
    init() {
      const input  = document.getElementById('search-input');
      const engine = document.getElementById('search-engine');
      if (!input || !engine) return;

      input.addEventListener('keypress', e => {
        if (e.key !== 'Enter' || !input.value.trim()) return;
        const q   = encodeURIComponent(input.value.trim());
        const url = (ENGINES[engine.value] || ENGINES.google)(q);
        window.open(url, '_blank', 'noopener');
        input.value = '';
      });
    },

    focus() {
      document.getElementById('search-input')?.focus();
    }
  };
})();


/* ─── PARTICLE CANVAS ─── */
const Particles = (() => {
  const COLORS = ['103,232,249', '167,139,250', '52,211,153'];

  return {
    init() {
      const canvas = document.getElementById('particles');
      if (!canvas) return;
      const ctx = canvas.getContext('2d');

      const resize = () => {
        canvas.width  = window.innerWidth;
        canvas.height = window.innerHeight;
      };
      window.addEventListener('resize', resize, { passive: true });
      resize();

      const count = Math.min(50, Math.floor(window.innerWidth / 28));
      const particles = Array.from({ length: count }, () => ({
        x:     Math.random() * canvas.width,
        y:     Math.random() * canvas.height,
        r:     Math.random() * 1.8 + 0.5,
        vx:    (Math.random() - 0.5) * 0.25,
        vy:    (Math.random() - 0.5) * 0.25,
        alpha: Math.random() * 0.35 + 0.1,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
      }));

      const tick = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (const p of particles) {
          p.x += p.vx;
          p.y += p.vy;
          if (p.x < 0 || p.x > canvas.width)  p.vx *= -1;
          if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
          ctx.fillStyle = `rgba(${p.color},${p.alpha})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fill();
        }
        requestAnimationFrame(tick);
      };
      tick();
    }
  };
})();


/* ─── TODOS ─── */
const Todos = (() => {
  const STORAGE_KEY = 'todos_v2';
  let items = [];

  const load = () => {
    try { items = JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }
    catch { items = []; }
  };

  const persist = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  };

  const render = () => {
    const list = document.getElementById('todo-list');
    if (!list) return;
    list.innerHTML = '';

    if (!items.length) {
      const empty = document.createElement('div');
      empty.className = 'todo-empty';
      empty.textContent = 'No tasks yet — press N to add one';
      list.appendChild(empty);
      return;
    }

    items.forEach((item, idx) => {
      const row = document.createElement('div');
      row.className = 'todo-item card-enter';

      const chk = document.createElement('input');
      chk.type      = 'checkbox';
      chk.className = 'todo-check';
      chk.checked   = item.done;
      chk.addEventListener('change', () => {
        items[idx].done = !items[idx].done;
        persist();
        render();
      });

      const txt = document.createElement('span');
      txt.className = `todo-text${item.done ? ' done' : ''}`;
      txt.textContent = item.text;

      const del = document.createElement('button');
      del.className   = 'todo-del';
      del.textContent = '×';
      del.setAttribute('aria-label', 'Delete task');
      del.addEventListener('click', () => {
        items.splice(idx, 1);
        persist();
        render();
      });

      row.append(chk, txt, del);
      list.appendChild(row);
    });
  };

  return {
    init() {
      load();
      render();
    },
    add() {
      const text = prompt('New task:');
      if (text?.trim()) {
        items.push({ text: text.trim(), done: false });
        persist();
        render();
      }
    }
  };
})();


/* ─── NOTES ─── */
const Notes = (() => {
  const KEY = 'quickNote';
  return {
    init() {
      const ta = document.getElementById('quick-note');
      if (!ta) return;
      const saved = localStorage.getItem(KEY);
      if (saved) ta.value = saved;

      // auto-save on input (debounced)
      let timer;
      ta.addEventListener('input', () => {
        clearTimeout(timer);
        timer = setTimeout(() => {
          localStorage.setItem(KEY, ta.value);
        }, 800);
      });
    },
    save() {
      const ta = document.getElementById('quick-note');
      if (!ta?.value.trim()) return;
      localStorage.setItem(KEY, ta.value);

      // visual feedback
      const btn = document.querySelector('.btn-save-note');
      if (btn) {
        const orig = btn.textContent;
        btn.textContent = 'Saved ✓';
        btn.style.background = 'rgba(52,211,153,0.18)';
        btn.style.borderColor = 'rgba(52,211,153,0.3)';
        btn.style.color = '#34d399';
        setTimeout(() => {
          btn.textContent = orig;
          btn.style.background = '';
          btn.style.borderColor = '';
          btn.style.color = '';
        }, 1800);
      }
    }
  };
})();


/* ─── MINI CALENDAR ─── */
const Calendar = (() => {
  const DAY_NAMES = ['S','M','T','W','T','F','S'];

  return {
    init() {
      const wrap = document.getElementById('mini-calendar');
      if (!wrap) return;

      const now   = new Date();
      const yr    = now.getFullYear();
      const mo    = now.getMonth();
      const today = now.getDate();
      const label = now.toLocaleString('default', { month: 'long' });
      const first = new Date(yr, mo, 1).getDay();
      const total = new Date(yr, mo + 1, 0).getDate();

      const hdr = document.createElement('div');
      hdr.className   = 'cal-header';
      hdr.textContent = `${label} ${yr}`;

      const grid = document.createElement('div');
      grid.className = 'cal-grid';

      // Day-name headers
      DAY_NAMES.forEach(n => {
        const d = document.createElement('div');
        d.className   = 'cal-day-name';
        d.textContent = n;
        grid.appendChild(d);
      });

      // Blank cells before 1st
      for (let i = 0; i < first; i++) {
        grid.appendChild(document.createElement('div'));
      }

      // Day cells
      for (let n = 1; n <= total; n++) {
        const d = document.createElement('div');
        d.className   = `cal-day${n === today ? ' today' : ''}`;
        d.textContent = n;
        grid.appendChild(d);
      }

      wrap.append(hdr, grid);
    }
  };
})();


/* ─── DAILY QUOTE ─── */
const Quote = (() => {
  const QUOTES = [
    'The best way to predict the future is to create it.',
    'Stay curious. The best builders never stop learning.',
    'Code is like humor. When you have to explain it, it\'s bad.',
    'First, solve the problem. Then, write the code.',
    'Every expert was once a beginner. Ship daily.',
    'Your portfolio speaks louder than any degree.',
    'Consistency beats intensity. Show up every day.',
  ];
  return {
    init() {
      const el = document.getElementById('daily-quote');
      if (!el) return;
      el.textContent = `"${QUOTES[new Date().getDate() % QUOTES.length]}"`;
    }
  };
})();


/* ─── SHORTCUTS MODAL ─── */
const Modal = (() => {
  const overlay = () => document.getElementById('shortcuts-modal');

  return {
    show() {
      const m = overlay();
      if (!m) return;
      m.classList.add('open');
      // Re-trigger modal-in animation
      const box = m.querySelector('.modal-box');
      if (box) {
        box.style.animation = 'none';
        requestAnimationFrame(() => { box.style.animation = ''; });
      }
    },
    hide() {
      overlay()?.classList.remove('open');
    },
    init() {
      const m = overlay();
      if (!m) return;
      m.addEventListener('click', e => {
        if (e.target === m) this.hide();
      });
    }
  };
})();


/* ─── KEYBOARD SHORTCUTS ─── */
const Keyboard = (() => ({
  init() {
    document.addEventListener('keydown', e => {
      const tag = document.activeElement.tagName;
      const typing = tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT';

      if (e.key === 'Escape') { Modal.hide(); return; }
      if (typing) return;

      switch (e.key) {
        case '/': e.preventDefault(); Search.focus();  break;
        case 'n': e.preventDefault(); Todos.add();     break;
        case '?': Modal.show();                         break;
      }
    });
  }
}))();


/* ─── RIPPLE EFFECT ─── */
const Ripple = (() => ({
  attach(selector) {
    document.querySelectorAll(selector).forEach(el => {
      el.classList.add('ripple-host');
      el.addEventListener('click', e => {
        const r    = document.createElement('span');
        const rect = el.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        r.className = 'ripple-effect';
        r.style.cssText = `
          width:${size}px;
          height:${size}px;
          left:${e.clientX - rect.left - size/2}px;
          top:${e.clientY - rect.top - size/2}px;
        `;
        el.appendChild(r);
        r.addEventListener('animationend', () => r.remove());
      });
    });
  }
}))();


/* ─── INTERSECTION OBSERVER (lazy fade-up) ─── */
const Reveal = (() => ({
  init() {
    // Cards and sections that appear in the second fold benefit
    // from IntersectionObserver for a genuine on-scroll feel
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.animationPlayState = 'running';
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    document.querySelectorAll('.fade-up').forEach(el => {
      el.style.animationPlayState = 'paused';
      observer.observe(el);
    });
  }
}))();


/* ─── BOOT ─── */
document.addEventListener('DOMContentLoaded', () => {
  Clock.init();
  Search.init();
  Particles.init();
  Todos.init();
  Notes.init();
  Calendar.init();
  Quote.init();
  Modal.init();
  Keyboard.init();
  Ripple.attach('.qa-card');
  Reveal.init();
});

/* ─── GLOBAL CALLBACKS (used by inline onclick attributes) ─── */
window.addTodo          = () => Todos.add();
window.saveNote         = () => Notes.save();
window.showShortcutsModal = () => Modal.show();
window.hideShortcutsModal = () => Modal.hide();