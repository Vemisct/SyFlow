// WelcomeRP.jsx
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';

const COLORS = {
  blue: '#3b82f6',
  purple: '#a855f7',
  green: '#10b981',
  pink: '#ec4899',
  bg: '#050505',
  surface: '#09090b',
  border: 'rgba(255,255,255,0.05)'
};

// Варіанти анімації для контейнера
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3
    }
  }
};

const itemVariants = {
  hidden: { y: 30, opacity: 0, filter: 'blur(10px)' },
  visible: {
    y: 0,
    opacity: 1,
    filter: 'blur(0px)',
    transition: { type: 'spring', stiffness: 100, damping: 20 }
  }
};

// Компонент частинок фону
const Particles = () => {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationFrame;
    let width, height;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      initParticles();
    };

    const initParticles = () => {
      particles = [];
      for (let i = 0; i < 80; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius: Math.random() * 2 + 1,
          speedX: (Math.random() - 0.5) * 0.4,
          speedY: (Math.random() - 0.5) * 0.4,
          color: `rgba(59, 130, 246, ${Math.random() * 0.3 + 0.1})`
        });
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      particles.forEach(p => {
        p.x += p.speedX;
        p.y += p.speedY;
        if (p.x < 0 || p.x > width) p.speedX *= -1;
        if (p.y < 0 || p.y > height) p.speedY *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
      });
      animationFrame = requestAnimationFrame(draw);
    };

    window.addEventListener('resize', resize);
    resize();
    draw();

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="position-fixed top-0 start-0 w-100 h-100" style={{ pointerEvents: 'none', zIndex: 0 }} />;
};

// Віджет терміналу (покращений)
const TerminalWidget = () => {
  const [lines, setLines] = useState(['> Ініціалізація ядра...']);
  useEffect(() => {
    const cmds = [
      '> Завантаження модулів: ОК',
      '> Підключення до потоку...',
      '> SYFLOW.ACADEMY: ONLINE'
    ];
    const interval = setInterval(() => {
      setLines(prev => (prev.length >= 4 ? ['> Очікування команд...'] : [...prev, cmds[prev.length - 1]]));
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div variants={itemVariants} className="mt-4 p-4" style={{ backgroundColor: '#050505', borderRadius: '16px', border: `1px solid ${COLORS.blue}40`, fontFamily: 'monospace', fontSize: '0.9rem', color: COLORS.blue, minHeight: '140px' }}>
      <div className="d-flex align-items-center mb-2 pb-2" style={{ borderBottom: `1px solid ${COLORS.blue}30` }}>
        <i className="fa-solid fa-terminal me-2" /> SysLog
      </div>
      {lines.map((line, i) => (
        <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }} className="mb-1">
          {line}
        </motion.div>
      ))}
    </motion.div>
  );
};

// Віджет хвилі (покращений)
const WaveWidget = () => (
  <motion.div variants={itemVariants} className="mt-4 p-4" style={{ backgroundColor: '#050505', borderRadius: '16px', border: `1px solid ${COLORS.purple}40`, height: '140px', position: 'relative', overflow: 'hidden' }}>
    <div className="d-flex justify-content-between align-items-center mb-2 position-relative z-1">
      <span style={{ fontSize: '0.85rem', color: COLORS.purple, textTransform: 'uppercase', letterSpacing: '1px' }}>
        <i className="fa-solid fa-wave-square me-2" /> Ритм потоку
      </span>
      <span className="fw-bold text-white">42 Hz</span>
    </div>
    <svg viewBox="0 0 500 100" className="w-100 position-absolute bottom-0 start-0" style={{ height: '80px', opacity: 0.8 }} preserveAspectRatio="none">
      <motion.path d="M0,50 Q125,20 250,50 T500,50" fill="none" stroke={COLORS.purple} strokeWidth="3"
        animate={{ d: ["M0,50 Q125,20 250,50 T500,50", "M0,50 Q125,80 250,50 T500,50", "M0,50 Q125,20 250,50 T500,50"] }}
        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
      />
      <motion.path d="M0,50 Q125,80 250,50 T500,50" fill="none" stroke={COLORS.pink} strokeWidth="2" opacity="0.5"
        animate={{ d: ["M0,50 Q125,80 250,50 T500,50", "M0,50 Q125,20 250,50 T500,50", "M0,50 Q125,80 250,50 T500,50"] }}
        transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
      />
    </svg>
  </motion.div>
);

// Прогрес віджет
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
    <motion.div variants={itemVariants} className="mt-4 p-4 d-flex flex-column justify-content-center" style={{ backgroundColor: '#050505', borderRadius: '16px', border: `1px solid ${COLORS.green}40`, height: '140px' }}>
      <div className="d-flex align-items-center mb-2">
        <i className="fa-solid fa-arrow-trend-up me-2" style={{ color: COLORS.green }} />
        <span style={{ fontSize: '0.85rem', color: COLORS.green, textTransform: 'uppercase', letterSpacing: '1px' }}>Еволюційний індекс</span>
      </div>
      <div className="d-flex align-items-baseline">
        <span className="fw-bold text-white" style={{ fontSize: '2.5rem', fontFamily: 'monospace' }}>{count}</span>
        <span className="ms-2 text-secondary" style={{ fontSize: '1rem' }}>EXP</span>
      </div>
      <div className="w-100 mt-2" style={{ height: '4px', backgroundColor: '#18181b', borderRadius: '2px', overflow: 'hidden' }}>
        <motion.div initial={{ width: 0 }} animate={{ width: '75%' }} transition={{ duration: 2, delay: 0.5 }} style={{ height: '100%', backgroundColor: COLORS.green, boxShadow: `0 0 10px ${COLORS.green}` }} />
      </div>
    </motion.div>
  );
};

