import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Protege cualquier ruta, requiriendo que el usuario esté logueado
const PrivateRoute = () => {
    const { isAuthenticated } = useAuth();
    
    // Si está autenticado, muestra el componente (Outlet), si no, redirige a /login
    return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;