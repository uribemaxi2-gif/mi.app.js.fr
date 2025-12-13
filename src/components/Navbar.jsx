// frontend-app/src/components/Navbar.jsx (CÓDIGO CORREGIDO)

import React from 'react';
import { Link } from 'react-router-dom'; // Eliminamos useNavigate ya que el logout lo maneja
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { isAuthenticated, isAdmin, logout, user } = useAuth();

    const handleLogout = () => {
        // Ejecuta el logout (que debe redirigir a /login en el AuthContext)
        logout(); 
    };

    return (
        // 1. Aplicar clase principal de Navbar
        <nav className="navbar-container"> 
            
            <div className="navbar-links"> {/* Usar clase para espaciado */}
                {/* 2. Aplicar clase para enlaces */}
                <Link to="/" className="navbar-link">Home</Link>
                
                {isAdmin && (
                    <Link to="/admin" className="navbar-link" style={{ color: 'lightgreen' }}>Panel Admin</Link>
                )}
            </div>

            <div className="user-auth-area"> {/* Usar clase para alinear elementos de autenticación */}
                {isAuthenticated ? (
                    <>
                        {/* 3. Saludo con clase y comprobación de user */}
                        {user && <span className="user-greeting">Hola, {user.username}</span>} 
                        
                        <button 
                            onClick={handleLogout} 
                            // 4. Usar la clase btn general y un estilo de botón secundario/transparente
                            className="btn" 
                            style={{ 
                                backgroundColor: 'transparent', 
                                color: 'white', 
                                border: '1px solid white', 
                                padding: '8px 16px', /* Ajuste de padding temporal */
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