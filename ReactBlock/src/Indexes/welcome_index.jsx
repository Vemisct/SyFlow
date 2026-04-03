import React from 'react';
import { createRoot } from 'react-dom/client';
// Переконайся, що шлях до твого WelcomeRP правильний
import WelcomeRP from '../Pages/WelcomeRP'; 

const container = document.getElementById('root');

if (container) {
    const root = createRoot(container);
    root.render(<WelcomeRP />);
}