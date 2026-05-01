// src/Indexes/workshop_index.jsx
import React from 'react';
import { createRoot } from 'react-dom/client';
import WorkshopRP from '../Pages/WorkshopRP';
import { applyStoredSettings } from '../utils/settingsUtils';
applyStoredSettings();

const container = document.getElementById('workshop-root');
if (container) {
  createRoot(container).render(<WorkshopRP />);
}