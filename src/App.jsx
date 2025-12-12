// src/App.jsx

import React from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom'; // Asegúrate de usar BrowserRouter en main.jsx o aquí
import { useAuth } from './context/AuthContext'; // Importar el hook de autenticación

// Importaciones de Componentes y Páginas
import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage'; 
import RegisterPage from './pages/RegisterPage'; 
import LandingPage from './pages/LandingPage'; 
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';
import AdminPanelPage from './pages/AdminPanelPage'; 

function App() {
    // 1. Obtener el estado que indica si la verificación inicial está en curso
    const { isCheckingAuth } = useAuth(); 

    // 2. CRÍTICO: Bloquear el renderizado si la verificación no ha terminado.
    // Esto evita que cualquier componente (como Navbar o Dashboard) acceda a user.username cuando es null.
    if (isCheckingAuth) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontSize: '18px' }}>
                <p>Cargando configuración de usuario y rutas...</p>
            </div>
        );
    }
    
    // 3. Renderizar la aplicación normal solo cuando isCheckingAuth es false
    return (
        <>
            <Navbar />
            <div className="container">
                <Routes>
                    {/* 1. RUTAS PÚBLICAS */}
                    <Route path="/" element={<LandingPage />} /> 
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} /> 

                    {/* 2. RUTAS PROTEGIDAS (Solo si el usuario está logueado) */}
                    {/* El elemento PrivateRoute es el Layout/Shell */}
                    <Route path="/dashboard" element={<PrivateRoute />}>
                        <Route index element={<DashboardPage />} /> 
                    </Route>

                    {/* 3. RUTAS DE ADMINISTRADOR (Requieren rol 'admin') */}
                    <Route path="/admin" element={<AdminRoute />}>
                        <Route index element={<AdminPanelPage />} />
                    </Route>
                    
                    {/* 4. Ruta de fallback/Error 404 si la ruta no existe (Opcional) */}
                    <Route path="*" element={<h2>Error 404: Página No Encontrada</h2>} />
                </Routes>
            </div>
        </>
    );
}

export default App;
