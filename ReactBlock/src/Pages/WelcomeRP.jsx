// WelcomeRP.jsx
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const COLORS = {
  blue: '#3b82f6',
  purple: '#a855f7',
  green: '#10b981',
  pink: '#ec4899',
  yellow: '#f59e0b',
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

// Частинки фону
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

// Картка відділу для лендингу
const DepartmentCard = ({ title, description, icon, color, delay }) => (
  <motion.div variants={itemVariants} custom={delay}
    className="p-4 h-100" style={{ backgroundColor: COLORS.surface, border: `1px solid ${color}40`, borderRadius: '20px' }}>
    <div className="d-flex align-items-center gap-3 mb-2">
      <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <i className={icon} style={{ color, fontSize: '1.8rem' }} />
      </div>
      <h3 className="fw-bold text-white mb-0" style={{ fontSize: '1.5rem' }}>{title}</h3>
    </div>
    <p className="text-secondary mt-2" style={{ fontSize: '0.95rem', lineHeight: '1.5' }}>{description}</p>
  </motion.div>
);

const WelcomeRP = () => {
  const [isEntering, setIsEntering] = useState(false);

  const handleEntrance = (e) => {
    e.preventDefault();
    setIsEntering(true);
    setTimeout(() => { window.location.href = "/accounts/google/login/"; }, 800);
  };

  const departments = [
    { title: 'Академія', description: 'Навчальні модулі від синтаксису до архітектури.', icon: 'fa-solid fa-book-journal-whills', color: COLORS.blue },
    { title: 'Майстерня', description: 'Спільні проекти та код-рев’ю.', icon: 'fa-solid fa-hammer', color: COLORS.purple },
    { title: 'Маркет', description: 'Внутрішня економіка: скіни, бустери, інструменти.', icon: 'fa-solid fa-store', color: COLORS.yellow },
    { title: 'Полігон', description: 'Тренажери, змагання, перевірка навичок.', icon: 'fa-solid fa-gamepad', color: COLORS.pink },
    { title: 'Баланс', description: 'Контроль ритму, відпочинок та здоровий flow.', icon: 'fa-solid fa-scale-balanced', color: COLORS.green },
  ];

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
                Організація для тих, хто будує цифрові світи. Навчання, співпраця, економіка — всі відділи в одному потоці.
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

        {/* Відділи */}
        <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} className="container py-5" style={{ maxWidth: '1100px' }}>
          <h2 className="text-white text-center mb-5 fw-bold" style={{ fontSize: '2.5rem' }}>Наші відділи</h2>
          <div className="row g-4">
            {departments.map((dept, idx) => (
              <div className="col-md-6 col-lg-4" key={idx}>
                <DepartmentCard {...dept} delay={idx * 0.1} />
              </div>
            ))}
          </div>
        </motion.div>

        <div className="py-5 text-center w-100" style={{ color: '#52525b', fontSize: '0.9rem', borderTop: `1px solid ${COLORS.border}` }}>
          <p className="mb-0">© 2026 SyFlow. Організація розробників.</p>
        </div>
      </div>
    </div>
  );
};

export default WelcomeRP;