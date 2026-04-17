// src/Pages/HomeRP.jsx
import React from 'react';
import { motion } from 'framer-motion';

// Вбудовані кольори (без імпорту constants)
const COLORS = {
  blue: '#3b82f6',
  purple: '#a855f7',
  green: '#10b981',
  bg: '#050505',
  surface: '#09090b',
  border: 'rgba(255, 255, 255, 0.05)'
};

// Тимчасово Sidebar вбудований прямо тут, щоб уникнути проблем з імпортом
const Sidebar = () => {
  const navItems = [
    { name: 'Дашборд', icon: 'fa-solid fa-border-all', color: '#fff', active: true, link: '/dashboard/' },
    { name: 'Академія', icon: 'fa-solid fa-book-journal-whills', color: COLORS.blue, active: false, link: '/academy/' },
    { name: 'Баланс', icon: 'fa-solid fa-scale-balanced', color: COLORS.purple, active: false, link: '/balance/' },
    { name: 'Еволюція', icon: 'fa-solid fa-layer-group', color: COLORS.green, active: false, link: '/evolution/' },
    { name: 'Симуляції', icon: 'fa-solid fa-gamepad', color: '#ec4899', active: false, link: '/simulations/' },
    { name: 'Маркет', icon: 'fa-solid fa-store', color: '#fbbf24', active: false, link: '/market/' },
  ];

  return (
    <div className="d-flex flex-column p-4 position-fixed top-0 start-0 h-100" style={{ width: '280px', backgroundColor: COLORS.surface, borderRight: `1px solid ${COLORS.border}`, zIndex: 100 }}>
      <div className="mb-5 d-flex align-items-center">
        <i className="fa-solid fa-terminal me-3 fs-3" style={{ color: '#e4e4e7' }}></i>
        <h2 className="river-text m-0 fw-bold" style={{ fontSize: '2rem', background: `linear-gradient(90deg, #fff, ${COLORS.blue}, #fff)`, backgroundClip: 'text', WebkitBackgroundClip: 'text', color: 'transparent' }}>SyFlow</h2>
      </div>
      <div className="d-flex flex-column gap-2 flex-grow-1">
        <div className="text-secondary font-monospace mb-2" style={{ fontSize: '0.75rem', letterSpacing: '2px' }}>ЯДРО СИСТЕМИ</div>
        {navItems.map((item, idx) => (
          <motion.a key={idx} href={item.link} whileHover={{ backgroundColor: 'rgba(255,255,255,0.03)', x: 5 }}
            className={`d-flex align-items-center p-3 text-decoration-none rounded-3 ${item.active ? 'bg-dark' : ''}`}
            style={{ color: '#e4e4e7', border: item.active ? `1px solid ${COLORS.border}` : '1px solid transparent' }}
          >
            <i className={`${item.icon} me-3`} style={{ color: item.color, width: '20px', textAlign: 'center' }}></i>
            <span className="fw-semibold" style={{ fontSize: '1.05rem' }}>{item.name}</span>
          </motion.a>
        ))}
      </div>
    </div>
  );
};

