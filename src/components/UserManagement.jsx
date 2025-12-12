import React, { useState, useEffect } from 'react';
import api from '@/utils/api';
import { useAuth } from '../context/AuthContext';

const UserManagement = () => {
    const { user, logout } = useAuth();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchUsers = async () => {
        try {
            // Llama a GET /api/users (Ruta que creamos, protegida por 'admin')
            const response = await api.get('/users'); 
            setUsers(response.data);
            setLoading(false);
        } catch (err) {
            setError('Error al cargar usuarios. ¿La ruta /api/users existe en el backend?');
            if (err.response && err.response.status === 403) {
                // Si el token falló, salimos
                logout(); 
            }
            setLoading(false);
        }
    };

    const handleToggleRole = async (userId, currentRole) => {
        const newRole = currentRole === 'admin' ? 'usuario_normal' : 'admin';
        if (window.confirm(`¿Seguro que quieres cambiar el rol a ${newRole}?`)) {
            try {
                // Llama a PUT /api/users/:id/role
                await api.put(`/users/${userId}/role`, { role: newRole });
                fetchUsers(); // Recargar la lista
            } catch (err) {
                setError('Fallo al cambiar rol.');
            }
        }
    };

// Función para eliminar un usuario
    const handleDeleteUser = async (userId) => {
        // 1. Evitar que el administrador se elimine a sí mismo
        if (userId === user._id) {
            setError('No puedes eliminar tu propia cuenta mientras estás logueado.');
            return;
        }

        if (window.confirm('ADVERTENCIA: ¿Estás seguro de que quieres eliminar a este usuario permanentemente?')) {
            try {
                // Llama a DELETE /api/users/:id (protegido por 'admin')
                // Usamos la ruta corregida: /users/
                await api.delete(`/users/${userId}`); 
                fetchUsers(); // Recargar la lista después de la eliminación
            } catch (err) {
                // Si el backend devuelve un error 403/404/500
                setError(err.response?.data?.message || 'Fallo al eliminar el usuario. ¿El backend está activo?');
            }
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    if (loading) return <p>Cargando lista de usuarios...</p>;
    if (error) return <p className="error-message">{error}</p>;

    return (
        <div>
            <h3>👥 Gestión de Usuarios Registrados ({users.length})</h3>
            
            <ul style={{ listStyle: 'none', padding: 0 }}>
                {users.map((u) => (
                    <li key={u._id} style={{ border: '1px solid #ddd', padding: '10px', margin: '10px 0', display: 'flex', justifyContent: 'space-between' }}>
                        <div>
                            <strong>{u.username}</strong>
                            <span style={{ marginLeft: '10px', color: u.role === 'admin' ? 'green' : 'blue' }}>({u.role.toUpperCase()})</span>
                        </div>
                        
                        <div>
                            {/* Botón para cambiar rol */}
                            <button 
                                onClick={() => handleToggleRole(u._id, u.role)} 
                                className="btn" style={{ backgroundColor: '#ffc107', marginRight: '10px' }}
                            >
                                {u.role === 'admin' ? 'Degradar a Usuario' : 'Ascender a Admin'}
                            </button>
                            
                            {/* Botón de Eliminar */}
                            <button 
                                onClick={() => handleDeleteUser(u._id)}
                                className="btn" style={{ backgroundColor: 'red' /* Reemplaza por clase CSS */ }}>Eliminar</button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default UserManagement;