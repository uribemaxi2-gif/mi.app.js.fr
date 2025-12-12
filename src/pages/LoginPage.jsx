import React, { useState } from 'react';
// Cerca del inicio de LoginPage.jsx 
// O
import api from '@/utils/api';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); 

        try {
            // Petición al backend (el proxy de Vite lo dirige a http://localhost:5000/api/auth/login)
            const response = await api.post('/auth/login', { username, password });            
            login(response.data); // Almacena token, username y role en el contexto
            
            navigate('/'); 

        } catch (err) {
            setError(err.response?.data?.message || 'Error de conexión o credenciales inválidas');
        }
    };

    return (
        // 1. Contenedor principal del formulario: centrado y con estilo 'card'
        <div className="login-container"> 
            <div className="card">
                <h2>Iniciar Sesión</h2>
                <form onSubmit={handleSubmit}>
                    {error && <p className="error-message">{error}</p>}

                    <div className="form-group">
                        <label htmlFor="username">Usuario:</label>
                        <input
                            type="text"
                            id="username"
                            className="form-control" // <-- Clase para inputs
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Contraseña:</label>
                        <input
                            type="password"
                            id="password"
                            className="form-control" // <-- Clase para inputs
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button 
                        type="submit" 
                        className="btn btn-primary btn-block" // <-- Clases para botones
                    >
                        Entrar
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;