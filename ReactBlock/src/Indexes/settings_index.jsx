import React from 'react';
import { createRoot } from 'react-dom/client';
import SettingsRP from '../Pages/SettingsRP';
import { applyStoredSettings } from '../utils/settingsUtils';
applyStoredSettings();

const container = document.getElementById('settings-root');
if (container) {
  createRoot(container).render(<SettingsRP />);
}