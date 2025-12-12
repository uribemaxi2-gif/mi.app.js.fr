import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { isAuthenticated, isAdmin, logout, user } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        // 1. Ejecutar el logout (borra el estado y localStorage)
        logout(); 
        
        // 2. CRÍTICO: Redirigir a una página pública (como el login o la landing)
        // Usamos '/login' para forzar que el usuario vea la pantalla de inicio de sesión
        navigate('/login'); 
    };

    return (
        <nav style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 20px', backgroundColor: '#333', color: 'white' }}>
            <div style={{ display: 'flex', gap: '20px' }}>
                <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>Home</Link>
                
                {/* Enlace visible SOLO para Administradores */}
                {isAdmin && (
                    <Link to="/admin" style={{ color: 'lightgreen', textDecoration: 'none' }}>Panel Admin</Link>
                )}
            </div>

            <div>
                {isAuthenticated ? (
                    <>
                        <span style={{ marginRight: '15px' }}>Hola, {user.username}</span>
                        <button onClick={handleLogout} style={{ padding: '5px 10px', cursor: 'pointer' }}>
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