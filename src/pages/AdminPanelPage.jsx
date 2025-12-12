import React, { useState, useEffect } from 'react';
import api from '@/utils/api'; 
import { useAuth } from '../context/AuthContext';
import UserManagement from '../components/UserManagement'; // <-- Importación para la pestaña Usuarios

const AdminPanelPage = () => {
    const { user, logout } = useAuth();
    // Estado para la lógica de la página
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('proyectos'); // <-- Estado de las pestañas

    // Estados para el formulario de creación de Proyectos
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [isVisible, setIsVisible] = useState(true);

    // ===============================================
    // LÓGICA DE GESTIÓN DE PROYECTOS
    // ===============================================
    const fetchProjects = async () => {
        try {
            // Llama a GET /api/projects para listar los proyectos
            const response = await api.get('/projects'); 
            setProjects(response.data);
            
        } catch (err) {
            setError('Error al cargar proyectos. Intenta cerrar e iniciar sesión de nuevo.');
            
            // Si el token es inválido o el rol falló, forzar logout
            if (err.response && (err.response.status === 401 || err.response.status === 403)) {
                logout(); 
            }
        } finally {
            // CRÍTICO: Asegurarse de que el estado de carga siempre termine
            setLoading(false); 
        }
    };

    const handleCreateProject = async (e) => {
        e.preventDefault();
        try {
            await api.post('/projects', { title, description, isVisible });
            // Limpiar y recargar
            setTitle('');
            setDescription('');
            setIsVisible(true);
            fetchProjects(); 
        } catch (err) {
            setError('Fallo al crear proyecto. Verifique su rol de administrador.');
        }
    };

    const handleDeleteProject = async (id) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar este proyecto?')) {
            try {
                await api.delete(`/projects/${id}`);
                fetchProjects(); 
            } catch (err) {
                setError('Fallo al eliminar proyecto.');
            }
        }
    };

    // Cargar proyectos solo al montar el componente o cambiar la pestaña
    useEffect(() => {
        // Solo cargamos proyectos si la pestaña activa es 'proyectos'
        if (activeTab === 'proyectos') {
            fetchProjects();
        }
    }, [activeTab]);

    // ===============================================
    // RENDERIZADO CONDICIONAL DE CONTENIDO
    // ===============================================
    const renderContent = () => {
        if (activeTab === 'usuarios') {
            return <UserManagement />; // Muestra el componente de gestión de usuarios
        }
        
        if (activeTab === 'config') {
            // Esta será la futura sección de configuración de perfil propio
            return <h3>⚙️ Configuración del Administrador (Perfil propio, contraseña, etc.)</h3>;
        }

        // Pestaña 'proyectos' (CRUD)
        return (
            <>
                <div className="card">
                    <h2>Crear Nuevo Proyecto</h2>
                    <form onSubmit={handleCreateProject} style={{ padding: '15px', marginBottom: '30px' }}>
                        <div className="form-group">
                            <input type="text" placeholder="Título" value={title} onChange={(e) => setTitle(e.target.value)} className="form-control" required />
                        </div>
                        <div className="form-group">
                            <textarea placeholder="Descripción del experimento" value={description} onChange={(e) => setDescription(e.target.value)} className="form-control" required />
                        </div>
                        <label className="form-group">
                            <input type="checkbox" checked={isVisible} onChange={(e) => setIsVisible(e.target.checked)} />
                            Visible para usuarios normales
                        </label>
                        <button type="submit" className="btn btn-primary">Guardar Proyecto</button>
                    </form>
                </div>

                <hr />

                <h2>Listado de Experimentos ({projects.length})</h2>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                    {projects.map((project) => (
                        <li key={project._id} style={{ border: '1px solid #eee', padding: '10px', marginBottom: '10px' }} className="card">
                            <strong>{project.title}</strong> ({project.isVisible ? 'Público' : 'Privado'})
                            <p>{project.description}</p>
                            
                            <button 
                                onClick={() => handleDeleteProject(project._id)} 
                                className="btn" style={{ backgroundColor: 'red', color: 'white' }}
                            >
                                Eliminar
                            </button>
                        </li>
                    ))}
                </ul>
            </>
        );
    };

    // Si la pestaña actual es 'proyectos' y está cargando, muestra el spinner.
    if (activeTab === 'proyectos' && loading) return <p>Cargando panel de administración...</p>;
    if (error) return <p className="error-message">{error}</p>;

    return (
        <div style={{ padding: '20px' }}>
            <h1>🚀 Panel de Administración</h1>
            <p>Bienvenido, {user.username} ({user.role.toUpperCase()}).</p>
            
            {/* --- Barra de Pestañas (Tabs) --- */}
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
            
            {/* --- Contenido de la Pestaña Activa --- */}
            {renderContent()}

        </div>
    );
};

export default AdminPanelPage;