import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    // 1. Cargar el usuario de localStorage al inicio (Persistencia de Sesión)
    const [user, setUser] = useState(() => {
        try {
            const storedUser = localStorage.getItem('user');
            // Al cargar, si hay un usuario, pre-calculamos su rol
            const initialUser = storedUser ? JSON.parse(storedUser) : null;
            
            // Asignamos el estado inicial de isAdmin basado en el usuario cargado
            return initialUser; 
        } catch (error) {
            console.error("Error parsing user from localStorage", error);
            return null;
        }
    });

    // ❌ CORRECCIÓN CRÍTICA: Eliminar la variable de estado 'isAdmin'
    // Ya no la necesitamos porque la calcularemos en tiempo real
    // const [isAdmin, setIsAdmin] = useState(false); <--- ELIMINAR ESTA LÍNEA

    const [isAuthenticated, setIsAuthenticated] = useState(!!user);
    const navigate = useNavigate();
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);

    // 2. Variable CALCULADA para isAdmin (NO es estado, se recalcula al cambiar user)
    // Esto resuelve la colisión de nombres y el error setIsAdmin is not defined.
    const isAdmin = user && user.role === 'admin'; 

    // 3. Mantener localStorage sincronizado y actualizar el estado de autenticación
    useEffect(() => {
        // Actualizar el estado de autenticación
        setIsAuthenticated(!!user);
        
        // Sincronizar localStorage
        if (user) {
            localStorage.setItem('user', JSON.stringify(user));
        } else {
            localStorage.removeItem('user');
        }
        if (isCheckingAuth) {
            setIsCheckingAuth(false);
        }
    }, [user]);

    const login = (userData) => {
        // userData incluye { token, username, role, ... }
        setUser(userData);
        // El estado isAdmin se actualizará automáticamente con el useEffect
        navigate('/dashboard'); // Redirigir después de iniciar sesión
    };

    const logout = () => {
        localStorage.removeItem('user'); 
        
        // 4. CRÍTICO: Limpiar el estado del usuario.
        // Como 'isAdmin' es una variable calculada, se pondrá a false automáticamente.
        setUser(null); 
        // ❌ ELIMINAR: setIsAdmin(false); <-- Ya no es necesario, resolviendo el ReferenceError
        
        // 5. CRÍTICO: Redirigir inmediatamente.
        navigate('/login'); 
    };

    // 6. El contexto expone la variable calculada 'isAdmin'
    return (
        <AuthContext.Provider value={{ user, isAuthenticated, isAdmin, isCheckingAuth, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

// NOTA: Asegúrate de que este componente esté envolviendo tu <App /> en main.jsx