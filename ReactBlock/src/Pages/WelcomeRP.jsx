import React from 'react';
import { motion } from 'framer-motion';

const WelcomeRP = () => {
    return (
        <div className="vh-100 d-flex align-items-center justify-content-center" style={{ backgroundColor: '#0a0a0c' }}>
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="p-5 text-center"
                style={{ 
                    backgroundColor: '#151518', // Суворий темно-сірий колір картки
                    border: '1px solid #27272a', // Тонка чітка рамка
                    borderRadius: '16px', 
                    maxWidth: '420px',
                    width: '100%'
                }}
            >
                <h1 className="fw-bold mb-2 text-white" style={{ letterSpacing: '-0.5px' }}>SyFlow</h1>
                <p className="mb-5" style={{ color: '#a1a1aa', fontSize: '0.95rem' }}>
                    Преображення вашого шляху в коді.<br/>
                    Дисципліна та чистий потік.
                </p>

                {/* Пряме посилання на стандартний шлях django-allauth. Ніяких кастомних додатків */}
                <a 
                    href="/accounts/google/login/" 
                    className="btn w-100 py-3 fw-semibold text-white d-flex align-items-center justify-content-center"
                    style={{ 
                        backgroundColor: '#27272a', 
                        border: '1px solid #3f3f46',
                        borderRadius: '8px',
                        transition: 'background-color 0.2s'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#3f3f46'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#27272a'}
                >
                    <img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" 
                         width="18" className="me-3" alt="Google" />
                    Увійти через Google
                </a>
            </motion.div>
        </div>
    );
};

export default WelcomeRP;