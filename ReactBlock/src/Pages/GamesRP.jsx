import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const COLORS = {
    blue: '#3b82f6', purple: '#a855f7', green: '#10b981', pink: '#ec4899', 
    bg: '#050505', surface: '#09090b', border: 'rgba(255, 255, 255, 0.05)'
};

// --- НАЛАШТУВАННЯ PyRun ---
const GRID_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_DIRECTION = { x: 0, y: -1 };

// --- САЙДБАР (Такий самий, але активний пункт - Симуляції) ---
const Sidebar = () => {
    const navItems = [
        { name: 'Дашборд', icon: 'fa-solid fa-border-all', color: '#a1a1aa', active: false, link: '/dashboard/' },
        { name: 'Академія', icon: 'fa-solid fa-book-journal-whills', color: COLORS.blue, active: false, link: '#' },
        { name: 'Баланс', icon: 'fa-solid fa-scale-balanced', color: COLORS.purple, active: false, link: '#' },
        { name: 'Еволюція', icon: 'fa-solid fa-layer-group', color: COLORS.green, active: false, link: '#' },
        { name: 'Симуляції', icon: 'fa-solid fa-gamepad', color: '#fff', active: true, link: '/simulations/' },
    ];

    return (
        <div className="d-flex flex-column p-4 position-fixed top-0 start-0 h-100" style={{ width: '280px', backgroundColor: COLORS.surface, borderRight: `1px solid ${COLORS.border}`, zIndex: 100 }}>
            <div className="mb-5 d-flex align-items-center">
                <i className="fa-solid fa-terminal me-3 fs-3" style={{ color: '#e4e4e7' }}></i>
                <h2 className="river-text m-0 fw-bold" style={{ fontSize: '2rem', background: `linear-gradient(90deg, #fff, ${COLORS.blue}, #fff)` }}>SyFlow</h2>
            </div>
            <div className="d-flex flex-column gap-2 flex-grow-1">
                <div className="text-secondary font-monospace mb-2" style={{ fontSize: '0.75rem', letterSpacing: '2px' }}>ЯДРО СИСТЕМИ</div>
                {navItems.map((item, idx) => (
                    <motion.a key={idx} href={item.link} whileHover={{ backgroundColor: 'rgba(255,255,255,0.03)', x: 5 }} className={`d-flex align-items-center p-3 text-decoration-none rounded-3 ${item.active ? 'bg-dark' : ''}`} style={{ color: item.active ? '#fff' : '#e4e4e7', transition: 'all 0.2s', border: item.active ? `1px solid ${COLORS.border}` : '1px solid transparent' }}>
                        <i className={`${item.icon} me-3`} style={{ color: item.active ? COLORS.pink : item.color, width: '20px', textAlign: 'center' }}></i>
                        <span className="fw-semibold" style={{ fontSize: '1.05rem' }}>{item.name}</span>
                    </motion.a>
                ))}
            </div>
        </div>
    );
};

