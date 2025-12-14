// frontend-app/src/pages/AdminPanelPage.jsx (Estilos Corregidos)

import React, { useState, useEffect } from 'react';
import api from '../utils/api'; 
import { useAuth } from '../context/AuthContext';
import UserManagement from '../components/UserManagement'; 

const AdminPanelPage = () => {
    const { user, logout } = useAuth();
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('proyectos'); 
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [isVisible, setIsVisible] = useState(true);

    // ===============================================
    // LÓGICA DE GESTIÓN DE PROYECTOS (Revisar en Punto 2)
    // ===============================================
    const fetchProjects = async () => { /* ... (código que ya tenías) ... */ };
    const handleCreateProject = async (e) => { /* ... (código que ya tenías) ... */ };
    const handleDeleteProject = async (id) => { /* ... (código que ya tenías) ... */ };
    
    useEffect(() => {
        if (activeTab === 'proyectos') {
            fetchProjects();
        }
    }, [activeTab]);

    // Manejo de carga e identidad (para evitar error de null si fuera el caso)
    if (!user) return <p>Cargando información del administrador...</p>;
    if (activeTab === 'proyectos' && loading) return <p>Cargando proyectos...</p>;
    if (error) return <p className="error-message">{error}</p>;

    const renderContent = () => {
        if (activeTab === 'usuarios') {
            return <UserManagement />; 
        }
        
        if (activeTab === 'config') {
            return <h3>⚙️ Configuración del Administrador (Perfil propio, contraseña, etc.)</h3>;
        }

        // Pestaña 'proyectos' (CRUD)
        return (
            <>
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

                <h2>Listado de Experimentos ({projects.length})</h2>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                    {projects.map((project) => (
                        // Usamos solo la clase card, el margen se ajusta
                        <li key={project._id} className="card" style={{ marginBottom: '10px' }}>
                            <strong>{project.title}</strong> ({project.isVisible ? 'Público' : 'Privado'})
                            <p>{project.description}</p>
                            
                            <button 
                                onClick={() => handleDeleteProject(project._id)} 
                                // Usamos la clase btn-danger que definimos
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
            
            {/* --- Barra de Pestañas (Tabs) --- */}
            <div className="admin-tabs">
                <button 
                    onClick={() => setActiveTab('proyectos')} 
                    className={`tab-button ${activeTab === 'proyectos' ? 'active' : ''}`}
                >
                    Proyectos 
                </button>
                <button 
                    onClick={() => setActiveTab('usuarios')} 
                    className={`tab-button ${activeTab === 'usuarios' ? 'active' : ''}`}
                >
                    Gestión de Usuarios
                </button>
                <button 
                    onClick={() => setActiveTab('config')} 
                    className={`tab-button ${activeTab === 'config' ? 'active' : ''}`}
                >
                    Configuración
                </button>
            </div>
            
            {renderContent()}

        </div>
    );
};

export default AdminPanelPage;