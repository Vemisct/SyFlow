// src/Pages/AcademyRP.jsx
import React from 'react';
import { motion } from 'framer-motion';

// ---------- ЛОКАЛЬНІ КОЛЬОРИ ----------
const COLORS = {
  blue: '#3b82f6',
  purple: '#a855f7',
  green: '#10b981',
  pink: '#ec4899',
  yellow: '#f59e0b',
  bg: '#050505',
  surface: '#09090b',
  border: 'rgba(255, 255, 255, 0.05)',
  textMain: '#e4e4e7',
  textMuted: '#a1a1aa'
};

// ---------- ВБУДОВАНИЙ SIDEBAR ----------
const Sidebar = ({ activeItem = 'academy' }) => {
  const navItems = [
    { name: 'Дашборд', icon: 'fa-solid fa-border-all', color: '#a1a1aa', key: 'dashboard', link: '/dashboard/' },
    { name: 'Академія', icon: 'fa-solid fa-book-journal-whills', color: COLORS.blue, key: 'academy', link: '/academy/' },
    { name: 'Баланс', icon: 'fa-solid fa-scale-balanced', color: COLORS.purple, key: 'balance', link: '/balance/' },
    { name: 'Еволюція', icon: 'fa-solid fa-layer-group', color: COLORS.green, key: 'evolution', link: '/evolution/' },
    { name: 'Симуляції', icon: 'fa-solid fa-gamepad', color: COLORS.pink, key: 'simulations', link: '/simulations/' },
    { name: 'Маркет', icon: 'fa-solid fa-store', color: '#fbbf24', key: 'market', link: '/market/' },
  ];

  return (
    <div className="d-flex flex-column p-4 position-fixed top-0 start-0 h-100"
         style={{ width: '280px', backgroundColor: COLORS.surface, borderRight: `1px solid ${COLORS.border}`, zIndex: 100 }}>
      <div className="mb-5 d-flex align-items-center">
        <i className="fa-solid fa-terminal me-3 fs-3" style={{ color: '#e4e4e7' }}></i>
        <h2 className="river-text m-0 fw-bold" style={{ fontSize: '2rem', background: `linear-gradient(90deg, #fff, ${COLORS.blue}, #fff)`, backgroundClip: 'text', WebkitBackgroundClip: 'text', color: 'transparent' }}>SyFlow</h2>
      </div>
      <div className="d-flex flex-column gap-2 flex-grow-1">
        <div className="text-secondary font-monospace mb-2" style={{ fontSize: '0.75rem', letterSpacing: '2px' }}>ЯДРО СИСТЕМИ</div>
        {navItems.map((item) => (
          <motion.a key={item.key} href={item.link} whileHover={{ backgroundColor: 'rgba(255,255,255,0.03)', x: 5 }}
            className={`d-flex align-items-center p-3 text-decoration-none rounded-3 ${activeItem === item.key ? 'bg-dark' : ''}`}
            style={{ color: '#e4e4e7', border: activeItem === item.key ? `1px solid ${COLORS.border}` : '1px solid transparent' }}
          >
            <i className={`${item.icon} me-3`} style={{ color: item.color, width: '20px', textAlign: 'center' }}></i>
            <span className="fw-semibold" style={{ fontSize: '1.05rem' }}>{item.name}</span>
          </motion.a>
        ))}
      </div>
    </div>
  );
};

