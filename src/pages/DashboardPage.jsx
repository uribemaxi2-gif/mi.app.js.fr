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

    // Mostrar siempre la lista de proyectos al montar el componente
    const fetchProjects = async () => {
        setLoading(true); // Iniciar carga
        setError(null);   // Limpiar errores

        try {
            // Llama a GET /api/projects para listar los proyectos
            // El backend decide si muestra TODOS (admin) o solo PUBLICOS (user)
            const response = await api.get('/projects'); 
            setProjects(response.data);
            
        } catch (err) {
            setError('Error al cargar proyectos. Por favor, intenta de nuevo.');
            
            // Si el token es inválido o el rol falló, forzar logout
            if (err.response && (err.response.status === 401 || err.response.status === 403)) {
                logout(); 
            }
        } finally {
            setLoading(false); // Terminar carga
        }
    };

    // 2. Cargar proyectos solo al montar el componente
    useEffect(() => {
        // Solo intentamos cargar si ya tenemos los datos del usuario
        if (user) { 
            fetchProjects();
        }
    }, [user]); // Depende de 'user' para asegurarse de que esté cargado

    // Manejo de carga e identidad
    if (loading || !user) {
        return <p>Cargando información y proyectos...</p>;
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

            <hr />
            <h2>Listado de Experimentos ({projects.length})</h2>
            
            {error && <p style={{ color: 'red' }}>{error}</p>}
            
            <ul style={{ listStyle: 'none', padding: 0 }}>
                {projects.map((project) => (
                    <li key={project._id} className="card" style={{ border: '1px solid #eee', padding: '10px', marginBottom: '10px' }}>
                        <strong>{project.title}</strong> ({project.isVisible ? 'Público' : 'Privado'})
                        <p>{project.description}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default DashboardPage;