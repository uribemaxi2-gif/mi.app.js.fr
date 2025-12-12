import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import DashboardPage from './DashboardPage'; // Usaremos el Dashboard si está logueado

const LandingPage = () => {
    const { isAuthenticated } = useAuth();

    // Si el usuario ya está autenticado, lo enviamos al Dashboard
    if (isAuthenticated) {
        // Renderiza el contenido del DashboardPage o redirige
        return <DashboardPage />; 
    }

    return (
        <div className="login-container">
            <div className="card" style={{ maxWidth: '500px', textAlign: 'center' }}>
                <h1>Bienvenido a tus Experimentos JS</h1>
                <p>Por favor, selecciona una opción para continuar.</p>
                
                <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', marginTop: '30px' }}>
                    
                    <Link to="/login" className="btn btn-primary">
                        Iniciar Sesión
                    </Link>
                    
                    <Link to="/register" className="btn btn-secondary">
                        Registrarse
                    </Link>

                </div>
            </div>
        </div>
    );
};

export default LandingPage;