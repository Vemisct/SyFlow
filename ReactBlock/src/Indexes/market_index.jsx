// src/Indexes/market_index.jsx
import React from 'react';
import { createRoot } from 'react-dom/client';
import MarketRP from '../Pages/MarketRP';

const container = document.getElementById('market-root');
if (container) {
  createRoot(container).render(<MarketRP />);
}