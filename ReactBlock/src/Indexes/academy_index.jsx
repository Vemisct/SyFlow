// src/Indexes/academy_index.jsx
import React from 'react';
import { createRoot } from 'react-dom/client';
import AcademyRP from '../Pages/AcademyRP';

const container = document.getElementById('academy-root');
if (container) {
  createRoot(container).render(<AcademyRP />);
}