// Структурований блок
const StructuredModuleBlock = ({ title, description, iconClass, color, widget }) => (
  <motion.div variants={itemVariants} className="position-relative w-100 mb-5" style={{ backgroundColor: '#09090b', borderRadius: '24px', border: `1px solid ${COLORS.border}`, overflow: 'hidden' }}>
    <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '55%', background: `linear-gradient(to top, ${color}33, transparent)`, filter: 'blur(40px)', zIndex: 0, pointerEvents: 'none' }} />
    <div className="position-relative z-1 p-4 p-md-5 d-flex justify-content-between align-items-center" style={{ borderBottom: `1px solid ${COLORS.border}` }}>
      <h2 className="river-text m-0 fw-bold" style={{ fontSize: '3.5rem', background: `linear-gradient(90deg, #fff, ${color}, #fff)`, backgroundClip: 'text', WebkitBackgroundClip: 'text', color: 'transparent' }}>
        {title}
      </h2>
      <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${color}40` }}>
        <i className={iconClass} style={{ fontSize: '2.5rem', color: color, filter: `drop-shadow(0 0 10px ${color}80)` }} />
      </div>
    </div>
    <div className="position-relative z-1 p-4 p-md-5 row align-items-start">
      <div className="col-lg-7 mb-4 mb-lg-0 pe-lg-5">
        <p style={{ fontSize: '1.25rem', color: '#a1a1aa', lineHeight: '1.7', fontWeight: 300, margin: 0 }}>{description}</p>
      </div>
      <div className="col-lg-5">
        {widget}
      </div>
    </div>
  </motion.div>
);

const WelcomeRP = () => {
  const [isEntering, setIsEntering] = useState(false);

  const handleEntrance = (e) => {
    e.preventDefault();
    setIsEntering(true);
    setTimeout(() => { window.location.href = "/accounts/google/login/"; }, 800);
  };

  return (
    <div className="w-100 position-relative min-vh-100" style={{ backgroundColor: COLORS.bg, color: '#e4e4e7', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <Particles />
      <AnimatePresence>
        {isEntering && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.8 }} className="position-fixed top-0 start-0 w-100 h-100 bg-black" style={{ zIndex: 100000 }} />
        )}
      </AnimatePresence>

      <div className="position-relative" style={{ zIndex: 1, filter: isEntering ? 'blur(10px)' : 'none', transition: 'filter 0.5s' }}>
        {/* Hero секція */}
        <div className="min-vh-100 d-flex flex-column align-items-center justify-content-center py-5">
          <motion.div variants={containerVariants} initial="hidden" animate="visible" className="container text-center position-relative">
            <div className="position-absolute top-50 start-50 translate-middle rounded-circle" style={{ width: '600px', height: '600px', background: `radial-gradient(circle, ${COLORS.blue}15 0%, transparent 70%)`, filter: 'blur(70px)', zIndex: -1 }} />

            <motion.h1 variants={itemVariants} className="river-text mb-4 fw-bold" style={{ fontSize: 'clamp(4rem, 15vw, 7rem)', letterSpacing: '-0.02em', background: `linear-gradient(90deg, #fff, ${COLORS.blue}, #fff)`, backgroundClip: 'text', WebkitBackgroundClip: 'text', color: 'transparent' }}>
              SyFlow
            </motion.h1>

            <motion.div variants={itemVariants} className="mx-auto mb-5" style={{ maxWidth: '650px' }}>
              <p style={{ color: '#a1a1aa', fontSize: '1.3rem', lineHeight: '1.6', fontWeight: 300 }}>
                Професійне середовище для розробників. Ми об'єднали машинну точність архітектури та бездоганну дисципліну коду в єдиний потік.
              </p>
            </motion.div>

            <motion.a variants={itemVariants} href="/accounts/google/login/" onClick={handleEntrance}
              whileHover={{ scale: 1.02, boxShadow: `0 0 30px ${COLORS.blue}80` }}
              whileTap={{ scale: 0.98 }}
              className="btn py-3 px-5 fw-bold text-white d-inline-flex align-items-center justify-content-center"
              style={{ backgroundColor: '#18181b', border: `1px solid ${COLORS.blue}40`, borderRadius: '12px', transition: 'all 0.3s', fontSize: '1.1rem' }}
            >
              <i className="fa-brands fa-google me-3 fs-5" /> Увійти до Системи
            </motion.a>
          </motion.div>
        </div>

        {/* Модулі */}
        <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} className="container py-5" style={{ maxWidth: '1000px' }}>
          <StructuredModuleBlock title="Академія" color={COLORS.blue} iconClass="fa-solid fa-book-journal-whills"
            description="Чітка, структурована ієрархія знань. Від базового синтаксису до масштабованої архітектури додатків. Система відкидає хаос, надаючи інструменти для побудови глибокого розуміння коду. Навчання перетворюється на інженерний процес."
            widget={<TerminalWidget />}
          />
          <StructuredModuleBlock title="Баланс" color={COLORS.purple} iconClass="fa-solid fa-scale-balanced"
            description="Алгоритмічний контроль продуктивності. Відстеження метрик активності допомагає запобігти перевантаженню. Система розуміє, коли необхідна концентрація, а коли — пауза для відновлення нейронних зв'язків. Ефективність через відпочинок."
            widget={<WaveWidget />}
          />
          <StructuredModuleBlock title="Прогрес" color={COLORS.green} iconClass="fa-solid fa-layer-group"
            description="Ваш особистий літопис розробника. Математична фіксація результатів та тіньова гейміфікація. Кожен закритий модуль оновлює глобальні змінні вашого профілю, еволюціонуючи ваші навички у реальному часі."
            widget={<ProgressWidget />}
          />
        </motion.div>

        <div className="py-5 text-center w-100" style={{ color: '#52525b', fontSize: '0.9rem', borderTop: `1px solid ${COLORS.border}` }}>
          <p className="mb-0">© 2026 SyFlow. Дисципліна. Точність. Потік.</p>
        </div>
      </div>
    </div>
  );
};

export default WelcomeRP;