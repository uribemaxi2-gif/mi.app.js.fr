import React from 'react';
import { useAuth } from '../context/AuthContext';

const DashboardPage = () => {
    const { user, isAdmin } = useAuth();

    if (!user) {
        return <p>Cargando información del usuario...</p>;
    }

    return (
        <div style={{ padding: '20px' }}>
            <h1>Bienvenido, {user.username}</h1>
            <p>Tu Rol es: **{user.role.toUpperCase()}**</p>
            
            {isAdmin ? (
                <p style={{ color: 'green', fontWeight: 'bold' }}>Tienes acceso de ADMINISTRADOR.</p>
            ) : (
                <p style={{ color: 'blue' }}>Tu rol es de USUARIO NORMAL. Solo puedes ver el contenido público.</p>
            )}
        </div>
    );
};

export default DashboardPage;