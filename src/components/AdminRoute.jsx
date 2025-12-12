import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Protege la ruta, requiriendo que el usuario sea administrador
const AdminRoute = () => {
    const { isAuthenticated, isAdmin } = useAuth();
    
    if (!isAuthenticated) {
        // No logueado: redirige a login
        return <Navigate to="/login" replace />;
    }
    
    // Logueado pero no Admin: redirige a home
    return isAdmin ? <Outlet /> : <Navigate to="/" replace />;
};

export default AdminRoute;