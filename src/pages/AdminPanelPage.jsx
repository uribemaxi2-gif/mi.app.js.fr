// frontend-app/src/pages/AdminPanelPage.jsx

import React, { useState, useEffect } from 'react';
import api from '../utils/api'; // CRÍTICO: Asegura la ruta correcta
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

    // ... (Lógica fetchProjects, handleCreateProject, handleDeleteProject) ...
    const fetchProjects = async () => { /* ... lógica de la API ... */ setLoading(false); };
    const handleCreateProject = async (e) => { /* ... lógica de creación ... */ };
    const handleDeleteProject = async (id) => { /* ... lógica de eliminación ... */ };
    
    useEffect(() => {
        if (activeTab === 'proyectos') {
            fetchProjects();
        }
    }, [activeTab]);

    // ... (renderContent function) ...
    const renderContent = () => {
        if (activeTab === 'usuarios') {
            return <UserManagement />; 
        }
        
        if (activeTab === 'config') {
            return <h3>⚙️ Configuración del Administrador (Perfil propio, contraseña, etc.)</h3>;
        }

        return (
            <>
                <div className="card" style={{ marginBottom: '30px' }}> {/* Estilo inline para el margen */}
                    <h2>Crear Nuevo Proyecto</h2>
                    <form onSubmit={handleCreateProject}> {/* ❌ ELIMINAR style={{ padding: '15px', marginBottom: '30px' }} */}
                        <div className="form-group">
                            <input type="text" placeholder="Título" value={title} onChange={(e) => setTitle(e.target.value)} className="form-control" required />
                        </div>
                        <div className="form-group">
                            <textarea placeholder="Descripción del experimento" value={description} onChange={(e) => setDescription(e.target.value)} className="form-control" required />
                        </div>
                        
                        {/* 🚨 NOTA: Usa la clase .form-group o un div para el checkbox si lo necesitas */}
                        <div className="form-group"> 
                            <label>
                                <input type="checkbox" checked={isVisible} onChange={(e) => setIsVisible(e.target.checked)} style={{ marginRight: '8px' }}/>
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
                        <li key={project._id} className="card" style={{ marginBottom: '10px' }}> {/* ❌ ELIMINAR style={{ border: '1px solid #eee', padding: '10px', marginBottom: '10px' }} */}
                            <strong>{project.title}</strong> ({project.isVisible ? 'Público' : 'Privado'})
                            <p>{project.description}</p>
                            
                            <button 
                                onClick={() => handleDeleteProject(project._id)} 
                                // 🚨 Aplicar clase de botón de peligro/secundario (ajustar si tienes .btn-danger)
                                className="btn" 
                                style={{ backgroundColor: '#dc3545', color: 'white', marginTop: '10px' }} 
                            >
                                Eliminar
                            </button>
                        </li>
                    ))}
                </ul>
            </>
        );
    };

    if (activeTab === 'proyectos' && loading) return <p>Cargando panel de administración...</p>;
    if (error) return <p className="error-message">{error}</p>;

    return (
        <div style={{ padding: '20px' }}> {/* Mantenemos el padding externo si lo quieres */}
            <h1>🚀 Panel de Administración</h1>
            <p>Bienvenido, {user.username} ({user.role.toUpperCase()}).</p>
            
            {/* --- Barra de Pestañas (Tabs) --- */}
            {/* Estos estilos son complejos y mejor se mueven a una clase .admin-tabs en styles.css */}
            <div style={{ marginBottom: '20px', borderBottom: '1px solid #ccc' }}>
                <button 
                    onClick={() => setActiveTab('proyectos')} 
                    style={{ fontWeight: activeTab === 'proyectos' ? 'bold' : 'normal', padding: '10px', border: 'none', backgroundColor: activeTab === 'proyectos' ? '#e9ecef' : 'transparent' }}
                >
                    Proyectos 
                </button>
                <button 
                    onClick={() => setActiveTab('usuarios')} 
                    style={{ fontWeight: activeTab === 'usuarios' ? 'bold' : 'normal', padding: '10px', border: 'none', marginLeft: '10px', backgroundColor: activeTab === 'usuarios' ? '#e9ecef' : 'transparent' }}
                >
                    Gestión de Usuarios
                </button>
                <button 
                    onClick={() => setActiveTab('config')} 
                    style={{ fontWeight: activeTab === 'config' ? 'bold' : 'normal', padding: '10px', border: 'none', marginLeft: '10px', backgroundColor: activeTab === 'config' ? '#e9ecef' : 'transparent' }}
                >
                    Configuración
                </button>
            </div>
            
            {renderContent()}

        </div>
    );
};

export default AdminPanelPage;