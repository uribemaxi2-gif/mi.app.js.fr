// frontend-app/src/components/Navbar.jsx (VERSION FINAL Y CORREGIDA)

import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { isAuthenticated, isAdmin, logout, user } = useAuth();

    const handleLogout = () => {
        // Llama al logout del contexto, que también debe manejar la redirección.
        logout(); 
    };

    return (
        // 1. Aplica la clase del contenedor principal
        <nav className="navbar-container"> 
            
            {/* 2. Área de enlaces: aplica la clase de espaciado */}
            <div className="navbar-links"> 
                <Link to="/" className="navbar-link">Home</Link>
                
                {isAdmin && (
                    <Link to="/admin" className="navbar-link" style={{ color: 'lightgreen' }}>Panel Admin</Link>
                )}
            </div>

            {/* 🚨 CRÍTICO: Aplica la clase user-auth-area para que el 'gap' se aplique */}
            <div className="user-auth-area"> 
                {isAuthenticated ? (
                    <>
                        {/* 3. Saludo con clase y comprobación de user */}
                        {user && <span className="user-greeting">Hola, {user.username}</span>} 
                        
                        <button 
                            onClick={handleLogout} 
                            // Usamos btn para los estilos base, y el estilo de botón secundario/peligro
                            className="btn" 
                            style={{ 
                                // Estilos temporales/secundarios que deberían estar en styles.css (.btn-secondary)
                                backgroundColor: 'transparent', 
                                color: 'white', 
                                border: '1px solid white', 
                                padding: '8px 16px', 
                            }}
                        >
                            Cerrar Sesión
                        </button>
                    </>
                ) : (
                    <Link to="/login" className="navbar-link">Iniciar Sesión</Link>
                )}
            </div>
        </nav>
    );
};

export default Navbar;