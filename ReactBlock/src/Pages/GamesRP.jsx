// src/Pages/GamesRP.jsx
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ---------- ЛОКАЛЬНІ КОЛЬОРИ ----------
const COLORS = {
  blue: '#3b82f6',
  purple: '#a855f7',
  green: '#10b981',
  pink: '#ec4899',
  bg: '#050505',
  surface: '#09090b',
  border: 'rgba(255, 255, 255, 0.05)'
};

// ---------- ВБУДОВАНИЙ SIDEBAR ----------
const Sidebar = ({ activeItem = 'simulations' }) => {
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

// ---------- НАЛАШТУВАННЯ ГРИ ----------
const GRID_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_DIRECTION = { x: 0, y: -1 };

const GamesRP = () => {
  const [activeGame, setActiveGame] = useState(null);
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [dirState, setDirState] = useState(INITIAL_DIRECTION);
  const dirRef = useRef(INITIAL_DIRECTION);
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [obstacles, setObstacles] = useState([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const setDirection = (newDir) => {
    if (dirRef.current.x === -newDir.x && dirRef.current.y === -newDir.y) return;
    dirRef.current = newDir;
    setDirState(newDir);
  };

  const getRandomFreeCell = () => {
    const occupied = new Set([
      ...snake.map(s => `${s.x},${s.y}`),
      ...obstacles.map(o => `${o.x},${o.y}`)
    ]);
    if (occupied.size >= GRID_SIZE * GRID_SIZE) return null;
    let coord;
    do {
      coord = { x: Math.floor(Math.random() * GRID_SIZE), y: Math.floor(Math.random() * GRID_SIZE) };
    } while (occupied.has(`${coord.x},${coord.y}`));
    return coord;
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (activeGame !== 'pyrun' || !isPlaying || gameOver) return;
      e.preventDefault();
      if (e.key === 'ArrowUp') setDirection({ x: 0, y: -1 });
      else if (e.key === 'ArrowDown') setDirection({ x: 0, y: 1 });
      else if (e.key === 'ArrowLeft') setDirection({ x: -1, y: 0 });
      else if (e.key === 'ArrowRight') setDirection({ x: 1, y: 0 });
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeGame, isPlaying, gameOver]);

  useEffect(() => {
    if (!isPlaying || gameOver || activeGame !== 'pyrun') return;
    const moveSnake = () => {
      setSnake(prevSnake => {
        const currentDir = dirRef.current;
        const head = { x: prevSnake[0].x + currentDir.x, y: prevSnake[0].y + currentDir.y };
        if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE ||
            prevSnake.some(seg => seg.x === head.x && seg.y === head.y) ||
            obstacles.some(obs => obs.x === head.x && obs.y === head.y)) {
          setGameOver(true);
          return prevSnake;
        }
        const newSnake = [head, ...prevSnake];
        if (head.x === food.x && head.y === food.y) {
          setScore(s => s + 10);
          const newFood = getRandomFreeCell();
          if (newFood) setFood(newFood);
          if ((score + 10) % 30 === 0) {
            const newObstacle = getRandomFreeCell();
            if (newObstacle) setObstacles(prev => [...prev, newObstacle]);
          }
        } else {
          newSnake.pop();
        }
        return newSnake;
      });
    };
    const speed = Math.max(50, 150 - Math.floor(score / 2));
    const interval = setInterval(moveSnake, speed);
    return () => clearInterval(interval);
  }, [isPlaying, gameOver, food, obstacles, score, activeGame]);

  const startPyRun = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setScore(0);
    setGameOver(false);
    setObstacles([]);
    const newFood = getRandomFreeCell();
    if (newFood) setFood(newFood);
    setIsPlaying(true);
  };

  return (
    <div className="d-flex w-100 min-vh-100" style={{ backgroundColor: COLORS.bg, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <Sidebar activeItem="simulations" />
      <div className="flex-grow-1" style={{ marginLeft: '280px', padding: '2.5rem 4rem' }}>
        <div className="d-flex justify-content-between align-items-center mb-5 pb-3" style={{ borderBottom: `1px solid ${COLORS.border}` }}>
          <div>
            <div className="text-secondary font-monospace mb-1" style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '2px' }}>СЕКТОР ТРЕНУВАНЬ</div>
            <h1 className="text-white fw-bold m-0" style={{ fontSize: '2rem' }}>
              Симуляції та <span className="river-text" style={{ background: `linear-gradient(90deg, #fff, ${COLORS.pink}, #fff)`, backgroundClip: 'text', WebkitBackgroundClip: 'text', color: 'transparent' }}>Ігри</span>
            </h1>
          </div>
        </div>

        <div className="row g-4">
          <div className="col-12 col-xl-6">
            <motion.div whileHover={{ y: -5, boxShadow: `0 0 30px ${COLORS.blue}30` }}
              className="p-5 h-100 position-relative overflow-hidden"
              style={{ backgroundColor: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: '24px', cursor: 'pointer' }}
              onClick={() => setActiveGame('pyrun')}
            >
              <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '50%', background: `linear-gradient(to top, ${COLORS.blue}15, transparent)`, pointerEvents: 'none' }} />
              <div className="position-relative z-1 d-flex flex-column h-100">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <div style={{ width: '60px', height: '60px', borderRadius: '14px', backgroundColor: `${COLORS.blue}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${COLORS.blue}40` }}>
                    <i className="fa-solid fa-terminal" style={{ color: COLORS.blue, fontSize: '2rem' }} />
                  </div>
                  <span className="px-3 py-1 font-monospace" style={{ backgroundColor: `${COLORS.green}20`, color: COLORS.green, borderRadius: '4px', fontSize: '0.8rem' }}>СТАБІЛЬНО</span>
                </div>
                <h2 className="text-white fw-bold mb-3" style={{ fontSize: '2.5rem', letterSpacing: '-1px' }}>PyRun Engine</h2>
                <p className="text-secondary mb-5" style={{ fontSize: '1.1rem', lineHeight: '1.6' }}>
                  Класичний тренажер фокусу. Збирай фрагменти коду, уникай багів, прискорюй обробку. Тренує реакцію та периферійний зір.
                </p>
                <div className="mt-auto">
                  <span className="fw-bold d-inline-flex align-items-center" style={{ color: COLORS.blue }}>
                    Ініціалізувати модуль <i className="fa-solid fa-arrow-right ms-2"></i>
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
          <div className="col-12 col-xl-6">
            <div className="p-5 h-100 position-relative overflow-hidden" style={{ backgroundColor: COLORS.surface, border: `1px dashed ${COLORS.border}`, borderRadius: '24px', opacity: 0.5 }}>
              <div className="position-relative z-1 d-flex flex-column h-100 justify-content-center align-items-center text-center">
                <i className="fa-solid fa-lock mb-4" style={{ color: '#52525b', fontSize: '3rem' }} />
                <h2 className="text-white fw-bold mb-3" style={{ fontSize: '2rem' }}>Сортування Масивів</h2>
                <p className="text-secondary font-monospace">МОДУЛЬ В СТАДІЇ РОЗРОБКИ...</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {activeGame === 'pyrun' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}
            className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
            style={{ zIndex: 99999, backgroundColor: 'rgba(0, 0, 0, 0.85)', backdropFilter: 'blur(15px)' }}
            onClick={() => { setActiveGame(null); setIsPlaying(false); }}
          >
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25 }} className="p-4 shadow-lg"
              style={{ backgroundColor: COLORS.surface, border: `1px solid ${COLORS.blue}50`, borderRadius: '16px', width: '90%', maxWidth: '500px' }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="d-flex justify-content-between align-items-center mb-3 pb-2" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <div className="fw-bold text-white font-monospace"><i className="fa-solid fa-terminal me-2" style={{ color: COLORS.blue }}></i> PyRun Engine</div>
                <button onClick={() => { setActiveGame(null); setIsPlaying(false); }} className="btn btn-sm btn-link p-0 text-secondary"><i className="fa-solid fa-xmark fs-5"></i></button>
              </div>
              <div className="d-flex justify-content-between mb-3 font-monospace" style={{ fontSize: '0.9rem', color: '#a1a1aa' }}>
                <span>Блоків зібрано: <span className="text-white fw-bold">{score}</span></span>
                <span>Статус: {gameOver ? <span className="text-danger">ПОМИЛКА</span> : isPlaying ? <span style={{ color: COLORS.green }}>ВИКОНАННЯ</span> : "ОЧІКУВАННЯ"}</span>
              </div>
              <div className="position-relative mx-auto" style={{ width: '100%', aspectRatio: '1/1', border: '1px solid #27272a', borderRadius: '8px', overflow: 'hidden', backgroundColor: '#000' }}>
                <div className="position-absolute" style={{ width: `${100/GRID_SIZE}%`, height: `${100/GRID_SIZE}%`, left: `${(food.x/GRID_SIZE)*100}%`, top: `${(food.y/GRID_SIZE)*100}%`, backgroundColor: COLORS.blue, borderRadius: '4px', boxShadow: `0 0 10px ${COLORS.blue}` }}></div>
                {obstacles.map((obs, i) => (<div key={i} className="position-absolute d-flex align-items-center justify-content-center" style={{ width: `${100/GRID_SIZE}%`, height: `${100/GRID_SIZE}%`, left: `${(obs.x/GRID_SIZE)*100}%`, top: `${(obs.y/GRID_SIZE)*100}%`, color: COLORS.pink, fontSize: '14px', fontWeight: 'bold' }}>X</div>))}
                {snake.map((seg, i) => (<div key={i} className="position-absolute" style={{ width: `${100/GRID_SIZE}%`, height: `${100/GRID_SIZE}%`, left: `${(seg.x/GRID_SIZE)*100}%`, top: `${(seg.y/GRID_SIZE)*100}%`, backgroundColor: i === 0 ? COLORS.green : '#059669', borderRadius: i===0 ? '4px' : '0', border: '1px solid #000' }}></div>))}
                {!isPlaying && (
                  <div className="position-absolute top-0 start-0 w-100 h-100 d-flex flex-column align-items-center justify-content-center" style={{ backgroundColor: 'rgba(0,0,0,0.8)' }}>
                    <button onClick={startPyRun} className="btn fw-bold text-white px-4 py-2" style={{ border: `1px solid ${COLORS.blue}`, backgroundColor: `${COLORS.blue}33`, borderRadius: '8px' }}>
                      {gameOver ? "Перезавантажити" : "Ініціалізувати"}
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GamesRP;