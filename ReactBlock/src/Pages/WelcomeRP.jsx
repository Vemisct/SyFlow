import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ПАЛІТРА СИСТЕМИ
const COLORS = {
    blue: '#3b82f6',
    purple: '#a855f7',
    green: '#10b981',
    pink: '#ec4899'
};

// --- ВІДЖЕТИ ДЛЯ БЛОКІВ ---

const TerminalWidget = () => {
    const [lines, setLines] = useState(['> Ініціалізація ядра...']);
    
    useEffect(() => {
        const cmds = [
            '> Завантаження архітектури...', 
            '> Аналіз синтаксису: ОК', 
            '> Побудова нейронних зв\'язків...', 
            '> SYFLOW.ACADEMY: ОНЛАЙН'
        ];
        const interval = setInterval(() => {
            setLines(prev => {
                if (prev.length >= 4) return ['> Очікування нових даних...'];
                return [...prev, cmds[prev.length]];
            });
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="mt-4 p-4 shadow-sm" style={{ backgroundColor: '#050505', borderRadius: '12px', border: `1px solid ${COLORS.blue}40`, fontFamily: 'monospace', fontSize: '0.9rem', color: COLORS.blue, height: '140px', overflow: 'hidden' }}>
            <div className="d-flex align-items-center mb-2 pb-2" style={{ borderBottom: `1px solid ${COLORS.blue}30` }}>
                <i className="fa-solid fa-terminal me-2"></i> SysLog
            </div>
            {lines.map((line, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }} className="mb-1">
                    {line}
                </motion.div>
            ))}
        </div>
    );
};

const WaveWidget = () => (
    <div className="mt-4 p-4 shadow-sm" style={{ backgroundColor: '#050505', borderRadius: '12px', border: `1px solid ${COLORS.purple}40`, height: '140px', position: 'relative', overflow: 'hidden' }}>
        <div className="d-flex justify-content-between align-items-center mb-2 position-relative z-1">
            <span style={{ fontSize: '0.85rem', color: COLORS.purple, textTransform: 'uppercase', letterSpacing: '1px' }}><i className="fa-solid fa-wave-square me-2"></i>Ритм потоку</span>
            <span className="fw-bold text-white">42 Hz</span>
        </div>
        <svg viewBox="0 0 500 100" className="w-100 position-absolute bottom-0 start-0" style={{ height: '80px', opacity: 0.8 }} preserveAspectRatio="none">
            <motion.path 
                d="M0,50 Q125,20 250,50 T500,50" fill="none" stroke={COLORS.purple} strokeWidth="3"
                animate={{ d: ["M0,50 Q125,20 250,50 T500,50", "M0,50 Q125,80 250,50 T500,50", "M0,50 Q125,20 250,50 T500,50"] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            />
            <motion.path 
                d="M0,50 Q125,80 250,50 T500,50" fill="none" stroke={COLORS.pink} strokeWidth="2" opacity="0.5"
                animate={{ d: ["M0,50 Q125,80 250,50 T500,50", "M0,50 Q125,20 250,50 T500,50", "M0,50 Q125,80 250,50 T500,50"] }}
                transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
            />
        </svg>
    </div>
);

const ProgressWidget = () => {
    const [count, setCount] = useState(0);
    
    useEffect(() => {
        let start = 0; const end = 2048; const duration = 2500; const increment = end / (duration / 16);
        const timer = setInterval(() => {
            start += increment;
            if (start >= end) { setCount(end); clearInterval(timer); } 
            else { setCount(Math.floor(start)); }
        }, 16);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="mt-4 p-4 shadow-sm d-flex flex-column justify-content-center" style={{ backgroundColor: '#050505', borderRadius: '12px', border: `1px solid ${COLORS.green}40`, height: '140px' }}>
            <div className="d-flex align-items-center mb-2">
                <i className="fa-solid fa-arrow-trend-up me-2" style={{ color: COLORS.green }}></i>
                <span style={{ fontSize: '0.85rem', color: COLORS.green, textTransform: 'uppercase', letterSpacing: '1px' }}>Еволюційний індекс</span>
            </div>
            <div className="d-flex align-items-baseline">
                <span className="fw-bold text-white" style={{ fontSize: '2.5rem', fontFamily: 'monospace' }}>{count}</span>
                <span className="ms-2 text-secondary" style={{ fontSize: '1rem' }}>EXP</span>
            </div>
            <div className="w-100 mt-2" style={{ height: '4px', backgroundColor: '#18181b', borderRadius: '2px', overflow: 'hidden' }}>
                <motion.div initial={{ width: 0 }} animate={{ width: '75%' }} transition={{ duration: 2, delay: 0.5 }} style={{ height: '100%', backgroundColor: COLORS.green, boxShadow: `0 0 10px ${COLORS.green}` }}></motion.div>
            </div>
        </div>
    );
};

// --- КОМПОНЕНТ: СТРУКТУРОВАНИЙ БЛОК ---
const StructuredModuleBlock = ({ title, description, iconClass, color, widget }) => (
    <motion.div 
        initial={{ opacity: 0, y: 30 }} 
        whileInView={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.8, ease: "easeOut" }} 
        viewport={{ once: true, amount: 0.2 }}
        className="position-relative w-100 mb-5"
        style={{ 
            backgroundColor: '#09090b', 
            borderRadius: '24px', 
            border: `1px solid rgba(255, 255, 255, 0.05)`,
            overflow: 'hidden' 
        }}
    >
        <div className="half-block-glow" style={{ 
            position: 'absolute', bottom: 0, left: 0, width: '100%', height: '55%', 
            background: `linear-gradient(to top, ${color}33, transparent)`, 
            filter: 'blur(40px)', zIndex: 0, pointerEvents: 'none' 
        }}></div>

        <div className="position-relative z-1 p-4 p-md-5 d-flex justify-content-between align-items-center" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <h2 className="river-text m-0 fw-bold" style={{ fontSize: '3.5rem', background: `linear-gradient(90deg, #fff, ${color}, #fff)` }}>
                {title}
            </h2>
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${color}40` }}>
                <i className={iconClass} style={{ fontSize: '2.5rem', color: color, filter: `drop-shadow(0 0 10px ${color}80)` }}></i>
            </div>
        </div>

        <div className="position-relative z-1 p-4 p-md-5 row align-items-start">
            <div className="col-lg-7 mb-4 mb-lg-0 pe-lg-5">
                <p style={{ fontSize: '1.25rem', color: '#a1a1aa', lineHeight: '1.7', fontWeight: 300, margin: 0 }}>
                    {description}
                </p>
            </div>
            <div className="col-lg-5">
                {widget}
            </div>
        </div>
    </motion.div>
);


// --- ГОЛОВНА СТОРІНКА ПРИВІТАННЯ ---
const WelcomeRP = () => {
    const [isEntering, setIsEntering] = useState(false);
    const [waterPhase, setWaterPhase] = useState(0);

    // Анімація течії для SVG фільтра
    useEffect(() => {
        let animationFrameId;
        const animateWater = () => {
            setWaterPhase(prev => (prev + 0.5) % 360);
            animationFrameId = requestAnimationFrame(animateWater);
        };
        animateWater();
        return () => cancelAnimationFrame(animationFrameId);
    }, []);

    const handleEntrance = (e) => {
        e.preventDefault(); 
        setIsEntering(true); 
        setTimeout(() => { window.location.href = "/accounts/google/login/"; }, 1000);
    };

    return (
        <div className="w-100 position-relative" style={{ color: '#e4e4e7', overflow: isEntering ? 'hidden' : 'auto', height: isEntering ? '100vh' : 'auto', backgroundColor: '#050505', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
            
            <style>
                {`
                .river-text {
                    background-size: 200% auto !important;
                    color: transparent !important;
                    -webkit-background-clip: text !important;
                    animation: text-flow 6s linear infinite;
                    filter: url(#water-filter);
                }
                @keyframes text-flow {
                    to { background-position: 200% center; }
                }
                .half-block-glow {
                    animation: pulse-glow 4s infinite alternate ease-in-out;
                }
                @keyframes pulse-glow {
                    0% { transform: scaleY(0.9); opacity: 0.7; }
                    100% { transform: scaleY(1.1); opacity: 1; }
                }
                `}
            </style>

            <svg style={{ position: 'absolute', width: 0, height: 0 }}>
                <filter id="water-filter">
                    <feTurbulence type="fractalNoise" baseFrequency="0.01 0.02" numOctaves="1" result="noise" seed={waterPhase} />
                    <feDisplacementMap in="SourceGraphic" in2="noise" scale="3" xChannelSelector="R" yChannelSelector="G" />
                </filter>
            </svg>

            {/* Анімація переходу (затемнення) при кліку на вхід */}
            <AnimatePresence>
                {isEntering && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }} className="position-fixed top-0 start-0 w-100 h-100 bg-black" style={{ zIndex: 100000 }} />
                )}
            </AnimatePresence>

            <div className="position-fixed w-100 h-100" style={{ backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px)', backgroundSize: '40px 40px', zIndex: 0, pointerEvents: 'none' }}></div>

            <div className="position-relative" style={{ zIndex: 1, filter: isEntering ? 'blur(10px)' : 'none', transition: 'filter 0.5s' }}>
                
                {/* --- HERO СЕКЦІЯ (БЕЗ КНОПКИ ТЕРМІНАЛУ) --- */}
                <div className="min-vh-100 d-flex flex-column align-items-center justify-content-center py-5 position-relative">
                    <div className="container text-center position-relative">
                        <div className="position-absolute top-50 start-50 translate-middle rounded-circle" style={{ width: '500px', height: '500px', background: `radial-gradient(circle, ${COLORS.blue}15 0%, transparent 70%)`, filter: 'blur(60px)', zIndex: -1 }}></div>

                        <motion.h1 
                            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }} 
                            className="river-text mb-4 fw-bold" 
                            style={{ fontSize: '7rem', letterSpacing: '-4px', background: `linear-gradient(90deg, #fff, ${COLORS.blue}, #fff)` }}
                        >
                            SyFlow
                        </motion.h1>
                        
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="mx-auto mb-5" style={{ maxWidth: '650px' }}>
                            <p style={{ color: '#a1a1aa', fontSize: '1.3rem', lineHeight: '1.6', fontWeight: 300 }}>
                                Професійне середовище для розробників. Ми об'єднали машинну точність архітектури та бездоганну дисципліну коду в єдиний потік.
                            </p>
                        </motion.div>
                        
                        <motion.a 
                            href="/accounts/google/login/" onClick={handleEntrance}
                            whileHover={{ scale: 1.02, backgroundColor: '#fff', color: '#050505' }} whileTap={{ scale: 0.98 }} 
                            className="btn py-3 px-5 fw-bold text-white d-inline-flex align-items-center justify-content-center" 
                            style={{ backgroundColor: '#18181b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', transition: 'all 0.3s', fontSize: '1.1rem' }}
                        >
                            <i className="fa-brands fa-google me-3 fs-5"></i> Увійти до Системи
                        </motion.a>
                    </div>
                </div>

                {/* --- СТРУКТУРОВАНІ МОДУЛІ --- */}
                <div className="container py-5" style={{ maxWidth: '1000px' }}>
                    <StructuredModuleBlock 
                        title="Академія" 
                        color={COLORS.blue}
                        iconClass="fa-solid fa-book-journal-whills"
                        description="Чітка, структурована ієрархія знань. Від базового синтаксису до масштабованої архітектури додатків. Система відкидає хаос, надаючи інструменти для побудови глибокого розуміння коду. Навчання перетворюється на інженерний процес."
                        widget={<TerminalWidget />}
                    />

                    <StructuredModuleBlock 
                        title="Баланс" 
                        color={COLORS.purple}
                        iconClass="fa-solid fa-scale-balanced"
                        description="Алгоритмічний контроль продуктивності. Відстеження метрик активності допомагає запобігти перевантаженню. Система розуміє, коли необхідна концентрація, а коли — пауза для відновлення нейронних зв'язків. Ефективність через відпочинок."
                        widget={<WaveWidget />}
                    />

                    <StructuredModuleBlock 
                        title="Прогрес" 
                        color={COLORS.green}
                        iconClass="fa-solid fa-layer-group"
                        description="Ваш особистий літопис розробника. Математична фіксація результатів та тіньова гейміфікація. Кожен закритий модуль оновлює глобальні змінні вашого профілю, еволюціонуючи ваші навички у реальному часі."
                        widget={<ProgressWidget />}
                    />
                </div>

                {/* ФУТЕР */}
                <div className="py-5 text-center w-100" style={{ color: '#52525b', fontSize: '0.9rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                    <p className="mb-0">© 2026 SyFlow. Дисципліна. Точність. Потік.</p>
                </div>
            </div>
        </div>
    );
};

export default WelcomeRP;