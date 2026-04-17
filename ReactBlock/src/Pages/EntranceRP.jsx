// EntranceRP.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const COLORS = {
  blue: '#3b82f6',
  green: '#10b981',
  bg: '#050505',
  door: '#09090b'
};

const EntranceRP = () => {
  const [entranceState, setEntranceState] = useState('authenticating');

  useEffect(() => {
    const timer1 = setTimeout(() => setEntranceState('granted'), 2200);
    const timer2 = setTimeout(() => setEntranceState('opened'), 3400);
    const timer3 = setTimeout(() => { window.location.href = '/dashboard/'; }, 5000);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  const statusColor = entranceState === 'authenticating' ? COLORS.blue : COLORS.green;
  const statusGlow = entranceState === 'authenticating' ? `rgba(59,130,246,0.6)` : `rgba(16,185,129,0.8)`;

  return (
    <div className="w-100 vh-100 position-relative" style={{ overflow: 'hidden', color: '#e4e4e7', backgroundColor: COLORS.bg, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <style>{`
        .river-text {
          background-size: 200% auto !important;
          -webkit-background-clip: text !important;
          background-clip: text !important;
          color: transparent !important;
          animation: text-flow 6s linear infinite;
        }
        @keyframes text-flow {
          to { background-position: 200% center; }
        }
      `}</style>

      {/* Внутрішній вміст */}
      <div className="position-absolute w-100 h-100 d-flex flex-column align-items-center justify-content-center" style={{ zIndex: 1 }}>
        <div className="position-absolute w-100 h-100" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)', backgroundSize: '40px 40px', zIndex: -2 }} />
        <div className="position-absolute rounded-circle" style={{ width: '400px', height: '400px', background: `radial-gradient(circle, ${COLORS.green}15 0%, transparent 70%)`, filter: 'blur(50px)', zIndex: -1 }} />

        <motion.div
          initial={{ scale: 0.9, opacity: 0, filter: 'blur(20px)' }}
          animate={entranceState === 'opened' ? { scale: 1, opacity: 1, filter: 'blur(0px)' } : {}}
          transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
          className="text-center"
        >
          <div className="mb-4 mx-auto" style={{ width: '80px', height: '2px', backgroundColor: COLORS.green, boxShadow: `0 0 15px ${COLORS.green}` }} />
          <h1 className="fw-bold mb-3 river-text" style={{ fontSize: '4.5rem', letterSpacing: '-2px', background: `linear-gradient(90deg, #fff, ${COLORS.green}, #fff)` }}>
            СЕРЦЕ СИСТЕМИ
          </h1>
          <p className="font-monospace mb-4" style={{ color: COLORS.green, fontSize: '1.2rem', letterSpacing: '3px' }}>
            [ ІНІЦІАЛІЗАЦІЯ ДАШБОРДУ ]
          </p>
          <p style={{ color: '#a1a1aa', fontSize: '1.1rem', maxWidth: '500px', margin: '0 auto', fontWeight: 300 }}>
            Архітектура завантажена. Готовність до прийому команд.
          </p>
        </motion.div>
      </div>

      {/* Брама */}
      <AnimatePresence>
        {entranceState !== 'opened' && (
          <div className="position-absolute top-0 start-0 w-100 h-100 d-flex" style={{ zIndex: 10 }}>
            <motion.div initial={{ x: 0 }} exit={{ x: '-100%' }} transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }} className="h-100 w-50 position-relative"
              style={{ backgroundColor: COLORS.door, borderRight: `1px solid ${statusColor}`, boxShadow: `inset -30px 0 50px rgba(0,0,0,0.9)` }}
            />
            <motion.div initial={{ x: 0 }} exit={{ x: '100%' }} transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }} className="h-100 w-50 position-relative"
              style={{ backgroundColor: COLORS.door, borderLeft: `1px solid ${statusColor}`, boxShadow: `inset 30px 0 50px rgba(0,0,0,0.9)` }}
            />

            <motion.div initial={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.5, filter: 'blur(15px)' }} transition={{ duration: 0.8, ease: "easeIn" }}
              className="position-absolute top-50 start-50 translate-middle d-flex flex-column align-items-center justify-content-center" style={{ zIndex: 20 }}
            >
              <div className="position-relative d-flex align-items-center justify-content-center" style={{ width: '200px', height: '200px' }}>
                <div className="position-absolute rounded-circle" style={{ width: '100%', height: '100%', border: '1px solid rgba(255,255,255,0.05)', backgroundColor: COLORS.bg, boxShadow: '0 20px 50px rgba(0,0,0,0.8)' }} />
                <motion.div animate={entranceState === 'authenticating' ? { rotate: 360 } : { rotate: 0 }}
                  transition={entranceState === 'authenticating' ? { repeat: Infinity, duration: 3, ease: "linear" } : { duration: 0.5 }}
                  className="position-absolute rounded-circle" style={{ width: '80%', height: '80%', border: `2px dashed ${statusColor}`, opacity: 0.5 }}
                />
                <motion.div animate={entranceState === 'granted' ? { scale: [1, 1.2, 1], boxShadow: `0 0 40px ${COLORS.green}` } : { scale: 1 }}
                  transition={{ duration: 0.5 }} className="position-absolute rounded-circle d-flex align-items-center justify-content-center"
                  style={{ width: '60px', height: '60px', backgroundColor: COLORS.door, border: `2px solid ${statusColor}`, boxShadow: `0 0 20px ${statusGlow}` }}
                >
                  <i className={`fa-solid ${entranceState === 'authenticating' ? 'fa-fingerprint' : 'fa-check'} fs-4`} style={{ color: statusColor }} />
                </motion.div>
              </div>
              <div className="mt-5 font-monospace text-center">
                <motion.p animate={entranceState === 'authenticating' ? { opacity: [0.4, 1, 0.4] } : { opacity: 1 }}
                  transition={{ repeat: Infinity, duration: 1.5 }} style={{ color: statusColor, fontSize: '1rem', letterSpacing: '4px', textShadow: `0 0 10px ${statusGlow}` }}
                >
                  {entranceState === 'authenticating' ? 'СИНХРОНІЗАЦІЯ...' : 'ДОСТУП ДОЗВОЛЕНО'}
                </motion.p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EntranceRP;