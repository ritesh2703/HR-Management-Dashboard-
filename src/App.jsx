import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'; // ✅ Import Navigate
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './pages/Dashboard';
import "./App.css";

const App = () => (
    <Router>
        <Routes>
            <Route path="/" element={<Navigate to="/login" />} />  {/* ✅ Redirect "/" to "/login" */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
    </Router>
);

export default App;
