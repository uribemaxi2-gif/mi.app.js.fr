// frontend-app/src/pages/AdminPanelPage.jsx

import React, { useState, useEffect } from 'react';
import api from '../utils/api'; 
import { useAuth } from '../context/AuthContext';
import UserManagement from '../components/UserManagement'; 
import { useNavigate } from 'react-router-dom'; // Necesario para la redirección después del logout

const AdminPanelPage = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('proyectos'); 
    
    // Estados para el formulario de creación
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [isVisible, setIsVisible] = useState(true);

    // ===============================================
    // LÓGICA DE GESTIÓN DE PROYECTOS (CRUD)
    // ===============================================

    // 1. OBTENER PROYECTOS
    const fetchProjects = async () => {
        setLoading(true); // Siempre empieza cargando
        setError(null);

        try {
            // Llama a GET /api/projects para listar los proyectos
            const response = await api.get('/projects'); 
            setProjects(response.data);
            
        } catch (err) {
            setError(err.response?.data?.message || 'Error al cargar proyectos.');
            
            // Si el token es inválido o el rol falló, forzar logout/redirección
            if (err.response && (err.response.status === 401 || err.response.status === 403)) {
                logout(); 
                navigate('/login'); // Redirigir explícitamente si el contexto no lo hizo
            }
        } finally {
            setLoading(false); // Siempre termina cargando
        }
    };

    // 2. CREAR PROYECTO (¡Faltaba en tu código!)
    const handleCreateProject = async (e) => {
        e.preventDefault();
        setError(null);
        
        try {
            // Llama a POST /api/projects para crear
            await api.post('/projects', { title, description, isVisible });
            
            // Limpiar formulario
            setTitle('');
            setDescription('');
            setIsVisible(true);

            // Recargar la lista
            fetchProjects(); 
            
        } catch (err) {
            setError(err.response?.data?.message || 'Fallo al crear proyecto.');
        }
    };

    // 3. ELIMINAR PROYECTO (¡Faltaba en tu código!)
    const handleDeleteProject = async (id) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar este proyecto?')) {
            setError(null);

            try {
                // Llama a DELETE /api/projects/:id
                await api.delete(`/projects/${id}`);
                // Recargar la lista
                fetchProjects(); 
                
            } catch (err) {
                setError(err.response?.data?.message || 'Fallo al eliminar proyecto.');
            }
        }
    };

    // Cargar proyectos solo al montar el componente o cambiar la pestaña
    useEffect(() => {
        if (activeTab === 'proyectos') {
            fetchProjects();
        }
    }, [activeTab]);

    // Manejo de carga e identidad (para evitar error de null si fuera el caso)
    if (!user) return <p>Cargando información del administrador...</p>;
    if (activeTab === 'proyectos' && loading) return <p>Cargando proyectos...</p>;
    if (error) return <p className="error-message">{error}</p>;

    // ===============================================
    // RENDERIZADO (Con Estilos Corregidos)
    // ===============================================
    const renderContent = () => {
        // ... (Tu lógica de renderizado para usuarios y config sigue aquí) ...
        if (activeTab === 'usuarios') {
            return <UserManagement />; 
        }
        
        if (activeTab === 'config') {
            return <h3>⚙️ Configuración del Administrador (Perfil propio, contraseña, etc.)</h3>;
        }

        return (
            <>
                {/* Formulario de Creación */}
                <div className="card" style={{ marginBottom: '30px' }}>
                    <h2>Crear Nuevo Proyecto</h2>
                    <form onSubmit={handleCreateProject}>
                        <div className="form-group">
                            <input type="text" placeholder="Título" value={title} onChange={(e) => setTitle(e.target.value)} className="form-control" required />
                        </div>
                        <div className="form-group">
                            <textarea placeholder="Descripción del experimento" value={description} onChange={(e) => setDescription(e.target.value)} className="form-control" required />
                        </div>
                        
                        <div className="form-group"> 
                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <input type="checkbox" checked={isVisible} onChange={(e) => setIsVisible(e.target.checked)} />
                                Visible para usuarios normales
                            </label>
                        </div>
                        
                        <button type="submit" className="btn btn-primary">Guardar Proyecto</button>
                    </form>
                </div>

                <hr />

                {/* Listado de Proyectos */}
                <h2>Listado de Experimentos ({projects.length})</h2>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                    {projects.map((project) => (
                        <li key={project._id} className="card" style={{ marginBottom: '10px' }}>
                            <strong>{project.title}</strong> ({project.isVisible ? 'Público' : 'Privado'})
                            <p>{project.description}</p>
                            
                            <button 
                                onClick={() => handleDeleteProject(project._id)} 
                                className="btn btn-danger" 
                            >
                                Eliminar
                            </button>
                        </li>
                    ))}
                </ul>
            </>
        );
    };

    return (
        <div style={{ padding: '20px' }}>
            <h1>🚀 Panel de Administración</h1>
            <p>Bienvenido, {user.username} ({user.role.toUpperCase()}).</p>
            
            {/* Barra de Pestañas (Asumiendo que has agregado la clase .admin-tabs en styles.css) */}
            <div className="admin-tabs">
                <button onClick={() => setActiveTab('proyectos')} className={`tab-button ${activeTab === 'proyectos' ? 'active' : ''}`}>
                    Proyectos 
                </button>
                <button onClick={() => setActiveTab('usuarios')} className={`tab-button ${activeTab === 'usuarios' ? 'active' : ''}`}>
                    Gestión de Usuarios
                </button>
                <button onClick={() => setActiveTab('config')} className={`tab-button ${activeTab === 'config' ? 'active' : ''}`}>
                    Configuración
                </button>
            </div>
            
            {renderContent()}
        </div>
    );
};

export default AdminPanelPage;