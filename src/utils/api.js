// src/utils/api.js

import axios from 'axios';

// ----------------------------------------------------
// CRÍTICO: Reemplaza ESTA URL con la de tu servicio Render
// (ej: https://mi-app-js.onrender.com/api)
// ----------------------------------------------------
const API_BASE_URL = 'https://mi-app-js.onrender.com/api'; 

// 1. Crear una instancia base de axios
const api = axios.create({
    baseURL: API_BASE_URL, 
    headers: {
        'Content-Type': 'application/json',
    },
});

// 2. Interceptor: Se ejecuta antes de cada solicitud (Middleware de Axios)
api.interceptors.request.use(
    (config) => {
        // Obtener la información del usuario (que contiene el token JWT)
        const user = JSON.parse(localStorage.getItem('user')); 

        // CRÍTICO: Si el usuario existe y tiene un token, adjuntarlo.
        if (user && user.token) {
            // Formato estándar: Bearer <token>
            config.headers.Authorization = `Bearer ${user.token}`;
        }
        
        return config;
    },
    (error) => {
        // Manejo de errores durante la configuración de la petición
        return Promise.reject(error);
    }
);

export default api;