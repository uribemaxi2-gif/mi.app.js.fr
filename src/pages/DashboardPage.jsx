import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const DashboardPage = () => {
    const { user, isAdmin } = useAuth();
    const [projects, setProjects] = useState([]);

    if (!user) {
        return <p>Cargando información del usuario...</p>;
    }

    return (
        <>
        <div style={{ padding: '20px' }}>
            <h1>Bienvenido, {user.username}</h1>
            <p>Tu Rol es: **{user.role.toUpperCase()}**</p>
            
            {isAdmin ? (
                <p style={{ color: 'green', fontWeight: 'bold' }}>Tienes acceso de ADMINISTRADOR.</p>
            ) : (
                <p style={{ color: 'blue' }}>Tu rol es de USUARIO NORMAL. Solo puedes ver el contenido público.</p>
            )}
        </div>

        <hr />
        <h2>Listado de Experimentos ({projects.length})</h2>
            <ul style={{ listStyle: 'none', padding: 0 }}>
                {projects.map((project) => (
                    <li key={project._id} style={{ border: '1px solid #eee', padding: '10px', marginBottom: '10px' }} className="card">
                            <strong>{project.title}</strong> ({project.isVisible ? 'Público' : 'Privado'})
                            <p>{project.description}</p>
                            
                    </li>
                    ))}
            </ul>
        </>            
    );
};

export default DashboardPage;