// ---------- КАРТКА КУРСУ ----------
const CourseCard = ({ title, description, progress, icon, color, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    whileHover={{ y: -5, boxShadow: `0 0 30px ${color}20` }}
    className="p-4 h-100"
    style={{ backgroundColor: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: '20px' }}
  >
    <div className="d-flex align-items-start gap-3 mb-3">
      <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${color}40` }}>
        <i className={icon} style={{ color, fontSize: '1.5rem' }} />
      </div>
      <div>
        <h3 className="text-white fw-bold mb-1" style={{ fontSize: '1.4rem' }}>{title}</h3>
        <p className="text-secondary m-0" style={{ fontSize: '0.9rem' }}>{description}</p>
      </div>
    </div>
    <div className="mt-3">
      <div className="d-flex justify-content-between mb-2">
        <span className="font-monospace" style={{ color: '#a1a1aa', fontSize: '0.8rem' }}>Прогрес</span>
        <span className="font-monospace fw-bold" style={{ color }}>{progress}%</span>
      </div>
      <div className="w-100" style={{ height: '6px', backgroundColor: '#18181b', borderRadius: '3px', overflow: 'hidden' }}>
        <motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 1, delay: delay + 0.2 }} style={{ height: '100%', backgroundColor: color, boxShadow: `0 0 10px ${color}` }} />
      </div>
    </div>
  </motion.div>
);

// ---------- ГОЛОВНИЙ КОМПОНЕНТ ----------
const AcademyRP = () => {
  const courses = [
    { title: 'Python Core', description: 'Основи синтаксису та логіки', progress: 75, icon: 'fa-brands fa-python', color: '#3b82f6' },
    { title: 'Django Mastery', description: 'Веб-фреймворк для бекенду', progress: 40, icon: 'fa-solid fa-code', color: '#10b981' },
    { title: 'React Deep Dive', description: 'Сучасний фронтенд', progress: 20, icon: 'fa-brands fa-react', color: '#61dafb' },
    { title: 'Алгоритми', description: 'Структури даних та оптимізація', progress: 60, icon: 'fa-solid fa-diagram-project', color: '#a855f7' },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}
      className="d-flex w-100 min-vh-100" style={{ backgroundColor: COLORS.bg, fontFamily: 'system-ui, -apple-system, sans-serif' }}
    >
      <Sidebar activeItem="academy" />
      <div className="flex-grow-1" style={{ marginLeft: '280px', padding: '2.5rem 4rem' }}>
        <div className="d-flex justify-content-between align-items-center mb-5 pb-3" style={{ borderBottom: `1px solid ${COLORS.border}` }}>
          <div>
            <div className="text-secondary font-monospace mb-1" style={{ fontSize: '0.85rem', letterSpacing: '2px' }}>НАВЧАЛЬНИЙ ЦЕНТР</div>
            <h1 className="text-white fw-bold m-0" style={{ fontSize: '2.5rem' }}>
              <span className="river-text" style={{ background: `linear-gradient(90deg, #fff, ${COLORS.blue}, #fff)`, backgroundClip: 'text', WebkitBackgroundClip: 'text', color: 'transparent' }}>Академія</span> SyFlow
            </h1>
          </div>
          <div className="text-end">
            <div className="text-secondary font-monospace mb-1">Загальний прогрес</div>
            <div className="d-flex align-items-center gap-2">
              <span className="text-white fw-bold fs-4">48%</span>
              <i className="fa-solid fa-arrow-up" style={{ color: COLORS.green }} />
            </div>
          </div>
        </div>

        <div className="d-flex gap-3 mb-4">
          <button className="btn px-4 py-2 text-white" style={{ backgroundColor: COLORS.blue, borderRadius: '20px', border: 'none' }}>Всі курси</button>
          <button className="btn px-4 py-2" style={{ backgroundColor: 'transparent', color: '#a1a1aa', border: `1px solid ${COLORS.border}`, borderRadius: '20px' }}>Активні</button>
          <button className="btn px-4 py-2" style={{ backgroundColor: 'transparent', color: '#a1a1aa', border: `1px solid ${COLORS.border}`, borderRadius: '20px' }}>Завершені</button>
        </div>

        <div className="row g-4">
          {courses.map((course, idx) => (
            <div className="col-md-6 col-xl-4" key={idx}>
              <CourseCard {...course} delay={idx * 0.1} />
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default AcademyRP;