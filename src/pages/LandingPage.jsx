// frontend-app/src/pages/LandingPage.jsx

import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LandingPage = () => {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    // 🚨 CORRECCIÓN: Usar useEffect para REDIRIGIR si está autenticado.
    // Esto es CRÍTICO para no romper las reglas del router.
    useEffect(() => {
        if (isAuthenticated) {
            navigate('/dashboard'); // Redirige si está autenticado
        }
    }, [isAuthenticated, navigate]);

    // Si el usuario está autenticado, mostramos un mensaje de carga breve
    // mientras useEffect ejecuta la redirección.
    if (isAuthenticated) {
        return (
            <div className="login-container">
                <p>Cargando Dashboard...</p>
            </div>
        );
    }

    // Contenido de la Landing Page para usuarios no autenticados
    return (
        <div className="login-container">
            <div className="card" style={{ maxWidth: '500px', textAlign: 'center' }}>
                <h1>Bienvenido a tus Experimentos JS</h1>
                <p>Por favor, selecciona una opción para continuar.</p>
                
                <div className="form-group" style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
                    
                    <Link to="/login" className="btn btn-primary">
                        Iniciar Sesión
                    </Link>
                    
                    {/* Asumiendo que crearás una clase .btn-secondary en styles.css */}
                    <Link to="/register" className="btn" style={{ backgroundColor: 'var(--color-secondary)', color: 'white' }}>
                        Registrarse
                    </Link>

                </div>
            </div>
        </div>
    );
};

export default LandingPage;