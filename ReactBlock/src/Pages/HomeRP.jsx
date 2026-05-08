// HomeRP.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const COLORS = {
  blue: '#3b82f6',
  purple: '#a855f7',
  green: '#10b981',
  pink: '#ec4899',
  yellow: '#f59e0b',
  bg: '#050505',
  surface: '#09090b',
  border: 'rgba(255, 255, 255, 0.08)',
  glass: 'rgba(9, 9, 11, 0.65)',
};

// ==================== АНІМАЦІЯ ПЕРЕХОДУ ====================
const BlockTransition = ({ isActive }) => {
  if (!isActive) return null;
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
      style={{ zIndex: 9999, backgroundColor: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)' }}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0, y: 40 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: 'spring', damping: 20, stiffness: 200 }}
        className="text-center"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
          className="mb-4 mx-auto"
          style={{
            width: '60px', height: '60px',
            borderRadius: '50%',
            border: `3px solid ${COLORS.purple}`,
            borderTopColor: 'transparent',
          }}
        />
        <h2 className="text-white fw-bold mb-2">Перехід до блоку</h2>
        <p className="text-secondary">Зачекайте, відбувається синхронізація</p>
      </motion.div>
    </motion.div>
  );
};

// ==================== САЙДБАР ====================
const Sidebar = ({ onComingSoon, onNavigate }) => {
  const navItems = [
    { name: 'Центр управління', icon: 'fa-solid fa-border-all', active: true, link: '/dashboard/' },
    { name: 'Академія', icon: 'fa-solid fa-book-journal-whills', color: COLORS.blue, link: '/academy/', soon: true },
    { name: 'Майстерня', icon: 'fa-solid fa-hammer', color: COLORS.purple, link: '/workshop/main' },
    { name: 'Полігон', icon: 'fa-solid fa-gamepad', color: COLORS.pink, link: '/simulations/', soon: true },
    { name: 'Маркет', icon: 'fa-solid fa-store', color: COLORS.yellow, link: '/market/', soon: true },
  ];

  const handleClick = (e, item) => {
    if (item.soon) {
      e.preventDefault();
      onComingSoon();
      return;
    }
    if (!item.active) {
      e.preventDefault();
      onNavigate(item.link);
    }
  };

  return (
    <motion.div
      initial={{ x: -40, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="d-flex flex-column p-4 position-fixed top-0 start-0 h-100"
      style={{
        width: '280px',
        background: 'rgba(5,5,5,0.75)',
        backdropFilter: 'blur(25px)',
        borderRight: `1px solid ${COLORS.blue}40`,
        boxShadow: `5px 0 30px rgba(59, 130, 246, 0.1)`,
        zIndex: 100,
      }}
    >
      <div className="mb-5 d-flex align-items-center">
        <motion.i
          className="fa-solid fa-terminal me-3 fs-3"
          style={{ color: COLORS.blue }}
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ repeat: Infinity, duration: 5 }}
        />
        <h2
          className="river-text m-0 fw-bold"
          style={{
            fontSize: '2rem',
            background: `linear-gradient(90deg, #fff, ${COLORS.blue}, #fff)`,
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
          }}
        >
          SyFlow
        </h2>
      </div>

      <div className="d-flex flex-column gap-2 flex-grow-1">
        <div className="text-secondary font-monospace mb-2" style={{ fontSize: '0.75rem', letterSpacing: '2px' }}>
          ОРГАНІЗАЦІЯ
        </div>
        {navItems.map((item, idx) => (
          <motion.a
            key={idx}
            href={item.link}
            onClick={(e) => handleClick(e, item)}
            whileHover={{ backgroundColor: 'rgba(255,255,255,0.05)', x: 6, borderColor: item.color || '#fff' }}
            whileTap={{ scale: 0.97 }}
            className={`d-flex align-items-center p-3 text-decoration-none rounded-3 ${item.active ? 'bg-dark' : ''}`}
            style={{
              color: '#e4e4e7',
              border: item.active ? `1px solid ${COLORS.blue}50` : '1px solid transparent',
              transition: 'all 0.2s',
            }}
          >
            <i className={`${item.icon} me-3`} style={{ color: item.color || '#a1a1aa', width: '20px', textAlign: 'center' }}></i>
            <span className="fw-semibold" style={{ fontSize: '1.05rem' }}>{item.name}</span>
            {item.soon && <span className="ms-auto badge bg-secondary" style={{ fontSize: '0.65rem' }}>soon</span>}
          </motion.a>
        ))}
      </div>

      <div className="mt-auto pt-3 border-top" style={{ borderColor: COLORS.border }}>
        <motion.a
          href="/settings/"
          onClick={(e) => { e.preventDefault(); onNavigate('/settings/'); }}
          whileHover={{ backgroundColor: 'rgba(255,255,255,0.03)', x: 4 }}
          className="d-flex align-items-center p-3 text-decoration-none rounded-3 mb-1"
          style={{ color: '#a1a1aa' }}
        >
          <i className="fa-solid fa-gear me-3" style={{ width: '20px', textAlign: 'center' }}></i>
          <span className="fw-semibold">Налаштування</span>
        </motion.a>
        <motion.a
          href="/accounts/logout/"
          whileHover={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}
          className="d-flex align-items-center p-3 text-decoration-none rounded-3"
          style={{ color: '#a1a1aa' }}
        >
          <i className="fa-solid fa-arrow-right-from-bracket me-3" style={{ width: '20px', textAlign: 'center' }}></i>
          <span className="fw-semibold">Вийти</span>
        </motion.a>
      </div>
    </motion.div>
  );
};

