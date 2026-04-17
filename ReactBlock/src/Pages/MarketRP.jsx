// src/Pages/MarketRP.jsx
import React, { useState } from 'react';
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

const RARITY_COLORS = {
  common: '#a1a1aa',
  rare: '#3b82f6',
  epic: '#a855f7',
  legendary: '#f59e0b'
};

// ---------- ВБУДОВАНИЙ SIDEBAR ----------
const Sidebar = ({ activeItem = 'market' }) => {
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

// ---------- КАРТКА ТОВАРУ ----------
const ProductCard = ({ name, description, price, rarity, icon, color, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay }}
    whileHover={{ y: -5, boxShadow: `0 0 30px ${color}20` }}
    className="p-4 h-100 position-relative overflow-hidden"
    style={{ backgroundColor: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: '20px' }}
  >
    <div style={{ position: 'absolute', top: 0, right: 0, padding: '4px 12px', backgroundColor: `${RARITY_COLORS[rarity]}20`, borderBottomLeftRadius: '12px', borderLeft: `1px solid ${RARITY_COLORS[rarity]}`, borderBottom: `1px solid ${RARITY_COLORS[rarity]}` }}>
      <span style={{ color: RARITY_COLORS[rarity], fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>{rarity}</span>
    </div>
    <div className="d-flex flex-column h-100">
      <div className="d-flex align-items-center gap-3 mb-3">
        <div style={{ width: '56px', height: '56px', borderRadius: '16px', backgroundColor: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${color}40` }}>
          <i className={icon} style={{ color, fontSize: '1.8rem' }} />
        </div>
        <div>
          <h3 className="text-white fw-bold mb-0" style={{ fontSize: '1.3rem' }}>{name}</h3>
          <p className="text-secondary m-0" style={{ fontSize: '0.85rem' }}>{description}</p>
        </div>
      </div>
      <div className="mt-auto d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center">
          <i className="fa-solid fa-coins me-1" style={{ color: '#fbbf24' }} />
          <span className="fw-bold text-white" style={{ fontSize: '1.3rem' }}>{price}</span>
          <span className="text-secondary ms-1" style={{ fontSize: '0.8rem' }}>SyNit</span>
        </div>
        <button className="btn px-4 py-2" style={{ backgroundColor: `${color}20`, border: `1px solid ${color}`, color, borderRadius: '8px', fontWeight: 600 }}>
          Придбати
        </button>
      </div>
    </div>
  </motion.div>
);

// ---------- ГОЛОВНИЙ КОМПОНЕНТ ----------
const MarketRP = () => {
  const [balance] = useState(1250);
  const [category, setCategory] = useState('all');

  const products = [
    { name: 'Тема "Кіберпанк"', description: 'Ексклюзивне оформлення', price: 450, rarity: 'epic', icon: 'fa-solid fa-palette', color: '#a855f7' },
    { name: 'Рамка профілю "Золото"', description: 'Виділяйся серед інших', price: 800, rarity: 'legendary', icon: 'fa-regular fa-id-card', color: '#f59e0b' },
    { name: 'Іконка "Senior Dev"', description: 'Знак майстерності', price: 300, rarity: 'rare', icon: 'fa-solid fa-crown', color: '#3b82f6' },
    { name: 'Подвоєння XP (7 днів)', description: 'Прогрес x2', price: 600, rarity: 'rare', icon: 'fa-solid fa-bolt', color: '#3b82f6' },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}
      className="d-flex w-100 min-vh-100" style={{ backgroundColor: COLORS.bg, fontFamily: 'system-ui, -apple-system, sans-serif' }}
    >
      <Sidebar activeItem="market" />
      <div className="flex-grow-1" style={{ marginLeft: '280px', padding: '2.5rem 4rem' }}>
        <div className="d-flex justify-content-between align-items-center mb-5 pb-3" style={{ borderBottom: `1px solid ${COLORS.border}` }}>
          <div>
            <div className="text-secondary font-monospace mb-1" style={{ fontSize: '0.85rem', letterSpacing: '2px' }}>ВНУТРІШНЯ ЕКОНОМІКА</div>
            <h1 className="text-white fw-bold m-0" style={{ fontSize: '2.5rem' }}>
              <span className="river-text" style={{ background: `linear-gradient(90deg, #fff, ${COLORS.pink}, #fff)`, backgroundClip: 'text', WebkitBackgroundClip: 'text', color: 'transparent' }}>Sy-Маркет</span>
            </h1>
          </div>
          <div className="d-flex align-items-center gap-3">
            <div className="d-flex align-items-center px-4 py-2" style={{ backgroundColor: '#18181b', borderRadius: '40px', border: `1px solid ${COLORS.border}` }}>
              <i className="fa-solid fa-coins me-2" style={{ color: '#fbbf24', fontSize: '1.2rem' }} />
              <span className="text-white fw-bold fs-5 me-1">{balance}</span>
              <span className="text-secondary">SyNit</span>
            </div>
            <button className="btn p-2" style={{ backgroundColor: '#18181b', border: `1px solid ${COLORS.border}`, borderRadius: '50%', width: '40px', height: '40px' }}>
              <i className="fa-solid fa-bell" style={{ color: '#a1a1aa' }} />
            </button>
          </div>
        </div>

        <div className="d-flex gap-3 mb-4">
          {['all', 'skins', 'boosters', 'icons'].map(cat => (
            <button key={cat} onClick={() => setCategory(cat)} className="btn px-4 py-2 text-capitalize"
              style={{ backgroundColor: category === cat ? COLORS.blue : 'transparent', color: category === cat ? '#fff' : '#a1a1aa', border: category === cat ? 'none' : `1px solid ${COLORS.border}`, borderRadius: '20px' }}
            >
              {cat === 'all' ? 'Всі товари' : cat}
            </button>
          ))}
        </div>

        <div className="row g-4">
          {products.map((prod, idx) => (
            <div className="col-md-6 col-xl-4" key={idx}>
              <ProductCard {...prod} delay={idx * 0.1} />
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default MarketRP;