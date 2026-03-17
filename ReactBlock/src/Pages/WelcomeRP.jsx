import React, { useState, useEffect, useCallback } from 'react';
import { motion, useScroll, useSpring, AnimatePresence } from 'framer-motion';

// --- НАЛАШТУВАННЯ ГРИ PyRun ---
const GRID_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_DIRECTION = { x: 0, y: -1 }; // Рух вгору

const WelcomeRP = () => {
    // --- АНІМАЦІЇ СТОРІНКИ ---
    const { scrollYProgress } = useScroll();
    const smoothProgress = useSpring(scrollYProgress, { stiffness: 50, damping: 20 });
    const fadeUp = { hidden: { opacity: 0, y: 60 }, show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } } };

    // --- СТАН ГРИ PyRun ---
    const [isGameOpen, setIsGameOpen] = useState(false);
    const [snake, setSnake] = useState(INITIAL_SNAKE);
    const [dir, setDir] = useState(INITIAL_DIRECTION);
    const [food, setFood] = useState({ x: 5, y: 5 });
    const [obstacles, setObstacles] = useState([]);
    const [score, setScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);

    // Генерація випадкової координат
    const randomCoord = () => ({
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE)
    });

    // Управління (Стрілки)
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (!isGameOpen) return;
            if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
                e.preventDefault(); // Забороняємо скрол сторінки при грі
            }
            if (e.key === 'ArrowUp' && dir.y === 0) setDir({ x: 0, y: -1 });
            if (e.key === 'ArrowDown' && dir.y === 0) setDir({ x: 0, y: 1 });
            if (e.key === 'ArrowLeft' && dir.x === 0) setDir({ x: -1, y: 0 });
            if (e.key === 'ArrowRight' && dir.x === 0) setDir({ x: 1, y: 0 });
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [dir, isGameOpen]);

    // Ігровий цикл (Tick)
    useEffect(() => {
        if (!isPlaying || gameOver || !isGameOpen) return;

        const moveSnake = () => {
            setSnake(prevSnake => {
                const head = { x: prevSnake[0].x + dir.x, y: prevSnake[0].y + dir.y };

                // Зіткнення зі стінами
                if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
                    setGameOver(true); return prevSnake;
                }
                // Зіткнення з собою
                if (prevSnake.some(segment => segment.x === head.x && segment.y === head.y)) {
                    setGameOver(true); return prevSnake;
                }
                // Зіткнення з перешкодами (Багами)
                if (obstacles.some(obs => obs.x === head.x && obs.y === head.y)) {
                    setGameOver(true); return prevSnake;
                }

                const newSnake = [head, ...prevSnake];

                // З'їли Документацію (Їжу)
                if (head.x === food.x && head.y === food.y) {
                    setScore(s => s + 10);
                    setFood(randomCoord());
                    // Кожні 30 очок з'являється новий баг (перешкода)
                    if ((score + 10) % 30 === 0) {
                        setObstacles(prev => [...prev, randomCoord()]);
                    }
                } else {
                    newSnake.pop(); // Видаляємо хвіст, якщо не з'їли
                }
                return newSnake;
            });
        };

        const speed = Math.max(50, 150 - (score * 0.5)); // Гра прискорюється!
        const interval = setInterval(moveSnake, speed);
        return () => clearInterval(interval);
    }, [isPlaying, gameOver, dir, food, obstacles, score, isGameOpen]);

    const startGame = () => {
        setSnake(INITIAL_SNAKE);
        setDir(INITIAL_DIRECTION);
        setScore(0);
        setGameOver(false);
        setObstacles([]);
        setFood(randomCoord());
        setIsPlaying(true);
    };

    return (
        <div className="w-100 position-relative" style={{ color: '#e4e4e7', overflow: isGameOpen ? 'hidden' : 'auto', height: isGameOpen ? '100vh' : 'auto', backgroundColor: '#09090b' }}>
            
            {/* ТЛО: Інженерна сітка */}
            <div className="position-fixed w-100 h-100" style={{
                backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)',
                backgroundSize: '40px 40px', zIndex: 0, pointerEvents: 'none'
            }}></div>

            {/* ТЛО: Нерівна лінія (Хребет Потоку) */}
            <div className="position-absolute w-100 h-100 d-flex justify-content-center" style={{ top: 0, left: 0, zIndex: 0, pointerEvents: 'none', overflow: 'hidden' }}>
                <svg width="400" height="100%" viewBox="0 0 400 3000" preserveAspectRatio="none" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <motion.path d="M 200 0 C 400 500, 0 1000, 200 1500 C 400 2000, 0 2500, 200 3000" stroke="rgba(255, 255, 255, 0.05)" strokeWidth="2" />
                    <motion.path d="M 200 0 C 400 500, 0 1000, 200 1500 C 400 2000, 0 2500, 200 3000" stroke="url(#flowGradient)" strokeWidth="3" style={{ pathLength: smoothProgress }} />
                    <defs>
                        <linearGradient id="flowGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#e4e4e7" />
                            <stop offset="100%" stopColor="#3f3f46" />
                        </linearGradient>
                    </defs>
                </svg>
            </div>

            {/* ГОЛОВНИЙ КОНТЕНТ */}
            <div className="position-relative" style={{ zIndex: 1, filter: isGameOpen ? 'blur(10px)' : 'none', transition: 'filter 0.5s' }}>
                
                {/* HERO СЕКЦІЯ */}
                <div className="min-vh-100 d-flex flex-column align-items-center justify-content-center py-5 position-relative">
                    
                    {/* КНОПКА ВИКЛИКУ ПРИХОВАНОЇ ГРИ (ВЕРХНІЙ ПРАВИЙ КУТ) */}
                    <motion.button 
                        whileHover={{ scale: 1.1, color: '#10b981' }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setIsGameOpen(true)}
                        className="position-absolute btn btn-link"
                        style={{ top: '30px', right: '30px', color: '#52525b', zIndex: 10 }}
                        title="Initialize PyRun.exe"
                    >
                        <i className="fa-solid fa-terminal fs-4"></i>
                    </motion.button>

                    <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }} className="position-absolute rounded-circle" style={{ width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 70%)', filter: 'blur(40px)', zIndex: -1 }} />

                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: 0.8, ease: "easeOut" }}
                        className="p-4 p-md-5 text-center"
                        style={{ backgroundColor: 'rgba(15, 15, 17, 0.75)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '24px', maxWidth: '440px', width: '90%', boxShadow: '0 30px 60px -15px rgba(0, 0, 0, 0.9)' }}
                    >
                        <h1 className="fw-bold mb-3 text-white" style={{ fontSize: '3rem', letterSpacing: '-1.5px' }}>SyFlow</h1>
                        <p className="mb-4 mb-md-5" style={{ color: '#a1a1aa', fontSize: '1.1rem', lineHeight: '1.6' }}>
                            Преображення вашого шляху в коді.<br/>
                            Дисципліна та чистий потік.
                        </p>
                        <motion.a href="/accounts/google/login/" whileHover={{ scale: 1.02, backgroundColor: '#3f3f46' }} whileTap={{ scale: 0.95 }} className="btn w-100 py-3 fw-semibold text-white d-flex align-items-center justify-content-center" style={{ backgroundColor: '#27272a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '1.1rem', transition: 'all 0.3s' }}>
                            <img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" width="20" className="me-3" alt="Google" />
                            Увійти через Google
                        </motion.a>
                    </motion.div>
                </div>

                {/* 2. Академія */}
                <div className="min-vh-100 d-flex align-items-center py-5">
                    <div className="container">
                        <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-100px" }} className="row align-items-center p-4 p-lg-5" style={{ backgroundColor: 'rgba(20, 20, 23, 0.6)', backdropFilter: 'blur(15px)', borderRadius: '32px', border: '1px solid rgba(255,255,255,0.03)', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}>
                            <div className="col-lg-7 mb-5 mb-lg-0 pe-lg-5">
                                <div className="d-inline-block px-3 py-1 mb-4" style={{ border: '1px solid #3f3f46', borderRadius: '20px', fontSize: '0.85rem', color: '#a1a1aa', letterSpacing: '1px' }}>01 / СТРУКТУРА</div>
                                <h2 className="fw-bold mb-4 text-white" style={{ fontSize: '3.5rem', letterSpacing: '-1px' }}>Академія</h2>
                                <p style={{ fontSize: '1.2rem', color: '#a1a1aa', lineHeight: '1.8' }}>Забудь про хаотичні туторіали. SyFlow пропонує структурований шлях від базового синтаксису до складної архітектури.</p>
                            </div>
                            <div className="col-lg-5 text-center">
                                <motion.i whileHover={{ scale: 1.1, rotate: -5, color: '#fff', textShadow: '0 0 30px rgba(255,255,255,0.2)' }} className="fa-solid fa-book-journal-whills" style={{ fontSize: '12rem', color: '#27272a' }}></motion.i>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* 3. Баланс (Скляний Моноліт) */}
                <div className="min-vh-100 d-flex align-items-center py-5">
                    <div className="container">
                        <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-100px" }} className="row align-items-center p-4 p-lg-5 flex-column-reverse flex-lg-row" style={{ backgroundColor: 'rgba(20, 20, 23, 0.6)', backdropFilter: 'blur(15px)', borderRadius: '32px', border: '1px solid rgba(255,255,255,0.03)', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}>
                            <div className="col-lg-5 text-center mt-5 mt-lg-0">
                                <motion.i whileHover={{ scale: 1.1, rotate: 5, color: '#fff', textShadow: '0 0 30px rgba(255,255,255,0.2)' }} transition={{ duration: 0.4 }} className="fa-solid fa-scale-balanced" style={{ fontSize: '12rem', color: '#27272a', cursor: 'pointer' }}></motion.i>
                            </div>
                            <div className="col-lg-7 ps-lg-5">
                                <div className="d-inline-block px-3 py-1 mb-4" style={{ border: '1px solid #3f3f46', borderRadius: '20px', fontSize: '0.85rem', color: '#a1a1aa', letterSpacing: '1px' }}>02 / ЕФЕКТИВНІСТЬ</div>
                                <h2 className="fw-bold mb-4 text-white" style={{ fontSize: '3.5rem', letterSpacing: '-1px' }}>Баланс</h2>
                                <p style={{ fontSize: '1.2rem', color: '#a1a1aa', lineHeight: '1.8' }}>
                                    Продуктивність — це не 16 годин за монітором. Це стан глибокого потоку. SyFlow відстежує твою активність, захищає від вигорання і змушує відпочивати, коли це стратегічно необхідно.
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* 4. Система (Скляний Моноліт) */}
                <div className="min-vh-100 d-flex align-items-center py-5">
                    <div className="container">
                        <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-100px" }} className="row align-items-center p-4 p-lg-5" style={{ backgroundColor: 'rgba(20, 20, 23, 0.6)', backdropFilter: 'blur(15px)', borderRadius: '32px', border: '1px solid rgba(255,255,255,0.03)', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}>
                            <div className="col-lg-7 mb-5 mb-lg-0 pe-lg-5">
                                <div className="d-inline-block px-3 py-1 mb-4" style={{ border: '1px solid #3f3f46', borderRadius: '20px', fontSize: '0.85rem', color: '#a1a1aa', letterSpacing: '1px' }}>03 / ЕВОЛЮЦІЯ</div>
                                <h2 className="fw-bold mb-4 text-white" style={{ fontSize: '3.5rem', letterSpacing: '-1px' }}>Система</h2>
                                <p style={{ fontSize: '1.2rem', color: '#a1a1aa', lineHeight: '1.8' }}>
                                    Глибока тіньова гейміфікація. Виконуй завдання, тримай стрік, заробляй ресурси. Твій профіль еволюціонує разом із твоїми навичками. Жодних дитячих бейджів — тільки суворий рейтинг майстерності.
                                </p>
                            </div>
                            <div className="col-lg-5 text-center">
                                <motion.i whileHover={{ scale: 1.1, y: -10, color: '#fff', textShadow: '0 0 30px rgba(255,255,255,0.2)' }} transition={{ duration: 0.4 }} className="fa-solid fa-layer-group" style={{ fontSize: '12rem', color: '#27272a', cursor: 'pointer' }}></motion.i>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* ФУТЕР */}
                <div className="py-5 text-center w-100" style={{ borderTop: '1px solid rgba(255,255,255,0.05)', color: '#52525b' }}>
                    <h5 className="fw-bold text-white mb-2" style={{ letterSpacing: '-0.5px', opacity: 0.8 }}>SyFlow</h5>
                    <p className="mb-0" style={{ fontSize: '0.85rem' }}>The architecture of your mind. © 2026.</p>
                </div>
            </div>

            {/* --- СЕКРЕТНИЙ ТЕРМІНАЛ: PyRun! --- */}
            <AnimatePresence>
                {isGameOpen && (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                        className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
                        style={{ zIndex: 9999, backgroundColor: 'rgba(0,0,0,0.8)' }}
                    >
                        <div className="p-4" style={{ backgroundColor: '#0c0c0e', border: '1px solid #3f3f46', borderRadius: '16px', fontFamily: 'monospace', width: '100%', maxWidth: '450px' }}>
                            
                            {/* Шапка терміналу */}
                            <div className="d-flex justify-content-between align-items-center mb-3 pb-2" style={{ borderBottom: '1px solid #27272a' }}>
                                <div className="text-success fw-bold"><i className="fa-solid fa-terminal me-2"></i>PyRun.exe</div>
                                <button onClick={() => setIsGameOpen(false)} className="btn btn-sm btn-link text-danger p-0"><i className="fa-solid fa-xmark fs-5"></i></button>
                            </div>

                            {/* Рахунок */}
                            <div className="d-flex justify-content-between mb-3" style={{ color: '#a1a1aa' }}>
                                <span>Score: <span className="text-white fw-bold">{score}</span></span>
                                <span>Status: {gameOver ? <span className="text-danger">CRASHED</span> : isPlaying ? <span className="text-success">RUNNING</span> : "IDLE"}</span>
                            </div>

                            {/* Ігрове поле (400x400) */}
                            <div className="position-relative bg-black mx-auto" style={{ width: '100%', aspectRatio: '1/1', border: '1px solid #27272a', borderRadius: '8px', overflow: 'hidden' }}>
                                
                                {/* Їжа (Документація) */}
                                <div className="position-absolute" style={{ width: `${100/GRID_SIZE}%`, height: `${100/GRID_SIZE}%`, left: `${(food.x/GRID_SIZE)*100}%`, top: `${(food.y/GRID_SIZE)*100}%`, backgroundColor: '#3b82f6', borderRadius: '2px', boxShadow: '0 0 10px #3b82f6' }}></div>

                                {/* Перешкоди (Баги) */}
                                {obstacles.map((obs, i) => (
                                    <div key={i} className="position-absolute" style={{ width: `${100/GRID_SIZE}%`, height: `${100/GRID_SIZE}%`, left: `${(obs.x/GRID_SIZE)*100}%`, top: `${(obs.y/GRID_SIZE)*100}%`, backgroundColor: '#ef4444', clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}></div>
                                ))}

                                {/* Змійка (Python) */}
                                {snake.map((seg, i) => (
                                    <div key={i} className="position-absolute" style={{ 
                                        width: `${100/GRID_SIZE}%`, height: `${100/GRID_SIZE}%`, 
                                        left: `${(seg.x/GRID_SIZE)*100}%`, top: `${(seg.y/GRID_SIZE)*100}%`, 
                                        backgroundColor: i === 0 ? '#10b981' : '#059669', // Голова світліша
                                        border: '1px solid #000', borderRadius: i === 0 ? '4px' : '0' 
                                    }}></div>
                                ))}

                                {/* Оверлей кінця гри */}
                                {!isPlaying && (
                                    <div className="position-absolute top-0 start-0 w-100 h-100 d-flex flex-column align-items-center justify-content-center" style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}>
                                        {gameOver && <h3 className="text-danger fw-bold mb-3">SYSTEM CRASHED</h3>}
                                        <button onClick={startGame} className="btn btn-outline-success font-monospace">
                                            {gameOver ? "REBOOT SYSTEM" : "START SCRIPT"}
                                        </button>
                                        <div className="mt-3 text-secondary" style={{ fontSize: '0.8rem' }}>Use ARROW KEYS to move</div>
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

export default WelcomeRP;