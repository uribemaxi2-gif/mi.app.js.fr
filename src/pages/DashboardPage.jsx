// frontend-app/src/pages/DashboardPage.jsx

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api'; // CRÍTICO: Importar la instancia API

const DashboardPage = () => {
    // 1. Obtener 'logout' del contexto y definir estados necesarios
    const { user, isAdmin, logout } = useAuth();
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true); // Estado de carga
    const [error, setError] = useState(null);     // Estado de error

    // Función para obtener la lista de proyectos desde el backend
    const fetchProjects = async () => {
        setLoading(true); 
        setError(null); 

        try {
            // Llama a GET /api/projects. El backend decide qué mostrar
            // basándose en el rol (admin ve todo, user normal ve solo públicos)
            const response = await api.get('/projects'); 
            setProjects(response.data);
            
        } catch (err) {
            setError('Error al cargar proyectos. Por favor, intenta de nuevo.');
            
            // Si el backend responde con token inválido o acceso denegado (401/403),
            // se asume que la sesión expiró y se fuerza el logout.
            if (err.response && (err.response.status === 401 || err.response.status === 403)) {
                logout(); 
            }
        } finally {
            setLoading(false); // Siempre termina la carga
        }
    };

    // 2. Cargar proyectos al montar el componente, siempre que el 'user' esté cargado
    useEffect(() => {
        // Ejecutar la carga solo si el objeto 'user' ya está en el contexto
        if (user) { 
            fetchProjects();
        }
    }, [user]); // Se dispara si 'user' cambia de null a un objeto (inicio de sesión)

    // 3. Manejo de estados de carga y error (Para evitar el TypeError: reading 'username')
    // Si no hay 'user' (ej: después de cerrar sesión o antes de cargar el contexto)
    if (!user) {
        // Esto evita el error de intentar leer user.username cuando user es null
        // El router debería redirigir a /login, pero esto previene el fallo de JS.
        return <p>Cargando información del usuario o redirigiendo...</p>; 
    }

    // Si aún está cargando los datos de la API
    if (loading) {
        return <p>Cargando proyectos...</p>;
    }


    // 4. Renderizado Final del Dashboard
    return (
        <div style={{ padding: '20px' }}>
            <h1>Bienvenido, {user.username}</h1>
            <p>Tu Rol es: **{user.role.toUpperCase()}**</p>
            
            {isAdmin ? (
                <p style={{ color: 'green', fontWeight: 'bold' }}>Tienes acceso de ADMINISTRADOR.</p>
            ) : (
                <p style={{ color: 'blue' }}>Tu rol es de USUARIO NORMAL. Solo puedes ver el contenido público.</p>
            )}

            <hr />
            <h2>Listado de Experimentos ({projects.length})</h2>
            
            {/* Mostrar mensaje de error si la API falló */}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            
            {/* Listado de Proyectos */}
            <ul style={{ listStyle: 'none', padding: 0 }}>
                {projects.map((project) => (
                    <li key={project._id} className="card"> 
                        <strong>{project.title}</strong> ({project.isVisible ? 'Público' : 'Privado'})
                        <p>{project.description}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default DashboardPage;