import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/api'; 

const RegisterPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        try {
            // 2. CRÍTICO: Usar 'api.post' y SOLO la ruta relativa
            await api.post('/auth/register', { username, password });
            
            setMessage('¡Registro exitoso! Ya puedes iniciar sesión.');
            setTimeout(() => {
                navigate('/login'); // Redirigir al login después del registro
            }, 2000);

        } catch (err) {
            setError(err.response?.data?.message || 'Error al registrar usuario.');
        }
    };

    return (
        <div className="login-container">
            <div className="card">
                <h2>Registrarse</h2>
                <form onSubmit={handleSubmit}>
                    {error && <p className="error-message">{error}</p>}
                    {message && <p style={{ color: 'green', marginBottom: '15px' }}>{message}</p>}
                    
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
                        Registrar
                    </button>
                </form>

                <p style={{ marginTop: '20px', textAlign: 'center' }}>
                    ¿Ya tienes cuenta? <Link to="/login">Inicia Sesión aquí</Link>
                </p>
            </div>
        </div>
    );
};

export default RegisterPage;