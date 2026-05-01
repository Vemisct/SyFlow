import React from 'react';
import { createRoot } from 'react-dom/client';
import HomeRP from '../Pages/HomeRP';
import { applyStoredSettings } from '../utils/settingsUtils';
applyStoredSettings();

const container = document.getElementById('home-root');

if (container) {
    const root = createRoot(container);
    root.render(<HomeRP />);
}