// frontend-app/src/pages/LoginPage.jsx

import React, { useState } from 'react';
import api from '../utils/api'; 
import { useNavigate, Link } from 'react-router-dom';
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
            const response = await api.post('/auth/login', { username, password }); 
            login(response.data); 
            navigate('/dashboard'); 

        } catch (err) {
            setError(err.response?.data?.message || 'Error de conexión o credenciales inválidas');
        }
    };

    return (
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
                            className="form-control"
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
                            className="form-control"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button 
                        type="submit" 
                        className="btn btn-primary btn-block"
                    >
                        Entrar
                    </button>
                </form>
                <p className="form-group" style={{ marginTop: '20px', textAlign: 'center' }}>
                    ¿No tienes cuenta? <Link to="/register">Regístrate aquí</Link>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;