const DashboardCard = ({ title, value, subtitle, icon, color, delay }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay }}
    whileHover={{ y: -5, boxShadow: `0 0 30px ${color}20` }}
    className="p-4 position-relative overflow-hidden h-100"
    style={{ backgroundColor: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: '20px' }}
  >
    <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '40%', background: `linear-gradient(to top, ${color}15, transparent)`, pointerEvents: 'none' }} />
    <div className="position-relative z-1 d-flex flex-column h-100">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <span className="text-secondary fw-semibold" style={{ fontSize: '1.1rem' }}>{title}</span>
        <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${color}30` }}>
          <i className={icon} style={{ color, fontSize: '1.2rem' }} />
        </div>
      </div>
      <div className="mt-auto">
        <h3 className="fw-bold text-white mb-1" style={{ fontSize: '2.2rem' }}>{value}</h3>
        <p className="font-monospace m-0" style={{ color, fontSize: '0.85rem', letterSpacing: '1px' }}>{subtitle}</p>
      </div>
    </div>
  </motion.div>
);

const HomeRP = () => {
  const today = new Date();
  const formattedDate = new Intl.DateTimeFormat('uk-UA', { weekday: 'long', day: 'numeric', month: 'long' }).format(today);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}
      className="d-flex w-100 min-vh-100" style={{ backgroundColor: COLORS.bg, fontFamily: 'system-ui, -apple-system, sans-serif' }}
    >
      <Sidebar />
      <div className="flex-grow-1" style={{ marginLeft: '280px', padding: '2.5rem 4rem' }}>
        <div className="d-flex justify-content-between align-items-center mb-5 pb-3" style={{ borderBottom: `1px solid ${COLORS.border}` }}>
          <div>
            <div className="text-secondary font-monospace mb-1" style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '2px' }}>{formattedDate}</div>
            <h1 className="text-white fw-bold m-0" style={{ fontSize: '2rem' }}>
              Вітаю, <span className="river-text" style={{ background: `linear-gradient(90deg, #fff, ${COLORS.blue}, #fff)`, backgroundClip: 'text', WebkitBackgroundClip: 'text', color: 'transparent' }}>Сінсу</span>
            </h1>
          </div>
          <div className="d-flex align-items-center gap-3">
            <div className="d-flex align-items-center px-3 py-2" style={{ backgroundColor: 'rgba(16,185,129,0.1)', border: `1px solid ${COLORS.green}40`, borderRadius: '20px' }}>
              <div className="rounded-circle me-2" style={{ width: '8px', height: '8px', backgroundColor: COLORS.green, boxShadow: `0 0 10px ${COLORS.green}` }} />
              <span style={{ color: COLORS.green, fontSize: '0.85rem', fontWeight: 600 }}>SYSTEM.ONLINE</span>
            </div>
            <div className="rounded-circle overflow-hidden" style={{ width: '50px', height: '50px', border: `2px solid ${COLORS.border}` }}>
              <img src="https://api.dicebear.com/7.x/bottts/svg?seed=Sinsu&backgroundColor=09090b" alt="Avatar" width="100%" height="100%" />
            </div>
          </div>
        </div>

        <div className="row g-4">
          <div className="col-12 col-xl-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
              whileHover={{ boxShadow: `0 0 30px ${COLORS.blue}20` }}
              className="p-5 h-100 position-relative overflow-hidden" style={{ backgroundColor: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: '24px' }}
            >
              <div style={{ position: 'absolute', top: 0, right: 0, width: '50%', height: '100%', background: `radial-gradient(circle at right, ${COLORS.blue}10 0%, transparent 80%)`, pointerEvents: 'none' }} />
              <div className="position-relative z-1 d-flex flex-column justify-content-center h-100">
                <div className="d-inline-flex align-items-center px-3 py-1 mb-4" style={{ backgroundColor: `${COLORS.blue}15`, border: `1px solid ${COLORS.blue}30`, borderRadius: '6px', width: 'fit-content' }}>
                  <i className="fa-solid fa-crosshairs me-2" style={{ color: COLORS.blue }} />
                  <span style={{ color: COLORS.blue, fontSize: '0.85rem', fontWeight: 600, letterSpacing: '1px' }}>ПОТОЧНИЙ ФОКУС</span>
                </div>
                <h2 className="text-white fw-bold mb-3" style={{ fontSize: '3rem', letterSpacing: '-1px' }}>Архітектура Баз Даних</h2>
                <p className="text-secondary mb-5" style={{ fontSize: '1.2rem', maxWidth: '600px', lineHeight: '1.6' }}>
                  Модуль 04 очікує ініціалізації. Сьогодні ми розбираємо зв'язки Many-to-Many та оптимізацію ORM запитів у Django.
                </p>
                <div className="d-flex gap-3">
                  <button className="btn fw-bold px-4 py-3 text-white" style={{ backgroundColor: COLORS.blue, border: 'none', borderRadius: '12px' }}>Продовжити занурення</button>
                  <button className="btn fw-bold px-4 py-3 text-white" style={{ backgroundColor: 'transparent', border: `1px solid ${COLORS.border}`, borderRadius: '12px' }}>Переглянути конспект</button>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="col-12 col-md-6 col-xl-4"><DashboardCard title="Індекс Еволюції" value="Lvl. 12" subtitle="450 EXP до наступного рівня" icon="fa-solid fa-dna" color={COLORS.green} delay={0.1} /></div>
          <div className="col-12 col-md-6 col-xl-4"><DashboardCard title="Компіляція Модулів" value="4 / 28" subtitle="14% від загального ядра" icon="fa-solid fa-cubes" color={COLORS.blue} delay={0.2} /></div>
          <div className="col-12 col-md-6 col-xl-4"><DashboardCard title="Стан Потоку" value="Оптимальний" subtitle="Останній відпочинок: 2 год тому" icon="fa-solid fa-fan" color={COLORS.purple} delay={0.3} /></div>
          <div className="col-12 col-md-6 col-xl-4"><DashboardCard title="Синхронізація (Стрік)" value="5 Днів" subtitle="Продовжуйте підтримувати ритм" icon="fa-solid fa-fire" color="#f59e0b" delay={0.4} /></div>
        </div>
      </div>
    </motion.div>
  );
};

export default HomeRP;