// --- ГОЛОВНИЙ КОНТЕНТ СТОРІНКИ ІГОР ---
const GamesRP = () => {
    const [activeGame, setActiveGame] = useState(null); // 'pyrun' або null

    // --- ЛОГІКА PyRun ---
    const [snake, setSnake] = useState(INITIAL_SNAKE);
    const [dir, setDir] = useState(INITIAL_DIRECTION);
    const [food, setFood] = useState({ x: 5, y: 5 });
    const [obstacles, setObstacles] = useState([]);
    const [score, setScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    
    const randomCoord = () => ({ x: Math.floor(Math.random() * GRID_SIZE), y: Math.floor(Math.random() * GRID_SIZE) });

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (activeGame !== 'pyrun') return;
            if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) e.preventDefault();
            if (e.key === 'ArrowUp' && dir.y === 0) setDir({ x: 0, y: -1 });
            if (e.key === 'ArrowDown' && dir.y === 0) setDir({ x: 0, y: 1 });
            if (e.key === 'ArrowLeft' && dir.x === 0) setDir({ x: -1, y: 0 });
            if (e.key === 'ArrowRight' && dir.x === 0) setDir({ x: 1, y: 0 });
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [dir, activeGame]);

    useEffect(() => {
        if (!isPlaying || gameOver || activeGame !== 'pyrun') return;
        const moveSnake = () => {
            setSnake(prevSnake => {
                const head = { x: prevSnake[0].x + dir.x, y: prevSnake[0].y + dir.y };
                if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE || prevSnake.some(seg => seg.x === head.x && seg.y === head.y) || obstacles.some(obs => obs.x === head.x && obs.y === head.y)) { setGameOver(true); return prevSnake; }
                const newSnake = [head, ...prevSnake];
                if (head.x === food.x && head.y === food.y) {
                    setScore(s => s + 10); setFood(randomCoord());
                    if ((score + 10) % 30 === 0) setObstacles(prev => [...prev, randomCoord()]);
                } else { newSnake.pop(); }
                return newSnake;
            });
        };
        const speed = Math.max(50, 150 - (score * 0.5));
        const interval = setInterval(moveSnake, speed);
        return () => clearInterval(interval);
    }, [isPlaying, gameOver, dir, food, obstacles, score, activeGame]);

    const startPyRun = () => { setSnake(INITIAL_SNAKE); setDir(INITIAL_DIRECTION); setScore(0); setGameOver(false); setObstacles([]); setFood(randomCoord()); setIsPlaying(true); };

    return (
        <div className="d-flex w-100 min-vh-100" style={{ backgroundColor: COLORS.bg, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
            <Sidebar />

            <div className="flex-grow-1" style={{ marginLeft: '280px', padding: '2.5rem 4rem' }}>
                {/* Топбар */}
                <div className="d-flex justify-content-between align-items-center mb-5 pb-3" style={{ borderBottom: `1px solid ${COLORS.border}` }}>
                    <div>
                        <div className="text-secondary font-monospace mb-1" style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '2px' }}>
                            СЕКТОР ТРЕНУВАНЬ
                        </div>
                        <h1 className="text-white fw-bold m-0" style={{ fontSize: '2rem' }}>Симуляції та <span className="river-text" style={{ background: `linear-gradient(90deg, #fff, ${COLORS.pink}, #fff)` }}>Ігри</span></h1>
                    </div>
                </div>

                {/* Сітка Ігор */}
                <div className="row g-4">
                    {/* КАРТКА PyRun */}
                    <div className="col-12 col-xl-6">
                        <motion.div 
                            whileHover={{ y: -5 }}
                            className="p-5 h-100 position-relative overflow-hidden"
                            style={{ backgroundColor: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: '24px', cursor: 'pointer' }}
                            onClick={() => setActiveGame('pyrun')}
                        >
                            <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '50%', background: `linear-gradient(to top, ${COLORS.blue}15, transparent)`, pointerEvents: 'none' }}></div>
                            
                            <div className="position-relative z-1 d-flex flex-column h-100">
                                <div className="d-flex justify-content-between align-items-center mb-4">
                                    <div style={{ width: '60px', height: '60px', borderRadius: '14px', backgroundColor: `${COLORS.blue}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${COLORS.blue}40` }}>
                                        <i className="fa-solid fa-terminal" style={{ color: COLORS.blue, fontSize: '2rem' }}></i>
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

                    {/* КАРТКА (У розробці) */}
                    <div className="col-12 col-xl-6">
                        <div className="p-5 h-100 position-relative overflow-hidden" style={{ backgroundColor: COLORS.surface, border: `1px dashed ${COLORS.border}`, borderRadius: '24px', opacity: 0.5 }}>
                            <div className="position-relative z-1 d-flex flex-column h-100 justify-content-center align-items-center text-center">
                                <i className="fa-solid fa-lock mb-4" style={{ color: '#52525b', fontSize: '3rem' }}></i>
                                <h2 className="text-white fw-bold mb-3" style={{ fontSize: '2rem' }}>Сортування Масивів</h2>
                                <p className="text-secondary font-monospace">МОДУЛЬ В СТАДІЇ РОЗРОБКИ...</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- ВІКНО САМОЇ ГРИ PyRun (Відкривається поверх) --- */}
            <AnimatePresence>
                {activeGame === 'pyrun' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{ zIndex: 99999, backgroundColor: 'rgba(0, 0, 0, 0.85)', backdropFilter: 'blur(15px)' }}>
                        <div className="p-4 shadow-lg" style={{ backgroundColor: COLORS.surface, border: `1px solid ${COLORS.blue}50`, borderRadius: '16px', width: '90%', maxWidth: '500px' }}>
                            
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
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default GamesRP;