import React, { createContext, useContext, useState, useEffect } from 'react';

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
        // 1. CRÍTICO: Borrar el item de almacenamiento
        localStorage.removeItem('user'); 
        
        // 2. CRÍTICO: Resetear el estado de React
        setUser(null); 
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