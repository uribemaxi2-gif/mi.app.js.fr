// src/App.jsx

import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Importaciones
import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage'; 
import RegisterPage from './pages/RegisterPage'; // <-- NUEVA IMPORTACIÓN
import LandingPage from './pages/LandingPage';   // <-- NUEVA IMPORTACIÓN
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';
import AdminPanelPage from './pages/AdminPanelPage'; 

function App() {
  return (
    <>
      <Navbar />
      <div className="container">
        <Routes>
          {/* 1. RUTAS PÚBLICAS (ACCESO ABIERTO) */}
          <Route path="/" element={<LandingPage />} /> {/* NUEVA PÁGINA DE BIENVENIDA */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} /> {/* NUEVA RUTA DE REGISTRO */}

          {/* 2. RUTAS PROTEGIDAS (Solo si el usuario está logueado) */}
          {/* Usamos el PrivateRoute para proteger las páginas que deben verse después del login */}
          <Route path="/dashboard" element={<PrivateRoute />}>
            <Route path="/dashboard" element={<DashboardPage />} />
          </Route>

          {/* 3. RUTAS DE ADMINISTRADOR (Requieren rol 'admin') */}
          <Route path="/admin" element={<AdminRoute />}>
            <Route path="/admin" element={<AdminPanelPage />} />
          </Route>
        </Routes>
      </div>
    </>
  );
}

export default App;
