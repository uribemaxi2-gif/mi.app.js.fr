// frontend-app/src/components/Navbar.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Sugerencia: Define esta clase en styles.css para que sea consistente
// .navbar-container { display: flex; justify-content: space-between; padding: 10px 20px; background-color: var(--color-text); color: white; }

const Navbar = () => {
    const { isAuthenticated, isAdmin, logout, user } = useAuth();

    const handleLogout = () => {
        logout(); 
    };

    return (
        <nav className="navbar-container"> {/* Asumiendo que defines la clase 'navbar-container' en styles.css */}
            <div style={{ display: 'flex', gap: '20px' }}>
                <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>Home</Link>
                
                {isAdmin && (
                    <Link to="/admin" style={{ color: 'lightgreen', textDecoration: 'none' }}>Panel Admin</Link>
                )}
            </div>

            <div>
                {isAuthenticated ? (
                    <>
                        {/* 🚨 CORRECCIÓN: Usar 'user &&' para evitar el error de null */}
                        {user && <span style={{ marginRight: '15px' }}>Hola, {user.username}</span>}
                        <button 
                            onClick={handleLogout} 
                            className="btn" 
                            style={{ 
                                // Estilo inline temporal para que se vea como botón de logout. 
                                // Idealmente, se movería a una clase en styles.css (ej: .btn-secondary)
                                backgroundColor: 'transparent', 
                                color: 'white', 
                                border: '1px solid white', 
                                padding: '5px 10px', 
                                cursor: 'pointer' 
                            }}
                        >
                            Cerrar Sesión
                        </button>
                    </>
                ) : (
                    <Link to="/login" style={{ color: 'white', textDecoration: 'none' }}>Iniciar Sesión</Link>
                )}
            </div>
        </nav>
    );
};

export default Navbar;