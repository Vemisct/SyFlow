import React from 'react';
import { createRoot } from 'react-dom/client';
import GamesRP from '../Pages/GamesRP'; 

const container = document.getElementById('games-root');
if (container) {
    const root = createRoot(container);
    root.render(<GamesRP />);
}