// ==================== СТАТИСТИЧНА КАРТКА ====================
const StatCard = ({ title, value, subtitle, icon, color, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 30, scale: 0.95 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    transition={{ duration: 0.4, delay, ease: 'easeOut' }}
    whileHover={{
      y: -6,
      boxShadow: `0 15px 30px ${color}30`,
      borderColor: `${color}70`,
    }}
    className="p-4 position-relative overflow-hidden h-100"
    style={{
      backgroundColor: COLORS.glass,
      backdropFilter: 'blur(20px)',
      border: `1px solid ${color}40`,
      borderRadius: '24px',
      boxShadow: `0 10px 20px -5px rgba(0,0,0,0.5)`,
    }}
  >
    <div className="position-relative z-1 d-flex flex-column h-100">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <span className="text-secondary fw-semibold" style={{ fontSize: '1.1rem' }}>{title}</span>
        <motion.div
          whileHover={{ rotate: 15 }}
          style={{
            width: '44px', height: '44px', borderRadius: '14px',
            backgroundColor: `${color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: `1px solid ${color}50`,
          }}
        >
          <i className={icon} style={{ color, fontSize: '1.3rem' }} />
        </motion.div>
      </div>
      <div className="mt-auto">
        <h3 className="fw-bold text-white mb-1" style={{ fontSize: '2.2rem', fontFamily: 'var(--font-family, monospace)' }}>{value}</h3>
        <p className="font-monospace m-0 mt-1" style={{ color, fontSize: '0.85rem', letterSpacing: '1px', opacity: 0.9 }}>{subtitle}</p>
      </div>
    </div>
  </motion.div>
);

// ==================== КАРТКА ВІДДІЛУ ====================
const DepartmentDashboardCard = ({ title, description, icon, color, link, soon, onComingSoon, onClick }) => (
  <motion.a
    href={link || '#'}
    onClick={(e) => {
      if (soon) {
        e.preventDefault();
        onComingSoon();
        return;
      }
      if (onClick) {
        e.preventDefault();
        onClick(link, color);
      }
    }}
    initial={{ opacity: 0, y: 30, scale: 0.95 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    transition={{ duration: 0.4, delay: 0, ease: 'easeOut' }}
    whileHover={{
      y: -8,
      boxShadow: `0 20px 35px ${color}40`,
      borderColor: `${color}90`,
      transition: { duration: 0.3 },
    }}
    className="p-4 position-relative overflow-hidden h-100 text-decoration-none"
    style={{
      backgroundColor: COLORS.glass,
      backdropFilter: 'blur(20px)',
      border: `1px solid ${color}50`,
      borderRadius: '24px',
      display: 'block',
      boxShadow: `0 10px 20px -5px rgba(0,0,0,0.5)`,
    }}
  >
    <motion.div
      className="position-absolute top-0 start-0 w-100 h-100"
      style={{
        background: `radial-gradient(circle at 30% 20%, ${color}30 0%, transparent 70%)`,
        opacity: 0,
        pointerEvents: 'none',
      }}
      whileHover={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    />

    <div className="position-relative z-1 d-flex flex-column h-100">
      <div className="d-flex align-items-center gap-3 mb-3">
        <motion.div
          whileHover={{ scale: 1.1, rotate: 5 }}
          style={{
            width: '56px', height: '56px', borderRadius: '16px',
            backgroundColor: `${color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: `1px solid ${color}60`, boxShadow: `0 0 15px ${color}30`,
          }}
        >
          <i className={icon} style={{ color, fontSize: '1.8rem' }} />
        </motion.div>
        <h3 className="text-white fw-bold mb-0" style={{ fontSize: '1.5rem', letterSpacing: '-0.5px' }}>{title}</h3>
        {soon && <span className="ms-auto badge bg-secondary">скоро</span>}
      </div>
      <p className="text-secondary flex-grow-1" style={{ fontSize: '0.95rem', lineHeight: '1.6' }}>{description}</p>
      <motion.span
        className="mt-3 d-inline-flex align-items-center"
        style={{ color, fontSize: '0.9rem', fontWeight: 600 }}
        whileHover={{ x: 5 }}
      >
        {soon ? 'Очікуйте' : 'Перейти'} <i className="fa-solid fa-arrow-right ms-2" />
      </motion.span>
    </div>
  </motion.a>
);

// ==================== ГОЛОВНИЙ ДАШБОРД ====================
const HomeRP = () => {
  const [comingSoon, setComingSoon] = useState(false);
  const [exitingBlock, setExitingBlock] = useState({ active: false, link: '' });

  const today = new Date();
  const formattedDate = new Intl.DateTimeFormat('uk-UA', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(today);

const handleBlockClick = (link) => {
    setExitingBlock({ active: true, link });
    // Перехід через 1.5 секунди (поки показується анімація)
    setTimeout(() => {
      window.location.href = link;
    }, 1500);
  };

  const handleExitComplete = () => {
    if (exitingBlock.link) {
      window.location.href = exitingBlock.link;
    }
  };

  return (
    <div
      className="d-flex w-100 min-vh-100"
      style={{ backgroundColor: COLORS.bg, fontFamily: 'var(--font-family, system-ui, -apple-system, sans-serif)' }}
    >
      <Sidebar onComingSoon={() => setComingSoon(true)} onNavigate={handleBlockClick} />

      <div className="flex-grow-1" style={{ marginLeft: '280px', padding: '2.5rem 4rem' }}>
        {/* ===== ХЕДЕР ===== */}
        <div className="d-flex justify-content-between align-items-center mb-5 pb-3" style={{ borderBottom: `1px solid ${COLORS.border}` }}>
          <div>
            <div className="text-secondary font-monospace mb-1" style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '3px' }}>
              {formattedDate}
            </div>
            <h1 className="text-white fw-bold m-0" style={{ fontSize: '2.2rem' }}>
              Центр управління,{' '}
              <span
                className="river-text"
                style={{
                  background: `linear-gradient(90deg, #fff, ${COLORS.blue}, #fff)`,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  color: 'transparent',
                }}
              >
                оператор
              </span>
            </h1>
          </div>

          <div className="d-flex align-items-center gap-3">
            <motion.div
              animate={{ boxShadow: ['0 0 10px rgba(16,185,129,0.2)', '0 0 20px rgba(16,185,129,0.6)', '0 0 10px rgba(16,185,129,0.2)'] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="d-flex align-items-center px-3 py-2"
              style={{ backgroundColor: 'rgba(16,185,129,0.1)', border: `1px solid ${COLORS.green}50`, borderRadius: '20px' }}
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="rounded-circle me-2"
                style={{ width: '8px', height: '8px', backgroundColor: COLORS.green, boxShadow: `0 0 10px ${COLORS.green}` }}
              />
              <span style={{ color: COLORS.green, fontSize: '0.85rem', fontWeight: 600 }}>SYSTEM.ONLINE</span>
            </motion.div>

            <motion.a
              href="/settings/"
              onClick={(e) => { e.preventDefault(); handleBlockClick('/settings/'); }}
              whileHover={{ scale: 1.1, borderColor: COLORS.blue }}
              className="btn p-2 rounded-circle"
              style={{ backgroundColor: 'transparent', border: `1px solid ${COLORS.border}`, width: '42px', height: '42px' }}
              title="Налаштування"
            >
              <i className="fa-solid fa-gear" style={{ color: '#a1a1aa', fontSize: '1.1rem' }} />
            </motion.a>

            <motion.div
              whileHover={{ scale: 1.1, borderColor: COLORS.purple }}
              className="rounded-circle overflow-hidden"
              style={{ width: '50px', height: '50px', border: `2px solid ${COLORS.border}` }}
            >
              <img
                src="https://api.dicebear.com/7.x/bottts/svg?seed=Sinsu&backgroundColor=09090b"
                alt="Avatar"
                width="100%"
                height="100%"
              />
            </motion.div>
          </div>
        </div>

        {/* ===== ВІДДІЛИ ===== */}
        <div className="row g-4 mb-5">
          {[
            { title: 'Академія', description: 'Навчальний відділ: курси, лекції, менторство.', icon: 'fa-solid fa-book-journal-whills', color: COLORS.blue, link: '/academy/', soon: true },
            { title: 'Майстерня', description: 'Спільні проекти та код-рев\'ю.', icon: 'fa-solid fa-hammer', color: COLORS.purple, link: '/workshop/main' },
            { title: 'Маркет', description: 'Внутрішній магазин: скіни, бустери.', icon: 'fa-solid fa-store', color: COLORS.yellow, link: '/market/', soon: true },
            { title: 'Полігон', description: 'Тренажери, змагання, тестування.', icon: 'fa-solid fa-gamepad', color: COLORS.pink, link: '/simulations/', soon: true },
          ].map((dept, i) => (
            <div key={i} className="col-12 col-xl-6">
              <DepartmentDashboardCard
                {...dept}
                onClick={handleBlockClick}
                onComingSoon={() => setComingSoon(true)}
              />
            </div>
          ))}
        </div>

        {/* ===== СТАТИСТИКА ===== */}
        <div className="row g-4">
          {[
            { title: 'Індекс Еволюції', value: '12', subtitle: '450 XP до рівня', icon: 'fa-solid fa-dna', color: COLORS.green },
            { title: 'Компіляція Модулів', value: '4', subtitle: 'з 28 завершено', icon: 'fa-solid fa-cubes', color: COLORS.blue },
            { title: 'Стан Потоку', value: 'Оптимальний', subtitle: 'Відпочинок 2 год тому', icon: 'fa-solid fa-fan', color: COLORS.purple },
            { title: 'Синхронізація', value: '5', subtitle: 'днів безперервно', icon: 'fa-solid fa-fire', color: '#f59e0b' },
          ].map((stat, i) => (
            <div key={i} className="col-12 col-md-6 col-xl-3">
              <StatCard {...stat} delay={i * 0.05} />
            </div>
          ))}
        </div>
      </div>

      {/* Модалка "Coming Soon" */}
      <AnimatePresence>
        {comingSoon && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
            style={{ zIndex: 9998, backgroundColor: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(5px)' }}
            onClick={() => setComingSoon(false)}
          >
            <motion.div
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 20 }}
              transition={{ type: 'spring', damping: 20 }}
              className="text-center p-5 rounded-4"
              style={{ backgroundColor: COLORS.surface, border: `1px solid ${COLORS.border}` }}
              onClick={(e) => e.stopPropagation()}
            >
              <motion.i
                className="fa-solid fa-hammer mb-3"
                style={{ fontSize: '3rem', color: COLORS.purple }}
                animate={{ rotate: [0, -20, 20, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
              />
              <h2 className="text-white fw-bold mb-2">Незабаром</h2>
              <p className="text-secondary mb-4">Цей розділ ще будується. Команда SyFlow працює над ним.</p>
              <button className="btn px-4 py-2 text-white fw-bold rounded-3" style={{ backgroundColor: COLORS.purple }} onClick={() => setComingSoon(false)}>
                Зрозуміло
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Анімація переходу */}
      <BlockTransition
        isActive={exitingBlock.active}
      />
    </div>
  );
};

export default HomeRP;