import React from 'react';
import { createRoot } from 'react-dom/client';
import CoreEntranceRP from '../Pages/EntranceRP';

const container = document.getElementById('entrance-root');

if (container) {
    const root = createRoot(container);
    root.render(<CoreEntranceRP />);
}