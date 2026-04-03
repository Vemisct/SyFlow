import React from 'react';
import { createRoot } from 'react-dom/client';
import HomeRP from '../Pages/HomeRP';

const container = document.getElementById('home-root');

if (container) {
    const root = createRoot(container);
    root.render(<HomeRP />);
}