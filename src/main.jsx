import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './App.css'; // For Tailwind CSS styling

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Tailwind CSS configuration
import './App.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
