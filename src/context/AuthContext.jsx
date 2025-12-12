import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // <--- 1. Importar useNavigate

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    // 1. Cargar el usuario de localStorage al inicio
    const [user, setUser] = useState(() => {
        try {
            const storedUser = localStorage.getItem('user');
            return storedUser ? JSON.parse(storedUser) : null;
        } catch (error) {
            console.error("Error parsing user from localStorage", error);
            return null;
        }
    });
    const [isAuthenticated, setIsAuthenticated] = useState(!!user);

    const navigate = useNavigate();

    // 2. Mantener localStorage sincronizado con el estado 'user'
    useEffect(() => {
        setIsAuthenticated(!!user);
        if (user) {
            localStorage.setItem('user', JSON.stringify(user));
        } else {
            localStorage.removeItem('user');
        }
    }, [user]);

    const login = (userData) => {
        // userData incluye { token, username, role, ... }
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem('user'); 
        // Si tienes el token guardado por separado: 
        // localStorage.removeItem('token'); 

        setUser(null); 
        setIsAdmin(false); 
        
        // 3. CRÍTICO: Usar navigate() para redirigir a /login
        navigate('/login'); 
    };

    const isAdmin = user && user.role === 'admin';

    // 3. Este contexto debe envolver toda la aplicación en main.jsx
    return (
        <AuthContext.Provider value={{ user, isAuthenticated, isAdmin, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);